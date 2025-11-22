// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, appendFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Interface para el log de predicción
interface LogPrediccion {
  id: string
  timestamp: string
  environment: 'local' | 'production'
  input: any
  output: any
  feedback?: {
    rating: 1 | 2 | 3 | 4 | 5
    comentario?: string
    fecha_feedback: string
  }
  user_agent: string
}

const LOG_DIR = path.join(process.cwd(), 'data', 'logs')
const LOG_FILE = path.join(LOG_DIR, 'predicciones.jsonl')

// Asegurar que el directorio existe
async function ensureLogDir() {
  if (!existsSync(LOG_DIR)) {
    await mkdir(LOG_DIR, { recursive: true })
  }
}

// POST - Guardar nueva predicción
export async function POST(request: NextRequest) {
  try {
    await ensureLogDir()

    const body = await request.json()
    const { input, output } = body

    const logEntry: LogPrediccion = {
      id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'local',
      input,
      output,
      user_agent: request.headers.get('user-agent') || 'unknown'
    }

    // Agregar línea al archivo JSONL
    const logLine = JSON.stringify(logEntry) + '\n'

    if (!existsSync(LOG_FILE)) {
      await writeFile(LOG_FILE, logLine, 'utf-8')
    } else {
      await appendFile(LOG_FILE, logLine, 'utf-8')
    }

    console.log('📝 Log guardado:', logEntry.id)

    return NextResponse.json({
      success: true,
      log_id: logEntry.id,
      message: 'Predicción guardada en logs'
    })

  } catch (error) {
    console.error('❌ Error guardando log:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PATCH - Agregar feedback a una predicción existente
export async function PATCH(request: NextRequest) {
  try {
    await ensureLogDir()

    const body = await request.json()
    const { log_id, rating, comentario } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating debe ser entre 1 y 5' },
        { status: 400 }
      )
    }

    // Leer archivo completo
    if (!existsSync(LOG_FILE)) {
      return NextResponse.json(
        { success: false, error: 'No hay logs guardados' },
        { status: 404 }
      )
    }

    const content = await readFile(LOG_FILE, 'utf-8')
    const lines = content.trim().split('\n')

    let updated = false
    const updatedLines = lines.map(line => {
      const entry: LogPrediccion = JSON.parse(line)

      if (entry.id === log_id) {
        entry.feedback = {
          rating,
          comentario,
          fecha_feedback: new Date().toISOString()
        }
        updated = true
        console.log(`⭐ Feedback agregado: ${log_id} - ${rating} estrellas`)
      }

      return JSON.stringify(entry)
    })

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Log ID no encontrado' },
        { status: 404 }
      )
    }

    // Reescribir archivo con feedback actualizado
    await writeFile(LOG_FILE, updatedLines.join('\n') + '\n', 'utf-8')

    return NextResponse.json({
      success: true,
      message: 'Feedback guardado'
    })

  } catch (error) {
    console.error('❌ Error guardando feedback:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// GET - Obtener estadísticas de logs
export async function GET(request: NextRequest) {
  try {
    await ensureLogDir()

    if (!existsSync(LOG_FILE)) {
      return NextResponse.json({
        total_predicciones: 0,
        con_feedback: 0,
        rating_promedio: 0,
        casos_validos: 0,
        casos_revisar: 0
      })
    }

    const content = await readFile(LOG_FILE, 'utf-8')
    const lines = content.trim().split('\n').filter(l => l.length > 0)
    const logs: LogPrediccion[] = lines.map(line => JSON.parse(line))

    const conFeedback = logs.filter(l => l.feedback)
    const casosValidos = conFeedback.filter(l => l.feedback.rating >= 4)
    const casosRevisar = conFeedback.filter(l => l.feedback.rating <= 3)

    const ratingPromedio = conFeedback.length > 0
      ? conFeedback.reduce((sum, l) => sum + l.feedback.rating, 0) / conFeedback.length
      : 0

    return NextResponse.json({
      total_predicciones: logs.length,
      con_feedback: conFeedback.length,
      rating_promedio: Math.round(ratingPromedio * 10) / 10,
      casos_validos: casosValidos.length,
      casos_revisar: casosRevisar.length,
      porcentaje_feedback: Math.round((conFeedback.length / logs.length) * 100)
    })

  } catch (error) {
    console.error('❌ Error obteniendo stats:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
