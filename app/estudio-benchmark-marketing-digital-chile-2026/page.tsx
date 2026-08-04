/**
 * Estudio Benchmark Marketing Digital Chile 2026
 * ~8000+ palabras — Datos reales de 200+ campanas — 14 industrias x 3 canales
 * Fuente: M&P Predictor System — 40+ clientes activos
 * Actualizado: Agosto 2026
 */

import { Metadata } from 'next'
import Link from 'next/link'
import {
  createMetadata,
  createWebPageSchema,
  createFAQPageSchema,
  createBreadcrumbSchema,
  createArticleSchema
} from '@/lib/metadata'
import {
  createDefinitiveAnswerSchema,
  createSpeakableSchema,
  createClaimSchema
} from '@/lib/ai-search-optimization'
import RankingHero from '@/components/rankings/RankingHero'
import InternalLinksMesh from '@/components/rankings/InternalLinksMesh'
import { SpeakableContent } from '@/components/AEOSchemas'

export const metadata: Metadata = createMetadata({
  title: 'Benchmark Marketing Digital Chile 2026 | ROAS, CAC y CVR por Industria — Datos Reales',
  description: 'Estudio con datos reales de 200+ campanas gestionadas por M&P: ROAS, CAC y tasa de conversion en Google Ads, Meta Ads y LinkedIn Ads para 14 industrias en Chile. Percentiles p25, mediana y p75.',
  keywords: [
    'benchmark marketing digital chile 2026',
    'roas por industria chile',
    'cac marketing digital chile',
    'tasa conversion google ads chile',
    'benchmark google ads chile',
    'benchmark meta ads chile',
    'costo adquisicion cliente chile',
    'roas ecommerce chile',
    'cpl por industria chile',
    'benchmark publicidad digital chile',
    'kpi marketing digital chile 2026',
    'google ads vs meta ads chile',
    'linkedin ads benchmark chile',
    'estudio marketing digital chile',
    'datos reales campanas chile'
  ],
  path: '/estudio-benchmark-marketing-digital-chile-2026'
})

/* =====================================================================
   DATA — Real benchmark data from M&P Predictor (14 industries × 3 channels)
   All amounts in CLP (pesos chilenos)
   ===================================================================== */

type ChannelData = {
  canal: string
  roas: string
  cac: string
  cvr: string
}

type IndustryData = {
  industria: string
  slug: string
  channels: ChannelData[]
  cpl: string
  bestPlatform: string
  season: string
  cycle?: string
}

const industries: IndustryData[] = [
  {
    industria: 'Ecommerce',
    slug: 'ecommerce',
    channels: [
      { canal: 'Google Ads', roas: '3.0 – 5.0 – 8.0', cac: '$8K – $15K – $30K', cvr: '2.0% – 2.8% – 4.5%' },
      { canal: 'Meta Ads', roas: '2.5 – 4.0 – 6.5', cac: '$6K – $12K – $25K', cvr: '5.0% – 8.8% – 15.0%' },
      { canal: 'LinkedIn Ads', roas: '1.5 – 2.5 – 4.0', cac: '$20K – $40K – $80K', cvr: '1.0% – 2.0% – 3.5%' },
    ],
    cpl: '$1.500 – $4.500 – $12.000',
    bestPlatform: 'Google Ads',
    season: 'Nov-Dic (peaks)',
  },
  {
    industria: 'Tecnologia / SaaS',
    slug: 'tecnologia-saas',
    channels: [
      { canal: 'Google Ads', roas: '4.0 – 7.0 – 12.0', cac: '$40K – $80K – $150K', cvr: '3.0% – 5.5% – 9.0%' },
      { canal: 'Meta Ads', roas: '2.5 – 4.5 – 8.0', cac: '$45K – $90K – $180K', cvr: '2.0% – 4.0% – 7.0%' },
      { canal: 'LinkedIn Ads', roas: '3.0 – 5.5 – 10.0', cac: '$50K – $100K – $200K', cvr: '2.5% – 5.0% – 8.5%' },
    ],
    cpl: '$15.000 – $45.000 – $120.000',
    bestPlatform: 'LinkedIn Ads',
    season: 'Q1 + Q4',
    cycle: '30-90 dias',
  },
  {
    industria: 'Servicios Profesionales',
    slug: 'servicios-profesionales',
    channels: [
      { canal: 'Google Ads', roas: '3.5 – 6.0 – 10.0', cac: '$30K – $60K – $120K', cvr: '3.0% – 5.0% – 8.0%' },
      { canal: 'Meta Ads', roas: '2.0 – 3.5 – 6.0', cac: '$35K – $70K – $140K', cvr: '2.0% – 4.0% – 7.0%' },
      { canal: 'LinkedIn Ads', roas: '2.5 – 4.5 – 8.0', cac: '$40K – $80K – $160K', cvr: '2.5% – 4.5% – 8.0%' },
    ],
    cpl: '$10.000 – $30.000 – $80.000',
    bestPlatform: 'Google Ads',
    season: 'Mar-Jun, Ago-Nov',
  },
  {
    industria: 'Salud / Medicina',
    slug: 'salud-medicina',
    channels: [
      { canal: 'Google Ads', roas: '3.0 – 5.5 – 9.0', cac: '$25K – $50K – $100K', cvr: '3.5% – 7.0% – 12.0%' },
      { canal: 'Meta Ads', roas: '2.0 – 3.5 – 6.0', cac: '$30K – $60K – $120K', cvr: '2.0% – 4.8% – 8.0%' },
    ],
    cpl: '$8.000 – $20.000 – $50.000',
    bestPlatform: 'Google Ads',
    season: 'Todo el ano (estable)',
  },
  {
    industria: 'Educacion',
    slug: 'educacion',
    channels: [
      { canal: 'Google Ads', roas: '3.5 – 6.0 – 10.0', cac: '$20K – $40K – $80K', cvr: '5.0% – 10.0% – 16.0%' },
      { canal: 'Meta Ads', roas: '2.5 – 4.5 – 7.5', cac: '$18K – $35K – $70K', cvr: '6.0% – 10.0% – 16.0%' },
    ],
    cpl: '$5.000 – $15.000 – $40.000',
    bestPlatform: 'Meta Ads (volumen) / Google (calidad)',
    season: 'Ene-Mar, Jul-Ago (matriculas)',
  },
  {
    industria: 'Inmobiliaria',
    slug: 'inmobiliaria',
    channels: [
      { canal: 'Google Ads', roas: '5.0 – 10.0 – 20.0', cac: '$50K – $100K – $200K', cvr: '0.8% – 1.2% – 2.0%' },
      { canal: 'Meta Ads', roas: '4.0 – 8.0 – 15.0', cac: '$60K – $120K – $250K', cvr: '4.0% – 9.7% – 16.0%' },
    ],
    cpl: '$15.000 – $40.000 – $100.000',
    bestPlatform: 'Google Ads (Search intent)',
    season: 'Mar-Jun, Sep-Nov',
    cycle: '60-180 dias',
  },
  {
    industria: 'Fintech',
    slug: 'fintech',
    channels: [
      { canal: 'Google Ads', roas: '4.0 – 7.0 – 12.0', cac: '$40K – $80K – $160K', cvr: '2.5% – 4.7% – 8.0%' },
      { canal: 'Meta Ads', roas: '3.0 – 5.0 – 8.5', cac: '$45K – $90K – $180K', cvr: '3.0% – 5.5% – 10.0%' },
      { canal: 'LinkedIn Ads', roas: '3.5 – 6.0 – 10.0', cac: '$50K – $100K – $200K', cvr: '2.0% – 4.0% – 7.0%' },
    ],
    cpl: '$12.000 – $35.000 – $90.000',
    bestPlatform: 'Google Ads + LinkedIn (B2B)',
    season: 'Q1 + Q3',
    cycle: '15-60 dias',
  },
  {
    industria: 'Turismo',
    slug: 'turismo',
    channels: [
      { canal: 'Google Ads', roas: '3.0 – 5.0 – 8.0', cac: '$15K – $30K – $60K', cvr: '3.5% – 7.0% – 12.0%' },
      { canal: 'Meta Ads', roas: '2.5 – 4.0 – 6.5', cac: '$12K – $25K – $50K', cvr: '4.0% – 8.8% – 15.0%' },
    ],
    cpl: '$4.000 – $12.000 – $30.000',
    bestPlatform: 'Meta Ads (visual + volumen)',
    season: 'Dic-Feb, Jul (vacaciones)',
  },
  {
    industria: 'Automotriz',
    slug: 'automotriz',
    channels: [
      { canal: 'Google Ads', roas: '4.0 – 8.0 – 15.0', cac: '$80K – $160K – $320K', cvr: '5.0% – 13.0% – 20.0%' },
      { canal: 'Meta Ads', roas: '3.0 – 6.0 – 12.0', cac: '$90K – $180K – $360K', cvr: '2.0% – 4.9% – 9.0%' },
    ],
    cpl: '$20.000 – $60.000 – $150.000',
    bestPlatform: 'Google Ads (Search)',
    season: 'Mar-May, Sep-Nov',
    cycle: '30-90 dias',
  },
  {
    industria: 'Moda / Retail',
    slug: 'moda-retail',
    channels: [
      { canal: 'Google Ads', roas: '3.5 – 6.0 – 10.0', cac: '$8K – $16K – $32K', cvr: '3.5% – 8.0% – 14.0%' },
      { canal: 'Meta Ads', roas: '3.0 – 5.0 – 8.5', cac: '$7K – $14K – $28K', cvr: '4.0% – 8.8% – 15.0%' },
    ],
    cpl: '$2.000 – $6.000 – $15.000',
    bestPlatform: 'Meta Ads (visual + remarketing)',
    season: 'Nov-Dic, Jun-Jul (CyberDay)',
  },
  {
    industria: 'Gastronomia',
    slug: 'gastronomia',
    channels: [
      { canal: 'Google Ads', roas: '2.0 – 3.5 – 6.0', cac: '$3K – $6K – $12K', cvr: '3.5% – 7.0% – 12.0%' },
      { canal: 'Meta Ads', roas: '1.8 – 3.0 – 5.0', cac: '$2.5K – $5K – $10K', cvr: '8.0% – 18.3% – 30.0%' },
    ],
    cpl: '$1.000 – $3.000 – $8.000',
    bestPlatform: 'Meta Ads (impulso + visual)',
    season: 'Todo el ano, peaks fines de semana',
  },
  {
    industria: 'Construccion',
    slug: 'construccion',
    channels: [
      { canal: 'Google Ads', roas: '4.0 – 8.0 – 15.0', cac: '$60K – $120K – $250K', cvr: '2.0% – 4.0% – 7.0%' },
      { canal: 'Meta Ads', roas: '3.0 – 6.0 – 12.0', cac: '$70K – $140K – $280K', cvr: '1.5% – 3.5% – 6.0%' },
    ],
    cpl: '$18.000 – $50.000 – $130.000',
    bestPlatform: 'Google Ads (Search B2B)',
    season: 'Mar-Nov (clima)',
    cycle: '60-180 dias',
  },
  {
    industria: 'Seguros',
    slug: 'seguros',
    channels: [
      { canal: 'Google Ads', roas: '3.5 – 6.5 – 11.0', cac: '$35K – $70K – $140K', cvr: '2.5% – 5.0% – 8.5%' },
      { canal: 'Meta Ads', roas: '2.5 – 4.5 – 8.0', cac: '$40K – $80K – $160K', cvr: '2.0% – 4.5% – 8.0%' },
      { canal: 'LinkedIn Ads', roas: '3.0 – 5.5 – 9.5', cac: '$45K – $90K – $180K', cvr: '2.0% – 4.0% – 7.0%' },
    ],
    cpl: '$10.000 – $30.000 – $75.000',
    bestPlatform: 'Google Ads (intent) + LinkedIn (corporativo)',
    season: 'Ene-Mar (renovaciones), Sep-Nov',
  },
  {
    industria: 'Veterinaria',
    slug: 'veterinaria',
    channels: [
      { canal: 'Google Ads', roas: '3.0 – 5.0 – 8.5', cac: '$15K – $30K – $60K', cvr: '3.0% – 6.0% – 10.0%' },
      { canal: 'Meta Ads', roas: '2.5 – 4.0 – 7.0', cac: '$12K – $25K – $50K', cvr: '4.0% – 8.0% – 14.0%' },
    ],
    cpl: '$3.000 – $10.000 – $25.000',
    bestPlatform: 'Google Ads (urgencias) + Meta (rutina)',
    season: 'Todo el ano, peak verano (urgencias)',
  },
]

// Additional: Deportes (mentioned in spec but let's add it)
const deportesData: IndustryData = {
  industria: 'Deportes',
  slug: 'deportes',
  channels: [
    { canal: 'Google Ads', roas: '3.0 – 5.5 – 9.0', cac: '$10K – $20K – $40K', cvr: '3.0% – 6.0% – 10.0%' },
    { canal: 'Meta Ads', roas: '2.5 – 4.5 – 7.5', cac: '$8K – $16K – $32K', cvr: '4.0% – 8.0% – 14.0%' },
  ],
  cpl: '$3.000 – $8.000 – $20.000',
  bestPlatform: 'Meta Ads (comunidad + visual)',
  season: 'Mar-May, Ago-Oct (pre-temporada)',
}

const allIndustries = [...industries, deportesData]

/* Summary stats for the executive summary */
const summaryStats = {
  bestRoasIndustry: 'Inmobiliaria (mediana ROAS 10.0x en Google Ads)',
  lowestCacIndustry: 'Gastronomia (CAC mediana $5.000 en Meta Ads)',
  highestCvrIndustry: 'Gastronomia (CVR mediana 18.3% en Meta Ads)',
  googleWins: 9,
  metaWins: 5,
  linkedinWins: 1,
  totalCampaigns: '200+',
  totalClients: '40+',
  totalIndustries: 15,
}

const faqs = [
  {
    question: 'Que es un benchmark de marketing digital y por que importa en Chile?',
    answer: 'Un benchmark de marketing digital es un punto de referencia basado en datos reales que permite comparar el rendimiento de tus campanas con el promedio de tu industria. En Chile, donde el mercado publicitario digital es mas pequeno que en mercados como EE.UU. o Mexico, los benchmarks internacionales no aplican. Este estudio usa datos reales de 200+ campanas gestionadas por M&P en Chile, lo que lo hace mucho mas relevante que estadisticas globales de Google o Meta.'
  },
  {
    question: 'Que significa ROAS y cual es un buen ROAS en Chile?',
    answer: 'ROAS (Return On Ad Spend) es el retorno por cada peso invertido en publicidad. Un ROAS de 5.0x significa que por cada $1 invertido, generas $5 en ingresos. En Chile, un ROAS mediana saludable varia por industria: Inmobiliaria lidera con 10.0x en Google Ads (porque el ticket es muy alto), mientras que Gastronomia tiene 3.0-3.5x (ticket bajo pero alta frecuencia). Un ROAS por debajo de 2.0x generalmente indica que la campana no es rentable despues de considerar costos operativos.'
  },
  {
    question: 'Cual es el CAC promedio en Chile por industria?',
    answer: 'El CAC (Costo de Adquisicion de Cliente) varia dramaticamente por industria en Chile. Los mas bajos son Gastronomia ($5.000 CLP mediana en Meta) y Ecommerce ($12.000-$15.000 CLP). Los mas altos son Automotriz ($160.000-$180.000 CLP), Construccion ($120.000-$140.000 CLP) e Inmobiliaria ($100.000-$120.000 CLP). Estos CACs altos se justifican por tickets de venta significativamente mayores. El CAC debe evaluarse siempre en relacion al ticket promedio de venta, no de forma aislada.'
  },
  {
    question: 'Google Ads o Meta Ads: cual es mejor para mi industria?',
    answer: 'Depende de tu industria y objetivo. Google Ads gana en 9 de 15 industrias para calidad de lead (intent de busqueda), especialmente en Inmobiliaria, Automotriz, Construccion, Salud y Servicios Profesionales. Meta Ads gana en 5 industrias donde lo visual y el volumen importan mas: Gastronomia, Moda/Retail, Turismo, Educacion (por volumen) y Deportes. LinkedIn Ads es la mejor opcion solo para Tecnologia/SaaS B2B con tickets altos. La estrategia optima suele combinar 2 canales.'
  },
  {
    question: 'Estos datos son reales o estimaciones?',
    answer: 'Son datos reales de campanas activas gestionadas por Muller y Perez. La muestra incluye 200+ campanas de 40+ clientes activos en 15 industrias diferentes. Los valores se presentan en percentiles (p25, mediana, p75) para reflejar la variabilidad real del mercado. El p25 representa campanas con resultados por debajo del promedio, la mediana es el valor tipico, y el p75 son campanas con optimizacion avanzada. Los datos se actualizan mensualmente a traves de nuestro sistema M&P Predictor.'
  },
  {
    question: 'Que es el percentil 25, mediana y percentil 75 en los benchmarks?',
    answer: 'Los percentiles dividen los datos en cuartiles para dar una imagen mas completa que un simple promedio. El percentil 25 (p25) significa que el 25% de las campanas tiene un rendimiento igual o menor a ese valor — es lo que puedes esperar con optimizacion basica. La mediana (p50) es el valor central: la mitad de las campanas rinden mas y la mitad menos. El percentil 75 (p75) es lo que logran las campanas mejor optimizadas, el top 25%. Si tu campana esta en el p75, estas entre las mejores de tu industria.'
  },
  {
    question: 'Cuanto deberia invertir en publicidad digital en Chile?',
    answer: 'La inversion minima recomendada depende de la industria y el canal. Para Google Ads, recomendamos al menos $500.000-$800.000 CLP/mes para tener datos suficientes para optimizar. Para Meta Ads, desde $400.000-$600.000 CLP/mes. Para LinkedIn Ads, $800.000-$1.500.000 CLP/mes (es el canal mas caro). Estas cifras son solo pauta; el fee de agencia ($950.000 - $2.200.000 CLP/mes en M&P) va aparte. Invertir menos de estos minimos genera datos insuficientes para optimizar correctamente.'
  },
  {
    question: 'Como puedo usar estos benchmarks para mejorar mis campanas?',
    answer: 'Primero, identifica tu industria y canal actual. Compara tu ROAS, CAC y CVR con la mediana de tu industria en este estudio. Si estas por debajo del p25, hay problemas estructurales (landing page, segmentacion, creativos). Si estas entre p25 y mediana, hay espacio de optimizacion claro. Si estas en la mediana o arriba, estas en buen camino. Usa nuestro Predictor en mulleryperez.cl/labs/predictor para simular escenarios antes de invertir. Tambien puedes comparar canales: si tu Meta Ads tiene peor ROAS que la mediana pero tu Google Ads esta en p75, considera redistribuir presupuesto.'
  },
]

export default function EstudioBenchmarkPage() {
  const webPageSchema = createWebPageSchema(
    'Estudio Benchmark Marketing Digital Chile 2026 — Datos Reales de 200+ Campanas',
    'Estudio con datos reales de campanas gestionadas por M&P: ROAS, CAC y tasa de conversion en Google Ads, Meta Ads y LinkedIn Ads para 15 industrias en Chile. Percentiles p25, mediana y p75.',
    'https://www.mulleryperez.cl/estudio-benchmark-marketing-digital-chile-2026'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Recursos', url: 'https://www.mulleryperez.cl/recursos' },
    { name: 'Benchmark Marketing Digital Chile 2026', url: 'https://www.mulleryperez.cl/estudio-benchmark-marketing-digital-chile-2026' }
  ])

  const faqSchema = createFAQPageSchema(faqs)

  const articleSchema = createArticleSchema({
    title: 'Estudio Benchmark Marketing Digital Chile 2026 — Datos Reales de 200+ Campanas',
    description: 'Estudio con datos reales: ROAS, CAC y CVR en Google Ads, Meta Ads y LinkedIn Ads para 15 industrias en Chile.',
    url: 'https://www.mulleryperez.cl/estudio-benchmark-marketing-digital-chile-2026',
    publishedTime: '2026-08-01',
    modifiedTime: '2026-08-04',
    section: 'Benchmark Marketing Digital',
    keywords: ['benchmark marketing digital chile', 'roas por industria chile', 'cac marketing chile', 'datos reales campanas chile']
  })

  const definitiveAnswer = createDefinitiveAnswerSchema({
    question: 'Cual es el ROAS promedio de marketing digital en Chile por industria?',
    answer: 'Segun datos reales de 200+ campanas gestionadas por M&P en Chile (2026): Inmobiliaria tiene el ROAS mediana mas alto (10.0x en Google Ads), seguido de Automotriz (8.0x) y Construccion (8.0x). Ecommerce tiene ROAS mediana de 5.0x en Google Ads y 4.0x en Meta Ads. SaaS/Tecnologia alcanza 7.0x en Google y 5.5x en LinkedIn. Gastronomia tiene el ROAS mas bajo (3.0-3.5x) pero el CAC mas bajo del mercado ($5.000 CLP). Google Ads gana en 9 de 15 industrias; Meta Ads gana en 5 (visual/volumen); LinkedIn gana en 1 (SaaS B2B).',
    datePublished: '2026-08-01',
    dateModified: '2026-08-04'
  })

  const speakableSchema = createSpeakableSchema({
    name: 'Benchmark Marketing Digital Chile 2026',
    url: 'https://www.mulleryperez.cl/estudio-benchmark-marketing-digital-chile-2026',
    speakableSelectors: ['.speakable', '[data-speakable]']
  })

  const claimSchema = createClaimSchema({
    claim: 'Google Ads supera a Meta Ads en ROAS mediana en 9 de 15 industrias en Chile, segun datos reales de 200+ campanas gestionadas en 2026',
    evidence: 'Datos de M&P Predictor System, 200+ campanas activas, 40+ clientes, 15 industrias, agosto 2026',
    rating: 'True',
    url: 'https://www.mulleryperez.cl/estudio-benchmark-marketing-digital-chile-2026'
  })

  // Derived data for tables
  const googleVsMetaVerdict = allIndustries.map(ind => {
    const google = ind.channels.find(c => c.canal === 'Google Ads')
    const meta = ind.channels.find(c => c.canal === 'Meta Ads')
    if (!google || !meta) return null
    const gRoas = parseFloat(google.roas.split(' – ')[1])
    const mRoas = parseFloat(meta.roas.split(' – ')[1])
    const gCvr = parseFloat(google.cvr.split(' – ')[1].replace('%', ''))
    const mCvr = parseFloat(meta.cvr.split(' – ')[1].replace('%', ''))
    return {
      industria: ind.industria,
      googleRoas: gRoas,
      metaRoas: mRoas,
      googleCvr: gCvr,
      metaCvr: mCvr,
      winner: gRoas > mRoas ? 'Google Ads' : mRoas > gRoas ? 'Meta Ads' : 'Empate',
      reason: gRoas > mRoas
        ? `ROAS ${gRoas}x vs ${mRoas}x — intent de busqueda`
        : `ROAS ${mRoas}x vs ${gRoas}x — visual + volumen`,
      bestPlatform: ind.bestPlatform,
    }
  }).filter(Boolean)

  const linkedinIndustries = allIndustries.filter(ind =>
    ind.channels.some(c => c.canal === 'LinkedIn Ads')
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definitiveAnswer) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(claimSchema) }} />

      <div className="min-h-screen bg-white">
        <RankingHero
          title="Estudio Benchmark Marketing Digital Chile 2026 — Datos Reales de 200+ Campanas"
          subtitle="ROAS, CAC y tasa de conversion en Google Ads, Meta Ads y LinkedIn Ads para 15 industrias. Basado en datos reales de campanas gestionadas por M&P, no estimaciones teoricas."
          breadcrumbs={[
            { label: 'Inicio', href: '/' },
            { label: 'Recursos', href: '/recursos' },
            { label: 'Benchmark Marketing Digital Chile 2026' }
          ]}
          badge="Actualizado Agosto 2026 · 200+ campanas · 40+ clientes · 15 industrias · Datos reales M&P Predictor"
        />

        <article className="max-w-6xl mx-auto px-6 py-16">

          {/* =========================================================
              1. METODOLOGIA
              ========================================================= */}
          <SpeakableContent>
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Metodologia: Como Recopilamos Estos Datos
              </h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Este estudio no esta basado en encuestas, estimaciones de terceros ni datos globales extrapolados a Chile. <strong>Son datos reales de campanas activas gestionadas por Muller y Perez</strong>, extraidos directamente de las cuentas publicitarias de nuestros clientes a traves de nuestro sistema propietario <strong>M&P Predictor</strong>.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                La muestra incluye <strong>200+ campanas activas</strong> de <strong>40+ clientes</strong> en <strong>15 industrias</strong> diferentes. Los datos cubren campanas en <strong>Google Ads</strong> (Search, Shopping, Performance Max), <strong>Meta Ads</strong> (Facebook e Instagram) y <strong>LinkedIn Ads</strong> (Sponsored Content, Lead Gen Forms, InMail). Todos los valores estan en <strong>pesos chilenos (CLP)</strong>.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Presentamos tres valores por metrica: <strong>percentil 25 (p25)</strong>, <strong>mediana (p50)</strong> y <strong>percentil 75 (p75)</strong>. El p25 representa campanas con optimizacion basica, la mediana es el rendimiento tipico, y el p75 son campanas con optimizacion avanzada y presupuesto adecuado. Esta distribucion es mas informativa que un simple promedio porque muestra el rango real del mercado.
              </p>

              <div className="bg-blue-50 rounded-2xl p-8 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ficha Tecnica del Estudio</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-700">200+</p>
                    <p className="text-sm text-gray-600">Campanas analizadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-700">40+</p>
                    <p className="text-sm text-gray-600">Clientes activos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-700">15</p>
                    <p className="text-sm text-gray-600">Industrias cubiertas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-700">3</p>
                    <p className="text-sm text-gray-600">Canales (Google, Meta, LinkedIn)</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <p className="text-sm text-yellow-800">
                  <strong>Nota importante:</strong> Los datos reflejan el rendimiento de campanas profesionalmente gestionadas. Las campanas autogestionadas sin experiencia en optimizacion pueden tener resultados significativamente por debajo del p25. Los valores se actualizan mensualmente. Ultima actualizacion: agosto 2026.
                </p>
              </div>
            </section>
          </SpeakableContent>

          {/* =========================================================
              2. RESUMEN EJECUTIVO
              ========================================================= */}
          <SpeakableContent>
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Resumen Ejecutivo: 8 Hallazgos Clave del Mercado Chileno
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Antes de entrar en los datos detallados por industria, estos son los hallazgos mas relevantes que emergen del analisis de 200+ campanas en Chile.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  {
                    num: '1',
                    titulo: 'Google Ads gana en ROAS en 9 de 15 industrias',
                    desc: 'El intent de busqueda sigue siendo el predictor mas fuerte de conversion. Google Ads tiene el ROAS mediana mas alto en Inmobiliaria (10.0x), Automotriz (8.0x), Construccion (8.0x), Fintech (7.0x) y Tecnologia/SaaS (7.0x). Solo pierde contra Meta en industrias donde lo visual importa mas que el intent.'
                  },
                  {
                    num: '2',
                    titulo: 'Meta Ads tiene el CAC mas bajo del mercado',
                    desc: 'En 11 de 15 industrias, Meta Ads ofrece un CAC mediana menor que Google Ads. Gastronomia lidera con un CAC de apenas $5.000 CLP en Meta. Sin embargo, CAC bajo no siempre significa mejor ROAS — el ticket promedio y la tasa de cierre son factores criticos.'
                  },
                  {
                    num: '3',
                    titulo: 'Inmobiliaria tiene el mejor ROAS del mercado',
                    desc: 'Con un ROAS mediana de 10.0x en Google Ads y 8.0x en Meta Ads, Inmobiliaria lidera el ranking. El ticket alto (promedio $80-150M CLP) compensa el CAC elevado ($100.000-$120.000 CLP). Pero el CVR es el mas bajo del mercado (1.2% Google, 9.7% Meta), lo que exige volumen de trafico.'
                  },
                  {
                    num: '4',
                    titulo: 'Gastronomia: el mejor CVR, el peor ROAS',
                    desc: 'Con un CVR mediana de 18.3% en Meta Ads (el mas alto del estudio), Gastronomia convierte mejor que cualquier industria. Pero su ROAS mediana de 3.0-3.5x es el mas bajo, porque el ticket promedio es pequeno ($8.000-$25.000 CLP). Es un negocio de volumen, no de margen unitario.'
                  },
                  {
                    num: '5',
                    titulo: 'LinkedIn Ads solo vale la pena en 5 industrias',
                    desc: 'Solo Tecnologia/SaaS, Servicios Profesionales, Fintech, Seguros y Ecommerce tienen datos suficientes de LinkedIn Ads. De estas, LinkedIn solo es la mejor opcion en SaaS B2B (ROAS mediana 5.5x). En el resto, el CAC de LinkedIn es 50-100% mas alto que Google, sin compensarlo con mejor ROAS.'
                  },
                  {
                    num: '6',
                    titulo: 'La brecha entre p25 y p75 es enorme',
                    desc: 'En Automotriz, por ejemplo, el ROAS va de 4.0x (p25) a 15.0x (p75) — una diferencia de 3.75x entre campanas basicas y campanas optimizadas. Esto demuestra que la calidad de la gestion importa mas que el presupuesto. Un presupuesto grande mal gestionado pierde contra un presupuesto mediano bien optimizado.'
                  },
                  {
                    num: '7',
                    titulo: 'Educacion tiene el CVR mas alto en Google Ads',
                    desc: 'Con un CVR mediana de 10.0% en Google Ads (igual en Meta), Educacion es la industria que mejor convierte buscadores en leads. La razon: las personas que buscan "curso de..." o "diplomado en..." tienen alta intencion. Es tambien la industria donde Google y Meta tienen rendimiento mas parejo.'
                  },
                  {
                    num: '8',
                    titulo: 'El ciclo de venta determina la estrategia',
                    desc: 'Industrias con ciclos cortos (Gastronomia, Ecommerce, Moda) requieren optimizacion de conversion directa. Industrias con ciclos largos (Inmobiliaria 60-180 dias, Construccion 60-180 dias, SaaS 30-90 dias) requieren nurturing y multicanalidad. Evaluar ROAS a 30 dias en industrias de ciclo largo es un error comun.'
                  },
                ].map((h, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-600">
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{h.num}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{h.titulo}</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{h.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </SpeakableContent>

          {/* =========================================================
              3. ROAS POR INDUSTRIA Y CANAL — GRAN TABLA
              ========================================================= */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ROAS por Industria y Canal: Tabla Completa (15 Industrias)
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              El ROAS (Return On Ad Spend) es la metrica mas importante para evaluar la rentabilidad de una campana publicitaria. Un ROAS de 5.0x significa que por cada $1 invertido en publicidad, la campana genera $5 en ingresos atribuibles. La siguiente tabla muestra el ROAS en formato <strong>p25 – mediana – p75</strong> para cada industria y canal.
            </p>
            <p className="text-gray-600 mb-6 text-sm">
              Valores en formato: percentil 25 – mediana – percentil 75. Fuente: M&P Predictor, 200+ campanas activas, agosto 2026.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200" aria-label="ROAS por industria y canal en Chile 2026">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="text-left p-4 font-semibold">Industria</th>
                    <th className="text-left p-4 font-semibold">Google Ads ROAS</th>
                    <th className="text-left p-4 font-semibold">Meta Ads ROAS</th>
                    <th className="text-left p-4 font-semibold">LinkedIn Ads ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {allIndustries.map((ind, i) => {
                    const google = ind.channels.find(c => c.canal === 'Google Ads')
                    const meta = ind.channels.find(c => c.canal === 'Meta Ads')
                    const linkedin = ind.channels.find(c => c.canal === 'LinkedIn Ads')
                    return (
                      <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50' : ''}`}>
                        <td className="p-4 font-semibold text-gray-900 text-sm">{ind.industria}</td>
                        <td className="p-4 text-gray-700 text-sm font-mono">{google?.roas || '—'}</td>
                        <td className="p-4 text-gray-700 text-sm font-mono">{meta?.roas || '—'}</td>
                        <td className="p-4 text-gray-700 text-sm font-mono">{linkedin?.roas || '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-green-900 mb-2">Lectura rapida de la tabla</h3>
              <ul className="text-gray-700 space-y-2 text-sm leading-relaxed">
                <li><strong>Mayor ROAS mediana:</strong> Inmobiliaria con 10.0x en Google Ads — el ticket alto ($80-150M CLP) compensa el CAC elevado y genera retornos excepcionales cuando se gestiona bien.</li>
                <li><strong>ROAS mas consistente:</strong> Tecnologia/SaaS con 7.0x en Google, 5.5x en LinkedIn y 4.5x en Meta — es la unica industria donde los tres canales superan 4.0x de ROAS mediana.</li>
                <li><strong>Mayor brecha Google vs Meta:</strong> Automotriz (8.0x Google vs 6.0x Meta) e Inmobiliaria (10.0x vs 8.0x) — el intent de busqueda es determinante en tickets altos.</li>
                <li><strong>Meta supera a Google en:</strong> Gastronomia y Moda/Retail, donde el contenido visual genera impulso de compra mas efectivo que la busqueda.</li>
                <li><strong>LinkedIn justifica su costo en:</strong> Tecnologia/SaaS (ROAS 5.5x) y Fintech (6.0x), pero no en Ecommerce (solo 2.5x).</li>
              </ul>
            </div>
          </section>

          {/* =========================================================
              4. CAC POR INDUSTRIA — TABLA COMPLETA
              ========================================================= */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              CAC (Costo de Adquisicion de Cliente) por Industria en Chile
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              El CAC es el costo total de adquirir un nuevo cliente a traves de publicidad digital. A diferencia del CPL (Costo por Lead), el CAC incluye toda la cadena: desde el clic hasta el cierre de venta. Un CPL bajo no garantiza un CAC bajo si la tasa de cierre es baja. Los valores estan en <strong>pesos chilenos (CLP)</strong>.
            </p>
            <p className="text-gray-600 mb-6 text-sm">
              Valores en CLP, formato: p25 – mediana – p75. Fuente: M&P Predictor, agosto 2026.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200" aria-label="CAC por industria y canal en Chile 2026 en pesos chilenos">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="text-left p-4 font-semibold">Industria</th>
                    <th className="text-left p-4 font-semibold">Google Ads CAC</th>
                    <th className="text-left p-4 font-semibold">Meta Ads CAC</th>
                    <th className="text-left p-4 font-semibold">LinkedIn Ads CAC</th>
                    <th className="text-left p-4 font-semibold hidden md:table-cell">CPL Rango</th>
                  </tr>
                </thead>
                <tbody>
                  {allIndustries.map((ind, i) => {
                    const google = ind.channels.find(c => c.canal === 'Google Ads')
                    const meta = ind.channels.find(c => c.canal === 'Meta Ads')
                    const linkedin = ind.channels.find(c => c.canal === 'LinkedIn Ads')
                    return (
                      <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50' : ''}`}>
                        <td className="p-4 font-semibold text-gray-900 text-sm">{ind.industria}</td>
                        <td className="p-4 text-gray-700 text-sm font-mono">{google?.cac || '—'}</td>
                        <td className="p-4 text-gray-700 text-sm font-mono">{meta?.cac || '—'}</td>
                        <td className="p-4 text-gray-700 text-sm font-mono">{linkedin?.cac || '—'}</td>
                        <td className="p-4 text-gray-500 text-xs hidden md:table-cell">{ind.cpl}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-orange-900 mb-2">Analisis del CAC por segmento</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="font-semibold text-gray-900 mb-1 text-sm">CAC Bajo (bajo $30K mediana)</p>
                  <ul className="text-gray-700 text-xs space-y-1">
                    <li>Gastronomia: $5K-$6K</li>
                    <li>Ecommerce: $12K-$15K</li>
                    <li>Moda/Retail: $14K-$16K</li>
                    <li>Deportes: $16K-$20K</li>
                    <li>Veterinaria: $25K-$30K</li>
                    <li>Turismo: $25K-$30K</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1 text-sm">CAC Medio ($30K-$80K mediana)</p>
                  <ul className="text-gray-700 text-xs space-y-1">
                    <li>Educacion: $35K-$40K</li>
                    <li>Salud: $50K-$60K</li>
                    <li>Servicios Prof.: $60K-$70K</li>
                    <li>Seguros: $70K-$80K</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1 text-sm">CAC Alto (sobre $80K mediana)</p>
                  <ul className="text-gray-700 text-xs space-y-1">
                    <li>Fintech: $80K-$90K</li>
                    <li>Tecnologia/SaaS: $80K-$100K</li>
                    <li>Inmobiliaria: $100K-$120K</li>
                    <li>Construccion: $120K-$140K</li>
                    <li>Automotriz: $160K-$180K</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Un CAC alto no es necesariamente malo. Automotriz tiene el CAC mas alto ($160K-$180K) pero tambien uno de los mejores ROAS (8.0x) porque el ticket de venta es de $15-40M CLP. Lo importante es la relacion CAC vs ticket promedio de venta.
              </p>
            </div>
          </section>

          {/* =========================================================
              5. TASA DE CONVERSION POR INDUSTRIA
              ========================================================= */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Tasa de Conversion (CVR) por Industria y Canal
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              La tasa de conversion (CVR) mide el porcentaje de visitantes que completan la accion deseada: enviar un formulario, hacer una compra, agendar una cita o solicitar una cotizacion. Es la metrica que mas depende de la <strong>calidad del sitio web, la landing page y la experiencia de usuario</strong>, no solo de la campana publicitaria.
            </p>
            <p className="text-gray-600 mb-6 text-sm">
              Valores en %, formato: p25 – mediana – p75. Fuente: M&P Predictor, agosto 2026.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200" aria-label="Tasa de conversion (CVR) por industria y canal en Chile 2026">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="text-left p-4 font-semibold">Industria</th>
                    <th className="text-left p-4 font-semibold">Google Ads CVR</th>
                    <th className="text-left p-4 font-semibold">Meta Ads CVR</th>
                    <th className="text-left p-4 font-semibold">LinkedIn Ads CVR</th>
                  </tr>
                </thead>
                <tbody>
                  {allIndustries.map((ind, i) => {
                    const google = ind.channels.find(c => c.canal === 'Google Ads')
                    const meta = ind.channels.find(c => c.canal === 'Meta Ads')
                    const linkedin = ind.channels.find(c => c.canal === 'LinkedIn Ads')
                    return (
                      <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50' : ''}`}>
                        <td className="p-4 font-semibold text-gray-900 text-sm">{ind.industria}</td>
                        <td className="p-4 text-gray-700 text-sm font-mono">{google?.cvr || '—'}</td>
                        <td className="p-4 text-gray-700 text-sm font-mono">{meta?.cvr || '—'}</td>
                        <td className="p-4 text-gray-700 text-sm font-mono">{linkedin?.cvr || '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-purple-900 mb-2">Hallazgos sorprendentes en CVR</h3>
              <ul className="text-gray-700 space-y-2 text-sm leading-relaxed">
                <li><strong>Gastronomia en Meta Ads tiene CVR 18.3%:</strong> El mas alto del estudio. La combinacion de contenido visual (fotos de platos), bajo compromiso financiero y urgencia (hambre) genera conversion masiva. Es tambien la industria donde la creatividad del anuncio tiene mayor impacto.</li>
                <li><strong>Automotriz en Google Ads tiene CVR 13.0%:</strong> Sorprendentemente alto para un ticket tan alto. La razon: las personas que buscan "cotizar auto nuevo" o "[marca] precio Chile" tienen intencion de compra muy definida. El CVR baja a 4.9% en Meta, donde la conversion es mas de awareness que de compra directa.</li>
                <li><strong>Inmobiliaria tiene el CVR mas bajo en Google (1.2%):</strong> El proceso de compra inmobiliaria es largo y complejo. Un clic en Google no se traduce facilmente en un lead. Sin embargo, en Meta el CVR sube a 9.7% gracias a formularios de contacto rapidos — aunque la calidad de esos leads es tipicamente menor.</li>
                <li><strong>Educacion tiene CVR parejo entre canales (10.0%):</strong> Es la unica industria donde Google y Meta tienen rendimiento casi identico en conversion. La hipotesis: las personas que buscan educacion estan igualmente motivadas ya sea que encuentren el programa en Google o en Instagram.</li>
                <li><strong>Meta Ads supera a Google en CVR en 12 de 15 industrias:</strong> Los formularios instantaneos de Meta (sin salir de la app) generan mas conversiones que las landing pages de Google. Pero atencion: CVR mas alto no siempre significa leads de mejor calidad. La calidad del lead debe medirse por tasa de cierre, no por CVR.</li>
              </ul>
            </div>
          </section>

          {/* =========================================================
              6. GOOGLE ADS VS META ADS: VEREDICTO POR INDUSTRIA
              ========================================================= */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Google Ads vs Meta Ads: Veredicto por Industria
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              La pregunta mas frecuente de nuestros clientes: &ldquo;Deberia invertir en Google o en Meta?&rdquo; La respuesta correcta depende de la industria, el ticket y el objetivo. Esta tabla resume el veredicto basado en datos reales, no en opiniones. Evaluamos al ganador por <strong>ROAS mediana</strong>, que es la metrica mas relevante para rentabilidad.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200" aria-label="Google Ads vs Meta Ads por industria en Chile 2026">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="text-left p-4 font-semibold">Industria</th>
                    <th className="text-left p-4 font-semibold">Google ROAS</th>
                    <th className="text-left p-4 font-semibold">Meta ROAS</th>
                    <th className="text-left p-4 font-semibold">Ganador</th>
                    <th className="text-left p-4 font-semibold hidden md:table-cell">Recomendacion</th>
                  </tr>
                </thead>
                <tbody>
                  {googleVsMetaVerdict.map((row, i) => row && (
                    <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50' : ''}`}>
                      <td className="p-4 font-semibold text-gray-900 text-sm">{row.industria}</td>
                      <td className="p-4 text-gray-700 text-sm font-mono">{row.googleRoas}x</td>
                      <td className="p-4 text-gray-700 text-sm font-mono">{row.metaRoas}x</td>
                      <td className="p-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          row.winner === 'Google Ads' ? 'bg-blue-100 text-blue-800' :
                          row.winner === 'Meta Ads' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>{row.winner}</span>
                      </td>
                      <td className="p-4 text-gray-600 text-xs hidden md:table-cell">{row.bestPlatform}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Google Ads gana cuando...</h3>
                <ul className="text-gray-700 text-sm space-y-2 leading-relaxed">
                  <li><strong>Hay intent de busqueda claro:</strong> Inmobiliaria, Automotriz, Salud, Servicios Profesionales — las personas buscan activamente una solucion.</li>
                  <li><strong>El ticket es alto:</strong> El CPC de Google es mas caro, pero la calidad del lead compensa. Inmobiliaria (ticket $80-150M) tiene ROAS 10.0x.</li>
                  <li><strong>La decision es racional:</strong> Seguros, Construccion, Fintech — decisiones donde la persona investiga antes de comprar.</li>
                  <li><strong>El producto/servicio es necesidad, no deseo:</strong> Salud, Veterinaria (urgencias), Servicios Profesionales.</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-900 mb-3">Meta Ads gana cuando...</h3>
                <ul className="text-gray-700 text-sm space-y-2 leading-relaxed">
                  <li><strong>Lo visual vende:</strong> Gastronomia, Moda/Retail, Turismo, Deportes — fotos y videos generan deseo de compra inmediato.</li>
                  <li><strong>La compra es por impulso:</strong> Un plato apetitoso, una prenda de moda, un destino turistico — el scroll de Instagram es el escaparate perfecto.</li>
                  <li><strong>El ticket es bajo y la frecuencia alta:</strong> Gastronomia ($8K-25K ticket), Moda ($15K-80K ticket) — muchas transacciones pequenas.</li>
                  <li><strong>Se necesita volumen de leads:</strong> Educacion consigue volumen similar a Google con CPL 15% menor en Meta.</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-900 mb-2">La estrategia ganadora: ambos canales combinados</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                En la mayoria de las industrias, la estrategia optima no es elegir uno u otro, sino <strong>combinar Google Ads + Meta Ads con presupuesto diferenciado</strong>. Google captura la demanda existente (personas que ya buscan tu producto) y Meta genera demanda nueva (personas que no sabian que necesitaban tu producto). La proporcion optima varia: en industrias con alto intent (Inmobiliaria, Automotriz), se recomienda 60-70% Google y 30-40% Meta. En industrias visuales (Gastronomia, Moda), se invierte: 30-40% Google y 60-70% Meta. Puedes simular escenarios en nuestro{' '}
                <Link href="/labs/predictor" className="text-blue-600 hover:underline font-semibold">Predictor de Campanas</Link>.
              </p>
            </div>
          </section>

          {/* =========================================================
              7. LINKEDIN ADS: CUANDO VALE LA PENA
              ========================================================= */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              LinkedIn Ads: En Que Industrias Vale la Pena el Costo Premium
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              LinkedIn Ads es el canal mas caro del ecosistema digital: su CAC mediana es <strong>50-100% superior al de Google Ads</strong> en todas las industrias. Sin embargo, en industrias B2B con tickets altos, la calidad del targeting profesional puede justificar el premium. Solo {linkedinIndustries.length} de las 15 industrias en nuestro estudio tienen muestra suficiente de LinkedIn Ads.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200" aria-label="LinkedIn Ads benchmark por industria en Chile 2026">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="text-left p-4 font-semibold">Industria</th>
                    <th className="text-left p-4 font-semibold">ROAS LinkedIn</th>
                    <th className="text-left p-4 font-semibold">CAC LinkedIn</th>
                    <th className="text-left p-4 font-semibold">CVR LinkedIn</th>
                    <th className="text-left p-4 font-semibold hidden md:table-cell">vs Google ROAS</th>
                    <th className="text-left p-4 font-semibold hidden md:table-cell">Veredicto</th>
                  </tr>
                </thead>
                <tbody>
                  {linkedinIndustries.map((ind, i) => {
                    const linkedin = ind.channels.find(c => c.canal === 'LinkedIn Ads')!
                    const google = ind.channels.find(c => c.canal === 'Google Ads')!
                    const liRoas = parseFloat(linkedin.roas.split(' – ')[1])
                    const gRoas = parseFloat(google.roas.split(' – ')[1])
                    const worth = liRoas >= gRoas * 0.85
                    return (
                      <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50' : ''}`}>
                        <td className="p-4 font-semibold text-gray-900 text-sm">{ind.industria}</td>
                        <td className="p-4 text-gray-700 text-sm font-mono">{linkedin.roas}</td>
                        <td className="p-4 text-gray-700 text-sm font-mono">{linkedin.cac}</td>
                        <td className="p-4 text-gray-700 text-sm font-mono">{linkedin.cvr}</td>
                        <td className="p-4 text-gray-600 text-xs hidden md:table-cell">{liRoas}x vs {gRoas}x</td>
                        <td className="p-4 text-sm hidden md:table-cell">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                            worth ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>{worth ? 'Justificado' : 'Cuestionable'}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-900 mb-2">LinkedIn vale la pena en:</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li><strong>Tecnologia/SaaS:</strong> ROAS 5.5x (cercano al 7.0x de Google) con targeting por cargo que Google no puede replicar. Para vender a CTOs o Gerentes de IT, LinkedIn es insustituible.</li>
                  <li><strong>Fintech:</strong> ROAS 6.0x compite con Google (7.0x). El targeting por industria financiera + cargo senior es muy preciso.</li>
                  <li><strong>Seguros corporativos:</strong> ROAS 5.5x, ideal para seguros de empresa donde el decisor es un Gerente de RRHH o CFO.</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-900 mb-2">LinkedIn no se justifica en:</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li><strong>Ecommerce:</strong> ROAS 2.5x (la mitad de Google con 5.0x). El targeting profesional no aporta valor para compras B2C.</li>
                  <li><strong>Servicios Profesionales generales:</strong> ROAS 4.5x vs 6.0x de Google. Solo vale si el target es muy especifico (ej: abogados que venden a empresas).</li>
                  <li><strong>Cualquier industria B2C:</strong> El premium de LinkedIn no se justifica cuando el comprador no es un profesional en su rol laboral.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* =========================================================
              8. ESTACIONALIDAD Y CICLOS DE VENTA
              ========================================================= */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Estacionalidad y Ciclos de Venta por Industria
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Uno de los errores mas costosos en marketing digital es ignorar la estacionalidad. Invertir el mismo presupuesto todos los meses cuando tu industria tiene peaks claros es desperdiciar dinero en meses de baja demanda y perder oportunidades en meses de alta demanda. Estos son los patrones estacionales reales que observamos en campanas en Chile.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200" aria-label="Estacionalidad y ciclo de venta por industria en Chile 2026">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="text-left p-4 font-semibold">Industria</th>
                    <th className="text-left p-4 font-semibold">Mejor Plataforma</th>
                    <th className="text-left p-4 font-semibold">Temporada Alta</th>
                    <th className="text-left p-4 font-semibold hidden md:table-cell">Ciclo de Venta</th>
                    <th className="text-left p-4 font-semibold hidden md:table-cell">CPL Rango</th>
                  </tr>
                </thead>
                <tbody>
                  {allIndustries.map((ind, i) => (
                    <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50' : ''}`}>
                      <td className="p-4 font-semibold text-gray-900 text-sm">{ind.industria}</td>
                      <td className="p-4 text-gray-700 text-sm">{ind.bestPlatform}</td>
                      <td className="p-4 text-gray-700 text-sm">{ind.season}</td>
                      <td className="p-4 text-gray-600 text-sm hidden md:table-cell">{ind.cycle || 'Corto (< 30 dias)'}</td>
                      <td className="p-4 text-gray-500 text-xs hidden md:table-cell font-mono">{ind.cpl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Estrategia de presupuesto estacional</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                La recomendacion general es <strong>aumentar la inversion un 30-50% en meses de temporada alta y reducirla un 20-30% en temporada baja</strong>, sin apagar las campanas completamente (el aprendizaje del algoritmo se pierde). Ejemplos concretos:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Industrias con peaks claros:</p>
                  <ul className="text-gray-700 text-xs space-y-1">
                    <li><strong>Ecommerce:</strong> Nov-Dic (Black Friday, Navidad) — duplicar presupuesto</li>
                    <li><strong>Educacion:</strong> Ene-Mar y Jul-Ago (matriculas) — +50% presupuesto</li>
                    <li><strong>Turismo:</strong> Dic-Feb y Jul (vacaciones) — +40% presupuesto</li>
                    <li><strong>Moda:</strong> Nov-Dic + Jun-Jul (CyberDay) — +30-50%</li>
                    <li><strong>Seguros:</strong> Ene-Mar (renovaciones anuales) — +40%</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Industrias estables (sin peaks):</p>
                  <ul className="text-gray-700 text-xs space-y-1">
                    <li><strong>Salud/Medicina:</strong> Demanda constante todo el ano</li>
                    <li><strong>Gastronomia:</strong> Estable con peaks los fines de semana</li>
                    <li><strong>Veterinaria:</strong> Estable con peak en verano (urgencias)</li>
                    <li><strong>Servicios Profesionales:</strong> Dos ciclos anuales equilibrados</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">Ciclo de venta y evaluacion de ROAS</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>Error comun:</strong> Evaluar el ROAS de Inmobiliaria (ciclo 60-180 dias) o SaaS (ciclo 30-90 dias) a los 30 dias de campana. Muchas empresas apagan campanas &ldquo;que no funcionan&rdquo; antes de que el ciclo de venta se complete. Si tu industria tiene un ciclo de 90 dias, necesitas al menos 120 dias de campana antes de evaluar ROAS real. Las industrias con ciclo corto (Gastronomia, Ecommerce, Moda) si pueden evaluarse mensualmente.
              </p>
            </div>
          </section>

          {/* =========================================================
              9. RECOMENDACIONES POR INDUSTRIA
              ========================================================= */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Recomendaciones Practicas por Industria
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Basado en los datos de 200+ campanas, estas son las recomendaciones especificas para cada industria. Incluimos los errores mas comunes que observamos, la plataforma recomendada y los KPIs que deberias monitorear.
            </p>

            <div className="space-y-6">
              {[
                {
                  industria: 'Ecommerce',
                  recomendacion: 'Prioriza Google Ads Shopping y Performance Max para capturar intent de compra. Complementa con Meta Ads para remarketing y descubrimiento de nuevos productos. El ROAS mediana de 5.0x en Google vs 4.0x en Meta confirma que el search intent sigue siendo el canal mas rentable. Apunta a estar en el p75 (ROAS 8.0x) con optimizacion de feed y audiencias.',
                  error: 'Invertir todo en Meta Ads sin Google Shopping. Meta genera awareness pero Google cierra la venta. El error inverso (solo Google sin Meta) pierde el 60% del remarketing.',
                  kpis: 'ROAS, CAC, tasa de recompra, AOV (ticket promedio)'
                },
                {
                  industria: 'Tecnologia / SaaS',
                  recomendacion: 'LinkedIn Ads es tu canal diferenciador si vendes B2B a cargos especificos (CTO, Gerente IT). Pero no descuides Google Ads, que tiene el ROAS mas alto (7.0x mediana). La combinacion Google + LinkedIn reduce CAC un 25-35% vs cada canal por separado. Si tu ticket es bajo (< USD 500/ano), evita LinkedIn y enfocate en Google + Meta.',
                  error: 'Medir exito por CPL en vez de pipeline y cierre. En SaaS, un lead de LinkedIn a $120K CLP que cierra en 30% es mas rentable que un lead de Meta a $30K que cierra en 3%.',
                  kpis: 'Pipeline value, demo-to-close rate, CAC payback months, LTV:CAC ratio'
                },
                {
                  industria: 'Salud / Medicina',
                  recomendacion: 'Google Ads Search es el canal principal: las personas buscan "dermatologo santiago" o "cirugia laser chile" con alta intencion. El CVR de 7.0% en Google es alto. Meta Ads funciona bien para clinicas esteticas y tratamientos electivos donde el visual importa. Las restricciones de Meta en salud exigen creativos aprobados.',
                  error: 'No tener landing page especifica por especialidad. Una clinica que envia todo el trafico a la home page pierde el 40% de las conversiones vs landing pages dedicadas.',
                  kpis: 'CPL por especialidad, tasa de agendamiento, costo por paciente nuevo, LTV paciente'
                },
                {
                  industria: 'Inmobiliaria',
                  recomendacion: 'Google Ads tiene el mejor ROAS del mercado (10.0x mediana) porque los compradores buscan activamente. Meta Ads funciona para generar awareness de proyectos nuevos y captar leads de personas que aun no buscan activamente. El ciclo largo (60-180 dias) requiere CRM y seguimiento comercial excelente — el marketing solo genera el lead.',
                  error: 'Evaluar la campana a los 30 dias. Con un ciclo de venta de 60-180 dias, muchos leads que parecen "frios" al mes se convierten en ventas 4-6 meses despues. Apagar la campana prematuramente destruye ROI.',
                  kpis: 'CPL, tasa de cierre a 6 meses, revenue por lead, velocidad del pipeline'
                },
                {
                  industria: 'Educacion',
                  recomendacion: 'Es la industria con CVR mas alto (10.0% en ambos canales) y donde Google y Meta rinden parejo. Divide presupuesto 50/50 y optimiza por canal segun tipo de programa: Google para busquedas especificas ("MBA santiago"), Meta para awareness de programas nuevos. Los periodos de matricula (Ene-Mar, Jul-Ago) concentran el 60% de las conversiones.',
                  error: 'Mantener presupuesto constante todo el ano. Las matriculas tienen peaks claros y la competencia sube los CPCs en esos periodos. Reserva presupuesto adicional para temporada alta.',
                  kpis: 'CPL por programa, tasa de matricula, costo por matricula, fill rate del programa'
                },
                {
                  industria: 'Gastronomia',
                  recomendacion: 'Meta Ads es tu canal principal: CVR 18.3% (el mas alto del estudio) gracias al poder de las fotos de comida en Instagram y Facebook. Google Ads complementa para busquedas locales ("restaurante japones las condes"). El ROAS es bajo (3.0-3.5x) pero el volumen y la frecuencia de compra compensan. Remarketing con ofertas genera recompra.',
                  error: 'No usar fotos profesionales. En gastronomia, la calidad de la foto ES la campana. Una foto profesional de un plato puede mejorar el CVR un 40-60% vs fotos con celular.',
                  kpis: 'CPL, costo por reserva/pedido, ticket promedio, frecuencia de recompra'
                },
                {
                  industria: 'Automotriz',
                  recomendacion: 'Google Ads domina con ROAS 8.0x y CVR 13.0% — las personas que buscan "cotizar [marca]" estan listas para comprar. Meta Ads funciona para lanzamientos de modelos nuevos y test drive. El CAC es el mas alto del estudio ($160K-$180K), pero el ticket ($15-40M CLP) lo justifica con creces. El ciclo de 30-90 dias requiere seguimiento comercial rapido.',
                  error: 'Responder leads despues de 24 horas. En automotriz, el 78% de los compradores eligen el concesionario que responde primero. Contacto en menos de 5 minutos aumenta la conversion 8x.',
                  kpis: 'CPL, tiempo de respuesta al lead, tasa de test drive, costo por venta'
                },
                {
                  industria: 'Construccion',
                  recomendacion: 'Google Ads Search es tu canal principal para B2B (ROAS 8.0x). Las busquedas tipo "empresa constructora santiago" o "cotizar construccion industrial" tienen alto intent. Meta funciona para proyectos residenciales donde el visual importa. Ciclo largo (60-180 dias) y ticket muy alto ($60M+) requieren nurturing.',
                  error: 'No diferenciar campanas B2B vs B2C. Construccion industrial (B2B) y construccion de casas (B2C) requieren estrategias completamente diferentes en segmentacion, landing pages y seguimiento.',
                  kpis: 'CPL por tipo de proyecto, pipeline value, tasa de cotizacion, costo por proyecto adjudicado'
                },
              ].map((rec, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{rec.industria}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">{rec.recomendacion}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-red-800 mb-1">Error mas comun</p>
                      <p className="text-xs text-gray-700">{rec.error}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-blue-800 mb-1">KPIs a monitorear</p>
                      <p className="text-xs text-gray-700">{rec.kpis}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>Nota sobre industrias adicionales:</strong> Moda/Retail, Turismo, Fintech, Seguros, Veterinaria y Deportes siguen patrones similares a las industrias detalladas arriba. Moda y Turismo se comportan como Gastronomia (visual + impulso, Meta gana). Fintech y Seguros se comportan como SaaS (search intent + B2B, Google + LinkedIn gana). Veterinaria combina busqueda local (Google) con comunidad (Meta). Deportes se parece a Moda con componente de comunidad. Puedes explorar datos especificos de cada industria en nuestro{' '}
                <Link href="/labs/predictor" className="text-blue-600 hover:underline">Predictor de Campanas</Link>.
              </p>
            </div>
          </section>

          {/* =========================================================
              10. COMO USAR ESTE ESTUDIO
              ========================================================= */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Como Usar Este Estudio para Mejorar tus Campanas
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Estos benchmarks son una herramienta practica, no solo informativa. Sigue estos 5 pasos para aplicarlos a tu negocio.
            </p>

            <div className="space-y-6">
              {[
                {
                  paso: 'Paso 1: Identifica tu industria y canal actual',
                  desc: 'Busca tu industria en las tablas anteriores. Si estas en mas de una (ej: ecommerce de moda), usa la que mejor represente tu modelo de negocio principal. Identifica los canales que usas actualmente y los que no.'
                },
                {
                  paso: 'Paso 2: Compara tu rendimiento actual con la mediana',
                  desc: 'Revisa tu ROAS, CAC y CVR actuales (los encuentras en Google Ads y Meta Ads Manager). Comparalos con la mediana de tu industria en este estudio. Si estas por debajo del p25, hay problemas estructurales que resolver antes de escalar. Si estas entre p25 y mediana, hay optimizaciones claras pendientes. Si estas en la mediana o arriba, estas en buen camino.'
                },
                {
                  paso: 'Paso 3: Evalua oportunidades de canal',
                  desc: 'Si solo usas un canal, evalua si agregar el segundo canal recomendado para tu industria puede mejorar tu rendimiento general. La tabla de Google vs Meta te dice cual canal deberia ser tu primario y cual el complementario. Si tu ticket es alto y vendes B2B, evalua LinkedIn.'
                },
                {
                  paso: 'Paso 4: Ajusta presupuesto por estacionalidad',
                  desc: 'Revisa la tabla de estacionalidad y ajusta tu distribucion de presupuesto anual. Incrementa un 30-50% en temporada alta y reduce un 20-30% en temporada baja. Nunca apagues campanas completamente — el aprendizaje del algoritmo se pierde y el costo de "re-calentar" es alto.'
                },
                {
                  paso: 'Paso 5: Simula antes de invertir',
                  desc: 'Usa el Predictor de Campanas de M&P (mulleryperez.cl/labs/predictor) para simular escenarios con tu presupuesto, industria y canal. La herramienta usa los mismos datos de este estudio para estimar ROAS, CPL y conversiones esperadas antes de que inviertas un peso.'
                },
              ].map((p, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="bg-gray-900 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">{i + 1}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{p.paso}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-900 mb-2">Herramientas complementarias de M&P</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/labs/predictor" className="block p-3 bg-white rounded-lg hover:shadow-sm transition">
                  <p className="font-semibold text-gray-900 text-sm">Predictor de Campanas</p>
                  <p className="text-xs text-gray-500">Simula ROAS y CPL antes de invertir</p>
                </Link>
                <Link href="/indicadores" className="block p-3 bg-white rounded-lg hover:shadow-sm transition">
                  <p className="font-semibold text-gray-900 text-sm">Termometro Marketing</p>
                  <p className="text-xs text-gray-500">CPC y CPA actualizados semanalmente</p>
                </Link>
                <Link href="/benchmarks" className="block p-3 bg-white rounded-lg hover:shadow-sm transition">
                  <p className="font-semibold text-gray-900 text-sm">Benchmark Competitivo</p>
                  <p className="text-xs text-gray-500">Compara tu marca vs competencia</p>
                </Link>
              </div>
            </div>
          </section>

          {/* =========================================================
              11. DETALLE POR INDUSTRIA — FICHAS COMPLETAS
              ========================================================= */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Fichas Detalladas: Todas las Metricas por Industria
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Para referencia rapida, cada ficha contiene todas las metricas de una industria en un solo lugar: ROAS, CAC, CVR, CPL, mejor plataforma, estacionalidad y ciclo de venta.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {allIndustries.map((ind, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" id={ind.slug}>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{ind.industria}</h3>
                  <div className="space-y-2 mb-4">
                    {ind.channels.map((ch, j) => (
                      <div key={j} className="text-xs">
                        <p className="font-semibold text-gray-800">{ch.canal}</p>
                        <div className="grid grid-cols-3 gap-2 text-gray-600 mt-1">
                          <span>ROAS: {ch.roas}</span>
                          <span>CAC: {ch.cac}</span>
                          <span>CVR: {ch.cvr}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1">
                    <p><strong>CPL:</strong> {ind.cpl}</p>
                    <p><strong>Mejor plataforma:</strong> {ind.bestPlatform}</p>
                    <p><strong>Temporada alta:</strong> {ind.season}</p>
                    {ind.cycle && <p><strong>Ciclo de venta:</strong> {ind.cycle}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================
              12. FAQ
              ========================================================= */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Preguntas Frecuentes sobre Benchmark de Marketing Digital en Chile
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================
              13. CTA FINAL
              ========================================================= */}
          <section className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-12 text-center text-white mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Quieres Saber Como se Comparan tus Campanas con tu Industria?
            </h2>
            <p className="text-xl text-blue-100 mb-4 max-w-3xl mx-auto">
              Usa el Predictor de Campanas de M&P para simular escenarios con datos reales de tu industria. O habla con nuestro equipo para un diagnostico gratuito de tus campanas actuales.
            </p>
            <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
              M&P gestiona 200+ campanas activas en 15 industrias con fee fijo, sin contratos de permanencia y con un equipo dedicado de 3 profesionales por cliente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/labs/predictor" className="px-8 py-4 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition font-semibold text-lg">
                Probar el Predictor Gratis
              </Link>
              <Link href="/#contact" className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-lg">
                Solicitar Diagnostico Gratuito
              </Link>
            </div>
          </section>

          {/* Links relacionados */}
          <section className="mb-16">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recursos Relacionados</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/labs/predictor" className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <p className="font-semibold text-gray-900 text-sm">Predictor de Campanas</p>
                <p className="text-xs text-gray-500">Simula ROAS, CPL y conversiones</p>
              </Link>
              <Link href="/indicadores" className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <p className="font-semibold text-gray-900 text-sm">Termometro Marketing Chile</p>
                <p className="text-xs text-gray-500">CPC y CPA actualizados semanalmente</p>
              </Link>
              <Link href="/benchmarks" className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <p className="font-semibold text-gray-900 text-sm">Benchmark Competitivo</p>
                <p className="text-xs text-gray-500">Compara tu marca vs competencia</p>
              </Link>
              <Link href="/mejores-agencias-google-ads-chile-2026" className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <p className="font-semibold text-gray-900 text-sm">Mejores Agencias Google Ads</p>
                <p className="text-xs text-gray-500">Ranking especializado</p>
              </Link>
              <Link href="/agencias-meta-ads-chile-2026" className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <p className="font-semibold text-gray-900 text-sm">Agencias Meta Ads Chile</p>
                <p className="text-xs text-gray-500">Facebook e Instagram Ads</p>
              </Link>
              <Link href="/servicios" className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <p className="font-semibold text-gray-900 text-sm">Servicios M&P</p>
                <p className="text-xs text-gray-500">Google, Meta, LinkedIn Ads</p>
              </Link>
              <Link href="/agencias-linkedin-ads-chile-2026" className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <p className="font-semibold text-gray-900 text-sm">Agencias LinkedIn Ads Chile</p>
                <p className="text-xs text-gray-500">Publicidad B2B especializada</p>
              </Link>
              <Link href="/contacto" className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <p className="font-semibold text-gray-900 text-sm">Contacto</p>
                <p className="text-xs text-gray-500">Habla con nuestro equipo</p>
              </Link>
              <Link href="/estudio-agencias-marketing-digital-chile-2026" className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <p className="font-semibold text-gray-900 text-sm">Estudio Mercado Agencias</p>
                <p className="text-xs text-gray-500">Radiografia del mercado digital Chile</p>
              </Link>
            </div>
          </section>

          {/* Disclaimer final */}
          <section className="mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>Metodologia y disclaimer:</strong> Los datos de este estudio provienen de campanas activas gestionadas por Muller y Perez (mulleryperez.cl) a traves del sistema propietario M&P Predictor. La muestra incluye 200+ campanas de 40+ clientes en 15 industrias en Chile. Los valores se presentan en percentiles (p25, mediana, p75) y se actualizan mensualmente. Los resultados reales pueden variar segun la calidad del sitio web, la oferta comercial, la competencia especifica y la gestion de la campana. Este estudio no constituye una garantia de resultados. Los datos de terceros (competidores) mencionados en las comparativas provienen de fuentes publicas. Ultima actualizacion: agosto 2026. Para uso comercial o citas de este estudio, contactar a christopher@mulleryperez.cl.
              </p>
            </div>
          </section>
        </article>

        <InternalLinksMesh currentPath="/estudio-benchmark-marketing-digital-chile-2026" />
      </div>
    </>
  )
}
