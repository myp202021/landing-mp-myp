import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: Obtener todos los clientes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      // Obtener un cliente específico con sus estadísticas
      const { data: cliente, error: clienteError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single()

      if (clienteError) {
        console.error('❌ Error obteniendo cliente:', clienteError)
        return NextResponse.json(
          { error: 'Error obteniendo cliente', details: clienteError.message },
          { status: 500 }
        )
      }

      // Obtener estadísticas del cliente
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('cliente_id', id)

      const total_leads = leads?.length || 0
      const contactados = leads?.filter(l => l.contactado).length || 0
      const vendidos = leads?.filter(l => l.vendido).length || 0
      const monto_total = leads?.reduce((sum, l) => sum + (parseFloat(l.monto_vendido) || 0), 0) || 0

      return NextResponse.json({
        cliente,
        estadisticas: {
          total_leads,
          contactados,
          vendidos,
          monto_total,
          tasa_contacto: total_leads > 0 ? (contactados / total_leads * 100).toFixed(1) : 0,
          tasa_conversion: total_leads > 0 ? (vendidos / total_leads * 100).toFixed(1) : 0
        }
      })
    }

    // Obtener todos los clientes con conteo de leads
    const { data: clientes, error } = await supabase
      .from('clientes')
      .select(`
        *,
        leads (count)
      `)
      .order('creado_en', { ascending: false })

    if (error) {
      console.error('❌ Error obteniendo clientes:', error)
      return NextResponse.json(
        { error: 'Error obteniendo clientes', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ clientes, total: clientes.length })

  } catch (error: any) {
    console.error('❌ Error en GET /api/crm/clientes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

// POST: Crear un nuevo cliente
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, email, empresa, telefono } = body

    if (!nombre || !email) {
      return NextResponse.json(
        { error: 'nombre y email son requeridos' },
        { status: 400 }
      )
    }

    const { data: cliente, error } = await supabase
      .from('clientes')
      .insert({
        nombre,
        email,
        empresa: empresa || null,
        telefono: telefono || null,
        activo: true
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error creando cliente:', error)
      return NextResponse.json(
        { error: 'Error creando cliente', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Cliente creado:', cliente.id)

    return NextResponse.json({
      success: true,
      cliente
    })

  } catch (error: any) {
    console.error('❌ Error en POST /api/crm/clientes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH: Actualizar un cliente
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'id es requerido' },
        { status: 400 }
      )
    }

    const { data: cliente, error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error actualizando cliente:', error)
      return NextResponse.json(
        { error: 'Error actualizando cliente', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Cliente actualizado:', id)

    return NextResponse.json({
      success: true,
      cliente
    })

  } catch (error: any) {
    console.error('❌ Error en PATCH /api/crm/clientes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE: Eliminar un cliente
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id es requerido' },
        { status: 400 }
      )
    }

    // Primero eliminar todos los leads asociados
    const { error: leadsError } = await supabase
      .from('leads')
      .delete()
      .eq('cliente_id', id)

    if (leadsError) {
      console.error('❌ Error eliminando leads del cliente:', leadsError)
      return NextResponse.json(
        { error: 'Error eliminando leads del cliente', details: leadsError.message },
        { status: 500 }
      )
    }

    // Luego eliminar el cliente
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Error eliminando cliente:', error)
      return NextResponse.json(
        { error: 'Error eliminando cliente', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Cliente y sus leads eliminados:', id)

    return NextResponse.json({
      success: true,
      message: 'Cliente eliminado exitosamente'
    })

  } catch (error: any) {
    console.error('❌ Error en DELETE /api/crm/clientes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}
