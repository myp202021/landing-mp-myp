/**
 * CRM UPLOAD API - Procesamiento de archivos Meta Ads
 * Soporta .csv, .xls, .xlsx
 *
 * Límites:
 * - Archivo: 5MB max
 * - Filas: 5k rows max
 *
 * Features:
 * - Deduplicación automática por email/teléfono + fecha
 * - Normalización de campos de Meta
 * - Detección de archivos duplicados (SHA-256)
 * - Validación de datos
 * - Audit trail automático
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import crypto from 'crypto'

// Configuración Vercel
export const runtime = 'nodejs'
export const maxDuration = 30 // 30s para procesar archivos grandes
export const dynamic = 'force-dynamic'

// Límites
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_ROWS = 5000

/**
 * MAPEO DE CAMPOS META → SCHEMA
 * Soporta nombres en inglés y español
 */
const FIELD_MAPPING: Record<string, string> = {
  // Datos del lead - INGLÉS
  'full_name': 'nombre',
  'first_name': 'nombre',
  'last_name': 'apellido',
  'email': 'email',
  'phone_number': 'telefono',
  'phone': 'telefono',
  'company_name': 'empresa',
  'city': 'ciudad',
  'state': 'region',
  'province': 'region',
  'region': 'region',
  'street_address': 'mensaje',
  'job_title': 'servicio',
  'budget': 'presupuesto',
  'service': 'servicio',
  'message': 'mensaje',

  // Datos del lead - ESPAÑOL
  'nombre_completo': 'nombre',
  'apellido': 'apellido',
  'correo': 'email',
  'correo_electrónico': 'email',
  'e-mail': 'email',
  'mail': 'email', // Agregado para archivos Arturo
  'teléfono': 'telefono',
  'celular': 'telefono',
  'número_de_teléfono': 'telefono', // Con guión bajo (Meta exports)
  'nombre_de_la_empresa': 'empresa',
  'región': 'region',
  'dirección': 'mensaje',
  'cargo': 'servicio',
  'comentarios': 'mensaje',
  'comentario': 'observaciones', // Agregado para archivos Arturo
  'status': 'observaciones', // Agregado para archivos Arturo
  'valor_venta': 'monto_vendido', // Agregado para archivos Arturo
  'motivos_de_no_venta': 'razon_no_venta', // Agregado para archivos Arturo
  'facturación_mensual_empresa': 'presupuesto', // Meta exports

  // Contexto campaña - INGLÉS
  'campaign_name': 'campana_nombre',
  'ad_set_name': 'adset_nombre',
  'ad_name': 'ad_nombre',
  'form_name': 'form_nombre',
  'created_time': 'fecha_ingreso',
  'timestamp': 'fecha_ingreso',
  'date': 'fecha_ingreso',

  // Contexto campaña - ESPAÑOL
  'nombre_de_la_campaña': 'campana_nombre',
  'campaña': 'campana_nombre',
  'nombre_del_conjunto_de_anuncios': 'adset_nombre',
  'conjunto_de_anuncios': 'adset_nombre',
  'nombre_del_anuncio': 'ad_nombre',
  'anuncio': 'ad_nombre',
  'nombre_del_formulario': 'form_nombre',
  'formulario': 'form_nombre',
  'hora_de_creación': 'fecha_ingreso',
  'fecha_de_creación': 'fecha_ingreso',
  'fecha': 'fecha_ingreso', // Agregado para archivos Arturo
}

/**
 * Normalizar nombre de columna (minúsculas, sin espacios)
 */
function normalizeColumnName(col: string): string {
  return col.toLowerCase().trim().replace(/\s+/g, '_')
}

/**
 * Parsear archivo según extensión
 */
async function parseFile(buffer: Buffer, filename: string): Promise<any[]> {
  const ext = filename.split('.').pop()?.toLowerCase()

  if (ext === 'csv') {
    // CSV con PapaParse
    const text = buffer.toString('utf-8')
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: normalizeColumnName
    })
    return result.data
  } else if (ext === 'xls' || ext === 'xlsx') {
    // Excel con XLSX
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet, { raw: false, defval: '' })

    // Normalizar headers
    return data.map((row: any) => {
      const normalized: any = {}
      for (const [key, value] of Object.entries(row)) {
        normalized[normalizeColumnName(key)] = value
      }
      return normalized
    })
  } else {
    throw new Error('Formato no soportado. Use .csv, .xls o .xlsx')
  }
}

/**
 * Mapear fila de Meta a schema de leads
 */
function mapRowToLead(row: any, clientId: string, rubro: string): any {
  const lead: any = {
    cliente_id: clientId,
    rubro: rubro,
    fecha_ingreso: new Date().toISOString(), // Default: ahora
  }

  // Mapear campos detectados
  for (const [metaField, dbField] of Object.entries(FIELD_MAPPING)) {
    if (row[metaField]) {
      if (dbField === 'fecha_ingreso') {
        // Parsear fecha (puede ser número de Excel o string ISO)
        try {
          const value = row[metaField]
          if (typeof value === 'number') {
            // Fecha serializada de Excel (días desde 1900-01-01)
            const excelEpoch = new Date(1899, 11, 30) // Excel epoch ajustado
            const date = new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000)
            lead[dbField] = date.toISOString()
          } else {
            lead[dbField] = new Date(value).toISOString()
          }
        } catch {
          lead[dbField] = new Date().toISOString()
        }
      } else if (dbField === 'nombre' && row['full_name']) {
        // Dividir nombre completo si existe
        const parts = row['full_name'].trim().split(/\s+/)
        lead['nombre'] = parts[0]
        if (parts.length > 1) {
          lead['apellido'] = parts.slice(1).join(' ')
        }
      } else if (dbField === 'monto_vendido') {
        // Convertir valor venta a número
        const value = String(row[metaField]).replace(/[^0-9.]/g, '')
        lead[dbField] = value ? parseFloat(value) : null
      } else {
        lead[dbField] = row[metaField]
      }
    }
  }

  // Detectar si fue contactado (formato Arturo)
  if (row['mail_enviado'] || row['whatsapp'] || row['llamada']) {
    const contacted = ['mail_enviado', 'whatsapp', 'llamada'].some(field => {
      const value = String(row[field] || '').toLowerCase()
      return value === 'si' || value === 'sí' || value === 'yes' || value === 'true'
    })
    if (contacted) {
      lead.contactado = true
      lead.fecha_contacto = lead.fecha_ingreso
    }
  }

  // Detectar si fue vendido (si tiene valor venta)
  if (lead.monto_vendido && lead.monto_vendido > 0) {
    lead.vendido = true
  }

  return lead
}

/**
 * Validar lead (campos mínimos)
 */
function validateLead(lead: any): { valid: boolean; error?: string } {
  // Al menos email o teléfono
  if (!lead.email && !lead.telefono) {
    return { valid: false, error: 'Falta email o teléfono' }
  }

  // Email válido
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return { valid: false, error: 'Email inválido' }
  }

  return { valid: true }
}

/**
 * POST /api/crm/upload
 *
 * Body: FormData
 *   - file: File (.csv/.xls/.xlsx)
 *   - clientId: UUID
 *   - rubro: string (opcional)
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const formData = await req.formData()
    const file = formData.get('file') as File
    const clientId = formData.get('clientId') as string
    const rubro = formData.get('rubro') as string || 'Meta Ads'

    // Validaciones básicas
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400 }
      )
    }

    if (!clientId) {
      return NextResponse.json(
        { error: 'clientId es requerido' },
        { status: 400 }
      )
    }

    // Validar tamaño (máximo 10MB)
    const MAX_UPLOAD_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: `Archivo muy grande. Máximo 10MB` },
        { status: 400 }
      )
    }

    // Validar extensión
    const filename = file.name
    const ext = filename.split('.').pop()?.toLowerCase()
    if (!['csv', 'xls', 'xlsx'].includes(ext || '')) {
      return NextResponse.json(
        { error: 'Formato no soportado. Use .csv, .xls o .xlsx' },
        { status: 400 }
      )
    }

    // Convertir a buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Calcular checksum (para detectar duplicados)
    const checksum = crypto.createHash('sha256').update(buffer).digest('hex')

    // Verificar si ya existe este archivo
    const { data: existingCarga } = await supabase
      .from('cargas')
      .select('id, filename, creado_en')
      .eq('cliente_id', clientId)
      .eq('checksum_sha256', checksum)
      .single()

    if (existingCarga) {
      return NextResponse.json({
        error: 'Archivo duplicado',
        message: `Este archivo ya fue cargado el ${new Date(existingCarga.creado_en).toLocaleDateString()}`,
        carga_id: existingCarga.id
      }, { status: 409 })
    }

    // Parsear archivo
    const rows = await parseFile(buffer, filename)

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Archivo vacío o sin datos válidos' },
        { status: 400 }
      )
    }

    if (rows.length > MAX_ROWS) {
      return NextResponse.json(
        { error: `Demasiadas filas. Máximo ${MAX_ROWS}, encontradas ${rows.length}` },
        { status: 400 }
      )
    }

    // Detectar columnas
    const columnas_detectadas = Object.keys(rows[0])

    // Mapeo de campos aplicado
    const mapeo_campos: Record<string, string> = {}
    for (const col of columnas_detectadas) {
      if (FIELD_MAPPING[col]) {
        mapeo_campos[col] = FIELD_MAPPING[col]
      }
    }

    // Procesar filas en batches de 100
    const results = {
      ok: [] as any[],
      errors: [] as { row: number; error: string; data: any }[],
      duplicados: [] as { row: number; reason: string; data: any }[]
    }

    const BATCH_SIZE = 100
    const leadsToInsert: any[] = []
    const validRows: { index: number; lead: any; originalRow: any }[] = []

    // Primero validar todas las filas
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]

      try {
        const lead = mapRowToLead(row, clientId, rubro)
        const validation = validateLead(lead)

        if (!validation.valid) {
          results.errors.push({
            row: i + 2,
            error: validation.error!,
            data: row
          })
        } else {
          validRows.push({ index: i, lead, originalRow: row })
        }
      } catch (err: any) {
        results.errors.push({
          row: i + 2,
          error: err.message,
          data: row
        })
      }
    }

    // Insertar en batches
    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const batch = validRows.slice(i, i + BATCH_SIZE)
      const leadsToInsertBatch = batch.map(r => r.lead)

      try {
        const { data, error } = await supabase
          .from('leads')
          .insert(leadsToInsertBatch)
          .select()

        if (error) {
          // Si hay error en el batch, insertar uno por uno para detectar duplicados
          for (const { index, lead, originalRow } of batch) {
            const { data: singleData, error: singleError } = await supabase
              .from('leads')
              .insert(lead)
              .select()
              .single()

            if (singleError) {
              if (singleError.code === '23505') {
                results.duplicados.push({
                  row: index + 2,
                  reason: 'Email o teléfono ya existe para esta fecha',
                  data: originalRow
                })
              } else {
                results.errors.push({
                  row: index + 2,
                  error: singleError.message,
                  data: originalRow
                })
              }
            } else {
              results.ok.push(singleData)
            }
          }
        } else {
          results.ok.push(...(data || []))
        }
      } catch (err: any) {
        // Fallback a inserción individual
        for (const { index, lead, originalRow } of batch) {
          try {
            const { data: singleData, error: singleError } = await supabase
              .from('leads')
              .insert(lead)
              .select()
              .single()

            if (singleError) {
              if (singleError.code === '23505') {
                results.duplicados.push({
                  row: index + 2,
                  reason: 'Email o teléfono ya existe para esta fecha',
                  data: originalRow
                })
              } else {
                results.errors.push({
                  row: index + 2,
                  error: singleError.message,
                  data: originalRow
                })
              }
            } else {
              results.ok.push(singleData)
            }
          } catch (innerErr: any) {
            results.errors.push({
              row: index + 2,
              error: innerErr.message,
              data: originalRow
            })
          }
        }
      }
    }

    // Crear registro de carga
    const { data: carga, error: cargaError } = await supabase
      .from('cargas')
      .insert({
        cliente_id: clientId,
        filename: filename,
        size_bytes: file.size,
        mime_type: file.type,
        checksum_sha256: checksum,
        columnas_detectadas: columnas_detectadas,
        mapeo_campos: mapeo_campos,
        rows_ok: results.ok.length,
        rows_error: results.errors.length,
        rows_duplicados: results.duplicados.length,
        ejemplos_error: results.errors.slice(0, 10), // Solo primeros 10
        estado: results.ok.length > 0 ? 'completado' : 'error',
        meta: {
          total_rows: rows.length,
          parsed_at: new Date().toISOString()
        }
      })
      .select()
      .single()

    if (cargaError) {
      console.error('Error creando registro de carga:', cargaError)
    }

    // Retornar resultado
    return NextResponse.json({
      success: true,
      carga_id: carga?.id,
      filename,
      summary: {
        total_rows: rows.length,
        rows_ok: results.ok.length,
        rows_error: results.errors.length,
        rows_duplicados: results.duplicados.length,
      },
      columnas_detectadas,
      mapeo_campos,
      errores: results.errors.slice(0, 10), // Solo primeros 10 para no saturar respuesta
      duplicados_sample: results.duplicados.slice(0, 5)
    })

  } catch (error: any) {
    console.error('Error en upload:', error)
    return NextResponse.json(
      { error: error.message || 'Error procesando archivo' },
      { status: 500 }
    )
  }
}
