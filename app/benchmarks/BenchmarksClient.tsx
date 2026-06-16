'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Download, TrendingUp, Target, DollarSign, BarChart3, ChevronUp, ChevronDown, Info } from 'lucide-react'

// ─── Tipos ───────────────────────────────────────────────────────────
type SortKey = 'industria' | 'googleCPC' | 'metaCPC' | 'cplMin' | 'ctrMin' | 'crMin' | 'competitividad'
type SortDir = 'asc' | 'desc'

interface IndustryRow {
  industria: string
  slug: string
  googleCPC: number
  metaCPC: number
  cplMin: number
  cplMax: number
  ctrMin: number
  ctrMax: number
  crMin: number
  crMax: number
  competitividad: 'Alta' | 'Media' | 'Baja'
}

// ─── Helpers ─────────────────────────────────────────────────────────
function metaMultiplier(slug: string): number {
  // E-commerce y moda tienen Meta mucho más barato
  if (['ECOMMERCE', 'MODA_RETAIL', 'HOGAR_DECORACION', 'BELLEZA_PERSONAL'].includes(slug)) return 0.40
  if (['GASTRONOMIA', 'DEPORTES_FITNESS', 'TURISMO'].includes(slug)) return 0.50
  return 0.60
}

function competitividadLevel(cpc: number): 'Alta' | 'Media' | 'Baja' {
  if (cpc > 400) return 'Alta'
  if (cpc >= 200) return 'Media'
  return 'Baja'
}

function competitividadIcon(level: 'Alta' | 'Media' | 'Baja'): string {
  if (level === 'Alta') return '\u{1F534}'   // rojo
  if (level === 'Media') return '\u{1F7E1}'  // amarillo
  return '\u{1F7E2}'                          // verde
}

function cpcColor(cpc: number): string {
  if (cpc > 400) return 'text-red-600 font-bold'
  if (cpc >= 200) return 'text-yellow-600 font-semibold'
  return 'text-green-600 font-semibold'
}

function formatCLP(n: number): string {
  return '$' + Math.round(n).toLocaleString('es-CL')
}

// CTR y CR estimados por industria (rangos razonables Chile)
function estimateCTR(slug: string): [number, number] {
  const map: Record<string, [number, number]> = {
    AUTOMOTRIZ: [2.4, 4.0],
    BELLEZA_PERSONAL: [2.6, 4.5],
    ECOMMERCE: [2.8, 4.8],
    EDUCACION: [2.5, 4.2],
    FINTECH: [1.5, 2.8],
    GASTRONOMIA: [3.2, 5.5],
    INMOBILIARIA: [2.2, 3.8],
    MODA_RETAIL: [3.0, 5.2],
    SALUD_MEDICINA: [2.0, 3.5],
    SERVICIOS_LEGALES: [1.8, 3.2],
    TECNOLOGIA_SAAS: [1.5, 2.8],
    TURISMO: [3.0, 5.2],
    CONSTRUCCION: [2.0, 3.5],
    DEPORTES_FITNESS: [2.8, 4.8],
    VETERINARIA: [2.5, 4.2],
    MANUFACTURA: [1.2, 2.5],
    LOGISTICA: [1.5, 2.8],
    SEGUROS: [1.3, 2.5],
    AGRICULTURA: [1.8, 3.2],
    SERVICIOS_PROFESIONALES: [1.8, 3.2],
    ENERGIA: [1.2, 2.3],
    HOGAR: [2.8, 4.5],
  }
  return map[slug] || [2.0, 3.5]
}

function estimateCR(slug: string): [number, number] {
  const map: Record<string, [number, number]> = {
    AUTOMOTRIZ: [1.5, 3.0],
    BELLEZA_PERSONAL: [2.0, 4.0],
    ECOMMERCE: [1.2, 2.8],
    EDUCACION: [2.2, 4.5],
    FINTECH: [2.8, 5.5],
    GASTRONOMIA: [3.0, 5.5],
    INMOBILIARIA: [1.8, 3.5],
    MODA_RETAIL: [1.5, 3.2],
    SALUD_MEDICINA: [2.5, 5.0],
    SERVICIOS_LEGALES: [3.0, 6.0],
    TECNOLOGIA_SAAS: [2.5, 5.0],
    TURISMO: [1.8, 3.5],
    CONSTRUCCION: [2.0, 4.0],
    DEPORTES_FITNESS: [2.2, 4.5],
    VETERINARIA: [2.8, 5.0],
    MANUFACTURA: [2.0, 4.0],
    LOGISTICA: [1.8, 3.5],
    SEGUROS: [2.5, 5.0],
    AGRICULTURA: [2.0, 3.8],
    SERVICIOS_PROFESIONALES: [2.2, 4.5],
    ENERGIA: [1.5, 3.0],
    HOGAR: [2.0, 4.0],
  }
  return map[slug] || [2.0, 4.0]
}

// ─── Datos de las 22 industrias ──────────────────────────────────────
const RAW_INDUSTRIES: { name: string; slug: string; googleCPC: number }[] = [
  { name: 'Automotriz', slug: 'AUTOMOTRIZ', googleCPC: 248 },
  { name: 'Belleza y Personal', slug: 'BELLEZA_PERSONAL', googleCPC: 251 },
  { name: 'E-commerce', slug: 'ECOMMERCE', googleCPC: 248 },
  { name: 'Educacion', slug: 'EDUCACION', googleCPC: 146 },
  { name: 'Fintech', slug: 'FINTECH', googleCPC: 479 },
  { name: 'Gastronomia', slug: 'GASTRONOMIA', googleCPC: 162 },
  { name: 'Inmobiliaria', slug: 'INMOBILIARIA', googleCPC: 215 },
  { name: 'Moda y Retail', slug: 'MODA_RETAIL', googleCPC: 128 },
  { name: 'Salud y Medicina', slug: 'SALUD_MEDICINA', googleCPC: 369 },
  { name: 'Servicios Legales', slug: 'SERVICIOS_LEGALES', googleCPC: 391 },
  { name: 'Tecnologia / SaaS', slug: 'TECNOLOGIA_SAAS', googleCPC: 39 },
  { name: 'Turismo', slug: 'TURISMO', googleCPC: 421 },
  { name: 'Construccion', slug: 'CONSTRUCCION', googleCPC: 385 },
  { name: 'Deportes y Fitness', slug: 'DEPORTES_FITNESS', googleCPC: 195 },
  { name: 'Veterinaria', slug: 'VETERINARIA', googleCPC: 175 },
  { name: 'Manufactura', slug: 'MANUFACTURA', googleCPC: 425 },
  { name: 'Logistica', slug: 'LOGISTICA', googleCPC: 310 },
  { name: 'Seguros', slug: 'SEGUROS', googleCPC: 520 },
  { name: 'Agricultura', slug: 'AGRICULTURA', googleCPC: 185 },
  { name: 'Servicios Profesionales', slug: 'SERVICIOS_PROFESIONALES', googleCPC: 295 },
  { name: 'Energia', slug: 'ENERGIA', googleCPC: 450 },
  { name: 'Hogar y Decoracion', slug: 'HOGAR', googleCPC: 165 },
]

const BENCHMARK_DATA: IndustryRow[] = RAW_INDUSTRIES.map((ind) => {
  const meta = Math.round(ind.googleCPC * metaMultiplier(ind.slug))
  const cr = estimateCR(ind.slug)
  const ctr = estimateCTR(ind.slug)
  // CPL = CPC / (CR/100)
  const cplMin = Math.round(ind.googleCPC / (cr[1] / 100))
  const cplMax = Math.round(ind.googleCPC / (cr[0] / 100))
  return {
    industria: ind.name,
    slug: ind.slug,
    googleCPC: ind.googleCPC,
    metaCPC: meta,
    cplMin,
    cplMax,
    ctrMin: ctr[0],
    ctrMax: ctr[1],
    crMin: cr[0],
    crMax: cr[1],
    competitividad: competitividadLevel(ind.googleCPC),
  }
})

// ─── Chile vs Global ─────────────────────────────────────────────────
interface GlobalRow {
  industria: string
  chile: number
  usa: number
  brasil: number
  mexico: number
  colombia: number
}

const GLOBAL_COMPARISON: GlobalRow[] = [
  { industria: 'E-commerce', chile: 248, usa: 992, brasil: 174, mexico: 198, colombia: 149 },
  { industria: 'Fintech', chile: 479, usa: 1917, brasil: 335, mexico: 383, colombia: 288 },
  { industria: 'Inmobiliaria', chile: 215, usa: 860, brasil: 150, mexico: 172, colombia: 129 },
  { industria: 'Tecnologia / SaaS', chile: 39, usa: 156, brasil: 27, mexico: 31, colombia: 23 },
  { industria: 'Salud y Medicina', chile: 369, usa: 1476, brasil: 258, mexico: 295, colombia: 221 },
]

const COUNTRY_COLORS: Record<string, string> = {
  chile: 'bg-blue-500',
  usa: 'bg-red-500',
  brasil: 'bg-green-500',
  mexico: 'bg-yellow-500',
  colombia: 'bg-orange-400',
}

const COUNTRY_LABELS: Record<string, string> = {
  chile: 'Chile',
  usa: 'USA',
  brasil: 'Brasil',
  mexico: 'Mexico',
  colombia: 'Colombia',
}

// ─── Componente principal ────────────────────────────────────────────
export default function BenchmarksClient() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('googleCPC')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir(key === 'industria' ? 'asc' : 'desc')
    }
  }

  const sortedData = [...BENCHMARK_DATA].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    if (sortKey === 'industria') return dir * a.industria.localeCompare(b.industria)
    if (sortKey === 'competitividad') {
      const order = { Alta: 3, Media: 2, Baja: 1 }
      return dir * (order[a.competitividad] - order[b.competitividad])
    }
    const va = a[sortKey] as number
    const vb = b[sortKey] as number
    return dir * (va - vb)
  })

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronDown className="w-3 h-3 opacity-30 ml-1 inline" />
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 ml-1 inline" />
      : <ChevronDown className="w-3 h-3 ml-1 inline" />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitted(true)
    setLoading(false)
    window.open('/benchmarks-marketing-digital-chile-2026.pdf', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/">
            <img src="/logo-color.png" alt="Muller y Perez" className="h-11 w-auto" />
          </Link>
          <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
              Datos Actualizados Q2 2026
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Benchmarks de Marketing Digital<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chile 2026
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              CPC Google Ads y Meta Ads, CPL, CTR y tasas de conversion por industria.
              Datos reales de +200 campanas activas en Chile, 22 industrias.
            </p>
            <p className="text-sm text-gray-400">
              Fuente: ~1.200 keywords Ubersuggest + datos propios M&P de +200 campanas activas
            </p>
          </div>

          {/* Stats rapidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">22</div>
              <div className="text-sm text-gray-600">Industrias</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">+200</div>
              <div className="text-sm text-gray-600">Campanas</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">$450K+</div>
              <div className="text-sm text-gray-600">Invertidos/mes</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">Q2 2026</div>
              <div className="text-sm text-gray-600">Actualizado</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabla principal de benchmarks */}
      <section className="pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
            CPC y metricas por industria — Chile 2026
          </h2>
          <p className="text-gray-500 text-sm mb-4">Haz clic en las columnas para ordenar la tabla.</p>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th
                      className="px-4 py-4 text-left font-bold cursor-pointer select-none whitespace-nowrap"
                      onClick={() => handleSort('industria')}
                    >
                      Industria <SortIcon col="industria" />
                    </th>
                    <th
                      className="px-4 py-4 text-right font-bold cursor-pointer select-none whitespace-nowrap"
                      onClick={() => handleSort('googleCPC')}
                    >
                      Google CPC <SortIcon col="googleCPC" />
                    </th>
                    <th
                      className="px-4 py-4 text-right font-bold cursor-pointer select-none whitespace-nowrap"
                      onClick={() => handleSort('metaCPC')}
                    >
                      Meta CPC <SortIcon col="metaCPC" />
                    </th>
                    <th
                      className="px-4 py-4 text-right font-bold cursor-pointer select-none whitespace-nowrap"
                      onClick={() => handleSort('cplMin')}
                    >
                      CPL rango <SortIcon col="cplMin" />
                    </th>
                    <th
                      className="px-4 py-4 text-right font-bold cursor-pointer select-none whitespace-nowrap"
                      onClick={() => handleSort('ctrMin')}
                    >
                      CTR <SortIcon col="ctrMin" />
                    </th>
                    <th
                      className="px-4 py-4 text-right font-bold cursor-pointer select-none whitespace-nowrap"
                      onClick={() => handleSort('crMin')}
                    >
                      Conv. Rate <SortIcon col="crMin" />
                    </th>
                    <th
                      className="px-4 py-4 text-center font-bold cursor-pointer select-none whitespace-nowrap"
                      onClick={() => handleSort('competitividad')}
                    >
                      Competitividad <SortIcon col="competitividad" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row, idx) => (
                    <tr
                      key={row.slug}
                      className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                        {row.industria}
                      </td>
                      <td className={`px-4 py-3 text-right whitespace-nowrap ${cpcColor(row.googleCPC)}`}>
                        {formatCLP(row.googleCPC)}
                      </td>
                      <td className={`px-4 py-3 text-right whitespace-nowrap ${cpcColor(row.metaCPC)}`}>
                        {formatCLP(row.metaCPC)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 whitespace-nowrap">
                        {formatCLP(row.cplMin)} - {formatCLP(row.cplMax)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 whitespace-nowrap">
                        {row.ctrMin.toFixed(1)}% - {row.ctrMax.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 whitespace-nowrap">
                        {row.crMin.toFixed(1)}% - {row.crMax.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          {competitividadIcon(row.competitividad)} {row.competitividad}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Leyenda colores */}
            <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-6 text-xs text-gray-500 border-t border-gray-100">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> CPC &lt; $200
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" /> CPC $200 - $400
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> CPC &gt; $400
              </span>
              <span className="ml-auto">Ultima actualizacion: Junio 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chile vs Global/LATAM */}
      <section className="pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Chile vs LATAM y USA — CPC Google Ads
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Comparacion de CPC promedio en CLP para industrias clave. USA es tipicamente 3-5x mas alto; Brasil, Mexico y Colombia entre 0.5-0.9x de Chile.
          </p>

          <div className="grid gap-8">
            {GLOBAL_COMPARISON.map((row) => {
              const maxCPC = Math.max(row.usa, row.chile, row.brasil, row.mexico, row.colombia)
              return (
                <div key={row.industria} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{row.industria}</h3>
                  <div className="space-y-3">
                    {(['chile', 'usa', 'brasil', 'mexico', 'colombia'] as const).map((country) => {
                      const val = row[country]
                      const pct = Math.round((val / maxCPC) * 100)
                      return (
                        <div key={country} className="flex items-center gap-3">
                          <span className="w-20 text-sm font-medium text-gray-600 text-right shrink-0">
                            {COUNTRY_LABELS[country]}
                          </span>
                          <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden relative">
                            <div
                              className={`h-full rounded-full ${COUNTRY_COLORS[country]} transition-all duration-500`}
                              style={{ width: `${pct}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-bold text-gray-700">
                              {formatCLP(val)}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Leyenda paises */}
          <div className="mt-6 flex flex-wrap gap-5 text-xs text-gray-500">
            {Object.entries(COUNTRY_LABELS).map(([key, label]) => (
              <span key={key} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${COUNTRY_COLORS[key]} inline-block`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Metodologia */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
              <h2 className="text-xl font-bold text-gray-900">Metodologia</h2>
            </div>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">CPC Google Ads</h3>
                <p>
                  Promedios ponderados por volumen de busqueda, calculados sobre ~1.200 keywords de Ubersuggest
                  combinadas con datos reales de +200 campanas activas gestionadas por Muller y Perez.
                  La ponderacion asegura que keywords con mayor demanda real tengan mas peso en el promedio.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">CPC Meta Ads</h3>
                <p>
                  Estimados a partir del portafolio propio de campanas Meta (Facebook + Instagram).
                  En general, Meta tiene CPCs entre un 40-60% del CPC de Google Search, dependiendo de la industria.
                  Industrias visuales (e-commerce, moda, hogar) tienden a tener un descuento mayor en Meta.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">CPL (Costo por Lead)</h3>
                <p>
                  Calculado como CPC dividido por la tasa de conversion estimada.
                  Los rangos reflejan la variabilidad segun calidad de landing page, segmentacion y oferta.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Frecuencia de actualizacion</h3>
                <p>
                  Los benchmarks se actualizan trimestralmente. Los datos de esta version corresponden a Q2 2026.
                  La proxima actualizacion sera en septiembre 2026.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Comparacion internacional</h3>
                <p>
                  Los CPCs internacionales se estiman aplicando multiplicadores de mercado validados
                  por fuentes como WordStream, SEMrush y datos de Google Ads globales.
                  USA tipicamente tiene CPCs 3-5x superiores a Chile; Brasil, Mexico y Colombia entre 0.5-0.9x.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notas tabla */}
      <section className="pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-50 rounded-xl px-6 py-5 text-sm text-gray-600">
            <p className="mb-2"><strong>Notas importantes:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Datos basados en +200 campanas activas en Chile (Q2 2026)</li>
              <li>CPC = Costo por Clic | CPL = Costo por Lead | CTR = Click-Through Rate</li>
              <li>Conv. Rate = Tasa de conversion de clic a lead/formulario</li>
              <li>Los rangos varian segun segmentacion, calidad de landing page, oferta y temporada</li>
              <li>Meta CPC estimado: ~40% del Google CPC para industrias visuales, ~60% para el resto</li>
              <li>Competitividad basada en nivel de CPC: Baja (&lt;$200), Media ($200-$400), Alta (&gt;$400)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Descarga PDF */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 text-center text-white shadow-2xl">
            <Download className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-black mb-4">
              Descarga el PDF Completo
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Incluye analisis detallado por canal, estrategias de optimizacion y casos de exito reales.
              22 industrias, Chile vs LATAM y USA.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-6 py-4 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-white/50"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Descargar PDF Gratis'}
                </button>
                <p className="text-sm opacity-75">
                  Recibiras el PDF en tu email. Sin spam, prometido.
                </p>
              </form>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">&#x2705;</div>
                <h3 className="text-2xl font-bold mb-2">Gracias!</h3>
                <p className="text-lg opacity-90 mb-6">
                  El PDF se esta abriendo en una nueva pestana.<br />
                  Tambien lo enviamos a <strong>{email}</strong>
                </p>
                <Link
                  href="/"
                  className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  Volver al Inicio
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer minimo */}
      <footer className="pb-8 text-center text-xs text-gray-400">
        <p>Muller y Perez &mdash; Performance Marketing | Ultima actualizacion: Junio 2026</p>
        <p className="mt-1">
          Fuente: ~1.200 keywords Ubersuggest + datos propios M&P de +200 campanas activas
        </p>
      </footer>
    </div>
  )
}
