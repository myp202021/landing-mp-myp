import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, BarChart2, DollarSign, HelpCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'CPC y CPA por Industria en Chile 2026 — Google Ads y Meta Ads | Muller y Pérez',
  description: 'Benchmarks semanales de CPC y CPA para Google Ads y Meta Ads en 22 industrias en Chile. E-commerce, salud, inmobiliaria, fintech y más. Actualizado cada lunes con tipo de cambio USD real.',
  keywords: [
    'CPC Chile 2026', 'CPA Chile publicidad digital', 'Google Ads Chile costo por click',
    'Meta Ads Chile benchmark', 'costo pauta digital Chile', 'benchmark marketing digital Chile',
    'cuánto cuesta publicitar en Google Chile', 'cuánto cuesta publicitar en Facebook Chile',
    'tasa de conversión industria Chile', 'indicadores marketing digital Chile',
  ],
  alternates: { canonical: 'https://www.mulleryperez.cl/indicadores' },
  openGraph: {
    title: 'CPC y CPA por Industria en Chile 2026 — Google Ads y Meta Ads',
    description: 'Benchmarks semanales de CPC y CPA para Google Ads y Meta Ads en 22 industrias en Chile. Actualizado cada lunes.',
    url: 'https://www.mulleryperez.cl/indicadores',
    siteName: 'Muller y Pérez',
    locale: 'es_CL',
    type: 'website',
    images: [{ url: 'https://www.mulleryperez.cl/og-indicadores.png', width: 1200, height: 630, alt: 'Termómetro de Marketing Digital Chile — CPC y CPA por Industria' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CPC y CPA por Industria en Chile 2026',
    description: 'Benchmarks semanales de Google Ads y Meta Ads para 22 industrias en Chile. Actualizado cada lunes.',
    images: ['https://www.mulleryperez.cl/og-indicadores.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

// ─── Componentes UI ─────────────────────────────────────────────────────────

function VarBadge({ val }: { val: number | null }) {
  if (val === null || val === undefined) return <span className="text-white/30 text-xs">—</span>
  if (val > 0) return (
    <span className="flex items-center gap-0.5 text-red-400 text-xs font-bold">
      <TrendingUp className="w-3 h-3" />+{val}%
    </span>
  )
  if (val < 0) return (
    <span className="flex items-center gap-0.5 text-emerald-400 text-xs font-bold">
      <TrendingDown className="w-3 h-3" />{val}%
    </span>
  )
  return <span className="flex items-center gap-0.5 text-white/40 text-xs"><Minus className="w-3 h-3" />0%</span>
}

function clp(n: number | undefined | null) {
  if (n == null || isNaN(n as number)) return '—'
  return '$' + Math.round(n as number).toLocaleString('es-CL')
}

// CVR por industria (fuente: predictor M&P) — fallback para datos legacy
const CVR_MAP: Record<string, number> = {
  ecommerce: 2.1, moda_retail: 2.4, gastronomia: 2.8, educacion: 4.2,
  tecnologia: 3.2, hogar: 2.1, belleza: 2.9, deportes: 2.8,
  veterinaria: 4.8, automotriz: 1.6, inmobiliaria: 1.8, turismo: 2.1,
  salud: 3.4, legal: 3.1, profesionales: 3.2, construccion: 2.1,
  logistica: 2.4, seguros: 2.1, manufactura: 2.8, energia: 2.1,
  fintech: 2.8, agro: 2.4,
}

// ─── JSON-LD Schemas ─────────────────────────────────────────────────────────

function buildSchemas(data: any, cpcData: any[], fecha: string | null) {
  const rawDate = data?.fecha ?? new Date().toISOString().split('T')[0]
  const datePublished = rawDate.includes('T') ? rawDate : `${rawDate}T00:00:00-03:00`
  const semanaLabel = data ? `Semana ${data.semana}/${data.año}` : ''

  const maxCpc = cpcData.length ? cpcData.reduce((a: any, b: any) => a.google_clp > b.google_clp ? a : b) : null
  const minCpc = cpcData.length ? cpcData.reduce((a: any, b: any) => a.google_clp < b.google_clp ? a : b) : null
  const avgCpaG = cpcData.length
    ? Math.round(cpcData.reduce((s: number, i: any) => s + i.cpa_google_clp, 0) / cpcData.length)
    : null

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.mulleryperez.cl' },
      { '@type': 'ListItem', position: 2, name: 'Indicadores', item: 'https://www.mulleryperez.cl/indicadores' },
    ],
  }

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Muller y Pérez',
    url: 'https://www.mulleryperez.cl',
    logo: 'https://www.mulleryperez.cl/logo-color.png',
    sameAs: ['https://www.linkedin.com/company/m%C3%BCller-y-p%C3%A9rez/?viewAsMember=true'],
    areaServed: { '@type': 'Country', name: 'Chile' },
  }

  const webpage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'CPC y CPA por Industria en Chile 2026',
    url: 'https://www.mulleryperez.cl/indicadores',
    description: 'Benchmarks semanales de CPC y CPA para Google Ads y Meta Ads en 22 industrias en Chile.',
    dateModified: datePublished,
    inLanguage: 'es-CL',
    isPartOf: { '@type': 'WebSite', url: 'https://www.mulleryperez.cl', name: 'Muller y Pérez' },
    publisher: { '@type': 'Organization', name: 'Muller y Pérez', url: 'https://www.mulleryperez.cl' },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.speakable-intro', '.speakable-faq'],
    },
  }

  const dataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Benchmarks CPC y CPA por Industria en Chile — ${semanaLabel}`,
    description: `Costo por click (CPC) y costo por adquisición (CPA) estimado para Google Ads y Meta Ads en 22 industrias en Chile. Datos ajustados al tipo de cambio USD. Fuente: Ubersuggest Chile + Predictor M&P.`,
    url: 'https://www.mulleryperez.cl/indicadores',
    creator: { '@type': 'Organization', name: 'Muller y Pérez', url: 'https://www.mulleryperez.cl' },
    dateModified: datePublished,
    datePublished: datePublished,
    temporalCoverage: '2025/..',
    spatialCoverage: { '@type': 'Place', name: 'Chile', geo: { '@type': 'GeoCoordinates', latitude: -35.6751, longitude: -71.543 } },
    inLanguage: 'es-CL',
    license: 'https://creativecommons.org/licenses/by/4.0/',
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'CPC Google Ads CLP', description: 'Costo por click en Google Ads en pesos chilenos' },
      { '@type': 'PropertyValue', name: 'CPC Meta Ads CLP', description: 'Costo por click en Meta Ads (Facebook/Instagram) en pesos chilenos' },
      { '@type': 'PropertyValue', name: 'CPA Google Ads CLP', description: 'Costo por adquisición estimado en Google Ads en pesos chilenos' },
      { '@type': 'PropertyValue', name: 'CPA Meta Ads CLP', description: 'Costo por adquisición estimado en Meta Ads en pesos chilenos' },
      { '@type': 'PropertyValue', name: 'CVR', description: 'Tasa de conversión promedio por industria (%)' },
    ],
    distribution: {
      '@type': 'DataDownload',
      contentUrl: 'https://www.mulleryperez.cl/indicadores',
      encodingFormat: 'text/html',
    },
  }

  const faqItems = [
    {
      q: '¿Cuánto cuesta un click en Google Ads en Chile?',
      a: cpcData.length
        ? `El CPC en Google Ads en Chile varía por industria. El más bajo es ${minCpc?.label} con ${clp(minCpc?.google_clp)} CLP y el más alto es ${maxCpc?.label} con ${clp(maxCpc?.google_clp)} CLP. El promedio entre las 22 industrias analizadas es de ${clp(cpcData.reduce((s: number, i: any) => s + i.google_clp, 0) / cpcData.length)} CLP por click. Datos actualizados al ${fecha}.`
        : 'El CPC en Google Ads en Chile varía entre $100 y $600 CLP según la industria. Los sectores más competitivos son seguros, servicios legales, turismo y fintech.',
    },
    {
      q: '¿Cuánto cuesta publicitar en Meta Ads (Facebook e Instagram) en Chile?',
      a: cpcData.length
        ? `El CPC en Meta Ads en Chile es generalmente un 40–60% menor que en Google Ads. Por industria, va desde ${clp(cpcData.reduce((a: any, b: any) => a.meta_clp < b.meta_clp ? a : b).meta_clp)} CLP hasta ${clp(cpcData.reduce((a: any, b: any) => a.meta_clp > b.meta_clp ? a : b).meta_clp)} CLP por click.`
        : 'El CPC en Meta Ads en Chile es entre un 40 y 60% más bajo que Google Ads, dependiendo de la industria. Los CPCs van de $60 a $350 CLP aproximadamente.',
    },
    {
      q: '¿Qué es el CPA en publicidad digital y cómo se calcula?',
      a: 'El CPA (Costo por Adquisición) es cuánto cuesta conseguir una conversión (venta, lead, registro). Se calcula dividiendo el CPC por la tasa de conversión: CPA = CPC ÷ CVR. Por ejemplo, si un click cuesta $300 CLP y el 3% de los clicks convierte, el CPA es $10.000 CLP.',
    },
    {
      q: '¿Cuál es el CPA promedio en Google Ads en Chile?',
      a: avgCpaG
        ? `El CPA promedio en Google Ads en Chile entre las 22 industrias analizadas es de ${clp(avgCpaG)} CLP. Industrias con alta tasa de conversión como veterinaria (CVR ~4.8%) tienen CPAs más bajos. Industrias de compra baja frecuencia como automotriz (CVR ~1.6%) tienen CPAs más altos.`
        : 'El CPA promedio en Google Ads en Chile varía ampliamente, desde $3.000 CLP en industrias con alta conversión hasta $35.000 CLP en sectores de baja frecuencia de compra.',
    },
    {
      q: '¿Por qué cambia el CPC de Google Ads y Meta Ads cada semana en Chile?',
      a: 'Las plataformas de publicidad digital (Google y Meta) cobran en dólares americanos (USD). Cuando el tipo de cambio USD/CLP sube, el costo en pesos de cada click también sube proporcionalmente. Por eso el Termómetro M&P actualiza los CPCs cada lunes usando el valor del dólar publicado por el Banco Central de Chile.',
    },
    {
      q: '¿Qué industria tiene el CPC más alto en Chile?',
      a: maxCpc
        ? `La industria con el CPC más alto en Google Ads en Chile es ${maxCpc.label} con ${clp(maxCpc.google_clp)} CLP por click (dato de la semana ${data?.semana}/${data?.año}). Le siguen industrias como seguros, servicios legales, energía y fintech, que tienen keywords muy competitivas.`
        : 'Las industrias con CPC más alto en Chile son seguros, servicios legales, energía, manufactura B2B y fintech, con CPCs que pueden superar los $500 CLP por click.',
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return { breadcrumb, organization, webpage, dataset, faqSchema, faqItems }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function IndicadoresPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('indicadores_semanales')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single()

  const cpcData: any[] = (data?.cpc_data || []).map((ind: any) => {
    const cvr = ind.cvr ?? CVR_MAP[ind.id] ?? 2.0
    return {
      ...ind,
      cvr,
      cpa_google_clp: ind.cpa_google_clp ?? Math.round(ind.google_clp / (cvr / 100)),
      cpa_meta_clp:   ind.cpa_meta_clp   ?? Math.round(ind.meta_clp   / (cvr / 100)),
    }
  })

  const fechaActualizada = data?.fecha
    ? new Date(data.fecha + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const avgCpaGoogle = cpcData.length
    ? Math.round(cpcData.reduce((s: number, i: any) => s + (i.cpa_google_clp || 0), 0) / cpcData.length)
    : null

  const { breadcrumb, organization, webpage, dataset, faqSchema, faqItems } = buildSchemas(data, cpcData, fechaActualizada)

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dataset) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen text-white" style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0d1f5c 45%, #0a1628 100%)' }}>

        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50" style={{ background: 'rgba(10,22,40,0.9)' }}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/"><img src="/logo-color.png" alt="Muller y Pérez" className="h-9 w-auto" /></Link>
            <Link href="/" className="text-white/50 hover:text-white text-sm flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Inicio
            </Link>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-14">

          {/* Hero */}
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border mb-5"
              style={{ background: 'rgba(0,212,255,0.1)', borderColor: 'rgba(0,212,255,0.3)', color: '#00d4ff' }}>
              <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
              Actualizado cada lunes · Automatizado
            </span>
            <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
              Termómetro de<br />
              <span style={{ color: '#00d4ff' }}>Marketing Digital Chile</span>
            </h1>
            <p className="speakable-intro text-white/60 text-lg max-w-2xl">
              CPC y CPA estimado para Google Ads y Meta Ads en 22 industrias en Chile,
              ajustados semanalmente al tipo de cambio USD.
              Benchmarks reales del mercado chileno, actualizados cada lunes.
            </p>
            {fechaActualizada && (
              <p className="text-white/30 text-sm mt-3">
                Última actualización: <time dateTime={data.fecha}>{fechaActualizada}</time> · Semana {data.semana}/{data.año}
              </p>
            )}
          </div>

          {!data ? (
            <div className="rounded-2xl p-16 text-center border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <BarChart2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">Los indicadores se publican cada lunes.</p>
            </div>
          ) : (
            <>
              {/* Métricas macro */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
                {[
                  {
                    label: 'USD · CLP',
                    value: `$${data.usd_clp?.toLocaleString('es-CL')}`,
                    sub: data.usd_var_pct != null ? `${data.usd_var_pct > 0 ? '+' : ''}${data.usd_var_pct}% vs sem. ant.` : 'Banco Central Chile',
                    color: data.usd_var_pct > 0 ? '#f87171' : data.usd_var_pct < 0 ? '#34d399' : '#ffffff',
                  },
                  {
                    label: 'UF',
                    value: `$${Math.round(data.uf_clp)?.toLocaleString('es-CL')}`,
                    sub: 'Valor diario',
                    color: '#ffffff',
                  },
                  {
                    label: 'Industrias analizadas',
                    value: String(cpcData.length),
                    sub: 'Google Ads + Meta Ads',
                    color: '#00d4ff',
                  },
                  {
                    label: 'CPA prom. Google',
                    value: avgCpaGoogle ? clp(avgCpaGoogle) : '—',
                    sub: 'Promedio entre industrias',
                    color: '#a78bfa',
                  },
                ].map((m, i) => (
                  <div key={i} className="rounded-2xl p-5 border border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="text-2xl font-black mb-1" style={{ color: m.color }}>{m.value}</div>
                    <div className="text-white/80 text-sm font-semibold">{m.label}</div>
                    <div className="text-white/40 text-xs mt-0.5">{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Tabla CPC + CPA */}
              {cpcData.length > 0 && (
                <section aria-label="Benchmarks CPC y CPA por industria en Chile" className="mb-12">
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-5 flex items-center gap-2" style={{ color: '#00d4ff' }}>
                    <DollarSign className="w-4 h-4" /> CPC y CPA estimado por industria — Google Ads y Meta Ads
                  </h2>
                  <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>

                    {/* Header desktop */}
                    <div className="hidden md:grid px-5 py-3 border-b border-white/10 text-xs font-bold text-white/40 uppercase tracking-wider"
                      style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.6fr 0.7fr' }}>
                      <div>Industria</div>
                      <div className="text-right">G. CPC</div>
                      <div className="text-right text-emerald-400/60">G. CPA</div>
                      <div className="text-right" style={{ color: 'rgba(0,212,255,0.6)' }}>M. CPC</div>
                      <div className="text-right text-purple-400/60">M. CPA</div>
                      <div className="text-right">CVR</div>
                      <div className="text-right">Var.</div>
                    </div>

                    {/* Header mobile */}
                    <div className="grid md:hidden px-4 py-3 border-b border-white/10 text-xs font-bold text-white/40 uppercase tracking-wider"
                      style={{ gridTemplateColumns: '2fr 1fr 1fr 0.7fr' }}>
                      <div>Industria</div>
                      <div className="text-right">G. CPC</div>
                      <div className="text-right" style={{ color: 'rgba(0,212,255,0.6)' }}>M. CPC</div>
                      <div className="text-right">Var.</div>
                    </div>

                    {cpcData.map((ind: any) => (
                      <div key={ind.id} className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        itemScope itemType="https://schema.org/StatisticalVariable">
                        <meta itemProp="name" content={`CPC ${ind.label} Chile`} />
                        <meta itemProp="measurementTechnique" content="Benchmark Ubersuggest Chile ajustado por USD" />

                        {/* Row desktop */}
                        <div className="hidden md:grid px-5 py-3.5 items-center"
                          style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.6fr 0.7fr' }}>
                          <div className="text-sm font-medium text-white">{ind.label}</div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-white">{clp(ind.google_clp)}</span>
                            <span className="text-white/30 text-xs ml-0.5">CLP</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-emerald-400">{clp(ind.cpa_google_clp)}</span>
                            <span className="text-white/30 text-xs ml-0.5">CLP</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold" style={{ color: '#00d4ff' }}>{clp(ind.meta_clp)}</span>
                            <span className="text-white/30 text-xs ml-0.5">CLP</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-purple-400">{clp(ind.cpa_meta_clp)}</span>
                            <span className="text-white/30 text-xs ml-0.5">CLP</span>
                          </div>
                          <div className="text-right text-white/50 text-sm">{ind.cvr}%</div>
                          <div className="flex justify-end">
                            <VarBadge val={ind.google_var_pct} />
                          </div>
                        </div>

                        {/* Row mobile */}
                        <div className="grid md:hidden px-4 py-3.5 items-center"
                          style={{ gridTemplateColumns: '2fr 1fr 1fr 0.7fr' }}>
                          <div className="text-sm font-medium text-white">{ind.label}</div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-white">{clp(ind.google_clp)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold" style={{ color: '#00d4ff' }}>{clp(ind.meta_clp)}</span>
                          </div>
                          <div className="flex justify-end">
                            <VarBadge val={ind.google_var_pct} />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="px-5 py-3 text-xs text-white/25 border-t border-white/5 leading-relaxed">
                      <span className="text-white/40 font-semibold">CPC:</span> benchmarks Ubersuggest Chile, ajustados por USD semanal (Banco Central). &nbsp;
                      <span className="text-emerald-400/50 font-semibold">CPA Google</span> y{' '}
                      <span className="text-purple-400/50 font-semibold">CPA Meta:</span> CPC ÷ CVR de industria (predictor M&amp;P). &nbsp;
                      <span className="text-white/40 font-semibold">CVR:</span> tasa de conversión promedio por industria. &nbsp;
                      <span className="text-white/40 font-semibold">Var.:</span> variación vs semana anterior (sube USD → sube CPC).
                    </div>
                  </div>
                </section>
              )}

              {/* Nota metodológica */}
              <div className="rounded-2xl p-6 border border-white/10 mb-10" style={{ background: 'rgba(0,212,255,0.05)', borderColor: 'rgba(0,212,255,0.15)' }}>
                <h3 className="text-sm font-bold mb-2" style={{ color: '#00d4ff' }}>¿Cómo se calculan estos datos?</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Los <strong className="text-white/80">CPC de Google</strong> son benchmarks calibrados con datos reales de Ubersuggest Chile
                  (~1.200 keywords analizadas por volumen ponderado, base Sep 2025 a USD $935 CLP).
                  Se ajustan semanalmente por el tipo de cambio del Banco Central de Chile (vía mindicador.cl),
                  ya que Google y Meta facturan en dólares.
                  Los <strong className="text-white/80">CPC de Meta</strong> se estiman aplicando ratios de industria sobre Google
                  (benchmarks WordStream y Databox 2024–2025).
                  El <strong className="text-white/80">CPA</strong> = CPC ÷ CVR, donde el CVR proviene del motor del predictor M&P
                  (tasas de conversión validadas por industria en el mercado chileno).
                  Un CPA menor indica mayor eficiencia publicitaria.
                </p>
              </div>

              {/* FAQ — visible + speakable para SEO y AI search */}
              <section aria-label="Preguntas frecuentes sobre CPC y CPA en Chile" className="speakable-faq mb-10">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2" style={{ color: '#00d4ff' }}>
                  <HelpCircle className="w-4 h-4" /> Preguntas frecuentes
                </h2>
                <div className="space-y-4">
                  {faqItems.map(({ q, a }, i) => (
                    <details key={i} className="rounded-2xl border border-white/10 overflow-hidden group"
                      style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <summary className="px-6 py-4 text-sm font-semibold text-white cursor-pointer list-none flex items-center justify-between hover:bg-white/5 transition-colors">
                        {q}
                        <span className="text-white/30 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
                      </summary>
                      <p className="px-6 pb-5 text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4">{a}</p>
                    </details>
                  ))}
                </div>
              </section>

              {/* CTA */}
              <div className="rounded-2xl p-8 text-center border border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="font-bold text-white text-lg mb-1">¿Cuánto debería invertir en pauta tu empresa?</p>
                <p className="text-white/50 text-sm mb-5">
                  Usa el Predictor M&P: proyección personalizada de ROAS, CPA y conversiones para tu industria.
                </p>
                <Link href="/labs/predictor"
                  className="inline-block px-7 py-3 rounded-xl font-bold text-sm transition-all text-white"
                  style={{ background: 'linear-gradient(90deg, #0050ff, #00d4ff)' }}>
                  Calcular mi inversión óptima →
                </Link>
              </div>
            </>
          )}
        </main>

        <footer className="border-t border-white/10 py-8 px-6 text-center mt-6">
          <Link href="/"><img src="/logo-color.png" alt="Muller y Pérez" className="h-8 w-auto mx-auto mb-3 opacity-30" /></Link>
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} Muller y Pérez — Marketing &amp; Performance · Santiago, Chile ·{' '}
            <Link href="/" className="hover:text-white/40 transition-colors">mulleryperez.cl</Link>
          </p>
        </footer>
      </div>
    </>
  )
}
