/**
 * Blog: Cómo leer un informe de Meta Ads y Google Ads
 * Caso real anonimizado: una empresa B2B de servicios en Chile, octubre de 2026 (datos de Meta, Google Ads y CRM).
 */

import { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { createMetadata, createBreadcrumbSchema, createFAQPageSchema } from '@/lib/metadata'
import { createSpeakableSchema } from '@/lib/ai-search-optimization'
import InternalLinksMesh from '@/components/rankings/InternalLinksMesh'
import { SpeakableContent } from '@/components/AEOSchemas'

const SLUG = 'como-leer-informe-meta-ads-google-ads'
const URL_ARTICULO = `https://www.mulleryperez.cl/blog/${SLUG}`
const TITULO_SEO = 'Cómo leer un informe de Meta Ads y Google Ads (CPA, CTR, frecuencia)'
const H1 = 'Cómo leer un informe de Meta Ads y Google Ads: CPA, CPC, CTR, frecuencia y CAC con un caso real'
const DESCRIPCION = 'Guía técnica para leer informes de Meta y Google Ads: cómo se relacionan CPM, CTR, CPC y CPA, cuándo una frecuencia sobre 5 es mala, estacionalidad, presupuesto y CAC, con un caso real.'

const FAQS = [
  {
    question: '¿Qué métrica importa más en un informe de Meta o Google Ads?',
    answer: 'El costo por cliente nuevo (CAC) y su relación con lo que vale ese cliente. El CPA de la plataforma sirve para optimizar, pero solo cuenta conversiones que la plataforma ve. Si la conversión no está conectada con ventas reales en el CRM, un CPA bajo puede esconder una campaña que no vende.',
  },
  {
    question: '¿Una frecuencia sobre 5 siempre es mala?',
    answer: 'No. Depende de la ventana, del tipo de campaña y del tamaño de la audiencia. En prospección en Meta, una frecuencia sobre 3 o 4 en 7 días con CTR cayendo y CPM subiendo suele indicar fatiga. En remarketing con audiencias chicas, 5 a 10 en 7 días puede ser normal. Una frecuencia de 5 en un informe mensual equivale a poco más de 1 por semana, que no es alta.',
  },
  {
    question: '¿Por qué sube el CPC si no cambié nada?',
    answer: 'Porque el CPC es el CPM dividido por mil veces el CTR. Sube si las impresiones se encarecen, por más competencia o temporada alta, o si el anuncio recibe menos clics. También sube cuando se aumenta el presupuesto y la plataforma compra impresiones más caras para gastarlo.',
  },
  {
    question: '¿Cómo sé si estoy perdiendo por presupuesto o por calidad en Google Ads?',
    answer: 'Con dos columnas: cuota de impresiones perdida por presupuesto y perdida por ranking. Si la pérdida es por presupuesto, más inversión compra más volumen. Si es por ranking, más presupuesto no sirve: hay que mejorar anuncios, landing, conversiones o la puja.',
  },
  {
    question: '¿Cuántos días hay que esperar antes de juzgar un cambio?',
    answer: 'En Meta, la fase de aprendizaje necesita cerca de 50 eventos de optimización por conjunto de anuncios en una semana. En Google, las estrategias de puja automática suelen necesitar una a dos semanas y varios ciclos de conversión. Juzgar un cambio en 2 o 3 días suele llevar a decisiones equivocadas.',
  },
  {
    question: '¿Por qué Meta, Google y el CRM muestran números distintos?',
    answer: 'Porque cada plataforma atribuye la conversión a sí misma con su propia ventana, y el CRM registra el lead una sola vez y con la fuente que tenga. Es normal que la suma de las plataformas supere lo que muestra el CRM. Para decidir presupuesto, manda el CRM.',
  },
  {
    question: '¿Cómo se calcula el CAC de campañas digitales?',
    answer: 'Se divide la inversión del periodo por los clientes nuevos de ese periodo. El CAC de medios usa solo la inversión publicitaria; el CAC completo suma también fee de agencia, herramientas y el costo del equipo comercial. En el caso de este artículo, cerca de 997 mil pesos en medios y 4 clientes dan un CAC de medios de unos 249 mil pesos.',
  },
  {
    question: '¿Un CPL bajo significa que la campaña funciona?',
    answer: 'No necesariamente. En el caso analizado, la campaña de formulario de Meta tuvo el CPL más bajo del mes, cerca de 7 mil pesos, y sus 44 leads no generaron ninguna venta. El CPL solo vale si se mide junto con la tasa de lead a cliente.',
  },
]

export const metadata: Metadata = createMetadata({
  title: TITULO_SEO,
  description: DESCRIPCION,
  keywords: [
    'cómo leer informe google ads',
    'cómo leer informe meta ads',
    'qué es cpa cpc ctr',
    'frecuencia meta ads',
    'frecuencia alta facebook ads',
    'cuota de impresiones google ads',
    'cac marketing digital',
    'métricas publicidad digital',
    'cpm ctr cpc relación',
  ],
  path: `/blog/${SLUG}`,
})

function H2({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id} className="text-3xl font-bold text-gray-900 mt-16 mb-6 scroll-mt-24">{children}</h2>
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{children}</h3>
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-lg text-gray-700 leading-relaxed mb-6">{children}</p>
}

function Int({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="text-blue-700 font-semibold underline decoration-2 underline-offset-2 hover:text-blue-900">{children}</Link>
}

function Lista({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700 mb-8">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  )
}

function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="bg-slate-900 text-slate-100 font-mono text-base md:text-lg rounded-xl p-5 mb-8 overflow-x-auto not-prose">
      {children}
    </div>
  )
}

function Tabla({ cabecera, filas }: { cabecera: string[]; filas: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full text-left text-base border border-slate-200">
        <thead className="bg-slate-100 text-gray-900">
          <tr>{cabecera.map((c) => <th key={c} className="p-3 border-b border-slate-200 font-semibold">{c}</th>)}</tr>
        </thead>
        <tbody className="text-gray-700">
          {filas.map((fila, i) => (
            <tr key={i} className="border-b border-slate-200 align-top">
              {fila.map((celda, j) => <td key={j} className="p-3">{celda}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Caso({ children }: { children: ReactNode }) {
  return (
    <div className="bg-blue-100 border-l-[6px] border-blue-700 p-6 rounded-r-xl mb-8 shadow-sm not-prose">
      <p className="text-sm font-bold uppercase tracking-wide text-blue-900 mb-3">Caso real · octubre 2026</p>
      <div className="text-lg text-gray-900 leading-relaxed space-y-3">{children}</div>
    </div>
  )
}

const INDICE = [
  ['caso', 'El caso: una empresa B2B de servicios en Chile'],
  ['metricas', 'Las métricas, una por una'],
  ['cadena', 'La cadena que explica el CPA'],
  ['combinaciones', 'Sube una, baja otra: cómo leer las combinaciones'],
  ['frecuencia', 'Frecuencia: cuándo sobre 5 es malo y cuándo no'],
  ['estacionalidad', 'Estacionalidad en Chile'],
  ['presupuesto', 'Presupuesto y fase de aprendizaje'],
  ['competencia', 'Competencia: cuota de impresiones y subasta'],
  ['atribucion', 'Atribución: por qué los números no cuadran'],
  ['cac', 'CAC: la métrica que decide'],
  ['checklist', 'Checklist para leer un informe en 15 minutos'],
  ['faq', 'Preguntas frecuentes'],
]

export default function ComoLeerInformePage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Blog', url: 'https://www.mulleryperez.cl/blog' },
    { name: 'Cómo leer un informe de Meta y Google Ads', url: URL_ARTICULO },
  ])
  const faqSchema = createFAQPageSchema(FAQS)
  const speakableSchema = createSpeakableSchema({
    name: H1,
    url: URL_ARTICULO,
    speakableSelectors: ['.speakable', '[data-speakable]'],
  })
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: H1,
    description: DESCRIPCION,
    url: URL_ARTICULO,
    datePublished: '2026-11-09T12:00:00.000-03:00',
    dateModified: '2026-11-09T12:00:00.000-03:00',
    author: {
      '@type': 'Person',
      name: 'Christopher Muller',
      url: 'https://www.mulleryperez.cl/equipo/christopher-muller',
      jobTitle: 'CEO & Founder',
      worksFor: { '@type': 'Organization', name: 'Muller y Pérez', url: 'https://www.mulleryperez.cl' },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl',
      logo: { '@type': 'ImageObject', url: 'https://www.mulleryperez.cl/logo-color.png' },
    },
    image: 'https://www.mulleryperez.cl/og-image.jpg',
    mainEntityOfPage: { '@type': 'WebPage', '@id': URL_ARTICULO },
    articleSection: 'Paid Media',
    inLanguage: 'es-CL',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />

      <article className="min-h-screen bg-white">
        <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="inline-block px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm mb-4">
              Guía técnica &middot; Paid Media
            </div>
            <SpeakableContent>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{H1}</h1>
              <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                Un informe de campañas no se lee métrica por métrica: se lee como una cadena. Esta guía explica cómo se
                conectan CPM, CTR, CPC, tasa de conversión, CPA y CAC, qué significa cuando una sube y otra baja, y cómo
                pesan la frecuencia, la temporada, el presupuesto y la competencia. Todo con los números reales de un mes.
              </p>
            </SpeakableContent>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span>9 de noviembre de 2026</span>
              <span>&middot;</span>
              <span>20 min de lectura</span>
              <span>&middot;</span>
              <span>Por Christopher Muller</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 max-w-5xl py-12">
          <div className="prose prose-lg max-w-none">

            <div className="bg-amber-50 border-l-[6px] border-amber-500 not-prose p-6 rounded-r-xl mb-8">
              <p className="text-lg font-bold text-gray-900 mb-3">En resumen</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>La fórmula base:</strong> CPA = CPM ÷ (1.000 × CTR × tasa de conversión). Todo cambio en el CPA viene de una de esas tres piezas.</li>
                <li><strong>Frecuencia:</strong> el número solo no dice nada. Importa la ventana (7 días o mes), el tipo de campaña y si el CTR cae mientras sube.</li>
                <li><strong>Presupuesto y competencia:</strong> en Google, separa la cuota perdida por presupuesto de la perdida por ranking. Más plata solo arregla la primera.</li>
                <li><strong>El caso:</strong> la campaña con el CPL más barato del mes generó 0 ventas. Las ventas salieron de otros canales.</li>
                <li><strong>Lo que decide:</strong> el CAC medido en el CRM, no el CPA que reporta la plataforma.</li>
              </ul>
            </div>

            <nav className="border border-slate-200 rounded-xl p-6 mb-12 not-prose">
              <p className="font-bold text-gray-900 mb-3">Contenido</p>
              <ol className="list-decimal pl-6 space-y-1 text-blue-700">
                {INDICE.map(([id, t]) => <li key={id}><a href={`#${id}`} className="underline">{t}</a></li>)}
              </ol>
            </nav>

            <H2 id="caso">El caso: una empresa B2B de servicios en Chile</H2>
            <P>
              Para que esta guía no quede en teoría, vamos a usar los datos reales de octubre de 2026 de una empresa B2B de
              servicios en Chile, sin identificarla. Tiene una gracia poco común: además del informe de Meta
              y de Google Ads, tenemos su CRM completo, con cada lead, su estado comercial y las ventas cerradas con su monto. Si todavía no tienes claro qué canal te conviene, parte por{' '}
              <Int href="/blog/google-ads-vs-meta-ads-chile-2026">Google Ads vs Meta Ads en Chile</Int>.
              Eso permite hacer lo que casi ningún informe hace: seguir el peso invertido hasta el cliente que pagó.
            </P>
            <Tabla
              cabecera={['Canal / campaña', 'Inversión octubre', 'Resultado en plataforma', 'Costo por resultado']}
              filas={[
                ['Meta · formulario instantáneo', '$307.492', '44 leads', '$6.989'],
                ['Meta · mensajes a WhatsApp', '$57.723', '16 conversaciones', '$3.608'],
                ['Meta · dos pruebas de oferta', '$57.233', '3 leads', '$19.078'],
                ['Google Ads · Performance Max y Búsqueda', '$574.366', '23 conversiones', '$24.972'],
                [<strong key="t">Total medios</strong>, <strong key="t2">$996.814</strong>, '', ''],
              ]}
            />
            <P>
              Y del lado comercial: 110 leads entraron al CRM en el mes, 4 se convirtieron en clientes y la facturación mensual
              nueva sumó $5,8 millones netos. Volveremos a estos números en cada sección. Adelanto la conclusión más incómoda:
              mirando solo las plataformas, Meta parecía el canal estrella, con el lead más barato. Mirando el CRM, sus 44 leads
              de formulario no produjeron ni una cotización.
            </P>

            <H2 id="metricas">Las métricas, una por una</H2>
            <P>
              Antes de interpretar combinaciones hay que tener claro qué mide cada número y, sobre todo, de qué depende. Una
              métrica que se mueve sola casi nunca existe: casi todas son el resultado de otras.
            </P>
            <Tabla
              cabecera={['Métrica', 'Qué mide', 'De qué depende', 'Trampa típica']}
              filas={[
                ['Impresiones', 'Veces que se mostró el anuncio', 'Presupuesto, puja, tamaño de audiencia, competencia', 'Más impresiones no es mejor si son a la persona equivocada'],
                ['Alcance', 'Personas distintas que lo vieron (Meta)', 'Audiencia y presupuesto', 'Es estimado y no se suma entre campañas'],
                ['Frecuencia', 'Impresiones ÷ alcance', 'Presupuesto relativo a la audiencia y la ventana', 'Leerla sin saber si es de 7 días o del mes'],
                ['CPM', 'Costo por mil impresiones', 'Competencia en la subasta, temporada, calidad del anuncio, segmentación', 'Un CPM bajo puede ser inventario malo'],
                ['CTR', 'Clics ÷ impresiones', 'Creatividad, oferta, relevancia, ubicación', 'En Meta, usar CTR de enlace y no el CTR de todos los clics'],
                ['CPC', 'Costo por clic', 'CPM ÷ (1.000 × CTR)', 'Mirarlo solo, sin ver qué pasa después del clic'],
                ['Tasa de conversión (CVR)', 'Conversiones ÷ clics', 'Landing, formulario, oferta, intención', 'Depende de qué se cuenta como conversión'],
                ['CPA o CPL', 'Costo por conversión o por lead', 'CPC ÷ CVR', 'La plataforma solo cuenta lo que ve'],
                ['ROAS', 'Ingreso ÷ inversión', 'Valor de cada venta y atribución', 'Sin valores reales, es una ficción'],
                ['CAC', 'Inversión ÷ clientes nuevos', 'Todo el embudo, incluida la gestión comercial', 'Casi nadie lo mide porque exige cruzar con el CRM'],
              ]}
            />
            <P>
              Una advertencia sobre el CTR en Meta: el administrador muestra por defecto “CTR (todos)”, que cuenta clics en
              el perfil, en “ver más”, en la imagen y en reacciones. En el caso, la campaña de formulario tuvo 1.018 clics
              totales pero solo 789 clics en el enlace. El CTR “todos” era 3,19% y el CTR de enlace, el que importa, 2,47%.
              Comparar campañas con el CTR equivocado es uno de los errores más comunes en informes.
            </P>

            <H2 id="cadena">La cadena que explica el CPA</H2>
            <P>
              Toda la lectura de un informe parte de una identidad matemática simple. El costo por conversión es el precio de
              mil impresiones repartido entre las conversiones que esas mil impresiones producen:
            </P>
            <Formula>
              CPC = CPM ÷ (1.000 × CTR)<br />
              CPA = CPC ÷ CVR<br />
              <span className="text-yellow-300 font-bold">CPA = CPM ÷ (1.000 × CTR × CVR)</span>
            </Formula>
            <P>
              No es una regla empírica: es contabilidad. Si el CPA sube, sí o sí es porque subió el CPM, bajó el CTR o bajó
              la tasa de conversión, o alguna combinación de las tres. Eso convierte el diagnóstico en un ejercicio ordenado:
              en vez de preguntarse “¿por qué empeoró la campaña?”, se pregunta “¿cuál de los tres eslabones se movió?”. Cada
              eslabón apunta a un responsable distinto:
            </P>
            <Lista items={[
              <><strong>CPM:</strong> la subasta. Competencia, temporada, segmentación muy estrecha o un anuncio con mala valoración de calidad.</>,
              <><strong>CTR:</strong> la creatividad y la oferta. Lo que el anuncio promete y a quién se lo muestra.</>,
              <><strong>CVR:</strong> lo que pasa después del clic. La landing, el formulario, la velocidad del sitio y la intención real del usuario.</>,
            ]} />
            <Caso>
              <p>
                Comprobemos con la campaña de formulario de Meta en octubre: CPM de $9.641, CTR de enlace de 2,47% y una
                tasa de 5,58% de clics que dejaron sus datos (44 leads de 789 clics). Aplicando la fórmula: 9.641 ÷ (1.000 ×
                0,0247 × 0,0558) = <strong>$6.989 por lead</strong>, exactamente lo que reporta Meta.
              </p>
              <p>
                En septiembre la misma campaña tuvo CPM de $7.598, CTR de 1,72% y CVR de 6,26%: CPL de $7.041. El CPL quedó
                casi igual, pero por razones opuestas. En octubre las impresiones costaron 27% más y el anuncio compensó con
                44% más de CTR. Un informe que solo mostrara “CPL estable” habría escondido que la subasta se encareció y
                que la creatividad nueva estaba haciendo el trabajo.
              </p>
            </Caso>
            <P>
              Esa es la utilidad práctica de la cadena: dos meses con el mismo CPA pueden contar historias completamente
              distintas, y la decisión correcta depende de la historia, no del resultado final.
            </P>

            <H2 id="combinaciones">Sube una, baja otra: cómo leer las combinaciones</H2>
            <P>
              Con la cadena en mente, las combinaciones de movimientos se vuelven legibles. Esta tabla resume las que más
              aparecen en informes mensuales, qué suelen significar y qué revisar. Son lecturas probables, no sentencias:
              siempre hay que confirmar con el detalle por campaña, anuncio y día.
            </P>
            <Tabla
              cabecera={['Movimiento', 'Lectura probable', 'Qué revisar']}
              filas={[
                ['CPM sube, CTR estable, CPA sube', 'Subasta más cara: temporada o más competidores', 'Calendario (Cyber, Navidad), cuota de impresiones, cambios de segmentación'],
                ['CPM sube, CTR sube, CPA estable', 'Más competencia compensada con mejor anuncio', 'Que la creatividad nueva no esté atrayendo clics curiosos sin intención'],
                ['CTR baja, frecuencia sube', 'Fatiga creativa o audiencia saturada', 'CTR por semana, anuncios con más de 4 a 6 semanas, tamaño de audiencia'],
                ['CTR sube, CVR baja', 'El anuncio promete algo que la landing no cumple, o atrae a otro público', 'Coherencia mensaje-landing, términos de búsqueda, ubicaciones'],
                ['CTR estable, CVR baja de golpe', 'Problema técnico o de medición', 'Formulario roto, píxel o etiqueta caída, landing lenta, cambios en el sitio'],
                ['CPC baja, CPA sube', 'Clics más baratos pero peores', 'Ubicaciones de display o Audience Network, búsquedas amplias, bots'],
                ['Impresiones caen, CPM sube', 'Perdiendo subastas', 'Cuota perdida por ranking, puja objetivo demasiado exigente'],
                ['Impresiones caen, CPM estable', 'Límite de presupuesto o de audiencia', 'Cuota perdida por presupuesto, gasto diario vs presupuesto'],
                ['Conversiones suben, ventas no', 'Se optimiza a un evento que no predice venta', 'Qué acción está marcada como conversión principal, calidad en el CRM'],
                ['CPA sube tras subir presupuesto', 'Rendimiento decreciente: se compran impresiones marginales más caras', 'Cuánto subió el gasto vs las conversiones, fase de aprendizaje'],
              ]}
            />
            <P>
              La fila más peligrosa es la penúltima. Cuando una plataforma optimiza hacia una acción que no tiene relación con
              la venta, el informe se ve cada vez mejor mientras el negocio no mejora. El caso típico es contar clics en el
              botón de WhatsApp o visitas a una página como conversión: el algoritmo aprende a conseguir muchísimos de esos
              eventos baratos, y el CPA baja justo porque el evento no vale nada.
            </P>
            <Caso>
              <p>
                En <Int href="/servicios/google-ads-chile">Google Ads</Int> el caso muestra otra combinación. De septiembre a octubre la inversión subió 26% ($455.482 a
                $574.366), los clics bajaron de 1.220 a 997 y el CPC subió de $373 a $576. Las conversiones pasaron de 20 a
                23 y el CPA de $22.774 a $24.972.
              </p>
              <p>
                Lectura: más inversión, menos clics y algo más de conversiones apunta a que la campaña dejó de comprar
                clics baratos de baja intención y pagó más por usuarios que convertían algo mejor. Es una hipótesis, y la
                confirmamos o descartamos con la sección de competencia, más abajo.
              </p>
            </Caso>

            <H2 id="frecuencia">Frecuencia: cuándo sobre 5 es malo y cuándo no</H2>
            <P>
              La frecuencia es la métrica que más se malinterpreta. Una regla repetida en todas partes dice que una frecuencia
              sobre 5 es mala. A veces lo es; muchas veces no. Para leerla bien hay que contestar tres preguntas.
            </P>
            <H3>1. ¿De qué ventana es la frecuencia?</H3>
            <P>
              Meta calcula la frecuencia como impresiones divididas por alcance en el periodo que se elija. Una frecuencia de
              5 en un informe mensual equivale a algo más de una impresión por persona por semana, lo que es bajo. La misma
              frecuencia de 5 en una ventana de 7 días significa casi una impresión diaria a cada persona, lo que en
              prospección suele ser mucho. Además, el alcance no se suma entre días: la frecuencia mensual no es el promedio
              de las semanales. Antes de alarmarse, hay que mirar la frecuencia en ventanas de 7 días.
            </P>
            <H3>2. ¿Qué tipo de campaña es?</H3>
            <Tabla
              cabecera={['Tipo de campaña', 'Referencia práctica (7 días)', 'Cuándo preocuparse']}
              filas={[
                ['Meta · prospección (audiencias amplias o similares)', '1,5 a 3', 'Sobre 3 o 4 con CTR cayendo y CPM subiendo'],
                ['Meta · remarketing (visitantes, interacciones)', '3 a 8', 'Sobre 8 a 10, o cuando el CPA del remarketing supera al de prospección'],
                ['Meta · alcance o reconocimiento', 'La define el tope de frecuencia que se configure', 'Cuando se pierde el control del tope'],
                ['Meta · mensajes o leads con audiencia chica (B2B local)', '2 a 4', 'Sobre 4 y las conversaciones dejan de crecer'],
                ['Google Display y YouTube', 'Se controla con topes de frecuencia por campaña', 'Sin tope en remarketing: la frecuencia se dispara'],
                ['Google Búsqueda', 'No aplica de la misma forma', 'La impresión responde a una búsqueda activa; repetir no fatiga igual'],
                [<Int key="pm" href="/blog/campanas-performance-max-google-ads-2025">Performance Max</Int>, 'No se informa por canal', 'Mirar CTR y conversiones por grupo de recursos'],
              ]}
            />
            <P>
              Estas referencias son criterio práctico, no estándares publicados por las plataformas. Meta y Google no
              definen un umbral universal; lo que sí recomiendan es vigilar el rendimiento a medida que la frecuencia sube.
            </P>
            <H3>3. ¿La frecuencia está dañando el rendimiento?</H3>
            <P>
              La frecuencia alta solo es un problema si viene acompañada de síntomas. El patrón de fatiga clásico es frecuencia
              subiendo, CTR bajando y CPM o CPA subiendo, semana tras semana. Si la frecuencia sube y el CTR y el CPA se
              mantienen, la audiencia todavía tolera el anuncio y no hay que tocar nada.
            </P>
            <Caso>
              <p>
                La campaña de mensajes a WhatsApp del caso es el ejemplo perfecto. En septiembre tuvo frecuencia mensual de
                <strong> 6,04</strong> sobre una audiencia de solo 5.874 personas: con $89.263 de presupuesto, la campaña
                mostraba el anuncio una y otra vez a la misma gente. El CTR de enlace fue 0,62% y cada conversación costó
                $5.251.
              </p>
              <p>
                En octubre el presupuesto bajó a $57.723 y la frecuencia cayó a <strong>3,17</strong> con un alcance similar
                (6.002 personas). El CTR subió a 0,76% y el costo por conversación bajó a $3.608, un 31% menos. Se obtuvieron
                16 conversaciones contra 17, casi lo mismo con 35% menos de inversión. Ahí sí, la frecuencia sobre 5 era mala:
                el presupuesto extra de septiembre se gastó en repetir el anuncio a quienes ya habían decidido no escribir.
              </p>
            </Caso>
            <P>
              La lección general: cuando la audiencia es chica, como en casi todo B2B en Chile, el presupuesto se topa rápido
              con el tamaño del mercado. Subir inversión en esas condiciones no compra más clientes; compra más frecuencia.
            </P>

            <H2 id="estacionalidad">Estacionalidad en Chile</H2>
            <P>
              Comparar un mes con el anterior sin mirar el calendario lleva a conclusiones falsas. La subasta es un mercado:
              cuando más anunciantes quieren las mismas impresiones, el CPM sube aunque la campaña no haya cambiado en nada.
              En Chile hay momentos que mueven la subasta de forma predecible:
            </P>
            <Lista items={[
              <><strong>CyberDay y Cyber Monday Chile:</strong> el retail concentra inversión y los CPM de Meta suben para todos, incluidos los anunciantes B2B que no participan.</>,
              <><strong>Black Friday y diciembre:</strong> el cuarto trimestre es el más caro del año en Meta. Noviembre y diciembre encarecen el CPM incluso en audiencias de empresas.</>,
              <><strong>Fiestas Patrias:</strong> en septiembre la semana del 18 corta la demanda B2B y altera la comparación con octubre.</>,
              <><strong>Enero y febrero:</strong> vacaciones. En B2B cae el volumen de búsquedas y la tasa de respuesta comercial; en turismo y retail de verano pasa lo contrario.</>,
              <><strong>Marzo:</strong> reactivación. Suele ser el mes con mejor relación entre demanda y costo para servicios a empresas y educación.</>,
              <><strong>Cierres de año presupuestario:</strong> en B2B, octubre y noviembre traen empresas buscando proveedores para el año siguiente.</>,
            ]} />
            <P>
              La forma correcta de neutralizar la temporada es comparar contra el mismo periodo del año anterior, además del
              mes anterior, y separar el efecto en CPM del efecto en CTR y CVR. Si el CPM subió 30% en diciembre pero el CTR y
              la conversión se mantienen, la campaña está bien: es el mercado el que se encareció. Si el CVR también cayó, hay
              algo más que temporada.
            </P>
            <Caso>
              <p>
                En el caso, el CPM de la campaña de formulario subió 27% de septiembre a octubre. Parte de eso es estacional:
                septiembre tiene la semana de Fiestas Patrias, con menos competencia B2B, y octubre arrastra la previa del
                CyberDay y del cuarto trimestre. El resto viene de que la audiencia ya había sido impactada en septiembre.
                Ninguna de las dos causas se arregla tocando la campaña.
              </p>
            </Caso>

            <H2 id="presupuesto">Presupuesto y fase de aprendizaje</H2>
            <P>
              El presupuesto no es una perilla lineal (cuánto invertir según rubro está en la guía de{' '}
              <Int href="/blog/cuanto-cuesta-google-ads-chile-2026">cuánto cuesta Google Ads en Chile</Int>). Duplicar la inversión casi nunca duplica las conversiones, por dos
              razones: la plataforma compra primero las impresiones más baratas y con más probabilidad de conversión, así que
              cada peso adicional compra impresiones marginales peores; y los cambios grandes reinician el aprendizaje.
            </P>
            <H3>La fase de aprendizaje en Meta</H3>
            <P>
              Meta indica que un conjunto de anuncios sale de la fase de aprendizaje cuando acumula alrededor de 50 eventos de
              optimización en una semana. Durante esa fase el rendimiento es inestable y el CPA suele ser más alto. Cambios
              importantes, como presupuesto, segmentación, creatividad o evento de optimización, pueden devolverlo al
              aprendizaje. Si un conjunto queda en “aprendizaje limitado”, es señal de que con ese presupuesto y ese evento no
              va a llegar a los 50 eventos semanales.
            </P>
            <P>
              El caso ilustra el problema: la campaña de formulario consiguió 44 leads en todo octubre, unos 10 por semana.
              Nunca va a salir formalmente del aprendizaje con ese volumen. En cuentas B2B pequeñas eso es la norma, y la
              respuesta no es inflar el presupuesto sino consolidar: menos conjuntos de anuncios, más volumen por conjunto, y
              cambios espaciados.
            </P>
            <H3>Las pujas automáticas de Google</H3>
            <P>
              En Google Ads, las estrategias de puja como Maximizar conversiones o CPA objetivo también necesitan datos. Al
              cambiar estrategia, objetivo o presupuesto de forma importante, conviene esperar una a dos semanas antes de
              juzgar, y más si el ciclo entre clic y conversión es largo. Una regla operativa razonable es no mover el
              presupuesto más de 20% a 30% por vez y no tocar la misma campaña dos veces en la misma semana.
            </P>
            <H3>Cómo leer un cambio de presupuesto en el informe</H3>
            <Lista items={[
              <>Compara conversiones incrementales contra inversión incremental, no el CPA promedio. Si subes $100.000 y obtienes 2 conversiones más, el CPA de esas conversiones adicionales es $50.000, aunque el CPA promedio se vea casi igual.</>,
              <>Revisa si el gasto real llegó al presupuesto. Si una campaña con $25.000 diarios gasta $15.000, el límite no es el presupuesto: es la subasta o la audiencia.</>,
              <>Marca en el informe la fecha de cada cambio. Sin esa anotación, cualquier movimiento posterior es imposible de atribuir.</>,
            ]} />

            <H2 id="competencia">Competencia: cuota de impresiones y subasta</H2>
            <P>
              El grado de competencia no se adivina: Google Ads lo muestra (para comparar costos por rubro, ver el{' '}
              <Int href="/benchmark-cpl-chile-2026">benchmark de CPL en Chile 2026</Int>). Las columnas que hay que agregar al informe son
              la cuota de impresiones de búsqueda, la cuota perdida por presupuesto y la cuota perdida por ranking. El informe
              de Estadísticas de subastas (Auction Insights) suma con quién se compite, cuánto se superpone cada competidor y
              quién aparece más arriba.
            </P>
            <Tabla
              cabecera={['Columna', 'Qué significa', 'Qué se hace']}
              filas={[
                ['Cuota de impresiones', 'Porcentaje de las impresiones posibles que se obtuvieron', 'Medir el techo de crecimiento'],
                ['Perdida por presupuesto', 'Impresiones perdidas porque se acabó el presupuesto del día', 'Subir presupuesto, si el CPA marginal lo justifica'],
                ['Perdida por ranking', 'Impresiones perdidas por puja o calidad insuficiente', 'Mejorar anuncios, landing, señales de conversión o la puja; más presupuesto no ayuda'],
                ['Tasa de superposición', 'Cuántas veces un competidor apareció junto a ti', 'Identificar con quién compites de verdad'],
                ['Tasa de posición superior', 'Cuántas veces el competidor quedó por encima', 'Ver quién te gana la subasta y en qué horario'],
              ]}
            />
            <Caso>
              <p>
                La campaña Performance Max de Región Metropolitana del caso tenía una cuota de impresiones de búsqueda de
                cerca de 10%. Con presupuesto de $15.000 diarios, perdía 29,5% de las impresiones por presupuesto y 62% por
                ranking. El presupuesto se subió a $25.000 diarios.
              </p>
              <p>
                Resultado: la pérdida por presupuesto bajó a 0% en los días siguientes, pero la pérdida por ranking subió a
                cerca de 89% y la cuota total se quedó en torno a 10%. El presupuesto extra liberó subastas, pero la campaña
                las perdió por ranking. Esto confirma la hipótesis de la sección anterior: el CPC subió porque se entró a
                subastas más competidas, no porque se ganara más mercado.
              </p>
              <p>
                La decisión correcta, entonces, no era seguir subiendo presupuesto: era trabajar el ranking. Eso significa
                mejores recursos creativos y textos, una landing más rápida y relevante, y sobre todo señales de conversión de
                calidad para que la puja automática valore mejor cada subasta.
              </p>
            </Caso>
            <P>
              En Meta no existe un informe equivalente, pero el CPM funciona como termómetro de competencia: si el CPM sube
              en todas las campañas al mismo tiempo, sin cambios propios, es la subasta. Si sube solo en una, es un problema
              de esa campaña, generalmente de relevancia o de audiencia saturada.
            </P>

            <H2 id="atribucion">Atribución: por qué los números no cuadran</H2>
            <P>
              Ningún informe de campañas cuadra con el CRM, y está bien que así sea. Cada plataforma cuenta conversiones con
              sus propias reglas: Meta, por defecto, atribuye a 7 días después del clic y 1 día después de ver el anuncio;
              Google Ads usa su propio modelo basado en datos y una ventana configurable. Si la misma persona vio un anuncio en
              Instagram y después buscó en Google, ambas plataformas se adjudican la conversión. La suma de las plataformas
              casi siempre supera la realidad.
            </P>
            <P>
              El CRM, en cambio, registra cada lead una sola vez y con la fuente que logró capturar. Ahí aparece el problema
              opuesto: muchas ventas llegan por formulario web, por un correo directo o por un referido, y quedan sin fuente
              de pauta aunque la pauta haya influido. Ninguna de las dos vistas es la verdad completa. La práctica correcta es:
            </P>
            <Lista items={[
              <>Usar las plataformas para optimizar dentro de cada canal: qué anuncio, qué audiencia, qué palabra clave.</>,
              <>Usar el CRM para decidir el presupuesto entre canales y para medir CAC.</>,
              <>Marcar con UTM todo lo que se pueda y guardar la fuente en el lead desde el primer contacto.</>,
              <>Agregar al formulario la pregunta “¿cómo nos conociste?”: la respuesta del cliente suele mostrar canales que la atribución digital no ve.</>,
            ]} />
            <Caso>
              <p>
                En octubre las plataformas sumaron 86 resultados (44 + 16 + 3 + 23). El CRM registró 110 leads en total, de
                todas las fuentes, incluidas las orgánicas. Los 4 clientes cerrados entraron por formulario web (2), por una
                solicitud de cotización (1) y por una herramienta de comparación en el sitio (1). Ninguno quedó marcado como
                lead de un anuncio, aunque es probable que varios hayan visto antes la pauta.
              </p>
              <p>
                Lo que sí es medible es lo contrario: los 44 leads del formulario instantáneo de Meta tienen fuente clara, y su
                resultado fue 22 que nunca contestaron, 12 descartados por no calificar y 10 contactados. Cero cotizaciones y
                cero ventas.
              </p>
            </Caso>
            <P>
              Ese hallazgo es frecuente en formularios instantáneos de Meta en B2B: llenarlos cuesta dos toques porque Meta
              completa los datos, lo que baja el CPL y también la intención. Antes de concluir que el canal no sirve, la
              prueba razonable es cambiar a un formulario de mayor intención, con preguntas de calificación como presupuesto o
              cargo, y comparar la tasa de lead a cotización, no el CPL. Para profundizar en modelos, revisa nuestra guía de{' '}
              <Int href="/blog/atribucion-metricas-chile-2025">atribución y métricas en Chile</Int>.
            </P>

            <H2 id="cac">CAC: la métrica que decide</H2>
            <P>
              El costo de adquisición de clientes (CAC) es la única métrica del informe que se puede comparar directamente
              con el negocio. Se calcula dividiendo la inversión del periodo por los clientes nuevos de ese periodo. Hay dos
              versiones, y conviene reportar ambas:
            </P>
            <Formula>
              CAC de medios = inversión publicitaria ÷ clientes nuevos<br />
              CAC completo = (medios + fee de agencia + herramientas + costo comercial) ÷ clientes nuevos
            </Formula>
            <P>
              El detalle de cómo calcularlo y bajarlo está en{' '}
              <Int href="/blog/que-es-cac-como-calcularlo-reducirlo">qué es el CAC y cómo reducirlo</Int>, y la diferencia
              entre retorno sobre medios y sobre negocio en{' '}
              <Int href="/blog/roi-roas-agencia-marketing-digital-chile-2025">ROI y ROAS</Int>.
            </P>
            <Caso>
              <p>
                Con los datos del mes: $996.814 de inversión en medios y 4 clientes nuevos dan un{' '}
                <strong>CAC de medios de $249.204</strong>. Esos 4 clientes contrataron servicios por $5,8 millones netos
                mensuales en total, unos $1,45 millones por cliente al mes.
              </p>
              <p>
                El retorno sobre la inversión en medios, medido solo con el primer mes de facturación, es de 5,8 veces: cada peso
                invertido en pauta en octubre trajo 5,8 pesos de facturación en el primer mes. Ese es el número que justifica, o no, la pauta. Y es el número que ningún informe de Meta o
                Google puede mostrar por sí solo.
              </p>
            </Caso>
            <P>
              Tres advertencias para leer bien el CAC:
            </P>
            <Lista items={[
              <><strong>El rezago.</strong> En B2B el lead de octubre puede cerrar en diciembre. Medir CAC mensual sin considerar el ciclo de venta castiga los meses de siembra. Lo ideal es mirar CAC en ventanas de 3 meses o por cohorte de leads.</>,
              <><strong>El cuello de botella comercial.</strong> En el caso, 51 de los 110 leads quedaron como “no contesta”. La tasa de lead a cliente fue 3,6%. Antes de culpar a la pauta (ver también <Int href="/blog/como-aumentar-conversiones-google-ads">cómo aumentar conversiones</Int>), hay que revisar tiempo de respuesta e intentos de contacto: un lead llamado en los primeros minutos convierte bastante más que uno llamado al día siguiente.</>,
              <><strong>El CAC por canal.</strong> El CAC promedio esconde que algunos canales traen clientes y otros solo traen leads. El costo por cliente de la campaña de formulario de <Int href="/servicios/meta-ads-chile">Meta Ads</Int>, en octubre, fue infinito: $307.492 y ninguna venta.</>,
            ]} />
            <P>
              Una forma útil de cerrar el informe mensual es poner al lado el CPL de cada canal y su costo por cotización o por
              cliente. La diferencia entre ambos dice dónde está el problema: si el CPL es bueno y el costo por cliente es
              malo, el problema es de calidad del lead o de gestión comercial, no de la pauta. Si ambos son malos, el problema
              empieza en la campaña. Puedes estimar un CPL de referencia para tu rubro en nuestro{' '}
              <Int href="/predictor">Predictor de Campañas</Int>, y revisar los indicadores que conviene seguir en{' '}
              <Int href="/blog/kpis-marketing-digital-chile">KPIs de marketing digital</Int>.
            </P>

            <H2 id="checklist">Checklist para leer un informe en 15 minutos</H2>
            <P>
              Este es el orden que usamos para revisar un informe mensual. Va de lo que más pesa en el negocio a lo que menos:
            </P>
            <ol className="list-decimal pl-6 space-y-3 text-lg text-gray-700 mb-8">
              <li><strong>Clientes y CAC.</strong> ¿Cuántos clientes nuevos hubo, a qué CAC, y cómo se compara con lo que vale un cliente?</li>
              <li><strong>Calidad por canal.</strong> Para cada campaña: leads, porcentaje calificado, cotizaciones y ventas en el CRM.</li>
              <li><strong>Qué se cuenta como conversión.</strong> ¿La conversión principal de cada campaña predice venta, o es un clic o una visita?</li>
              <li><strong>Descomponer el CPA.</strong> Si cambió, ¿fue el CPM, el CTR o la tasa de conversión?</li>
              <li><strong>Calendario.</strong> ¿Hubo Cyber, feriados, fin de mes o cambios propios (presupuesto, anuncios, landing) que expliquen el movimiento?</li>
              <li><strong>Frecuencia con contexto.</strong> En ventana de 7 días, por tipo de campaña, junto al CTR semanal.</li>
              <li><strong>Competencia.</strong> En Google, cuota de impresiones y su pérdida por presupuesto y por ranking; en Meta, CPM de todas las campañas.</li>
              <li><strong>Gasto vs presupuesto.</strong> ¿Se gastó lo planificado? Si no, el límite está en otra parte.</li>
              <li><strong>Aprendizaje.</strong> ¿Hubo cambios grandes en los últimos 7 a 14 días que invaliden la comparación?</li>
              <li><strong>Atribución.</strong> ¿Cuánto suman las plataformas y cuánto registra el CRM? ¿Cuántos leads llegan sin fuente?</li>
              <li><strong>Decisión.</strong> Cada informe debe terminar en acciones con responsable y fecha de revisión, no en un resumen de números.</li>
            </ol>
            <P>
              Si un informe no permite contestar los tres primeros puntos, no es un informe de resultados: es un informe de
              actividad. Esa diferencia es la que separa una gestión de{' '}
              <Int href="/servicios/performance-marketing">performance marketing</Int> de una que solo administra campañas.
            </P>

            <H2 id="faq">Preguntas frecuentes</H2>
            <div className="space-y-6 mb-12">
              {FAQS.map((faq) => (
                <div key={faq.question} className="border border-slate-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <p className="text-base text-gray-500 mb-8">
              Nota sobre los datos: las cifras del caso son reales, de octubre de 2026, tomadas de Meta Ads, Google Ads y el CRM
              de la empresa. Los montos están en pesos chilenos e incluyen solo inversión publicitaria. Las referencias de
              frecuencia son criterio práctico de nuestro equipo, no umbrales publicados por Meta o Google.
            </p>

            <div className="bg-slate-900 text-white rounded-2xl p-8 mt-12 not-prose">
              <h2 className="text-2xl font-bold mb-3">¿Tu informe llega hasta el cliente que pagó?</h2>
              <p className="text-slate-300 mb-6">
                Revisamos tus campañas de Meta y Google cruzadas con tu CRM y te decimos dónde se pierde la plata.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/cotizador" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                  Cotizar una revisión
                </Link>
                <Link href="/predictor" className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors border border-white/20">
                  Predictor de Campañas
                </Link>
              </div>
            </div>

          </div>
        </div>

        <div className="container mx-auto px-6 max-w-5xl pb-16">
          <InternalLinksMesh currentPath={`/blog/${SLUG}`} showEditorial={false} />
        </div>
      </article>
    </>
  )
}
