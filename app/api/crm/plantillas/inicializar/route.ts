import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

// POST - Inicializar plantillas predefinidas Silver, Gold y Platinum
export async function POST() {
  try {
    // Verificar si ya existen plantillas predefinidas
    const { data: existing } = await supabase
      .from('plantillas_cotizacion')
      .select('nombre')
      .in('nombre', ['Plan Silver M&P', 'Plan Gold M&P', 'Plan Platinum M&P'])

    if (existing && existing.length > 0) {
      return NextResponse.json({
        message: 'Ya existen plantillas predefinidas',
        plantillas: existing
      })
    }

    // PLAN SILVER
    const planSilver = {
      nombre: 'Plan Silver M&P',
      descripcion: 'Gestión de Marketing Digital - Plan Silver: 2 campañas mensuales, 20 contenidos orgánicos, media jornada de grabación.',
      items_default: [
        {
          descripcion: 'Creación, optimización y gestión de campañas en plataformas clave (Google Ads, Meta Business, LinkedIn Ads, TikTok Business) - Hasta 2 campañas mensuales con máximo 6 gráficas',
          cantidad: 1,
          precio: 200000
        },
        {
          descripcion: 'Monitoreo de resultados de campaña y ajustes según KPIs definidos',
          cantidad: 1,
          precio: 80000
        },
        {
          descripcion: 'Creación y gestión de RR.SS. con derivación de contactos - 20 contenidos orgánicos (8 Posts, 8 Stories, 4 Reels)',
          cantidad: 1,
          precio: 250000
        },
        {
          descripcion: 'Media jornada mensual de grabación y producción audiovisual (4-5 cápsulas)',
          cantidad: 1,
          precio: 150000
        },
        {
          descripcion: 'Equipo de Paid Media, Publicidad & Diseño',
          cantidad: 1,
          precio: 50000
        },
        {
          descripcion: 'Diagnóstico inicial de marca + Benchmarking + Definición de Objetivos',
          cantidad: 1,
          precio: 20000
        }
      ],
      notas_default: `📦 INCLUYE:
• Equipo de Paid Media, Publicidad & Diseño
• Diagnóstico inicial de marca
• Análisis de palabras clave, competencia e industria
• Benchmarking
• Definición de Objetivos y estrategias comunicacionales
• Proyección de rendimiento al tercer mes
• Reuniones Mensuales

⏰ PLAZO:
• Vigencia de cotización: 15 días
• Inicio del servicio: A partir de la firma del contrato

💳 FORMA DE PAGO:
• Pago mensual anticipado al 1° de cada mes
• Factura + IVA

📌 IMPORTANTE:
La inversión publicitaria (presupuesto de pauta) es independiente de este valor de gestión.`,
      vigencia_dias_default: 15,
      descuento_default: 0,
      activa: true
    }

    // PLAN GOLD
    const planGold = {
      nombre: 'Plan Gold M&P',
      descripcion: 'Gestión de Marketing Digital - Plan Gold (RECOMENDADO): 4 campañas mensuales, 28 contenidos orgánicos, media jornada de grabación, 2 campañas de email marketing.',
      items_default: [
        {
          descripcion: 'Creación, optimización y gestión de campañas en plataformas clave (Google Ads, Meta Business, LinkedIn Ads, TikTok Business) - Hasta 4 campañas mensuales con máximo 6 gráficas',
          cantidad: 1,
          precio: 350000
        },
        {
          descripcion: 'Monitoreo de resultados de campaña y ajustes según KPIs definidos',
          cantidad: 1,
          precio: 120000
        },
        {
          descripcion: 'Creación y gestión de RR.SS. con derivación de contactos - 28 contenidos orgánicos (16 Posts, 8 Stories, 4 Reels)',
          cantidad: 1,
          precio: 350000
        },
        {
          descripcion: 'Media jornada mensual de grabación y producción audiovisual (4-5 cápsulas)',
          cantidad: 1,
          precio: 150000
        },
        {
          descripcion: 'Campañas de email marketing (2 mensuales)',
          cantidad: 1,
          precio: 100000
        },
        {
          descripcion: 'Equipo de Paid Media, Publicidad & Diseño',
          cantidad: 1,
          precio: 80000
        },
        {
          descripcion: 'Diagnóstico inicial de marca + Benchmarking + Definición de Objetivos',
          cantidad: 1,
          precio: 50000
        }
      ],
      notas_default: `⭐ PLAN RECOMENDADO

📦 INCLUYE:
• Equipo de Paid Media, Publicidad & Diseño
• Diagnóstico inicial de marca
• Análisis de palabras clave, competencia e industria
• Benchmarking
• Definición de Objetivos y estrategias comunicacionales
• Proyección de rendimiento al tercer mes
• Reuniones Quincenales

⏰ PLAZO:
• Vigencia de cotización: 15 días
• Inicio del servicio: A partir de la firma del contrato

💳 FORMA DE PAGO:
• Pago mensual anticipado al 1° de cada mes
• Factura + IVA

📌 IMPORTANTE:
La inversión publicitaria (presupuesto de pauta) es independiente de este valor de gestión.`,
      vigencia_dias_default: 15,
      descuento_default: 0,
      activa: true
    }

    // PLAN PLATINUM
    const planPlatinum = {
      nombre: 'Plan Platinum M&P',
      descripcion: 'Gestión de Marketing Digital - Plan Platinum: 6 campañas mensuales, 44 contenidos orgánicos, jornada completa de grabación, 4 campañas de email marketing, gestión de influencers.',
      items_default: [
        {
          descripcion: 'Creación, optimización y gestión de campañas en plataformas clave (Google Ads, Meta Business, LinkedIn Ads, TikTok Business) - Hasta 6 campañas mensuales con máximo 10 gráficas',
          cantidad: 1,
          precio: 550000
        },
        {
          descripcion: 'Monitoreo de resultados de campaña y ajustes según KPIs definidos',
          cantidad: 1,
          precio: 180000
        },
        {
          descripcion: 'Creación y gestión de RR.SS. con derivación de contactos - 44 contenidos orgánicos (28 Posts, 8 Stories, 8 Reels)',
          cantidad: 1,
          precio: 500000
        },
        {
          descripcion: 'Jornada completa mensual de grabación y producción audiovisual (8-10 cápsulas)',
          cantidad: 1,
          precio: 250000
        },
        {
          descripcion: 'Campañas de email marketing (4 mensuales)',
          cantidad: 1,
          precio: 180000
        },
        {
          descripcion: 'Gestión de Influencers (identificación, negociación y coordinación)',
          cantidad: 1,
          precio: 120000
        },
        {
          descripcion: 'Equipo de Paid Media, Publicidad & Diseño',
          cantidad: 1,
          precio: 100000
        },
        {
          descripcion: 'Diagnóstico inicial de marca + Benchmarking + Definición de Objetivos',
          cantidad: 1,
          precio: 20000
        }
      ],
      notas_default: `🏆 PLAN PREMIUM PLATINUM

📦 INCLUYE:
• Equipo de Paid Media, Publicidad & Diseño
• Diagnóstico inicial de marca
• Análisis de palabras clave, competencia e industria
• Benchmarking
• Definición de Objetivos y estrategias comunicacionales
• Proyección de rendimiento al tercer mes
• Reuniones Quincenales
• Gestión de Influencers

⏰ PLAZO:
• Vigencia de cotización: 15 días
• Inicio del servicio: A partir de la firma del contrato

💳 FORMA DE PAGO:
• Pago mensual anticipado al 1° de cada mes
• Factura + IVA

📌 IMPORTANTE:
La inversión publicitaria (presupuesto de pauta) es independiente de este valor de gestión.`,
      vigencia_dias_default: 15,
      descuento_default: 0,
      activa: true
    }

    // Insertar las 3 plantillas
    const { data, error } = await supabase
      .from('plantillas_cotizacion')
      .insert([planSilver, planGold, planPlatinum])
      .select()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Plantillas Silver, Gold y Platinum creadas exitosamente',
      plantillas: data
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error inicializando plantillas:', error)
    return NextResponse.json(
      { error: error.message || 'Error inicializando plantillas predefinidas' },
      { status: 500 }
    )
  }
}
