import type { Benchmark } from './types/intelligence'

export interface Insight {
  type: 'success' | 'warning' | 'info' | 'danger'
  title: string
  description: string
  action?: string
  priority: number // 1-5, 5 being highest
}

/**
 * Genera insights automáticos basados en los benchmarks
 */
export function generateInsights(
  userMetrics: {
    budget: number
    revenue: number
    cac?: number
    roas: number
    conversionRate?: number
    leads?: number
    sales?: number
  },
  benchmark: Benchmark
): Insight[] {
  const insights: Insight[] = []

  // 1. Análisis de ROAS
  if (userMetrics.roas > benchmark.avgROAS * 1.5) {
    insights.push({
      type: 'success',
      title: '🎉 ROAS excepcional',
      description: `Tu ROAS de ${userMetrics.roas.toFixed(1)}x es ${((userMetrics.roas / benchmark.avgROAS - 1) * 100).toFixed(0)}% mejor que el promedio de ${benchmark.avgROAS.toFixed(1)}x en tu industria.`,
      action: 'Considera incrementar presupuesto para escalar este éxito',
      priority: 5,
    })
  } else if (userMetrics.roas < benchmark.avgROAS * 0.7) {
    insights.push({
      type: 'danger',
      title: '⚠️ ROAS bajo el promedio',
      description: `Tu ROAS de ${userMetrics.roas.toFixed(1)}x está ${((1 - userMetrics.roas / benchmark.avgROAS) * 100).toFixed(0)}% por debajo del promedio de la industria (${benchmark.avgROAS.toFixed(1)}x).`,
      action: 'Revisa la segmentación de audiencias y copy de anuncios',
      priority: 5,
    })
  } else if (userMetrics.roas >= benchmark.avgROAS && userMetrics.roas <= benchmark.avgROAS * 1.2) {
    insights.push({
      type: 'info',
      title: 'ROAS en promedio de industria',
      description: `Tu ROAS de ${userMetrics.roas.toFixed(1)}x está alineado con el promedio (${benchmark.avgROAS.toFixed(1)}x). Hay oportunidad de optimizar.`,
      action: 'Prueba nuevas variantes de creatividades o segmentos',
      priority: 3,
    })
  }

  // 2. Análisis de CAC
  if (userMetrics.cac && benchmark.avgCAC) {
    if (userMetrics.cac < benchmark.avgCAC * 0.7) {
      insights.push({
        type: 'success',
        title: '💰 CAC muy eficiente',
        description: `Tu CAC de $${Math.round(userMetrics.cac).toLocaleString('es-CL')} es ${((1 - userMetrics.cac / benchmark.avgCAC) * 100).toFixed(0)}% más bajo que el promedio ($${Math.round(benchmark.avgCAC).toLocaleString('es-CL')}).`,
        action: 'Estás adquiriendo clientes eficientemente. Documenta tu estrategia.',
        priority: 4,
      })
    } else if (userMetrics.cac > benchmark.avgCAC * 1.3) {
      insights.push({
        type: 'warning',
        title: 'CAC elevado',
        description: `Tu CAC de $${Math.round(userMetrics.cac).toLocaleString('es-CL')} es ${((userMetrics.cac / benchmark.avgCAC - 1) * 100).toFixed(0)}% más alto que el promedio de la industria ($${Math.round(benchmark.avgCAC).toLocaleString('es-CL')}).`,
        action: 'Revisa tu funnel de conversión y optimiza landing pages',
        priority: 4,
      })
    }
  }

  // 3. Análisis de tasa de conversión
  if (userMetrics.conversionRate && benchmark.avgConversionRate) {
    if (userMetrics.conversionRate < benchmark.avgConversionRate * 0.7) {
      insights.push({
        type: 'danger',
        title: '📉 Tasa de conversión baja',
        description: `Tu tasa de conversión de ${userMetrics.conversionRate.toFixed(1)}% está muy por debajo del promedio (${benchmark.avgConversionRate.toFixed(1)}%).`,
        action: 'Audita tu proceso de ventas y califica mejor tus leads',
        priority: 5,
      })
    } else if (userMetrics.conversionRate > benchmark.avgConversionRate * 1.5) {
      insights.push({
        type: 'success',
        title: '🎯 Conversión sobresaliente',
        description: `Tu tasa de conversión de ${userMetrics.conversionRate.toFixed(1)}% supera significativamente el promedio (${benchmark.avgConversionRate.toFixed(1)}%).`,
        action: 'Comparte tu proceso con el equipo y replícalo',
        priority: 4,
      })
    }
  }

  // 4. Análisis de presupuesto (solo si hay datos reales)
  if (!benchmark.isReference && benchmark.avgBudget > 0) {
    if (userMetrics.budget < benchmark.avgBudget * 0.5) {
      insights.push({
        type: 'info',
        title: 'Presupuesto conservador',
        description: `Tu presupuesto de $${Math.round(userMetrics.budget).toLocaleString('es-CL')} es significativamente menor al promedio de la industria ($${Math.round(benchmark.avgBudget).toLocaleString('es-CL')}).`,
        action: userMetrics.roas > 2 ? 'Con tu ROAS actual, hay oportunidad de escalar inversión' : 'Mejora ROAS antes de escalar presupuesto',
        priority: 2,
      })
    } else if (userMetrics.budget > benchmark.avgBudget * 2) {
      insights.push({
        type: 'info',
        title: 'Presupuesto agresivo',
        description: `Tu presupuesto de $${Math.round(userMetrics.budget).toLocaleString('es-CL')} es más del doble del promedio de la industria ($${Math.round(benchmark.avgBudget).toLocaleString('es-CL')}).`,
        action: userMetrics.roas > benchmark.avgROAS ? 'Bien hecho, estás escalando con buenos resultados' : 'Con ROAS bajo promedio, considera reducir hasta optimizar',
        priority: 3,
      })
    }
  }

  // 5. Análisis de volumen (leads vs sales)
  if (userMetrics.leads && userMetrics.sales) {
    if (userMetrics.leads > 100 && userMetrics.sales < 10) {
      insights.push({
        type: 'warning',
        title: 'Embudo con fugas',
        description: `Generas muchos leads (${userMetrics.leads}) pero pocas ventas (${userMetrics.sales}). Hay una oportunidad significativa.`,
        action: 'Califica mejor tus leads o mejora tu proceso de cierre',
        priority: 5,
      })
    } else if (userMetrics.sales > userMetrics.leads * 0.5) {
      insights.push({
        type: 'success',
        title: 'Leads de alta calidad',
        description: `Más del 50% de tus leads se convierten en ventas. Excelente calificación de audiencia.`,
        action: 'Considera aumentar inversión en estos canales',
        priority: 4,
      })
    }
  }

  // 6. Análisis de sample size
  if (benchmark.isReference) {
    insights.push({
      type: 'info',
      title: 'Benchmarks de referencia',
      description: benchmark.totalSamples === 0
        ? 'Aún no hay datos reales para esta combinación. Mostrando benchmarks de fuentes verificadas (WordStream, Triple Whale).'
        : `Solo ${benchmark.totalSamples} ${benchmark.totalSamples === 1 ? 'empresa ha' : 'empresas han'} compartido datos (se necesitan 10+ para usar data real). Mostrando benchmarks de referencia mientras tanto.`,
      action: 'Comparte este link con tu red para obtener benchmarks reales',
      priority: 1,
    })
  } else if (benchmark.totalSamples >= 20) {
    insights.push({
      type: 'success',
      title: 'Benchmarks confiables',
      description: `Con ${benchmark.totalSamples} empresas contribuyendo, estos benchmarks son estadísticamente significativos.`,
      priority: 1,
    })
  } else if (benchmark.totalSamples < 20) {
    insights.push({
      type: 'info',
      title: 'Benchmarks en crecimiento',
      description: `Hay ${benchmark.totalSamples} empresas contribuyendo. Los datos serán más representativos con más contribuciones.`,
      action: 'Comparte este link con tu red para mejorar la precisión',
      priority: 1,
    })
  }

  // 7. Análisis de eficiencia relativa (solo si hay datos reales)
  if (!benchmark.isReference && benchmark.avgBudget > 0 && benchmark.avgRevenue > 0) {
    const yourEfficiency = userMetrics.revenue / userMetrics.budget
    const avgEfficiency = benchmark.avgRevenue / benchmark.avgBudget

    if (yourEfficiency > avgEfficiency * 1.5) {
      insights.push({
        type: 'success',
        title: '⚡ Alta eficiencia de inversión',
        description: `Estás generando ${yourEfficiency.toFixed(2)}x en revenue por cada peso invertido, vs ${avgEfficiency.toFixed(2)}x del promedio.`,
        action: 'Este canal está funcionando excepcionalmente bien',
        priority: 4,
      })
    }
  }

  // Ordenar por prioridad (mayor a menor)
  return insights.sort((a, b) => b.priority - a.priority)
}

/**
 * Genera recomendaciones de acción basadas en la posición del usuario
 */
export function getActionableRecommendations(
  userPosition: 'TOP_10' | 'ABOVE_AVG' | 'AVERAGE' | 'BELOW_AVG' | 'BOTTOM_10',
  metric: 'roas' | 'cac' | 'conversion'
): string[] {
  const recommendations: Record<typeof userPosition, Record<typeof metric, string[]>> = {
    TOP_10: {
      roas: [
        'Documenta tu estrategia ganadora',
        'Escala inversión manteniendo eficiencia',
        'Comparte aprendizajes con el equipo',
        'Explora nuevos canales con esta metodología',
      ],
      cac: [
        'Identifica qué hace diferente tu adquisición',
        'Mantén esta eficiencia al escalar',
        'Considera expandir a segmentos similares',
      ],
      conversion: [
        'Analiza qué hace único tu proceso de cierre',
        'Capacita al equipo en estas técnicas',
        'Documenta el playbook para replicar',
      ],
    },
    ABOVE_AVG: {
      roas: [
        'Buen desempeño, busca optimizaciones incrementales',
        'Testea nuevas creatividades para llegar a top 10%',
        'Monitorea métricas semanalmente',
      ],
      cac: [
        'Continúa optimizando para llegar a top 10%',
        'Prueba nuevos segmentos de audiencia',
        'Analiza oportunidades de automatización',
      ],
      conversion: [
        'Revisa el proceso de los top performers',
        'Implementa A/B testing en landing pages',
        'Optimiza seguimiento de leads',
      ],
    },
    AVERAGE: {
      roas: [
        'Audita campañas: pausa las de bajo rendimiento',
        'Testea nuevas variantes de copy y creatividades',
        'Revisa segmentación de audiencias',
        'Considera contratar experto en Google/Meta Ads',
      ],
      cac: [
        'Optimiza landing pages (velocidad + CRO)',
        'Revisa calidad de leads generados',
        'Testea nuevos canales de adquisición',
      ],
      conversion: [
        'Audita tu funnel de ventas completo',
        'Implementa scoring de leads',
        'Capacita equipo de ventas',
        'Reduce fricción en proceso de compra',
      ],
    },
    BELOW_AVG: {
      roas: [
        'URGENTE: Pausa campañas no rentables',
        'Revisa tracking de conversiones (puede estar mal)',
        'Audita con experto externo',
        'Vuelve a basics: audiencia, mensaje, oferta',
      ],
      cac: [
        'Revisa calidad de tráfico (mucho bot traffic?)',
        'Optimiza landing page UX',
        'Mejora calificación de leads',
        'Considera cambiar canal principal',
      ],
      conversion: [
        'Problema crítico en funnel de ventas',
        'Audita proceso con equipo comercial',
        'Revisa pricing y propuesta de valor',
        'Implementa nurturing de leads',
      ],
    },
    BOTTOM_10: {
      roas: [
        '🚨 CRÍTICO: Detén inversión hasta solucionar',
        'Contrata consultor especializado AHORA',
        'Revisa tracking (probablemente está roto)',
        'Vuelve a estrategia desde cero',
      ],
      cac: [
        'Estás perdiendo dinero en cada cliente',
        'Pausa campañas y re-evalúa estrategia',
        'Problema fundamental en propuesta de valor',
      ],
      conversion: [
        'Tu proceso de ventas tiene problemas graves',
        'Audita con gerente comercial urgentemente',
        'Probablemente estás generando leads de muy baja calidad',
      ],
    },
  }

  return recommendations[userPosition][metric] || []
}
