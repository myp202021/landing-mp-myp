/**
 * BENCHMARKS DE REFERENCIA PARA M&P INTELLIGENCE
 *
 * Basado en datos del Predictor M&P (benchmarks-2024-verificados.ts)
 * Adaptado para mostrar ROAS, CAC y Conversion Rate por industria y canal
 *
 * Fuentes: WordStream 2024, Triple Whale, Databox, XYZLab Chile
 *
 * USO: Estos benchmarks se muestran cuando no hay suficiente data real
 * de la comunidad. Sistema híbrido progresivo según cantidad de muestras.
 */

import type { Industry, Channel } from './types/intelligence'

export interface ReferenceBenchmark {
  roas: {
    p25: number    // Percentil 25
    median: number // Mediana
    p75: number    // Percentil 75
  }
  cac: {
    p25: number
    median: number
    p75: number
  }
  conversion: {
    p25: number
    median: number
    p75: number
  }
}

// Umbral para decidir cuándo usar referencias vs data real
export const DATA_THRESHOLDS = {
  MINIMUM_FOR_REAL: 10      // 10+ muestras = usar data real, <10 = usar referencias
}

/**
 * Benchmarks de referencia por industria y canal
 * Calculados a partir de:
 * - CPC promedio de Ubersuggest Chile 2024
 * - CVR promedio por industria (WordStream/Triple Whale)
 * - Ticket promedio estimado por industria en Chile
 */
export const REFERENCE_BENCHMARKS: Partial<Record<Industry, Partial<Record<Channel, ReferenceBenchmark>>>> = {

  ECOMMERCE: {
    GOOGLE_ADS: {
      roas: { p25: 3.0, median: 5.0, p75: 8.0 },
      cac: { p25: 8000, median: 15000, p75: 30000 },
      conversion: { p25: 2.0, median: 2.8, p75: 4.5 }
    },
    META_ADS: {
      roas: { p25: 2.5, median: 4.0, p75: 6.5 },
      cac: { p25: 6000, median: 12000, p75: 25000 },
      conversion: { p25: 5.0, median: 8.8, p75: 15.0 }
    },
    LINKEDIN_ADS: {
      roas: { p25: 1.5, median: 2.5, p75: 4.0 },
      cac: { p25: 20000, median: 40000, p75: 80000 },
      conversion: { p25: 1.0, median: 2.0, p75: 3.5 }
    }
  },

  SERVICIOS_PROFESIONALES: {
    GOOGLE_ADS: {
      roas: { p25: 3.5, median: 6.0, p75: 10.0 },
      cac: { p25: 30000, median: 60000, p75: 120000 },
      conversion: { p25: 3.0, median: 5.0, p75: 8.0 }
    },
    META_ADS: {
      roas: { p25: 2.0, median: 3.5, p75: 6.0 },
      cac: { p25: 35000, median: 70000, p75: 140000 },
      conversion: { p25: 2.0, median: 4.0, p75: 7.0 }
    },
    LINKEDIN_ADS: {
      roas: { p25: 2.5, median: 4.5, p75: 8.0 },
      cac: { p25: 40000, median: 80000, p75: 160000 },
      conversion: { p25: 2.5, median: 4.5, p75: 8.0 }
    }
  },

  TECNOLOGIA_SAAS: {
    GOOGLE_ADS: {
      roas: { p25: 4.0, median: 7.0, p75: 12.0 },
      cac: { p25: 40000, median: 80000, p75: 150000 },
      conversion: { p25: 3.0, median: 5.5, p75: 9.0 }
    },
    META_ADS: {
      roas: { p25: 2.5, median: 4.5, p75: 8.0 },
      cac: { p25: 45000, median: 90000, p75: 180000 },
      conversion: { p25: 2.0, median: 4.0, p75: 7.0 }
    },
    LINKEDIN_ADS: {
      roas: { p25: 3.0, median: 5.5, p75: 10.0 },
      cac: { p25: 50000, median: 100000, p75: 200000 },
      conversion: { p25: 2.5, median: 5.0, p75: 8.5 }
    }
  },

  SALUD_MEDICINA: {
    GOOGLE_ADS: {
      roas: { p25: 3.0, median: 5.5, p75: 9.0 },
      cac: { p25: 25000, median: 50000, p75: 100000 },
      conversion: { p25: 3.5, median: 7.0, p75: 12.0 }
    },
    META_ADS: {
      roas: { p25: 2.0, median: 3.5, p75: 6.0 },
      cac: { p25: 30000, median: 60000, p75: 120000 },
      conversion: { p25: 2.0, median: 4.8, p75: 8.0 }
    }
  },

  EDUCACION_ONLINE: {
    GOOGLE_ADS: {
      roas: { p25: 3.5, median: 6.0, p75: 10.0 },
      cac: { p25: 20000, median: 40000, p75: 80000 },
      conversion: { p25: 5.0, median: 10.0, p75: 16.0 }
    },
    META_ADS: {
      roas: { p25: 2.5, median: 4.5, p75: 7.5 },
      cac: { p25: 18000, median: 35000, p75: 70000 },
      conversion: { p25: 6.0, median: 10.0, p75: 16.0 }
    }
  },

  INMOBILIARIA: {
    GOOGLE_ADS: {
      roas: { p25: 5.0, median: 10.0, p75: 20.0 },
      cac: { p25: 50000, median: 100000, p75: 200000 },
      conversion: { p25: 0.8, median: 1.2, p75: 2.0 }
    },
    META_ADS: {
      roas: { p25: 4.0, median: 8.0, p75: 15.0 },
      cac: { p25: 60000, median: 120000, p75: 250000 },
      conversion: { p25: 4.0, median: 9.7, p75: 16.0 }
    }
  },

  FINTECH: {
    GOOGLE_ADS: {
      roas: { p25: 4.0, median: 7.0, p75: 12.0 },
      cac: { p25: 40000, median: 80000, p75: 160000 },
      conversion: { p25: 2.5, median: 4.7, p75: 8.0 }
    },
    META_ADS: {
      roas: { p25: 3.0, median: 5.0, p75: 8.5 },
      cac: { p25: 45000, median: 90000, p75: 180000 },
      conversion: { p25: 3.0, median: 5.5, p75: 10.0 }
    },
    LINKEDIN_ADS: {
      roas: { p25: 3.5, median: 6.0, p75: 10.0 },
      cac: { p25: 50000, median: 100000, p75: 200000 },
      conversion: { p25: 2.0, median: 4.0, p75: 7.0 }
    }
  },

  TURISMO: {
    GOOGLE_ADS: {
      roas: { p25: 3.0, median: 5.0, p75: 8.0 },
      cac: { p25: 15000, median: 30000, p75: 60000 },
      conversion: { p25: 3.5, median: 7.0, p75: 12.0 }
    },
    META_ADS: {
      roas: { p25: 2.5, median: 4.0, p75: 6.5 },
      cac: { p25: 12000, median: 25000, p75: 50000 },
      conversion: { p25: 4.0, median: 8.8, p75: 15.0 }
    }
  },

  AUTOMOTRIZ: {
    GOOGLE_ADS: {
      roas: { p25: 4.0, median: 8.0, p75: 15.0 },
      cac: { p25: 80000, median: 160000, p75: 320000 },
      conversion: { p25: 5.0, median: 13.0, p75: 20.0 }
    },
    META_ADS: {
      roas: { p25: 3.0, median: 6.0, p75: 12.0 },
      cac: { p25: 90000, median: 180000, p75: 360000 },
      conversion: { p25: 2.0, median: 4.9, p75: 9.0 }
    }
  },

  MODA_RETAIL: {
    GOOGLE_ADS: {
      roas: { p25: 3.5, median: 6.0, p75: 10.0 },
      cac: { p25: 8000, median: 16000, p75: 32000 },
      conversion: { p25: 3.5, median: 8.0, p75: 14.0 }
    },
    META_ADS: {
      roas: { p25: 3.0, median: 5.0, p75: 8.5 },
      cac: { p25: 7000, median: 14000, p75: 28000 },
      conversion: { p25: 4.0, median: 8.8, p75: 15.0 }
    }
  },

  GASTRONOMIA: {
    GOOGLE_ADS: {
      roas: { p25: 2.0, median: 3.5, p75: 6.0 },
      cac: { p25: 3000, median: 6000, p75: 12000 },
      conversion: { p25: 3.5, median: 7.0, p75: 12.0 }
    },
    META_ADS: {
      roas: { p25: 1.8, median: 3.0, p75: 5.0 },
      cac: { p25: 2500, median: 5000, p75: 10000 },
      conversion: { p25: 8.0, median: 18.3, p75: 30.0 }
    }
  },

  VETERINARIA: {
    GOOGLE_ADS: {
      roas: { p25: 3.0, median: 5.0, p75: 8.5 },
      cac: { p25: 15000, median: 30000, p75: 60000 },
      conversion: { p25: 3.0, median: 6.0, p75: 10.0 }
    },
    META_ADS: {
      roas: { p25: 2.5, median: 4.0, p75: 7.0 },
      cac: { p25: 12000, median: 25000, p75: 50000 },
      conversion: { p25: 4.0, median: 8.0, p75: 14.0 }
    }
  },

  DEPORTES: {
    GOOGLE_ADS: {
      roas: { p25: 3.0, median: 5.5, p75: 9.0 },
      cac: { p25: 10000, median: 20000, p75: 40000 },
      conversion: { p25: 3.0, median: 6.0, p75: 10.0 }
    },
    META_ADS: {
      roas: { p25: 2.5, median: 4.5, p75: 7.5 },
      cac: { p25: 8000, median: 16000, p75: 32000 },
      conversion: { p25: 4.0, median: 8.0, p75: 14.0 }
    }
  },

  CONSTRUCCION: {
    GOOGLE_ADS: {
      roas: { p25: 4.0, median: 8.0, p75: 15.0 },
      cac: { p25: 60000, median: 120000, p75: 250000 },
      conversion: { p25: 2.0, median: 4.0, p75: 7.0 }
    },
    META_ADS: {
      roas: { p25: 3.0, median: 6.0, p75: 12.0 },
      cac: { p25: 70000, median: 140000, p75: 280000 },
      conversion: { p25: 1.5, median: 3.5, p75: 6.0 }
    }
  },

  SEGUROS: {
    GOOGLE_ADS: {
      roas: { p25: 3.5, median: 6.5, p75: 11.0 },
      cac: { p25: 35000, median: 70000, p75: 140000 },
      conversion: { p25: 2.5, median: 5.0, p75: 8.5 }
    },
    META_ADS: {
      roas: { p25: 2.5, median: 4.5, p75: 8.0 },
      cac: { p25: 40000, median: 80000, p75: 160000 },
      conversion: { p25: 2.0, median: 4.5, p75: 8.0 }
    },
    LINKEDIN_ADS: {
      roas: { p25: 3.0, median: 5.5, p75: 9.5 },
      cac: { p25: 45000, median: 90000, p75: 180000 },
      conversion: { p25: 2.0, median: 4.0, p75: 7.0 }
    }
  }
}

/**
 * Obtiene el benchmark de referencia para una industria y canal
 */
export function getReferenceBenchmark(
  industry: Industry,
  channel: Channel
): ReferenceBenchmark | null {
  return REFERENCE_BENCHMARKS[industry]?.[channel] || null
}

/**
 * Determina si usar referencias o data real
 */
export function shouldUseReferences(totalSamples: number): boolean {
  return totalSamples < DATA_THRESHOLDS.MINIMUM_FOR_REAL
}

/**
 * Obtiene el label de calidad para UI
 */
export function getDataQualityLabel(totalSamples: number): string {
  if (totalSamples >= DATA_THRESHOLDS.MINIMUM_FOR_REAL) {
    return `Basado en ${totalSamples} empresas reales`
  }
  if (totalSamples > 0) {
    return `Solo ${totalSamples} ${totalSamples === 1 ? 'muestra' : 'muestras'}. Usando referencias de mercado hasta tener 10+ contribuciones.`
  }
  return 'Benchmarks de referencia de mercado (WordStream 2024, Triple Whale)'
}
