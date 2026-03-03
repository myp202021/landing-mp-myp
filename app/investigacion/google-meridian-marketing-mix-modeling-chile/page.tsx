import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, BarChart2, Target, CheckCircle2, AlertCircle, Info, Layers, GitBranch, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Google Meridian en Chile: Marketing Mix Modeling para agencias de performance',
  description: 'Qué es Google Meridian, cómo funciona el MMM bayesiano, por qué supera la atribución por clic y cómo las agencias de performance en Chile lo aplican para distribuir presupuesto con datos reales.',
  keywords: 'google meridian chile, marketing mix modeling chile, mmm atribución marketing, atribución bayesiana publicidad chile, meridian google open source, marketing mix modeling agencia chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/investigacion/google-meridian-marketing-mix-modeling-chile'
  },
  openGraph: {
    title: 'Google Meridian en Chile: Marketing Mix Modeling para agencias de performance',
    description: 'Cómo el modelo de atribución que usa Google internamente transforma la medición de campañas en Chile y qué significa para la distribución de presupuesto publicitario.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/investigacion/google-meridian-marketing-mix-modeling-chile',
    publishedTime: '2026-03-03T10:00:00Z',
    authors: ['Christopher Müller — Muller y Pérez'],
    images: [{ url: 'https://www.mulleryperez.cl/og-image.svg', width: 1200, height: 630, alt: 'Google Meridian Marketing Mix Modeling Chile' }]
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Google Meridian en Chile: Marketing Mix Modeling para agencias de performance',
      description: 'Análisis técnico de Google Meridian — el framework open source de MMM bayesiano de Google — y su aplicación práctica para la distribución de presupuesto publicitario en el mercado chileno.',
      datePublished: '2026-03-03T10:00:00Z',
      dateModified: '2026-03-03T10:00:00Z',
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
      mainEntityOfPage: 'https://www.mulleryperez.cl/investigacion/google-meridian-marketing-mix-modeling-chile',
      about: [
        { '@type': 'Thing', name: 'Marketing Mix Modeling' },
        { '@type': 'Thing', name: 'Google Meridian' },
        { '@type': 'Thing', name: 'Atribución publicitaria' },
        { '@type': 'Thing', name: 'Performance Marketing Chile' }
      ],
      mentions: {
        '@type': 'SoftwareApplication',
        name: 'Google Meridian',
        applicationCategory: 'Marketing Analytics',
        operatingSystem: 'Python',
        url: 'https://github.com/google/meridian',
        description: 'Framework open source de Marketing Mix Modeling desarrollado por Google, basado en inferencia bayesiana con JAX.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: [
          'Modelado bayesiano de impacto por canal',
          'Adstock y saturación configurable',
          'Optimización de presupuesto multicanal',
          'Parámetros temporales variables',
          'Calibración con señales de Google Ads'
        ]
      },
      keywords: ['Google Meridian', 'Marketing Mix Modeling', 'MMM', 'atribución bayesiana', 'performance marketing Chile'],
      isPartOf: {
        '@type': 'CreativeWorkSeries',
        name: 'Investigación — Muller y Pérez',
        url: 'https://www.mulleryperez.cl/investigacion'
      }
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Qué es Google Meridian?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Google Meridian es un framework open source de Marketing Mix Modeling (MMM) desarrollado por Google y publicado en 2024. Está construido en Python con JAX y utiliza inferencia bayesiana para estimar el impacto causal de cada canal de marketing (Google Ads, Meta, TV, radio, etc.) sobre los KPIs de negocio como ventas o leads. Google lo usa internamente para sus propios anunciantes y lo liberó como proyecto de código abierto disponible en github.com/google/meridian.'
          }
        },
        {
          '@type': 'Question',
          name: '¿Qué diferencia hay entre Marketing Mix Modeling y atribución basada en clics?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La atribución basada en clics (last-click, data-driven de GA4) solo mide conversiones rastreadas digitalmente: ignora el efecto de TV, radio, outdoor, o el impacto de ver un anuncio sin hacer clic. El MMM usa regresión estadística sobre datos históricos agregados para estimar el impacto causal de TODOS los canales, incluyendo canales offline y efectos de largo plazo (brand building). El MMM no depende de cookies ni de píxeles, lo que lo hace resistente a los cambios de iOS y a la desaparición de las third-party cookies.'
          }
        },
        {
          '@type': 'Question',
          name: '¿Es Google Meridian open source?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. Google Meridian está disponible de forma gratuita como proyecto open source bajo licencia Apache 2.0 en el repositorio github.com/google/meridian. Requiere Python y las librerías JAX, NumPy y Matplotlib. Es comparable a lightweight_mmm (el predecesor de Google) pero con mejoras en la interfaz, visualización y herramientas de optimización de presupuesto.'
          }
        },
        {
          '@type': 'Question',
          name: '¿Qué diferencia hay entre Google Meridian y lightweight_mmm?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ambos son frameworks de MMM bayesiano creados por Google. lightweight_mmm (2022) fue el primero y usa NumPyro. Meridian (2024) es su sucesor con mejor documentación, interfaz más amigable, herramientas de optimización de presupuesto integradas, soporte para parámetros geográficos y calibración mejorada con datos de Google Ads. Para nuevos proyectos, Google recomienda Meridian sobre lightweight_mmm.'
          }
        },
        {
          '@type': 'Question',
          name: '¿Qué datos necesita Google Meridian para funcionar?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Google Meridian necesita datos semanales (o diarios) de: (1) inversión publicitaria por canal durante al menos 1-2 años, (2) KPI de negocio en el mismo período (ventas, leads, ingresos), (3) opcionalmente: datos de volumen de búsqueda, precios, estacionalidad y variables de control. Con más de 52 semanas de datos y al menos 3-4 canales medibles, el modelo produce estimaciones confiables.'
          }
        },
        {
          '@type': 'Question',
          name: '¿Cómo afecta iOS 14 a la medición de marketing en Chile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'iOS 14 (2021) y sus actualizaciones posteriores eliminaron el IDFA para el 70%+ de usuarios Apple. En Chile, donde iPhone tiene ~35% de market share (más alto en segmentos ABC1), esto significa que Meta Ads perdió visibilidad sobre conversiones de iPhone y Google Analytics subreporta conversiones de usuarios iOS que no aceptan cookies. El MMM no depende de tracking individual: mide impacto de canales sobre KPIs agregados, por lo que es inmune a estas limitaciones.'
          }
        },
        {
          '@type': 'Question',
          name: '¿Cuándo vale la pena usar Marketing Mix Modeling en Chile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El MMM es más valioso cuando: (1) inviertes en 3 o más canales simultáneamente, (2) tienes presupuesto mensual superior a $5M CLP, (3) quieres entender impacto de canales no rastreables (TV, radio, outdoor), (4) sospechas que tu atribución digital subestima o sobreestima algún canal, (5) necesitas justificar reasignación de presupuesto con datos estadísticos. Para inversiones menores con 1-2 canales, la atribución digital estándar puede ser suficiente.'
          }
        },
        {
          '@type': 'Question',
          name: '¿Qué agencias en Chile usan Marketing Mix Modeling?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El Marketing Mix Modeling está emergiendo en Chile principalmente en agencias de performance con foco analítico y en las unidades de analytics de grandes anunciantes. Muller y Pérez es una de las primeras agencias de performance en Chile en incorporar MMM como metodología de análisis para la distribución de presupuesto de sus clientes, aplicando los principios del framework de Google Meridian a la realidad del mercado local.'
          }
        }
      ]
    }
  ]
}

const comparativaAtribucion = [
  {
    modelo: 'Last-click',
    como: 'Todo el crédito al último canal tocado antes de convertir',
    problema: 'Ignora todos los canales que iniciaron el viaje. Sobrevalora Search, subvalora awareness.',
    cookieless: false,
    offline: false,
    nivel: 'Básico'
  },
  {
    modelo: 'Data-driven (GA4)',
    como: 'ML de Google distribuye crédito entre touchpoints digitales',
    problema: 'Solo ve touchpoints de Google. Ignora Meta, TV, radio, impacto de marca.',
    cookieless: false,
    offline: false,
    nivel: 'Intermedio'
  },
  {
    modelo: 'Marketing Mix Modeling',
    como: 'Regresión bayesiana sobre datos históricos agregados de todos los canales',
    problema: 'Requiere al menos 1-2 años de datos y expertise técnico para interpretar.',
    cookieless: true,
    offline: true,
    nivel: 'Avanzado'
  },
  {
    modelo: 'Google Meridian (MMM)',
    como: 'MMM bayesiano con adstock, saturación y calibración con datos de Google Ads',
    problema: 'Curva de aprendizaje técnica. Necesita datos históricos limpios.',
    cookieless: true,
    offline: true,
    nivel: 'Avanzado+'
  },
]

const adstockConceptos = [
  {
    concepto: 'Adstock',
    icono: '📡',
    descripcion: 'Los efectos de la publicidad no terminan cuando termina el anuncio. El adstock modela cuánto tiempo persiste el impacto de una campaña después de su fin — crucial para medir brand building.',
    ejemplo: 'Una campaña de TV en noviembre puede seguir generando ventas en enero si el modelo adstock es correcto.'
  },
  {
    concepto: 'Saturación',
    icono: '📈',
    descripcion: 'El retorno de invertir más en un canal disminuye a medida que aumenta el gasto. Meridian modela la curva de saturación para identificar el punto de rendimiento óptimo.',
    ejemplo: 'Duplicar el presupuesto de Google Ads no duplica los leads: la curva se aplana. Meridian indica dónde está ese punto de quiebre.'
  },
  {
    concepto: 'Causalidad bayesiana',
    icono: '🔬',
    descripcion: 'A diferencia de regresión simple, el enfoque bayesiano incorpora priors (conocimiento previo) y genera distribuciones de probabilidad, no puntos únicos — lo que permite medir incertidumbre.',
    ejemplo: 'El modelo dice: "Google Ads contribuye entre 28% y 36% de las conversiones con 90% de confianza", no solo "32%".'
  },
  {
    concepto: 'Parámetros geo-temporales',
    icono: '🗺️',
    descripcion: 'Meridian soporta modelos con variación por región y por período de tiempo, capturando que el impacto de un canal puede cambiar con la estacionalidad o entre mercados geográficos.',
    ejemplo: 'Meta Ads puede tener mayor impacto en diciembre que en febrero, y más impacto en Santiago que en regiones — Meridian lo detecta.'
  },
]

const pasosMmm = [
  { paso: '1', titulo: 'Recolección de datos', detalle: 'Exportar inversión semanal por canal (Google Ads, Meta, LinkedIn, offline), KPIs de negocio (ventas, leads, ingresos) y variables de control (precios, competencia, estacionalidad) para al menos 52-104 semanas.' },
  { paso: '2', titulo: 'Preparación y limpieza', detalle: 'Alinear todas las series de tiempo en la misma granularidad (semanal o diaria), corregir anomalías, codificar estacionalidad con variables dummy (Black Friday, Cyber, Navidad, etc.).' },
  { paso: '3', titulo: 'Configuración del modelo', detalle: 'Definir la función de transformación de medios (adstock, hill function para saturación), establecer priors bayesianos para cada canal basándose en conocimiento del negocio.' },
  { paso: '4', titulo: 'Entrenamiento', detalle: 'Meridian usa MCMC (Monte Carlo vía cadenas de Markov) con JAX para muestrear la distribución posterior. El resultado es una distribución de contribuciones por canal, no un punto único.' },
  { paso: '5', titulo: 'Validación', detalle: 'Verificar que el modelo explique adecuadamente los datos históricos (R², MAPE), validar out-of-sample y hacer backtesting en períodos conocidos como peak estacional.' },
  { paso: '6', titulo: 'Optimización de presupuesto', detalle: 'Con el modelo entrenado, Meridian incluye herramientas de optimización que responden: ¿Cómo reasignar el presupuesto actual para maximizar conversiones manteniendo el mismo gasto total?' },
]

export default function MeridianPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" aria-label="Ir a inicio">
            <img src="/logo-color.png" alt="Muller y Pérez" className="h-11 w-auto" />
          </Link>
          <Link href="/investigacion" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Investigación
          </Link>
        </div>
      </header>

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Badges + fecha */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">Análisis técnico</span>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">Google Meridian 2024</span>
            <p className="text-gray-500 text-sm">3 de marzo, 2026 · 12 min de lectura · Por Christopher Müller</p>
          </div>

          {/* H1 */}
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Google Meridian: el modelo de atribución que Google usa internamente y qué significa para el marketing en Chile
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            En 2024 Google publicó Meridian, su framework interno de Marketing Mix Modeling (MMM). Es el mismo modelo que usan sus propios equipos para medir el impacto real de la publicidad — y está disponible de forma gratuita. Aquí explicamos qué es, cómo funciona, y por qué la atribución por clic ya no es suficiente para tomar decisiones de presupuesto en el mercado chileno.
          </p>

          {/* Resumen ejecutivo */}
          <div className="bg-blue-900 text-white rounded-2xl p-8 mb-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><BarChart2 className="w-5 h-5" /> Puntos clave de este análisis</h2>
            <div className="space-y-3">
              {[
                'Google Meridian es un MMM bayesiano open source — el mismo que Google usa para sus anunciantes internos',
                'La atribución por clic (GA4, Meta Pixel) subvalora canales de awareness y sobrevalora Search en hasta 30%',
                'iOS 14+ hace que Meta Ads subreporte conversiones de iPhone (~35% del mercado chileno)',
                'El MMM no depende de cookies ni pixels — es resistente a los cambios de privacidad',
                'Requiere al menos 1-2 años de datos históricos de inversión + KPIs por canal',
                'Meridian incluye optimizador de presupuesto: responde "¿cómo reasigno el mismo dinero para más conversiones?"',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-100 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sección 1: Qué es */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" /> ¿Qué es Google Meridian?
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Google Meridian es un framework open source de <strong>Marketing Mix Modeling (MMM)</strong> publicado por Google en 2024 y disponible en <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">github.com/google/meridian</code>. Está construido en Python usando JAX — la librería de cómputo científico de Google — y aplica <strong>inferencia bayesiana</strong> para estimar la contribución causal de cada canal de marketing sobre las ventas u otros KPIs de negocio.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              A diferencia de sus predecesores open source (incluido <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">lightweight_mmm</code>, el primer intento de Google en 2022), Meridian incluye herramientas integradas de optimización de presupuesto, mejor documentación, soporte nativo para modelos geográficos y calibración mejorada con señales de Google Ads.
            </p>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-5 rounded-r-xl">
              <p className="text-purple-900 text-sm leading-relaxed">
                <strong>Dato clave:</strong> Google usa internamente este mismo framework para ayudar a sus anunciantes premium a tomar decisiones de presupuesto. Al publicarlo como open source, cualquier agencia o empresa puede acceder a la misma metodología sin costo. Es el equivalente a que Google publique el código con el que opera sus propios equipos de media planning.
              </p>
            </div>
          </section>

          {/* Sección 2: El problema con la atribución tradicional */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-500" /> El problema con la atribución basada en clics en Chile
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              La mayoría de las empresas en Chile toman decisiones de presupuesto basándose en GA4, el Meta Pixel o reportes de plataforma. Estos sistemas tienen tres limitaciones estructurales que distorsionan la realidad:
            </p>

            <div className="space-y-4 mb-6">
              {[
                {
                  titulo: 'Solo ven clics, no impacto',
                  color: 'red',
                  detalle: 'Un usuario que ve tu anuncio en Meta, luego busca tu marca en Google y convierte aparece como conversión de Google Search. El crédito va a Search aunque Meta inició la intención. La atribución last-click sobrevalora el canal de cierre y subvalora el canal de apertura — en hasta un 30% según estudios de Google.'
                },
                {
                  titulo: 'iOS 14 rompió el pixel de Meta',
                  color: 'orange',
                  detalle: 'Desde 2021, el 70%+ de usuarios iPhone optó por no ser rastreados (ATT prompt). En Chile, iPhone tiene ~35% de market share — más alto en segmentos ABC1, que son los que más compran online. Meta reporta las conversiones que puede ver, pero una parte significativa queda invisible. Meta Ads puede estar funcionando mejor de lo que muestra el reporte.'
                },
                {
                  titulo: 'No miden canales offline ni efecto marca',
                  color: 'yellow',
                  detalle: 'Una empresa que invierte en LinkedIn, radio o sponsoring de eventos no puede medir ese impacto con píxeles. El brand building de Meta Ads — personas que ven tu anuncio, no hacen clic, pero te buscan 3 semanas después — tampoco queda registrado. El MMM captura todo esto desde los datos de ventas históricos.'
                },
              ].map((item, i) => (
                <div key={i} className={`bg-${item.color}-50 border border-${item.color}-200 rounded-xl p-5`}>
                  <h3 className="font-bold text-gray-900 mb-2">{item.titulo}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.detalle}</p>
                </div>
              ))}
            </div>

            {/* Tabla comparativa */}
            <h3 className="text-lg font-bold text-gray-900 mb-4">Comparativa de modelos de atribución</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold">Modelo</th>
                    <th className="text-left px-4 py-3 font-bold">Cómo funciona</th>
                    <th className="text-center px-4 py-3 font-bold">Cookieless</th>
                    <th className="text-center px-4 py-3 font-bold">Offline</th>
                    <th className="text-center px-4 py-3 font-bold">Nivel</th>
                  </tr>
                </thead>
                <tbody>
                  {comparativaAtribucion.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-bold text-gray-900">{row.modelo}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs leading-relaxed max-w-xs">{row.como}</td>
                      <td className="px-4 py-3 text-center">{row.cookieless ? '✅' : '❌'}</td>
                      <td className="px-4 py-3 text-center">{row.offline ? '✅' : '❌'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          row.nivel === 'Avanzado+' ? 'bg-purple-100 text-purple-700' :
                          row.nivel === 'Avanzado' ? 'bg-blue-100 text-blue-700' :
                          row.nivel === 'Intermedio' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{row.nivel}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sección 3: Cómo funciona Meridian */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" /> Cómo funciona Google Meridian: los 4 conceptos clave
            </h2>
            <p className="text-gray-600 mb-6">Para entender qué hace Meridian diferente a una simple regresión, hay 4 conceptos técnicos que definen su funcionamiento:</p>

            <div className="grid md:grid-cols-2 gap-4">
              {adstockConceptos.map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="text-3xl mb-3">{item.icono}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.concepto}</h3>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">{item.descripcion}</p>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-blue-800 text-xs"><strong>Ejemplo:</strong> {item.ejemplo}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sección 4: Proceso en 6 pasos */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-blue-600" /> Cómo se implementa un modelo MMM con Meridian
            </h2>
            <p className="text-gray-600 mb-6">El proceso de implementación de un modelo MMM con Google Meridian sigue 6 etapas, desde la recolección de datos hasta la optimización de presupuesto:</p>

            <div className="space-y-4">
              {pasosMmm.map((item, i) => (
                <div key={i} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-5">
                  <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">
                    {item.paso}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.titulo}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.detalle}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sección 5: Qué responde el MMM */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" /> Las 4 preguntas que responde el MMM (y que GA4 no puede)
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  pregunta: '¿Qué % de las ventas viene de cada canal?',
                  respuesta: '"Google Search genera el 38% de las conversiones, Meta el 22%, LinkedIn el 15%, y el 25% restante viene de efectos base (tráfico orgánico, marca, seasonal)."',
                  icono: '📊'
                },
                {
                  pregunta: '¿Cuánto adicional genera cada peso invertido?',
                  respuesta: '"El marginal ROI de Google Ads es $4.2 por cada $1 invertido. El de Meta es $3.1. El de LinkedIn es $5.8 para este tipo de negocio."',
                  icono: '💰'
                },
                {
                  pregunta: '¿Qué pasa si reasigno el presupuesto?',
                  respuesta: '"Moviendo $500k/mes de Meta a LinkedIn, el modelo proyecta un aumento de 12% en conversiones B2B manteniendo el mismo presupuesto total."',
                  icono: '🔄'
                },
                {
                  pregunta: '¿Cuánto duran los efectos de cada canal?',
                  respuesta: '"El adstock de TV tiene decaimiento de 8 semanas. El de Search es instantáneo. El de brand campaigns en Meta persiste ~3 semanas después de terminar la campaña."',
                  icono: '⏱️'
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="text-2xl mb-2">{item.icono}</div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{item.pregunta}</h3>
                  <p className="text-gray-500 text-xs italic leading-relaxed">{item.respuesta}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sección 6: Limitaciones */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-500" /> Limitaciones del MMM — lo que Meridian no puede hacer
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <p className="text-gray-700 mb-4">El MMM es poderoso, pero no es una bala de plata. Es importante conocer sus limitaciones para usarlo correctamente:</p>
              <div className="space-y-3">
                {[
                  { titulo: 'No mide usuarios individuales', detalle: 'El MMM trabaja con datos agregados. No puede decirte "Juan convirtió porque vio este anuncio específico". Es un modelo de impacto a nivel canal, no a nivel usuario.' },
                  { titulo: 'Requiere historia de datos suficiente', detalle: 'Para que el modelo bayesiano converja, necesitas al menos 52-104 semanas de datos. Empresas nuevas o con cambios radicales de negocio en el período no tienen base histórica válida.' },
                  { titulo: 'No captura efectos muy recientes', detalle: 'El modelo necesita tiempo para observar el resultado de la inversión. Cambios de presupuesto en las últimas 2-4 semanas pueden no estar bien reflejados en los coeficientes.' },
                  { titulo: 'Asume cierta estabilidad de mercado', detalle: 'En períodos de disrupción muy fuerte (pandemia, crisis económica), los parámetros aprendidos del pasado pueden no ser válidos para el futuro inmediato.' },
                  { titulo: 'Es un modelo — no la realidad', detalle: 'Como todo modelo estadístico, Meridian produce estimaciones con incertidumbre. Debe usarse como insumo para decisiones, no como verdad absoluta. El juicio del equipo sigue siendo necesario.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-0.5 flex-shrink-0">⚠</span>
                    <div>
                      <span className="font-semibold text-gray-900">{item.titulo}: </span>
                      <span className="text-gray-600 text-sm">{item.detalle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sección 7: Cómo aplica M&P */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-600" /> Cómo aplica Muller y Pérez los principios de MMM en Chile
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              En M&P no esperamos a que el cliente tenga 2 años de datos limpios para empezar a aplicar pensamiento MMM. Desde el primer mes de gestión aplicamos los principios de adstock, saturación y atribución multicanal para diseñar la estructura de campañas y distribuir el presupuesto:
            </p>

            <div className="space-y-4">
              {[
                {
                  titulo: 'Estructura de campañas por función en el funnel',
                  detalle: 'Separamos inversión en awareness (Meta broad, YouTube) de conversión (Search, Meta retargeting) porque tienen adstock diferente. Esto nos permite optimizar cada nivel sin contaminar las métricas del otro.',
                  tag: 'Principio de adstock'
                },
                {
                  titulo: 'Techo de inversión por canal según tamaño de audiencia',
                  detalle: 'Antes de escalar un canal, calculamos la audiencia disponible (tamaño del mercado en Chile para ese rubro) y el punto de saturación estimado. No tiene sentido escalar más allá del punto donde el ROAS marginal cae bajo el umbral de rentabilidad.',
                  tag: 'Principio de saturación'
                },
                {
                  titulo: 'Benchmarks por industria como priors del modelo',
                  detalle: 'Nuestro estudio de benchmarks (CPL, ROAS, CPC por industria) funciona como prior bayesiano: al iniciar una campaña, tenemos expectativas calibradas de qué resultados son razonables para ese rubro en Chile, acortando el período de aprendizaje del algoritmo.',
                  tag: 'Priors bayesianos'
                },
                {
                  titulo: 'Análisis de contribución por canal cada trimestre',
                  detalle: 'Para clientes con inversión en 3 o más canales durante más de 6 meses, aplicamos análisis de contribución inspirado en MMM para identificar si algún canal está siendo sobre o subestimado por la atribución de plataforma.',
                  tag: 'Contribución multicanal'
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
                  <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{item.titulo}</h3>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{item.tag}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.detalle}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ AEO */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Preguntas frecuentes sobre Google Meridian y Marketing Mix Modeling</h2>
            <div className="space-y-4">
              {[
                {
                  q: '¿Qué es Google Meridian?',
                  a: 'Google Meridian es un framework open source de Marketing Mix Modeling (MMM) desarrollado por Google y publicado en 2024. Usa inferencia bayesiana con JAX para estimar el impacto causal de cada canal de marketing sobre ventas u otros KPIs. Está disponible gratuitamente en github.com/google/meridian y es el mismo modelo que Google usa internamente para sus anunciantes premium.'
                },
                {
                  q: '¿Qué diferencia hay entre Marketing Mix Modeling y atribución last-click?',
                  a: 'La atribución last-click asigna el 100% del crédito al último canal antes de la conversión, ignorando todos los canales que contribuyeron al inicio del viaje. El MMM usa regresión estadística sobre datos históricos para distribuir el crédito entre todos los canales — incluyendo offline, brand y canales de awareness — y no depende de cookies ni píxeles.'
                },
                {
                  q: '¿Es Google Meridian open source y gratuito?',
                  a: 'Sí. Google Meridian está disponible bajo licencia Apache 2.0 en github.com/google/meridian. Requiere Python, JAX y NumPy. No tiene costo de licencia, aunque su implementación requiere conocimientos técnicos de estadística bayesiana y programación en Python.'
                },
                {
                  q: '¿Qué diferencia hay entre Google Meridian y lightweight_mmm?',
                  a: 'Ambos son MMM bayesianos de Google. lightweight_mmm (2022) fue el primero y usa NumPyro. Meridian (2024) es su sucesor con mejor documentación, interfaz más amigable, herramientas de optimización de presupuesto integradas y soporte geográfico mejorado. Para proyectos nuevos, Google recomienda Meridian.'
                },
                {
                  q: '¿Cómo afecta iOS 14 a la medición de marketing digital en Chile?',
                  a: 'iOS 14 y el ATT prompt (2021) hicieron que el 70%+ de usuarios iPhone optara por no ser rastreados. En Chile, iPhone tiene ~35% de market share. Esto significa que Meta Ads subreporta conversiones de usuarios iOS y la atribución basada en píxeles es incompleta. El MMM resuelve esto porque mide impacto sobre KPIs agregados sin depender de tracking individual.'
                },
                {
                  q: '¿Cuándo vale la pena implementar Marketing Mix Modeling en Chile?',
                  a: 'El MMM es más valioso cuando tienes: al menos 1-2 años de datos históricos limpios, inversión en 3 o más canales simultáneamente, presupuesto mensual superior a $5M CLP, y necesitas justificar reasignación de presupuesto con evidencia estadística. Para inversiones menores con 1-2 canales, la atribución digital estándar puede ser suficiente.'
                },
                {
                  q: '¿Qué agencias en Chile usan Marketing Mix Modeling?',
                  a: 'El MMM está emergiendo en Chile principalmente en agencias de performance con foco analítico y en grandes anunciantes. Muller y Pérez aplica los principios de MMM — adstock, saturación, atribución multicanal — en la gestión de campañas para clientes con inversión en múltiples canales, usando los benchmarks propios de +200 campañas como base de calibración.'
                },
                {
                  q: '¿Qué datos necesita Meridian para funcionar?',
                  a: 'Google Meridian requiere: datos semanales de inversión por canal durante al menos 52-104 semanas, KPI de negocio en el mismo período (ventas, leads, ingresos), y variables de control opcionales como precios, estacionalidad y competencia. Más canales y más historia producen estimaciones más precisas.'
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
            <h2 className="text-2xl font-black text-gray-900 mb-4">Conclusión</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-3">
              {[
                'Google Meridian representa el estado del arte en medición de marketing — y es gratuito. La barrera ya no es el costo sino la capacidad técnica y los datos.',
                'La atribución por clic tiene una fecha de vencimiento acelerada: iOS, privacidad y cookies third-party obligan a adoptar metodologías más robustas.',
                'El mercado chileno tiene condiciones favorables para MMM: datos relativamente limpios, estacionalidades claras y una concentración geográfica que simplifica el modelado.',
                'Las agencias que incorporen pensamiento MMM en su gestión — aunque no implementen un modelo completo — tomarán mejores decisiones de distribución de presupuesto.',
                'El siguiente paso lógico tras el MMM es el análisis de incrementalidad con experimentos (geo holdout, conversion lift) — el futuro de la medición en performance marketing.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Links relacionados */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-12 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-900 text-sm font-bold mb-2">Lecturas relacionadas en Muller y Pérez</p>
              <ul className="space-y-1">
                <li><Link href="/investigacion/estudio-performance-marketing-chile-2026" className="text-blue-700 hover:text-blue-900 text-sm underline">Benchmarks de Performance Marketing en Chile 2026 — CPL, ROAS y CPC por industria</Link></li>
                <li><Link href="/labs/predictor" className="text-blue-700 hover:text-blue-900 text-sm underline">Predictor de resultados — proyecta tus KPIs con datos reales del mercado chileno</Link></li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-black mb-3">¿Cómo está distribuido tu presupuesto publicitario hoy?</h2>
            <p className="text-blue-200 mb-6">Si inviertes en más de un canal digital, probablemente estés sobre o subestimando alguno. Conversemos sobre cómo aplicar pensamiento MMM a tu mix de medios.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/labs/predictor" className="bg-white text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
                Usar el Predictor →
              </Link>
              <a href="https://wa.me/56950575135?text=Hola%2C%20quiero%20revisar%20la%20distribución%20de%20mi%20presupuesto%20publicitario" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-white hover:text-blue-900 transition-colors">
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
            <Link href="/investigacion" className="text-blue-400 hover:text-blue-300">← Volver a Investigación</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
