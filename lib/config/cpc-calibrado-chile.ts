// @ts-nocheck
/**
 * CPCs CALIBRADOS CON DATOS REALES DE UBERSUGGEST - CHILE
 * Metodología: Promedio PONDERADO por volumen de búsqueda
 *
 * Fórmula: CPC_ponderado = Σ(CPC_keyword × Volumen_keyword) / Σ(Volumen_keyword)
 *
 * Fecha actualización: 2025-09-30
 * Fuente: Ubersuggest bulk analysis (2 partes combinadas)
 * Keywords analizadas: ~1,200 keywords totales
 * Keywords con data válida: 333 (volumen > 0 y CPC > 0)
 *
 * Mejora vs versión anterior:
 * - Ahora los CPCs reflejan el volumen real de búsqueda
 * - Keywords con alto volumen tienen mayor peso en el promedio
 * - Datos más representativos del mercado real chileno
 */

export const CPC_CALIBRADO_CHILE = {
  AUTOMOTRIZ: {
    cpc_promedio: 248.00,
    cpc_mediano: 173.00,
    cpc_min: 3.36,
    cpc_max: 695.00,
    keywords_con_data: 25,
    total_volumen: 3620,
    nota: 'Ponderado +8.7% vs simple (mayor demanda en SUVs y pickups)'
  },
  BELLEZA_PERSONAL: {
    cpc_promedio: 250.97,
    cpc_mediano: 304.00,
    cpc_min: 1.15,
    cpc_max: 859.00,
    keywords_con_data: 18,
    total_volumen: 3210,
    nota: 'Ponderado -21.2% vs simple (alto volumen en servicios básicos)'
  },
  ECOMMERCE: {
    cpc_promedio: 247.55,
    cpc_mediano: 212.00,
    cpc_min: 33.00,
    cpc_max: 922.00,
    keywords_con_data: 35,
    total_volumen: 12130,
    nota: 'Ponderado +3.2% vs simple (CPCs balanceados)'
  },
  EDUCACION: {
    cpc_promedio: 145.65,
    cpc_mediano: 2.77,
    cpc_min: 1.04,
    cpc_max: 917.00,
    keywords_con_data: 30,
    total_volumen: 4210,
    nota: 'Ponderado -47.5% vs simple (cursos online masivos de bajo CPC)'
  },
  FINTECH: {
    cpc_promedio: 478.97,
    cpc_mediano: 497.00,
    cpc_min: 1.08,
    cpc_max: 975.00,
    keywords_con_data: 29,
    total_volumen: 23520,
    nota: 'Ponderado +13.7% vs simple (alto volumen en créditos e hipotecarios)'
  },
  GASTRONOMIA: {
    cpc_promedio: 162.44,
    cpc_mediano: 202.00,
    cpc_min: 86.00,
    cpc_max: 926.00,
    keywords_con_data: 16,
    total_volumen: 12130,
    nota: 'Ponderado -44.7% vs simple (delivery masivo baja el promedio)'
  },
  INMOBILIARIA: {
    cpc_promedio: 214.93,
    cpc_mediano: 135.00,
    cpc_min: 1.01,
    cpc_max: 926.00,
    keywords_con_data: 59,
    total_volumen: 72640,
    nota: 'Ponderado -1.0% vs simple (muestra más robusta, CPCs estables)'
  },
  MODA_RETAIL: {
    cpc_promedio: 127.94,
    cpc_mediano: 173.00,
    cpc_min: 28.00,
    cpc_max: 868.00,
    keywords_con_data: 50,
    total_volumen: 111210,
    nota: 'Ponderado -31.1% vs simple (zapatillas masivas bajan CPC promedio)'
  },
  SALUD_MEDICINA: {
    cpc_promedio: 369.13,
    cpc_mediano: 294.00,
    cpc_min: 1.70,
    cpc_max: 801.00,
    keywords_con_data: 11,
    total_volumen: 1410,
    nota: 'Ponderado +28.2% vs simple (especialidades médicas con alto volumen)'
  },
  SERVICIOS_LEGALES: {
    cpc_promedio: 391.34,
    cpc_mediano: 1.44,
    cpc_min: 1.04,
    cpc_max: 864.00,
    keywords_con_data: 11,
    total_volumen: 1040,
    nota: 'Ponderado +112.7% vs simple (litigios laborales alto volumen y CPC)'
  },
  TECNOLOGIA_SAAS: {
    cpc_promedio: 38.66,
    cpc_mediano: 3.39,
    cpc_min: 1.15,
    cpc_max: 849.00,
    keywords_con_data: 18,
    total_volumen: 22940,
    nota: 'Ponderado -51.2% vs simple (software básico alto volumen bajo CPC)'
  },
  TURISMO: {
    cpc_promedio: 420.88,
    cpc_mediano: 444.00,
    cpc_min: 1.01,
    cpc_max: 965.00,
    keywords_con_data: 31,
    total_volumen: 16600,
    nota: 'Ponderado -9.9% vs simple (hoteles y tours equilibrados)'
  },
} as const;

/**
 * Helper function to get calibrated CPC by industry
 * @param industria - Industry code (e.g., 'ECOMMERCE', 'INMOBILIARIA')
 * @returns Calibrated average CPC in CLP
 */
export function getCPCCalibrado(industria: string): number {
  const industryData = CPC_CALIBRADO_CHILE[industria as keyof typeof CPC_CALIBRADO_CHILE];
  return industryData?.cpc_promedio || 250; // default fallback
}

/**
 * Get all CPC data for an industry
 * @param industria - Industry code
 * @returns Complete CPC data object or null
 */
export function getCPCData(industria: string) {
  return CPC_CALIBRADO_CHILE[industria as keyof typeof CPC_CALIBRADO_CHILE] || null;
}
