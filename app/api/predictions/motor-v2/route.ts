// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { MotorDecisionV2, InputConsultivo } from '../../../../lib/engine/motor-decision-v2'
import { MotorCalculo2024 } from '../../../../lib/engine/motor-calculo-2024'
import { InputCliente2024 } from '../../../../lib/engine/interfaces-cliente-2024'
import { getIndustryInsight } from '../../../../lib/config/industry-insights'
import { getCountry } from '../../../../lib/config/latam-countries-2026'
import { getSourceAttribution } from '../../../../lib/config/data-sources-2026'
import { getBenchmark2026 } from '../../../../lib/engine/benchmarks-2026-verificados'

/**
 * API MOTOR V2 - SISTEMA CONSULTIVO + PREDICCIÓN
 *
 * Combina:
 * 1. Motor de Decisión V2 (diagnóstico consultivo)
 * 2. Motor Cálculo 2024 (predicción numérica)
 *
 * Flujo:
 * - Primero genera diagnóstico consultivo (¿es viable? ¿qué plataforma?)
 * - Luego genera predicción numérica con el motor existente
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🎯 MOTOR V2 - Request recibido')

    const body = await request.json()
    console.log('⚙️ Input Motor V2:', body)

    // 1. Preparar input para Motor Decisión V2
    const inputConsultivo: InputConsultivo = {
      industria: body.industria,
      tipo_cliente: body.tipo_cliente || 'B2C',
      ticket_promedio: body.ticket_promedio || body.Z_ticket_promedio,
      ventas_actuales_mes: body.ventas_actuales_mes || 10,
      margen_bruto: body.margen_bruto || 40,

      etapa_negocio: body.etapa_negocio || 'CRECIMIENTO',
      objetivo_marketing: body.objetivo_marketing || 'LEADS',
      nivel_assets: body.nivel_assets || 'BASICO',

      presupuesto_mensual: body.presupuesto_mensual || body.X_presupuesto_mensual,

      competencia_percibida: body.competencia_percibida || 5,
      tiene_ecommerce: body.tiene_ecommerce || false,
      tiene_equipo_ventas: body.tiene_equipo_ventas || true,
      ciclo_venta_dias: body.ciclo_venta_dias || 30,
      pais: body.pais || 'CL'
    }

    console.log('🔧 Input consultivo procesado:', inputConsultivo)

    // 2. Ejecutar Motor Decisión V2 (diagnóstico consultivo)
    console.log('🧠 Ejecutando diagnóstico consultivo...')
    const diagnostico = MotorDecisionV2.diagnosticar(inputConsultivo)
    console.log('✅ Diagnóstico completado:', {
      viable: diagnostico.viable,
      score: diagnostico.score_viabilidad,
      plataforma: diagnostico.plataforma_recomendada
    })

    // 3. Si es viable, ejecutar Motor Cálculo 2024 para predicción numérica
    let prediccion = null
    if (diagnostico.viable || diagnostico.score_viabilidad >= 30) {
      console.log('📊 Ejecutando predicción numérica...')

      const inputMotor2024: any = {
        X_presupuesto_mensual: inputConsultivo.presupuesto_mensual,
        Y_tasa_cierre: body.tasa_cierre || 5,
        Z_ticket_promedio: inputConsultivo.ticket_promedio,
        industria: inputConsultivo.industria,
        tipo_cliente: inputConsultivo.tipo_cliente,
        tam_empresa: 'MEDIUM',
        competencia_percibida: inputConsultivo.competencia_percibida,
        madurez_digital: body.madurez_digital || 'INTERMEDIO',
        estacionalidad: 1.0,
        geo_objetivo: 'NACIONAL',
        decision_maker: 'GERENTE',
        objetivo_negocio: inputConsultivo.objetivo_marketing === 'VENTAS_DIRECTAS' ? 'CONVERSION' : 'LEAD_GEN',
        pais: body.pais || 'CL'
      }

      const resultadoMotor = MotorCalculo2024.calcular(inputMotor2024)

      prediccion = {
        metricas: {
          conversiones_mensuales: resultadoMotor.escenarios.base.conversiones,
          revenue_mensual: resultadoMotor.escenarios.base.revenue,
          roas_esperado: resultadoMotor.escenarios.base.roas,
          cpa_promedio: resultadoMotor.escenarios.base.cpa
        },
        escenarios: {
          conservador: {
            conversiones: resultadoMotor.escenarios.conservador.conversiones,
            revenue: resultadoMotor.escenarios.conservador.revenue,
            roas: resultadoMotor.escenarios.conservador.roas,
            cpa: resultadoMotor.escenarios.conservador.cpa
          },
          base: {
            conversiones: resultadoMotor.escenarios.base.conversiones,
            revenue: resultadoMotor.escenarios.base.revenue,
            roas: resultadoMotor.escenarios.base.roas,
            cpa: resultadoMotor.escenarios.base.cpa
          },
          agresivo: {
            conversiones: resultadoMotor.escenarios.agresivo.conversiones,
            revenue: resultadoMotor.escenarios.agresivo.revenue,
            roas: resultadoMotor.escenarios.agresivo.roas,
            cpa: resultadoMotor.escenarios.agresivo.cpa
          }
        },
        mix_campanas: resultadoMotor.mix_campanas,
        proyeccion_6_meses: Array.from({ length: 6 }, (_, i) => {
          const curva = i === 0 ? 0.6 : i === 1 ? 0.75 : i === 2 ? 0.9 : i === 3 ? 1.0 : i === 4 ? 1.1 : 1.15
          return {
            mes: i + 1,
            nombre: ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6'][i],
            conversiones: Math.round(resultadoMotor.escenarios.base.conversiones * curva),
            revenue: Math.round(resultadoMotor.escenarios.base.revenue * curva),
            roas: Math.round(resultadoMotor.escenarios.base.roas * curva * 10) / 10,
            fase: i < 2 ? 'Aprendizaje' : i < 4 ? 'Optimización' : 'Máximo'
          }
        })
      }

      console.log('✅ Predicción numérica completada')

      // VALIDACIÓN POST-PREDICCIÓN: Verificar ROAS real del motor
      const roas_real = resultadoMotor.escenarios.base.roas
      if (roas_real < 1) {
        diagnostico.alertas_criticas.push(
          `ROAS proyectado ${roas_real.toFixed(2)}x es menor a 1. Perderías $${Math.round(inputConsultivo.presupuesto_mensual * (1 - roas_real)).toLocaleString()} por mes. Considera reducir presupuesto o cambiar a Meta Ads.`
        )
        diagnostico.viable = false
        diagnostico.score_viabilidad = Math.min(diagnostico.score_viabilidad, 35)
        diagnostico.diagnostico_principal = `Proyecto NO viable económicamente. ROAS ${roas_real.toFixed(2)}x significa pérdida de dinero. Tu ticket ($${inputConsultivo.ticket_promedio.toLocaleString()}) es muy bajo para paid media rentable.`
        diagnostico.siguiente_paso = 'NO invertir en paid media con estos números. Opciones: aumentar ticket promedio, mejorar tasa de conversión, o usar solo remarketing.'

        // Si el ROAS es < 1, forzar recomendación a Meta (más barato)
        if (diagnostico.plataforma_recomendada === 'GOOGLE') {
          diagnostico.plataforma_recomendada = 'META'
          diagnostico.justificacion_plataforma = `Google Search no es viable con tu ticket. Meta Ads tiene CPCs 50-70% más bajos. Aún así, con ROAS ${roas_real.toFixed(2)}x, el paid media no es rentable para tu negocio.`
        }
      } else if (roas_real < 2) {
        // ROAS entre 1 y 2: viable pero riesgoso
        diagnostico.advertencias.push({
          tipo: 'IMPORTANTE',
          mensaje: `ROAS proyectado ${roas_real.toFixed(2)}x es bajo. Margen de error muy pequeño.`,
          accion_recomendada: 'Empezar con presupuesto mínimo y optimizar antes de escalar. Un ROAS < 2x deja poco margen para errores.'
        })
      }
    }

    // 4. Obtener insights específicos de la industria
    const industryInsight = getIndustryInsight(inputConsultivo.industria)

    // 5. Construir respuesta completa
    const respuesta = {
      // Sección 1: Diagnóstico consultivo (NUEVO)
      diagnostico: {
        viable: diagnostico.viable,
        score_viabilidad: diagnostico.score_viabilidad,
        diagnostico_principal: diagnostico.diagnostico_principal,
        alertas_criticas: diagnostico.alertas_criticas,

        recomendacion_plataforma: {
          plataforma: diagnostico.plataforma_recomendada,
          justificacion: diagnostico.justificacion_plataforma
        },

        recomendacion_campana: {
          tipo: diagnostico.tipo_campana_recomendado,
          justificacion: diagnostico.justificacion_campana
        },

        distribucion_presupuesto: diagnostico.distribucion_recomendada,

        presupuesto_sugerido: diagnostico.presupuesto_sugerido,

        advertencias: diagnostico.advertencias,

        siguiente_paso: diagnostico.siguiente_paso
      },

      // Sección 2: Predicción numérica (del motor existente)
      prediccion: prediccion,

      // Sección 3: Contexto analizado
      contexto_analizado: {
        industria: inputConsultivo.industria,
        tipo_cliente: inputConsultivo.tipo_cliente,
        ticket_promedio: inputConsultivo.ticket_promedio,
        presupuesto_mensual: inputConsultivo.presupuesto_mensual,
        etapa_negocio: inputConsultivo.etapa_negocio,
        objetivo_marketing: inputConsultivo.objetivo_marketing,
        nivel_assets: inputConsultivo.nivel_assets,
        pais: body.pais || 'CL',
        pais_info: getCountry(body.pais || 'CL')
      },

      // Sección 4: Insights de la industria (NUEVO)
      industry_insights: industryInsight ? {
        nombre: industryInsight.nombre,
        emoji: industryInsight.emoji,
        benchmarks: {
          roas: industryInsight.benchmark_roas,
          cpl: industryInsight.benchmark_cpl
        },
        tips_expertos: industryInsight.tips,
        errores_comunes: industryInsight.errores_comunes,
        mejor_plataforma_industria: industryInsight.mejor_plataforma,
        estacionalidad: industryInsight.estacionalidad,
        ciclo_venta_tipico: industryInsight.ciclo_venta_tipico,
        kpis_clave: industryInsight.kpis_clave
      } : null,

      // Sección 5: Fuentes de datos (transparencia)
      fuentes_datos: {
        benchmark_year: 2026,
        sources: getBenchmark2026(inputConsultivo.industria)?.fuentes_2026 || [],
        attribution: getSourceAttribution(getBenchmark2026(inputConsultivo.industria)?.fuentes_2026 || [])
      },

      // Metadata
      motor_v2_info: {
        version: '3.0.0',
        fecha_analisis: new Date().toISOString(),
        modulos_utilizados: ['motor-decision-v2', 'motor-calculo-2024', 'benchmarks-2026', 'latam-countries-2026', 'industry-insights'],
        metodologia: 'M&P Consultivo 2026 LATAM'
      }
    }

    console.log('🎉 Motor V2 completado exitosamente')
    return NextResponse.json(respuesta)

  } catch (error) {
    console.error('❌ Error en Motor V2:', error)

    return NextResponse.json(
      {
        error: 'Error en Motor V2',
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Motor V2 API - Sistema Consultivo',
    version: '2.0.0',
    descripcion: 'Motor de decisión consultivo + predicción numérica',
    endpoints: {
      POST: 'Generar diagnóstico y predicción completa'
    },
    inputs_requeridos: {
      industria: 'ECOMMERCE | FINTECH | TECNOLOGIA_SAAS | etc.',
      tipo_cliente: 'B2B | B2C | MIXTO',
      ticket_promedio: 'Valor promedio de venta en CLP',
      presupuesto_mensual: 'Presupuesto de ads en CLP',
      etapa_negocio: 'STARTUP | CRECIMIENTO | CONSOLIDADO',
      objetivo_marketing: 'AWARENESS | LEADS | VENTAS_DIRECTAS',
      nivel_assets: 'SIN_CONTENIDO | BASICO | PRODUCCION'
    },
    outputs: {
      diagnostico: 'Análisis consultivo con recomendaciones',
      prediccion: 'Proyección numérica de resultados'
    }
  })
}
