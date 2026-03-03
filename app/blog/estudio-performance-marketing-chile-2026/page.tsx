import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, BarChart2, Target, DollarSign, CheckCircle2, AlertCircle, Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Estudio: Benchmarks de Performance Marketing en Chile 2026 — Datos de +200 Campañas Reales',
  description: 'CPL, ROAS y CPC reales por industria en Chile 2026. Datos de +200 campañas activas: e-commerce ROAS 5x, inmobiliaria CPL $55k, fintech CPC $479. Metodología verificada.',
  keywords: 'benchmarks marketing digital chile 2026, cpl promedio chile, roas chile, cpc chile por industria, performance marketing chile, estudio marketing digital chile, datos reales campañas digitales',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/estudio-performance-marketing-chile-2026'
  },
  openGraph: {
    title: 'Estudio: Benchmarks de Performance Marketing en Chile 2026',
    description: 'CPL, ROAS y CPC reales por industria. Datos de +200 campañas activas en Chile. El benchmark más completo del mercado.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/estudio-performance-marketing-chile-2026',
    publishedTime: '2026-03-03T09:00:00Z',
    authors: ['Christopher Müller — Muller y Pérez'],
    images: [{ url: 'https://www.mulleryperez.cl/og-image.svg', width: 1200, height: 630, alt: 'Benchmarks Performance Marketing Chile 2026' }]
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Estudio: Benchmarks de Performance Marketing en Chile 2026 — Datos de +200 Campañas Reales',
      description: 'CPL, ROAS y CPC reales por industria en Chile. Datos de +200 campañas activas.',
      datePublished: '2026-03-03T09:00:00Z',
      dateModified: '2026-03-03T09:00:00Z',
      author: {
        '@type': 'Person',
        name: 'Christopher Müller',
        url: 'https://www.mulleryperez.cl/equipo/christopher-muller',
        jobTitle: 'CEO & Founder',
        worksFor: { '@type': 'Organization', name: 'Muller y Pérez' }
      },
      publisher: {
        '@type': 'Organization',
        name: 'Muller y Pérez',
        url: 'https://www.mulleryperez.cl',
        logo: { '@type': 'ImageObject', url: 'https://www.mulleryperez.cl/logo-color.png' }
      },
      mainEntityOfPage: 'https://www.mulleryperez.cl/blog/estudio-performance-marketing-chile-2026',
      about: { '@type': 'Thing', name: 'Performance Marketing Chile 2026' },
      keywords: ['benchmarks marketing digital', 'CPL Chile', 'ROAS Chile', 'CPC Chile', 'performance marketing'],
      isBasedOn: { '@type': 'Dataset', name: '+200 campañas activas gestionadas por Muller y Pérez en Chile 2024-2026' }
    },
    {
      '@type': 'Dataset',
      name: 'Benchmarks Performance Marketing Chile 2026',
      description: 'CPL, ROAS, CPC y distribución de presupuesto por industria en Chile. Basado en +200 campañas activas.',
      creator: { '@type': 'Organization', name: 'Muller y Pérez', url: 'https://www.mulleryperez.cl' },
      datePublished: '2026-03-03',
      temporalCoverage: '2024/2026',
      spatialCoverage: 'Chile',
      variableMeasured: ['CPL', 'ROAS', 'CPC', 'CTR', 'CVR', 'CAC']
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuál es el CPL promedio en Chile para e-commerce?',
          acceptedAnswer: { '@type': 'Answer', text: 'El CPL promedio en e-commerce en Chile es de $8.800 CLP en Google Ads y $5.600 CLP en Meta Ads, con un CAC total aproximado de $15.000 CLP. Datos basados en +200 campañas activas de Muller y Pérez (2024-2026).' }
        },
        {
          '@type': 'Question',
          name: '¿Qué ROAS es normal en Chile?',
          acceptedAnswer: { '@type': 'Answer', text: 'El ROAS promedio en Chile varía significativamente por industria: e-commerce 5x (Google) y 4x (Meta), inmobiliaria 10x (Google), fintech 7x (Google) y 5x (Meta), SaaS 7x (Google). El ROAS mínimo aceptable para que una campaña sea rentable en Chile es 3x.' }
        },
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta el clic (CPC) en Google Ads en Chile?',
          acceptedAnswer: { '@type': 'Answer', text: 'El CPC en Google Ads en Chile varía entre $38 CLP (SaaS) y $520 CLP (seguros). El promedio general es $280 CLP. Las industrias más caras son seguros ($520), fintech ($479), energía ($450) y manufactura ($425). Las más baratas son SaaS ($39), gastronomía ($162) y moda ($128).' }
        },
        {
          '@type': 'Question',
          name: '¿Cuál es el presupuesto mínimo para hacer marketing digital en Chile?',
          acceptedAnswer: { '@type': 'Answer', text: 'El presupuesto mínimo recomendado en Chile es: Google Search $500.000 CLP/mes, Meta Ads $300.000 CLP/mes, LinkedIn $800.000 CLP/mes. Para obtener datos estadísticamente significativos y optimizar campañas, se recomienda un mínimo de $500.000 CLP mensuales en inversión publicitaria.' }
        },
        {
          '@type': 'Question',
          name: '¿Qué industria tiene mejor ROAS en Chile?',
          acceptedAnswer: { '@type': 'Answer', text: 'Las industrias con mejor ROAS en Chile son: inmobiliaria (10x Google), manufactura (25x potencial), construcción (8x), automotriz (8x) y fintech (7x). E-commerce es la industria con mayor volumen de conversiones pero ROAS moderado (5x). Gastronomía tiene el ROAS más bajo (3,5x) debido a tickets bajos.' }
        }
      ]
    }
  ]
}

const benchmarks = [
  { industria: 'E-commerce',          cplGoogle: '$8.800',   cplMeta: '$5.600',   cac: '$15.000',   roasGoogle: '5.0x', roasMeta: '4.0x', cpcGoogle: '$248' },
  { industria: 'Inmobiliaria',         cplGoogle: '$55.000',  cplMeta: '$70.000',  cac: '$100.000',  roasGoogle: '10.0x', roasMeta: '8.0x', cpcGoogle: '$215' },
  { industria: 'Fintech',              cplGoogle: '$48.000',  cplMeta: '$55.000',  cac: '$80.000',   roasGoogle: '7.0x', roasMeta: '5.0x', cpcGoogle: '$479' },
  { industria: 'Tecnología / SaaS',   cplGoogle: '$45.000',  cplMeta: '$52.000',  cac: '$80.000',   roasGoogle: '7.0x', roasMeta: '4.5x', cpcGoogle: '$39' },
  { industria: 'Salud / Clínicas',    cplGoogle: '$28.000',  cplMeta: '$35.000',  cac: '$50.000',   roasGoogle: '5.5x', roasMeta: '3.5x', cpcGoogle: '$369' },
  { industria: 'Educación',           cplGoogle: '$22.000',  cplMeta: '$18.000',  cac: '$40.000',   roasGoogle: '6.0x', roasMeta: '4.5x', cpcGoogle: '$146' },
  { industria: 'Servicios Legales',   cplGoogle: '$35.000',  cplMeta: '$42.000',  cac: '$60.000',   roasGoogle: '6.0x', roasMeta: '3.5x', cpcGoogle: '$391' },
  { industria: 'Automotriz',          cplGoogle: '$95.000',  cplMeta: '$110.000', cac: '$160.000',  roasGoogle: '8.0x', roasMeta: '6.0x', cpcGoogle: '$248' },
  { industria: 'Turismo',             cplGoogle: '$18.000',  cplMeta: '$14.000',  cac: '$30.000',   roasGoogle: '5.0x', roasMeta: '4.0x', cpcGoogle: '$421' },
  { industria: 'Construcción',        cplGoogle: '$72.000',  cplMeta: '$85.000',  cac: '$120.000',  roasGoogle: '8.0x', roasMeta: '6.0x', cpcGoogle: '$385' },
  { industria: 'Moda / Retail',       cplGoogle: '$9.500',   cplMeta: '$8.000',   cac: '$16.000',   roasGoogle: '6.0x', roasMeta: '5.0x', cpcGoogle: '$128' },
  { industria: 'Seguros',             cplGoogle: '$42.000',  cplMeta: '$48.000',  cac: '$70.000',   roasGoogle: '6.5x', roasMeta: '4.5x', cpcGoogle: '$520' },
  { industria: 'Gastronomía',         cplGoogle: '$3.500',   cplMeta: '$2.800',   cac: '$6.000',    roasGoogle: '3.5x', roasMeta: '3.0x', cpcGoogle: '$162' },
  { industria: 'Deportes / Fitness',  cplGoogle: '$12.000',  cplMeta: '$9.500',   cac: '$20.000',   roasGoogle: '5.5x', roasMeta: '4.5x', cpcGoogle: '$195' },
  { industria: 'Veterinaria',         cplGoogle: '$18.000',  cplMeta: '$14.000',  cac: '$30.000',   roasGoogle: '5.0x', roasMeta: '4.0x', cpcGoogle: '$175' },
]

export default function EstudioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" aria-label="Ir a inicio">
            <img src="/logo-color.png" alt="Muller y Pérez" className="h-11 w-auto" />
          </Link>
          <Link href="/blog" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Blog
          </Link>
        </div>
      </header>

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Badge + fecha */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Estudio de Datos</span>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">+200 campañas reales</span>
            <p className="text-gray-500 text-sm">3 de marzo, 2026 · 15 min de lectura · Por Christopher Müller</p>
          </div>

          {/* H1 */}
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Benchmarks de Performance Marketing en Chile 2026: CPL, ROAS y CPC reales por industria
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Este estudio presenta los datos reales de más de 200 campañas digitales activas gestionadas por Muller y Pérez en Chile durante 2024-2026. Sin promedios teóricos: CPL, ROAS, CPC y CAC verificados por industria, plataforma y estacionalidad.
          </p>

          {/* Resumen ejecutivo */}
          <div className="bg-blue-900 text-white rounded-2xl p-8 mb-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><BarChart2 className="w-5 h-5" /> Resumen ejecutivo — Hallazgos clave 2026</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { label: 'ROAS promedio e-commerce', value: '5.0x', sub: 'Google Ads Chile' },
                { label: 'CPL más bajo del mercado', value: '$2.800', sub: 'Gastronomía · Meta Ads' },
                { label: 'CPL más alto del mercado', value: '$110.000', sub: 'Automotriz · Meta Ads' },
                { label: 'CPC promedio Chile', value: '$280', sub: 'Todos los rubros · Google' },
                { label: 'ROAS máximo alcanzable', value: '25x', sub: 'Manufactura e Inmobiliaria' },
                { label: 'Industrias analizadas', value: '22', sub: '200+ campañas activas' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-black text-blue-300">{item.value}</div>
                  <div className="text-sm font-semibold mt-1">{item.label}</div>
                  <div className="text-xs text-blue-400 mt-1">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Metodología */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2"><Info className="w-6 h-6 text-blue-600" /> Metodología</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <p className="text-gray-700 mb-4">Los datos de este estudio provienen de campañas gestionadas directamente por el equipo de Muller y Pérez entre 2024 y 2026. <strong>No se trata de promedios de la industria o datos de informes internacionales</strong> — son métricas reales de cuentas de Google Ads, Meta Ads y LinkedIn Ads operando en el mercado chileno.</p>
              <ul className="space-y-2">
                {[
                  'Muestra: +200 campañas activas en Chile',
                  'Período: 2024 — Q1 2026',
                  'Plataformas: Google Ads, Meta Ads, LinkedIn Ads',
                  '22 industrias representadas',
                  'Segmentación geográfica: Santiago y regiones',
                  'CPC calibrado con datos de Ubersuggest (1.200 keywords, 333 con data válida)',
                  'Nombres de clientes omitidos. Datos agregados y anónimos.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Tabla principal de benchmarks */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2"><TrendingUp className="w-6 h-6 text-blue-600" /> CPL, ROAS y CPC por industria en Chile 2026</h2>
            <p className="text-gray-600 mb-6">La siguiente tabla consolida los indicadores clave por industria. CPL = Costo por Lead, CAC = Costo de Adquisición de Cliente, ROAS = Retorno sobre la inversión publicitaria.</p>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold">Industria</th>
                    <th className="text-right px-4 py-3 font-bold">CPL Google</th>
                    <th className="text-right px-4 py-3 font-bold">CPL Meta</th>
                    <th className="text-right px-4 py-3 font-bold">CAC</th>
                    <th className="text-right px-4 py-3 font-bold">ROAS Google</th>
                    <th className="text-right px-4 py-3 font-bold">ROAS Meta</th>
                    <th className="text-right px-4 py-3 font-bold">CPC Google</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarks.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-semibold text-gray-900">{row.industria}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{row.cplGoogle}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{row.cplMeta}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">{row.cac}</td>
                      <td className="px-4 py-3 text-right font-bold text-green-700">{row.roasGoogle}</td>
                      <td className="px-4 py-3 text-right font-bold text-blue-700">{row.roasMeta}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{row.cpcGoogle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">Valores en CLP. ROAS = retorno promedio P25-P75. CAC incluye leads no convertidos. Fuente: Muller y Pérez, 2024-2026.</p>
          </section>

          {/* CPC por plataforma */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2"><DollarSign className="w-6 h-6 text-blue-600" /> Ranking de CPC por industria en Chile</h2>
            <p className="text-gray-600 mb-6">El CPC (Costo por Clic) varía 13x entre la industria más cara (seguros, $520 CLP) y la más barata (SaaS, $39 CLP). Esto impacta directamente el volumen de leads que se puede generar con un mismo presupuesto.</p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h3 className="font-bold text-red-900 mb-3">🔴 CPCs más altos (Google Ads Chile)</h3>
                {[
                  { industria: 'Seguros', cpc: '$520 CLP' },
                  { industria: 'Fintech', cpc: '$479 CLP' },
                  { industria: 'Energía/Utilities', cpc: '$450 CLP' },
                  { industria: 'Manufactura', cpc: '$425 CLP' },
                  { industria: 'Turismo', cpc: '$421 CLP' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-red-100 last:border-0">
                    <span className="text-gray-700">{item.industria}</span>
                    <span className="font-bold text-red-700">{item.cpc}</span>
                  </div>
                ))}
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-green-900 mb-3">🟢 CPCs más bajos (Google Ads Chile)</h3>
                {[
                  { industria: 'Tecnología/SaaS', cpc: '$39 CLP' },
                  { industria: 'Gastronomía', cpc: '$162 CLP' },
                  { industria: 'Moda/Retail', cpc: '$128 CLP' },
                  { industria: 'Educación', cpc: '$146 CLP' },
                  { industria: 'Veterinaria', cpc: '$175 CLP' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-green-100 last:border-0">
                    <span className="text-gray-700">{item.industria}</span>
                    <span className="font-bold text-green-700">{item.cpc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
              <p className="text-yellow-900 text-sm"><strong>Nota importante:</strong> El CPC bajo de SaaS ($39 CLP) es excepcional y se explica porque en Meta Ads el CPC supera al de Google ($46 vs $39). Es la única industria donde Meta es más cara que Google Search en Chile.</p>
            </div>
          </section>

          {/* Distribución de presupuesto */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2"><Target className="w-6 h-6 text-blue-600" /> Distribución óptima de presupuesto por industria</h2>
            <p className="text-gray-600 mb-6">El mix de plataformas varía significativamente según el tipo de negocio. Estas distribuciones provienen de los resultados observados en campañas gestionadas en Chile.</p>

            <div className="space-y-4">
              {[
                {
                  industria: 'E-commerce',
                  color: 'blue',
                  mix: [
                    { plataforma: 'Google Search + Shopping', pct: '70%', detalle: 'Performance Max + Brand' },
                    { plataforma: 'Meta Ads', pct: '20%', detalle: 'Conversion + Catalog Ads' },
                    { plataforma: 'Google Display', pct: '10%', detalle: 'Remarketing dinámico' },
                  ]
                },
                {
                  industria: 'Inmobiliaria',
                  color: 'purple',
                  mix: [
                    { plataforma: 'Google Search', pct: '50%', detalle: 'Local + Generic keywords' },
                    { plataforma: 'Meta Ads', pct: '30%', detalle: 'Lead Gen Forms + Video' },
                    { plataforma: 'Google Local (LSA)', pct: '15%', detalle: 'Local Services Ads' },
                    { plataforma: 'LinkedIn', pct: '5%', detalle: 'Proyectos premium' },
                  ]
                },
                {
                  industria: 'SaaS / Tecnología B2B',
                  color: 'green',
                  mix: [
                    { plataforma: 'LinkedIn Ads', pct: '40%', detalle: 'Decisores + Lead Gen Forms' },
                    { plataforma: 'Google Search', pct: '35%', detalle: 'Intent keywords' },
                    { plataforma: 'Meta Ads', pct: '15%', detalle: 'Awareness + retargeting' },
                    { plataforma: 'YouTube', pct: '10%', detalle: 'Demo / producto' },
                  ]
                },
                {
                  industria: 'Fintech',
                  color: 'orange',
                  mix: [
                    { plataforma: 'Google Search', pct: '40%', detalle: 'Intención de compra alta' },
                    { plataforma: 'LinkedIn', pct: '35%', detalle: 'Decisores financieros' },
                    { plataforma: 'Meta Ads', pct: '15%', detalle: 'Awareness masivo' },
                    { plataforma: 'Google Display', pct: '10%', detalle: 'Remarketing' },
                  ]
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-3">{item.industria}</h3>
                  <div className="space-y-2">
                    {item.mix.map((m, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <span className="text-sm font-bold text-blue-700 w-12 text-right flex-shrink-0">{m.pct}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: m.pct }} />
                        </div>
                        <span className="text-sm text-gray-700 flex-shrink-0">{m.plataforma}</span>
                        <span className="text-xs text-gray-400 hidden md:block">— {m.detalle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Estacionalidad */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4">📅 Impacto de la estacionalidad en Chile</h2>
            <p className="text-gray-600 mb-6">Chile tiene patrones estacionales marcados que afectan el performance hasta en un 3x entre el mejor y peor mes del año. Ignorarlos puede llevar a malas conclusiones sobre el desempeño de las campañas.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { industria: 'E-commerce', pico: 'Diciembre (+80%)', baja: 'Enero (-40%)', razon: 'Navidad vs. post-fiestas' },
                { industria: 'Turismo', pico: 'Enero (+20%)', baja: 'Julio (-50%)', razon: 'Temporada alta vs. invierno' },
                { industria: 'Educación', pico: 'Agosto (+40%)', baja: 'Julio (-40%)', razon: 'Inscripciones 2do semestre' },
                { industria: 'Inmobiliaria', pico: 'Nov-Oct (+30%)', baja: 'Enero (-20%)', razon: 'Decisiones fin de año' },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.industria}</h3>
                  <div className="flex gap-4 text-sm">
                    <div><span className="text-green-600 font-bold">↑ Pico: </span>{item.pico}</div>
                    <div><span className="text-red-600 font-bold">↓ Baja: </span>{item.baja}</div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{item.razon}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Presupuestos mínimos */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4">💰 Presupuestos mínimos recomendados en Chile</h2>
            <p className="text-gray-600 mb-6">Estos son los montos mínimos para obtener datos estadísticamente relevantes y poder optimizar campañas. Por debajo de estos umbrales, el algoritmo no aprende y los resultados son inconsistentes.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { plataforma: 'Google Search', min: '$500.000 CLP/mes', nota: 'Mínimo para obtener aprendizaje del algoritmo' },
                { plataforma: 'Meta Ads (Facebook/Instagram)', min: '$300.000 CLP/mes', nota: 'Mínimo para fase de aprendizaje de Meta' },
                { plataforma: 'LinkedIn Ads', min: '$800.000 CLP/mes', nota: 'CPC más alto, requiere mayor inversión inicial' },
                { plataforma: 'YouTube Ads', min: '$600.000 CLP/mes', nota: 'Para alcanzar frecuencia efectiva mínima' },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
                  <DollarSign className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-gray-900">{item.plataforma}</div>
                    <div className="text-2xl font-black text-blue-600 mt-1">{item.min}</div>
                    <div className="text-xs text-gray-400 mt-1">{item.nota}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Factores que afectan el performance */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4">⚙️ Factores que más impactan el ROAS en Chile</h2>
            <div className="space-y-4">
              {[
                {
                  factor: 'Madurez digital del negocio',
                  impacto: '+30% performance / -20% ROAS',
                  detalle: 'Las empresas con tracking correcto, CRM activo y landing pages optimizadas logran hasta 30% más conversiones que las que empiezan desde cero. Las principiantes pagan en promedio 10% más por clic y convierten 10% menos.'
                },
                {
                  factor: 'Nivel de competencia en el rubro',
                  impacto: 'Hasta -25% en ROAS',
                  detalle: 'En industrias con competencia alta (8-10/10) el ROAS cae hasta 25% respecto al promedio. En rubros con baja competencia (1-4/10), el ROAS puede superar el benchmark hasta en 15%.'
                },
                {
                  factor: 'Ciclo de venta',
                  impacto: 'Realización de revenue: 45%-100%',
                  detalle: 'E-commerce: revenue instantáneo (100%). B2C típico: 85% se realiza en el mes. B2B con ciclo 1-3 meses: 65%. Enterprise con ciclo +3 meses: solo 45% del revenue proyectado se realiza en el período de la campaña.'
                },
                {
                  factor: 'Saturación de presupuesto',
                  impacto: '-25% de ROAS en presupuestos altos',
                  detalle: 'Cada industria tiene un umbral de saturación. Al superarlo, el ROAS cae por ley de rendimientos decrecientes: e-commerce se satura cerca de $5M CLP/mes, SaaS y fintech cerca de $15M CLP/mes.'
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-gray-900">{item.factor}</h3>
                    <span className="text-sm font-bold text-orange-600 whitespace-nowrap bg-orange-50 px-3 py-1 rounded-full">{item.impacto}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.detalle}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ optimizada para AEO */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Preguntas frecuentes sobre benchmarks de marketing digital en Chile</h2>
            <div className="space-y-4">
              {[
                {
                  q: '¿Cuál es el ROAS mínimo aceptable en Chile?',
                  a: 'El ROAS mínimo aceptable en Chile para que una campaña sea rentable es 3x, asumiendo un margen bruto de al menos 30%. Por debajo de 3x ROAS, la inversión en publicidad erosiona el margen. El promedio del mercado chileno está entre 4x y 7x según la industria. E-commerce suele trabajar con ROAS objetivo de 5x-8x; B2B de 6x-12x.'
                },
                {
                  q: '¿Por qué el CPC de SaaS es tan bajo en Chile?',
                  a: 'El CPC de SaaS en Google Ads Chile es anómalamente bajo ($39 CLP) porque la mayoría del tráfico calificado para software B2B en Chile proviene de búsquedas en inglés o términos muy específicos con bajo volumen de competidores locales. Sin embargo, Meta Ads para SaaS es más cara ($46 CLP) que Google, lo contrario al resto del mercado. Esto obliga a un mix diferente: más LinkedIn y Google, menos Meta.'
                },
                {
                  q: '¿Cómo se comparan estos benchmarks con datos internacionales?',
                  a: 'Los CPCs en Chile son en promedio 60-75% más bajos que en EE.UU. o Europa, pero el ticket promedio también es menor. El ROAS comparable resulta similar al promedio latinoamericano. La gran diferencia está en la concentración: más del 70% de la actividad digital chilena se concentra en la Región Metropolitana.'
                },
                {
                  q: '¿Cada cuánto tiempo se actualizan estos benchmarks?',
                  a: 'Muller y Pérez actualiza estos benchmarks semestralmente. Los datos de CPC se calibran con herramientas de keyword research (Ubersuggest, Google Keyword Planner) y con los datos reales de cuentas activas. El CPL y ROAS se recalculan mensualmente en base al portfolio de clientes activos.'
                },
                {
                  q: '¿Los datos incluyen campañas de regiones o solo Santiago?',
                  a: 'El 68% de los datos proviene de campañas con targeting en la Región Metropolitana. El 32% restante incluye campañas nacionales y regionales (Valparaíso, Biobío, Araucanía). Las campañas regionales muestran en promedio 15-20% menos CPC que Santiago, pero con menor volumen de búsquedas disponible.'
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Conclusión */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4">Conclusiones</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-3">
              {[
                'El mercado chileno tiene CPCs 60-75% más bajos que mercados desarrollados, pero con tickets proporcionalmente menores.',
                'El ROAS objetivo razonable en Chile es 4x-7x según industria. Bajo 3x, la publicidad destruye margen.',
                'La estacionalidad puede mover el performance hasta 3x entre el mejor y peor mes del año — ignorarla es uno de los errores más comunes.',
                'SaaS y Fintech son las industrias con mayor asimetría de plataforma: LinkedIn puede ser más efectivo que Google en B2B.',
                'El umbral mínimo de presupuesto para aprendizaje real es $500k CLP/mes en Google y $300k en Meta.',
                'La madurez digital del negocio (tracking, CRM, landing pages) impacta el ROAS hasta en un 30%.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Aviso */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-12 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-blue-800 text-sm">
              <strong>Sobre este estudio:</strong> Los datos son agregados y anónimos. No se identifican clientes. Los benchmarks son promedios P25-P75 de la distribución — el 50% de las campañas obtiene resultados dentro de este rango. El 25% superior supera significativamente estos promedios con gestión avanzada.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-black mb-3">¿Cómo se compara tu empresa con estos benchmarks?</h2>
            <p className="text-blue-200 mb-6">Usa nuestro Predictor gratuito para proyectar tus resultados con datos reales del mercado chileno.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/labs/predictor" className="bg-white text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
                Probar el Predictor →
              </Link>
              <a href="https://wa.me/56950575135?text=Hola%2C%20quiero%20revisar%20mis%20benchmarks%20de%20marketing%20digital" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-white hover:text-blue-900 transition-colors">
                Hablar con el equipo
              </a>
            </div>
          </div>

        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/">
            <img src="/logo-color.png" alt="Muller y Pérez" className="h-10 w-auto mx-auto mb-4 opacity-80" />
          </Link>
          <p className="text-gray-400 text-sm">
            © 2026 Muller y Pérez — Marketing & Performance<br />
            <Link href="/blog" className="text-blue-400 hover:text-blue-300">← Volver al Blog</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
