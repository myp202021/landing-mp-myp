/**
 * Blog: ChatGPT Ads en Chile — guía completa con fuentes primarias
 * Fuentes oficiales de OpenAI y pruebas publicadas, leídas el 2 de noviembre de 2026
 */

import { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { createMetadata, createBreadcrumbSchema, createFAQPageSchema } from '@/lib/metadata'
import { createSpeakableSchema } from '@/lib/ai-search-optimization'
import InternalLinksMesh from '@/components/rankings/InternalLinksMesh'
import { SpeakableContent } from '@/components/AEOSchemas'

const URL_ARTICULO = 'https://www.mulleryperez.cl/blog/chatgpt-ads-chile-guia-agencia'
const TITULO_SEO = 'ChatGPT Ads en Chile: guía y comparación con Google Ads'
const H1 = 'ChatGPT Ads en Chile: guía completa para anunciar y compararlo con Google Ads'
const DESCRIPCION = 'Guía de ChatGPT Ads en Chile con fuentes oficiales: requisitos, paso a paso, costos, rubros prohibidos, comparación con Google Ads y prueba de 4 semanas.'

const F = {
  anuncio: 'https://openai.com/es-ES/index/chatgpt-ads-expands-26-new-countries/',
  medicion: 'https://openai.com/es-ES/index/new-chatgpt-ads-format-and-measurement/',
  politicas: 'https://openai.com/es-ES/policies/ad-policies/',
  basicos: 'https://help.openai.com/en/articles/20001207-ads-in-chatgpt-the-basics',
  faq: 'https://help.openai.com/en/articles/20001220-frequently-asked-questions',
  disponibilidad: 'https://help.openai.com/en/articles/20001245-ads-manager-availability',
  inicio: 'https://help.openai.com/en/articles/20001224-quickstart-launch-your-first-campaign',
  campanas: 'https://help.openai.com/en/articles/20001210-creating-campaigns-for-chatgpt-ads',
  grupos: 'https://help.openai.com/es-es/articles/20001211-create-ad-groups-for-chatgpt-ads',
  anuncios: 'https://help.openai.com/es-es/articles/20001212-creating-ads-for-chatgpt-ads',
  conversiones: 'https://help.openai.com/es-es/articles/20001412-conversion-optimized-campaigns',
  presupuesto: 'https://help.openai.com/es-es/articles/20001413-daily-budgets',
  lanzar: 'https://help.openai.com/es-es/articles/20001209-launch-campaigns',
  problemas: 'https://help.openai.com/es-es/articles/20001217-troubleshooting-common-issues',
  workshop: 'https://www.workshopdigital.com/blog/chatgpt-ads-for-b2b/',
  airops: 'https://www.airops.com/blog/chatgpt-ads-performance',
  graphite: 'https://www.searchenginejournal.com/chatgpt-ad-ctr-markets-report/591384/',
  sej: 'https://www.searchenginejournal.com/6-months-into-chatgpt-ads-advertisers-still-dont-know-what-good-looks-like/587583/',
  wordstream: 'https://www.wordstream.com/blog/2026-google-ads-benchmarks',
  digiday: 'https://digiday.com/marketing/everything-is-coming-down-chatgpt-ads-are-getting-cheaper/',
  sel: 'https://searchengineland.com/run-chatgpt-ads-484513',
  itsitio: 'https://itsitio.com/co/inteligencia-artificial/openai-amplia-los-anuncios-en-chatgpt-a-colombia-y-a-14-nuevos-mercados-de-america-latina/',
}

const FAQS = [
  {
    question: '¿Se puede anunciar en ChatGPT desde Chile?',
    answer: 'Sí. La página de disponibilidad de OpenAI marca a Chile con autoservicio disponible en el Gestor de anuncios. La entidad legal que anuncia y factura debe estar en un país habilitado. El despliegue es reciente, así que el volumen real en Chile hay que comprobarlo con una prueba.',
  },
  {
    question: '¿Cuánto cuesta anunciar en ChatGPT en Chile?',
    answer: 'El presupuesto diario mínimo publicado por OpenAI es de 3.750 pesos chilenos si la cuenta factura en CLP, y de 25 dólares si factura en USD. El precio real lo define una subasta. OpenAI recomienda partir con una puja máxima de 3 a 5 dólares por clic y no publica promedios de costo.',
  },
  {
    question: '¿Qué rubros no pueden anunciar en ChatGPT en Chile?',
    answer: 'Según las políticas de OpenAI actualizadas al 10 de septiembre de 2026, fuera de Estados Unidos están prohibidos los servicios jurídicos y, por lo general, los financieros y de salud. Tampoco se permiten alcohol, tabaco, apuestas, contenido político, drogas recreativas ni contenido para adultos. También se prohíben los anuncios de ofertas de empleo concretas y de viviendas concretas en venta o arriendo.',
  },
  {
    question: '¿Pagar anuncios en ChatGPT hace que mi marca aparezca en las respuestas?',
    answer: 'No. OpenAI declara que la publicidad no influye en las respuestas y que los anuncios van identificados y separados de ellas. Aparecer recomendado en la respuesta es un trabajo distinto, de posicionamiento orgánico en inteligencia artificial, también llamado GEO.',
  },
  {
    question: '¿ChatGPT Ads reemplaza a Google Ads?',
    answer: 'Con la evidencia disponible, no. En las dos comparaciones publicadas de un mismo anunciante, Google convirtió mejor. El clic puede ser más barato en ChatGPT, pero la tasa de clic y la conversión fueron más bajas. Lo razonable es probarlo con presupuesto adicional, sin quitarle inversión a una campaña de Google que ya genera ventas.',
  },
  {
    question: '¿Cómo se segmenta en ChatGPT si no hay palabras clave?',
    answer: 'Con indicaciones contextuales, que describen conversaciones, temas o términos en los que tu oferta puede ser relevante. OpenAI aclara que no son palabras clave de concordancia exacta y que no garantizan aparecer en una conversación concreta. También se puede segmentar por país, plataforma y, donde esté disponible, región, ciudad o código postal.',
  },
  {
    question: '¿Quién ve los anuncios de ChatGPT?',
    answer: 'Solo personas en los planes Gratis y Go. No hay anuncios en Plus, Pro, Business ni Enterprise, ni en cuentas identificadas como de menores de 18 años. Por eso quien revise la campaña desde una cuenta Plus no la verá, aunque esté activa.',
  },
  {
    question: '¿ChatGPT Ads sirve para empresas B2B?',
    answer: 'Todavía no está demostrado. La prueba B2B más detallada que encontramos, de la agencia Workshop Digital, invirtió 2.319 dólares y obtuvo 739 clics y ningún lead calificado. Además, las personas en planes de pago, frecuentes en empresas, no ven anuncios. Conviene tratarlo como una prueba de bajo presupuesto, no como un canal principal.',
  },
  {
    question: '¿Se paga por conversión en ChatGPT Ads?',
    answer: 'No. El objetivo de conversiones optimiza la entrega hacia un evento, como enviar un formulario, pero se factura por clic válido o por impresión. Además requiere tener instalado el píxel o la API de conversiones y hoy solo admite eventos estándar, uno por campaña.',
  },
  {
    question: '¿Cuánto tiempo y presupuesto necesita una prueba de ChatGPT Ads?',
    answer: 'Recomendamos al menos 4 semanas y presupuesto suficiente para unos 20 leads, un criterio nuestro. Con un clic de 3 a 5 dólares y una página que convierte 5%, eso equivale a entre 1.200 y 2.000 dólares. Es un ejemplo con supuestos: en Chile aún no hay datos públicos de costo.',
  },
]

export const metadata: Metadata = createMetadata({
  title: TITULO_SEO,
  description: DESCRIPCION,
  keywords: [
    'chatgpt ads chile',
    'anunciar en chatgpt chile',
    'agencia chatgpt ads chile',
    'publicidad en chatgpt',
    'chatgpt ads vs google ads',
    'cuánto cuesta anunciar en chatgpt',
    'gestor de anuncios chatgpt',
    'políticas publicidad chatgpt',
    'indicaciones contextuales chatgpt',
  ],
  path: '/blog/chatgpt-ads-chile-guia-agencia',
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

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{children}</a>
}

function Int({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="text-blue-700 underline">{children}</Link>
}

function Lista({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700 mb-8">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
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

const INDICE = [
  ['que-es', '¿Qué es ChatGPT Ads?'],
  ['chile', '¿Se puede anunciar desde Chile?'],
  ['requisitos', '¿Qué se necesita para partir?'],
  ['rubros', '¿Qué rubros pueden anunciar?'],
  ['paso-a-paso', '¿Cómo se crea una campaña?'],
  ['costos', '¿Cuánto cuesta?'],
  ['indicaciones', '¿Cómo se escriben las indicaciones y los anuncios?'],
  ['google', '¿Cómo se compara con Google Ads?'],
  ['medicion', '¿Cómo se mide bien?'],
  ['geo', '¿En qué se diferencia del GEO?'],
  ['para-quien', '¿Para quién conviene hoy?'],
  ['metodologia', 'Metodología de prueba de 4 semanas'],
  ['errores', 'Errores que conviene evitar'],
  ['agencia', '¿Cómo elegir una agencia?'],
  ['faq', 'Preguntas frecuentes'],
  ['fuentes', 'Fuentes'],
]

export default function ChatGPTAdsChilePage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Blog', url: 'https://www.mulleryperez.cl/blog' },
    { name: 'ChatGPT Ads en Chile', url: URL_ARTICULO },
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
    datePublished: '2026-11-02T12:00:00.000-03:00',
    dateModified: '2026-11-02T20:00:00.000-03:00',
    author: {
      '@type': 'Person',
      name: 'Christopher Muller',
      url: 'https://www.mulleryperez.cl',
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
    articleSection: 'Guías',
    inLanguage: 'es-CL',
    citation: Object.values(F),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />

      <article className="min-h-screen bg-white">
        <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <nav className="text-slate-400 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-white">ChatGPT Ads en Chile</span>
            </nav>
            <div className="inline-block px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm mb-4">
              Guía &middot; Publicidad en inteligencia artificial
            </div>
            <SpeakableContent>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{H1}</h1>
              <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                Chile ya tiene acceso al Gestor de anuncios de OpenAI. Esta guía explica los requisitos, el proceso,
                los rubros que quedan fuera, qué dicen los datos frente a Google Ads y cómo probarlo sin apostar a ciegas.
              </p>
            </SpeakableContent>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span>2 de noviembre de 2026</span>
              <span>&middot;</span>
              <span>21 min de lectura</span>
              <span>&middot;</span>
              <span>Por Christopher Muller</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 max-w-4xl py-12">
          <div className="prose prose-lg max-w-none">

            <div className="bg-slate-50 border-l-4 border-slate-600 p-6 rounded-r-xl mb-8">
              <p className="text-lg font-bold text-gray-900 mb-3">En resumen</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Disponibilidad:</strong> Chile tiene autoservicio disponible, según OpenAI.</li>
                <li><strong>Mínimo:</strong> 3.750 pesos diarios si la cuenta factura en CLP.</li>
                <li><strong>Quedan fuera en Chile:</strong> servicios jurídicos y, por lo general, financieros y de salud, entre otros.</li>
                <li><strong>Frente a Google:</strong> en las dos comparaciones publicadas de un mismo anunciante, Google convirtió mejor. La evidencia es poca y no encontramos datos de Chile.</li>
                <li><strong>Nuestra recomendación:</strong> una prueba de 4 semanas con presupuesto adicional, medida por costo de lead calificado.</li>
              </ul>
            </div>

            <SpeakableContent>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Más de 1.200 millones de personas usan ChatGPT cada semana, según OpenAI, y parte de ese uso es
                comparar opciones antes de comprar. Desde octubre de 2026, las empresas chilenas pueden pagar por
                aparecer debajo de esas respuestas. La pregunta útil no es si la plataforma es novedosa, sino si
                conviene ponerle plata hoy y cómo saberlo.
              </p>
            </SpeakableContent>

            <P>
              <strong>Cómo armamos esta guía.</strong> El 2 de noviembre de 2026 leímos directamente los anuncios, las
              políticas y el centro de ayuda de OpenAI, además de las pruebas publicadas por otros anunciantes. Marcamos
              qué es oficial y qué viene de terceros, y lo que es criterio nuestro lo decimos. La plataforma está en beta
              y OpenAI advierte que seguirá cambiando, así que conviene revisar las políticas antes de lanzar. En M&amp;P
              aún no tenemos resultados propios de ChatGPT Ads que mostrar. Cuando los tengamos, los publicaremos con
              sus cifras.
            </P>

            <nav aria-label="Índice" className="border border-slate-200 rounded-xl p-6 mb-8">
              <p className="text-lg font-bold text-gray-900 mb-3">Índice</p>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                {INDICE.map(([id, texto]) => (
                  <li key={id}><a href={`#${id}`} className="text-blue-700 hover:underline">{texto}</a></li>
                ))}
              </ol>
            </nav>

            <H2 id="que-es">¿Qué es ChatGPT Ads y dónde aparecen los anuncios?</H2>
            <P>
              Es la plataforma publicitaria de OpenAI. Los anuncios aparecen <Ext href={F.basicos}>debajo de las respuestas
              de ChatGPT</Ext>, marcados como anuncio y separados del texto. Cada uno muestra el nombre del anunciante, su
              logo, un título, una descripción, una imagen y un enlace. <Ext href={F.anuncio}>OpenAI informa</Ext> más de
              100.000 anunciantes y presencia en 89 países.
            </P>
            <H3>¿Quién los ve y quién no?</H3>
            <Lista items={[
              <><strong>Los ven:</strong> personas en los planes Gratis y Go.</>,
              <><strong>No los ven:</strong> quienes usan Plus, Pro, Business o Enterprise, ni las cuentas identificadas como de menores de 18 años.</>,
              <><strong>No aparecen en contextos sensibles:</strong> las <Ext href={F.politicas}>políticas</Ext> los excluyen de temas como salud mental, autolesiones, contenido político o seguridad infantil.</>,
            ]} />
            <P>
              Esto tiene dos consecuencias prácticas. Parte del público profesional queda fuera de alcance, porque usa planes
              de pago en el trabajo. Y quien revise la campaña desde una cuenta Plus no la va a ver, aunque esté activa.
            </P>
            <H3>¿Cómo decide ChatGPT qué anuncio mostrar?</H3>
            <P>
              El sistema considera el contexto y la intención de la conversación, la página de destino, el título, el texto y
              las indicaciones que entrega el anunciante. Si la persona tiene activada la personalización, suma señales de su
              uso de ChatGPT. Entre los anuncios elegibles, OpenAI usa una <Ext href={F.basicos}>subasta de segundo precio
              ponderada por relevancia</Ext>: tu puja fija un tope, pero la competencia y la relevancia definen lo que pagas.
              OpenAI no publica la fórmula de esa ponderación.
            </P>
            <P>
              OpenAI también declara que la publicidad no influye en las respuestas y que las conversaciones se mantienen
              privadas frente a los anunciantes. Un anunciante no recibe el texto de lo que conversó cada persona.
            </P>

            <H2 id="chile">¿Se puede anunciar en ChatGPT desde Chile?</H2>
            <P>
              Sí. La <Ext href={F.disponibilidad}>página de disponibilidad de OpenAI</Ext> marca a Chile como disponible para
              autoservicio, igual que a Argentina, Colombia, México y Perú. <Ext href={F.anuncio}>El anuncio del 21 de
              octubre</Ext> confirma a Chile entre los 14 países nuevos de Latinoamérica, y <Ext href={F.itsitio}>la prensa
              regional</Ext> detalla el resto.
            </P>
            <Lista items={[
              <><strong>Dos vías de entrada:</strong> por cuenta propia en el Gestor de anuncios, en ads.openai.com, o a través de socios tecnológicos.</>,
              <><strong>Condición oficial:</strong> la entidad legal que anuncia y factura debe estar en un país disponible, y no se puede falsear la ubicación de la empresa.</>,
              <><strong>Si también vendes afuera:</strong> <Ext href={F.campanas}>algunas cuentas nuevas</Ext> solo pueden anunciar al comienzo en su país de origen. Se habilitan para otros mercados cuando se aprueba la verificación de identidad y alcanzan el gasto requerido en su país.</>,
            ]} />
            <P>
              Disponible no significa con mucho volumen. No encontramos cifras públicas de usuarios en planes Gratis y Go en
              Chile ni de impresiones disponibles. Saber si la campaña entrega en tu rubro es lo primero que responde una prueba.
            </P>

            <H2 id="requisitos">¿Qué se necesita para empezar a anunciar en ChatGPT?</H2>
            <P>
              Según la <Ext href={F.inicio}>guía de inicio de OpenAI</Ext>, la cuenta se prepara en este orden:
            </P>
            <Lista items={[
              <>Entrar con una cuenta de OpenAI ligada al correo de trabajo, o crear una nueva.</>,
              <>Cargar el logo de la marca en la configuración.</>,
              <>Crear el perfil de facturación y agregar un medio de pago.</>,
              <>Completar la verificación de la cuenta. Sin ella, los anuncios pueden no publicarse.</>,
              <>Invitar a quienes necesiten acceso, por ejemplo la agencia.</>,
            ]} />
            <P>
              Si tu empresa ya tiene un espacio de OpenAI y el sistema no te deja crear la cuenta publicitaria, <Ext href={F.problemas}>hay
              que pedirle al administrador</Ext> el rol Ads Admin. Conviene dejar claro desde el comienzo quién será dueño de
              la cuenta: lo sano es que quede a nombre de la empresa que invierte.
            </P>

            <H2 id="rubros">¿Qué rubros pueden anunciar en ChatGPT en Chile?</H2>
            <P>
              Esto se revisa antes que cualquier presupuesto, porque descarta a varias industrias de entrada. El cuadro resume
              las <Ext href={F.politicas}>políticas actualizadas al 10 de septiembre de 2026</Ext>:
            </P>
            <Tabla
              cabecera={['Rubro', 'Situación en Chile', 'Detalle']}
              filas={[
                ['Hogar y consumo, servicios locales, viajes y entretenimiento, productos digitales y educación', 'Foco actual', 'Son las categorías que OpenAI prioriza en esta etapa.'],
                ['Servicios jurídicos', 'Prohibido', 'Solo se permiten en EE. UU. Incluye asesoría, representación, reclamaciones y preparación de documentos.'],
                ['Servicios financieros', 'Prohibido por lo general', 'Fuera de EE. UU. Alcanza a crédito, seguros, hipotecas e inversiones. Una app de presupuesto o un curso sin servicio financiero suelen estar permitidos.'],
                ['Salud y medicina', 'Prohibido por lo general', 'Fuera de EE. UU. El bienestar general sin afirmaciones médicas puede estar permitido.'],
                ['Inmobiliario', 'Con restricción', 'No se puede anunciar una vivienda concreta en venta o arriendo. Sí se puede enlazar a una plataforma, si ni el anuncio ni la página de destino mencionan una oferta concreta.'],
                ['Empleo', 'Con restricción', 'Misma regla: no se permiten ofertas de empleo concretas.'],
                ['Alcohol, tabaco y vapeo, apuestas, política, drogas recreativas, contenido para adultos', 'Prohibido', 'La regla alcanza también a la página de destino.'],
                ['Servicios B2B', 'Sin mención expresa', 'Las categorías publicadas apuntan al consumo. Hay que validarlo enviando un anuncio a revisión antes de planificar.'],
              ]}
            />
            <P>
              La <Ext href={F.politicas}>revisión</Ext> cubre el título, el texto, la imagen y la página de destino, y se hace
              principalmente con sistemas automáticos con supervisión humana. Un anuncio aceptable que lleva a una página con
              contenido no permitido se rechaza. OpenAI también se reserva el derecho de rechazar anuncios por su posición
              competitiva, de modo que tampoco conviene contar con esta vía para productos que compitan con los suyos.
            </P>
            <P>
              Si tu rubro queda fuera, hay otros canales: <Int href="/servicios/google-ads-chile">Google Ads</Int> o{' '}
              <Int href="/servicios/meta-ads-chile">Meta Ads</Int> para la pauta, y{' '}
              <Int href="/servicios/geo-chile">GEO</Int> para buscar que ChatGPT te recomiende de forma orgánica.
            </P>

            <H2 id="paso-a-paso">¿Cómo se crea una campaña en ChatGPT Ads, paso a paso?</H2>
            <P>
              La estructura tiene tres niveles: campaña, grupo de anuncios y anuncio. Estos pasos vienen de las guías oficiales
              para <Ext href={F.lanzar}>lanzar</Ext> y <Ext href={F.campanas}>crear campañas</Ext>.
            </P>
            <H3>1. Elegir el objetivo</H3>
            <Lista items={[
              <><strong>Vistas (CPM):</strong> pagas por cada 1.000 impresiones. Sirve para dar a conocer una marca.</>,
              <><strong>Clics (CPC):</strong> pagas por cada clic válido hacia tu sitio.</>,
              <><strong>Conversiones:</strong> el sistema optimiza hacia un evento, pero <Ext href={F.conversiones}>no pagas por conversión</Ext>. Se factura por clic (oCPC) o por impresión (oCPM).</>,
            ]} />
            <P>
              El objetivo no se cambia después de crear la campaña, y lo mismo pasa con el evento de conversión. Para optimizar
              a conversiones hace falta el píxel o la API de conversiones instalados, y hoy solo se admiten eventos estándar,
              uno por campaña.
            </P>
            <H3>2. Definir presupuesto, fechas y ubicación</H3>
            <P>
              El presupuesto puede ser total o diario. OpenAI sugiere a quienes parten usar el diario, para observar la entrega
              antes de comprometer un total. Además del país, se puede apuntar a región, ciudad o código postal donde esté
              disponible, y por plataforma: apps de iOS y Android, web móvil y web de escritorio.
            </P>
            <P>
              Un detalle fácil de pasar por alto: en la primera campaña puede no aparecer la opción de fechas antes de publicar.
              Si necesitas una fecha exacta de inicio, no publiques solo para llegar a ese ajuste, porque los anuncios podrían
              partir apenas se aprueben.
            </P>
            <H3>3. Armar los grupos de anuncios</H3>
            <P>
              Cada grupo debe responder a una necesidad distinta, con su mensaje y su página. <Ext href={F.grupos}>El ejemplo de
              OpenAI</Ext> es una empresa de gasfitería que separa reparaciones de emergencia y mantención preventiva. Aquí se
              escriben las indicaciones contextuales y se fija la puja máxima.
            </P>
            <H3>4. Crear los anuncios</H3>
            <Lista items={[
              <><strong>Título:</strong> se recomiendan 16 a 24 caracteres; máximo 50.</>,
              <><strong>Texto:</strong> se recomiendan 32 a 48 caracteres; máximo 100.</>,
              <><strong>Imagen:</strong> PNG o JPG cuadrada, de hasta 1200 × 1200.</>,
              <><strong>Varias imágenes:</strong> <Ext href={F.anuncios}>beta abierta desde el 26 de octubre</Ext>, con 4 a 6 imágenes cuadradas y un solo destino.</>,
            ]} />
            <H3>5. Preparar el sitio y el seguimiento</H3>
            <Lista items={[
              <>La página no debe bloquear a los rastreadores <strong>OAI-AdsBot</strong> ni <strong>OAI-SearchBot</strong>. Hay que revisar robots.txt y el firewall: un bloqueo es causa común de rechazo.</>,
              <>Agrega etiquetas UTM a cada URL de destino, para ver la fuente en tu analítica y tu CRM.</>,
              <>Enlaza a la página más específica posible, no a la portada. Una <Int href="/servicios/cro-chile">página pensada para convertir</Int> pesa más cuando el clic viene de alguien que aún está explorando.</>,
            ]} />
            <H3>6. Publicar y pasar la revisión</H3>
            <P>
              Se puede crear todo con el flujo guiado o con una carga masiva por CSV. Si un anuncio queda como “No se publica”,
              el motivo aparece al pasar el cursor sobre el estado, y <Ext href={F.problemas}>se puede corregir y reenviar</Ext>.
            </P>
            <H3>7. Leer las primeras señales</H3>
            <P>
              <Ext href={F.lanzar}>OpenAI indica</Ext> que una campaña activa debería recibir impresiones y clics dentro de 24
              horas. <Ext href={F.basicos}>Impresiones, clics y CTR</Ext> se actualizan cada 15 minutos aproximadamente, pero el
              gasto puede tardar de 7 a 8 horas en verse. Un gasto en cero con clics a la vista no significa que no haya cobro.
            </P>

            <H2 id="costos">¿Cuánto cuesta anunciar en ChatGPT?</H2>
            <P>
              No hay precio de lista. Se paga lo que determina la subasta, y <Ext href={F.faq}>OpenAI reconoce</Ext> que todavía
              no tiene referencias de rendimiento por anunciante, industria o tipo de campaña. Esto es lo que sí está publicado:
            </P>
            <Tabla
              cabecera={['Dato', 'Valor', 'Fuente']}
              filas={[
                ['Presupuesto diario mínimo en CLP', '3.750 CLP', <Ext key="a" href={F.campanas}>OpenAI</Ext>],
                ['Presupuesto diario mínimo en USD', '25 USD', <Ext key="b" href={F.campanas}>OpenAI</Ext>],
                ['Puja inicial recomendada por clic', '3 a 5 USD', <Ext key="c" href={F.basicos}>OpenAI</Ext>],
                ['Puja recomendada para conversiones', 'Sin monto recomendado', <Ext key="d" href={F.conversiones}>OpenAI</Ext>],
                ['CPC observado por distintos anunciantes', '3 a 22 USD', <Ext key="e" href={F.airops}>Search Engine Journal, vía AirOps</Ext>],
                ['CPM al lanzamiento y en abril de 2026', '60 USD y desde 25 USD', <Ext key="f" href={F.digiday}>Digiday, relatos de agencias</Ext>],
                ['Compromiso mínimo del piloto', 'De 250.000 a 50.000 USD, ya reemplazado por autoservicio', <Ext key="g" href={F.digiday}>Digiday</Ext>],
              ]}
            />
            <P>
              La diferencia entre el mínimo en pesos y en dólares es grande. Aparece así en la tabla oficial, y conviene
              comprobarlo al abrir la cuenta. Además, los valores en dólares vienen sobre todo de Estados Unidos. No encontramos
              un costo por clic publicado para Chile, así que no conviene presupuestar como si fuera un dato local.
            </P>
            <H3>¿Cómo funciona el presupuesto diario?</H3>
            <P>
              El <Ext href={F.presupuesto}>presupuesto diario</Ext> es un promedio semanal, no un tope por día. Un día puede
              gastar hasta el doble, y la semana, que va de domingo a sábado, no supera siete veces el monto. Por ejemplo, con
              $10.000 diarios un día puede gastar hasta $20.000, y la semana no pasa de $70.000. Si se usa todo temprano, la
              campaña puede detenerse hasta la semana siguiente aunque siga marcada como activa.
            </P>
            <P>
              Fija el monto pensando en que un día puede salir el doble. Con pujas fijas, el presupuesto diario tampoco puede ser
              menor que la puja más alta de los grupos de anuncios. Para ubicar este gasto dentro del total, sirve nuestra guía
              de <Int href="/blog/presupuesto-marketing-digital-chile-2025">presupuesto de marketing digital en Chile</Int>.
            </P>

            <H2 id="indicaciones">¿Cómo se escriben las indicaciones contextuales y los anuncios?</H2>
            <P>
              Aquí está la mayor diferencia con Google. En vez de comprar palabras clave se escriben{' '}
              <Ext href={F.grupos}>indicaciones contextuales</Ext>, que <Ext href={F.basicos}>describen conversaciones, temas o
              términos</Ext> donde tu oferta es relevante. No son concordancia exacta ni reglas de segmentación, y no garantizan
              aparecer en una conversación determinada.
            </P>
            <Tabla
              cabecera={['Rubro de ejemplo', 'Demasiado amplia', 'Más específica']}
              filas={[
                ['Instituto de cursos', 'cursos online', 'curso de análisis de datos para personas que trabajan y estudian de noche en Santiago'],
                ['Hotel en el sur', 'vacaciones en Chile', 'hotel familiar en Puerto Varas para viajar en verano con niños chicos'],
                ['Tienda de hogar', 'muebles', 'escritorio para trabajar desde casa en un departamento pequeño'],
              ]}
            />
            <P>
              Son ejemplos nuestros, no resultados. <Ext href={F.workshop}>La prueba de Workshop Digital</Ext> es lo más concreto
              que encontramos sobre qué funciona, con 2.319 dólares invertidos en un solo anunciante B2B en inglés. Vale como
              hipótesis para probar, no como regla:
            </P>
            <Tabla
              cabecera={['Qué se probó', 'Resultado', 'Lectura']}
              filas={[
                ['Indicaciones con términos específicos vs conversacionales', 'CTR 1,2% vs 0,9%, con CPC casi igual', 'Lo específico atrajo más clics.'],
                ['Marca al inicio del título vs sin marca', 'CPC 3,07 vs 3,30 USD; CTR 1,1% vs 1,0%', 'Diferencia chica, y su marca incluye la palabra “Digital”.'],
                ['Imagen del sector vs gráfica genérica', 'CTR 1,2% vs 0,9%; CPC 3,07 vs 3,37 USD', 'La imagen ligada al público rindió mejor.'],
                ['Fotografía de estilo de vida', 'CTR 1,1%; CPC 3,10 USD', 'Cerca de la imagen del sector.'],
              ]}
            />
            <P>Sumando esa prueba y las <Ext href={F.anuncios}>recomendaciones de OpenAI</Ext>, partiríamos así:</P>
            <Lista items={[
              <><strong>Lo importante va primero.</strong> Workshop Digital vio textos cortados antes de lo esperado, aun dentro del límite de caracteres.</>,
              <><strong>Di para quién es.</strong> Con poco control de segmentación, el texto filtra: “Cursos de datos para quien trabaja” deja fuera a quien no corresponde y ahorra clics.</>,
              <><strong>Haz varias variantes distintas.</strong> OpenAI pide varios títulos y textos por oferta, con enfoques diferentes y no el mismo mensaje reescrito.</>,
              <><strong>No copies la voz de ChatGPT.</strong> Las políticas prohíben imitar su interfaz o su forma de responder.</>,
              <><strong>Respalda cada afirmación.</strong> Las promesas exageradas de resultados o precios se rechazan en cualquier rubro.</>,
            ]} />

            <H2 id="google">¿Cómo se compara ChatGPT Ads con Google Ads?</H2>
            <P>
              Comparar con justicia exige separar dos cosas: cómo funciona cada plataforma, que está documentado, y cuánto rinde,
              donde la evidencia todavía es débil.
            </P>
            <H3>¿En qué se diferencia su funcionamiento?</H3>
            <Tabla
              cabecera={['Aspecto', 'ChatGPT Ads', 'Google Ads (Búsqueda)']}
              filas={[
                ['Qué activa el anuncio', 'Intención de la conversación y otras señales, orientado por indicaciones', 'Palabras clave que la persona busca'],
                ['Momento', 'Exploración y comparación, a veces antes de saber qué buscar', 'Búsqueda activa, a menudo con intención declarada'],
                ['Control', 'Menor: sin concordancia exacta. Las frases negativas solo para anunciantes que califican', 'Mayor: tipos de concordancia y palabras negativas'],
                ['Audiencia', 'Solo planes Gratis y Go', 'Quienes usan el buscador de Google'],
                ['Madurez', 'Beta, poco más de 8 meses desde el lanzamiento', 'Plataforma con décadas de uso'],
                ['Referencias en Chile', 'No encontramos datos públicos', <Int key="g" href="/blog/cuanto-cuesta-google-ads-chile-2026">Hay datos locales de costos</Int>],
              ]}
            />
            <H3>¿Qué dicen los datos de rendimiento?</H3>
            <P>
              OpenAI no publica promedios. Lo que existe son pruebas individuales y un panel, casi todo de Estados Unidos.{' '}
              <Ext href={F.airops}>AirOps</Ext> las recopiló y advierte que los números rara vez miden lo mismo:
            </P>
            <Tabla
              cabecera={['Fuente', 'ChatGPT', 'Google', 'Cómo leerlo']}
              filas={[
                [<Ext key="w" href={F.workshop}>Workshop Digital, agosto de 2026</Ext>, 'CTR 1,06%, CPC 3,14 USD, 739 clics, 0 leads calificados', 'CTR 5,2%, CPC 6,76 USD, 2 leads calificados', 'Mismo anunciante, B2B, con su propio dinero. Los autores avisan que la comparación es imperfecta.'],
                [<Ext key="s" href={F.airops}>StubGroup, vía AirOps</Ext>, 'Conversión 0,21%', 'Conversión 3,71%', 'Mismo anunciante. La agencia del autor vende campañas en ChatGPT.'],
                [<Ext key="g" href={F.graphite}>Graphite y Similarweb, septiembre de 2026</Ext>, 'CTR 0,73% por respuesta con anuncio', 'Sin dato', 'Panel de EE. UU. La base es otra: no se compara con CTR por impresión.'],
                [<Ext key="m" href={F.wordstream}>WordStream y LocaliQ, 13.474 campañas</Ext>, 'Sin dato', 'CTR 6,64%, CPC 5,42 USD, conversión 8,18%', 'Medianas de EE. UU., mezclan Google y Microsoft Ads.'],
                [<Ext key="o" href={F.medicion}>OpenAI, octubre de 2026</Ext>, 'WeightWatchers: costo por adquisición atribuido 15,3% menor que su búsqueda pagada', 'Es la referencia del anunciante', 'Socio elegido y publicado por OpenAI, sin gasto ni fechas. Atribuido, no causal.'],
              ]}
            />
            <P>
              OpenAI también cita a Dose, con 67% de las compras incrementales desde clientes nuevos, y a Portland Leather, con
              93% de visitantes nuevos desde los anuncios. Son señales de que puede llegar a público nuevo, pero no dicen cuánto
              costó. Varias de estas fuentes venden publicidad o herramientas de medición, así que hay que leerlas con cautela.
              Los costos también se mueven: <Ext href={F.sej}>Search Engine Journal</Ext> reunió pruebas con CPC de 10,62 dólares
              en EE. UU., por sobre la mediana de Google. No hay una respuesta única.
            </P>
            <H3>¿Qué cuenta más: el clic barato o el costo por conversión?</H3>
            <P>
              El costo por conversión. Se calcula dividiendo el costo por clic por la tasa de conversión, y es el número que se
              puede comparar entre plataformas:
            </P>
            <Tabla
              cabecera={['Escenario', 'CPC', 'Conversión', 'Costo por conversión']}
              filas={[
                ['Google, mediana de WordStream (EE. UU.)', '5,42 USD', '8,18%', '66 USD aprox.'],
                ['ChatGPT, ilustración de AirOps con la tasa de StubGroup', '3,00 USD', '0,21%', '1.429 USD aprox.'],
                ['Tu cuenta', 'Tu CPC', 'Tu conversión', 'CPC ÷ conversión'],
              ]}
            />
            <P>
              La segunda fila es un cálculo que combina un clic barato con una sola tasa baja, no un promedio del canal. Sirve
              para mostrar que un clic 45% más barato puede resultar muchísimo más caro al final. Si quieres repasar el concepto,
              revisa <Int href="/blog/que-es-cac-como-calcularlo-reducirlo">cómo calcular el CAC</Int> y{' '}
              <Int href="/blog/como-aumentar-conversiones-google-ads">cómo aumentar conversiones en Google Ads</Int>.
            </P>
            <P>
              <strong>Nuestra lectura:</strong> un clic más barato no significa un cliente más barato. Google captura a quien ya
              declaró lo que busca, y ChatGPT llega a quien todavía investiga, algo más parecido a una mezcla entre búsqueda y
              redes sociales, como lo describe Workshop Digital. Eso no descarta el canal: en compras largas podría influir antes
              de la búsqueda en Google. Pero hoy no hay evidencia independiente que lo demuestre. Si estás decidiendo entre
              canales ya probados, parte por{' '}
              <Int href="/blog/google-ads-vs-meta-ads-chile-2026">Google Ads vs Meta Ads en Chile</Int>.
            </P>

            <H2 id="medicion">¿Cómo se mide bien una campaña en ChatGPT?</H2>
            <P>
              La medición es donde más se equivoca una prueba nueva. Estas son las herramientas disponibles y sus límites:
            </P>
            <Lista items={[
              <><strong>UTM:</strong> <Ext href={F.basicos}>se mantienen en el clic</Ext> y permiten ver el tráfico en tu analítica.</>,
              <><strong>Píxel y API de conversiones:</strong> envían los eventos al Gestor. <Ext href={F.medicion}>Hay integraciones</Ext> con herramientas como AppsFlyer, Triple Whale y Northbeam.</>,
              <><strong>Conversiones posteriores a la impresión:</strong> la <Ext href={F.conversiones}>facturación por impresiones</Ext> optimiza también hacia conversiones de quien vio el anuncio sin hacer clic. Hay que mirarlas con cuidado, porque pueden sumar compras que habrían ocurrido igual.</>,
              <><strong>Incrementalidad:</strong> mide cuánto se vendió que no se habría vendido sin el anuncio. <Ext href={F.medicion}>OpenAI reconoce</Ext> que su trabajo aquí está en una fase temprana.</>,
            ]} />
            <P>
              Una trampa concreta: los <Ext href={F.basicos}>rastreadores de revisión</Ext> visitan las páginas con sus parámetros,
              y tu analítica puede contarlos como tráfico pagado, aunque esas visitas no se cobran. Por eso, antes de sacar
              conclusiones, compara los clics del Gestor con las visitas de tu analítica.
            </P>
            <P>
              Lo que más importa no está en el Gestor: cuántos de esos leads eran el cliente correcto y cuántos compraron. Marca
              la fuente en el CRM y compara por lead calificado. Más detalle en nuestra guía de{' '}
              <Int href="/blog/atribucion-metricas-chile-2025">atribución y métricas</Int>.
            </P>

            <H2 id="geo">¿En qué se diferencian los anuncios en ChatGPT del GEO?</H2>
            <P>
              Se confunden a menudo y son dos compras distintas.
            </P>
            <Tabla
              cabecera={['', 'ChatGPT Ads', 'GEO']}
              filas={[
                ['Qué es', 'Espacio pagado bajo la respuesta, marcado como anuncio', 'Lograr que el asistente te recomiende en la respuesta'],
                ['Depende de', 'Presupuesto, puja y relevancia', 'Tu contenido, tus menciones en otros sitios y lo que dicen las fuentes'],
                ['Cuándo se detiene', 'Al acabarse el presupuesto', 'Se acumula, aunque puede variar entre respuestas'],
                ['Rubros prohibidos', 'Quedan fuera', 'Sin esa restricción publicitaria'],
                ['Quién lo ve', 'Solo planes Gratis y Go', 'También planes de pago'],
              ]}
            />
            <P>
              Como OpenAI declara que la publicidad no influye en las respuestas, una campaña no debería mejorar tu posición
              orgánica. Las dos cosas se pueden cruzar: en un <Ext href={F.airops}>estudio de AirOps</Ext> sobre 2,8 millones de
              respuestas acerca de 131 marcas de fintech en EE. UU., 7,35% llevaba anuncio en promedio y cerca de 53% en la última
              semana. Y cuando la respuesta mencionaba marcas, el anuncio solía ser de un competidor. Es una categoría específica
              y de otro país, pero anticipa el riesgo: que te recomienden y que justo debajo aparezca tu competencia.
            </P>
            <P>
              Una medición honesta de GEO también exige mirar ChatGPT de verdad y repetir cada pregunta, porque las respuestas
              varían entre una vez y otra. Es lo que trabajamos en <Int href="/servicios/geo-chile">GEO en Chile</Int>, junto con
              el <Int href="/servicios/seo-chile">SEO</Int> que le sirve de base, y lo automatizamos con{' '}
              <Int href="/agentes-ia">agentes de IA</Int>.
            </P>

            <H2 id="para-quien">¿Para quién conviene ChatGPT Ads hoy?</H2>
            <P>Esta es nuestra lectura, a partir de las políticas y las pruebas publicadas:</P>
            <Tabla
              cabecera={['Tipo de empresa', 'Recomendación', 'Por qué']}
              filas={[
                ['Consumo, viajes, educación, productos digitales y servicios locales', 'Probar', 'Son las categorías priorizadas y su público suele usar planes gratuitos.'],
                ['Software con plan gratuito', 'Probar', 'Sus compradores suelen estar en planes gratuitos, según AirOps.'],
                ['B2B con venta consultiva', 'Probar poco, o esperar', 'Sin leads en la prueba publicada, y parte del público usa planes de pago.'],
                ['Inmobiliarias y portales', 'Revisar antes', 'No se pueden anunciar propiedades concretas.'],
                ['Abogados, clínicas y servicios financieros', 'No aplica hoy en Chile', 'Prohibidos o casi. Conviene trabajar el GEO.'],
                ['Empresas sin medición de leads', 'Primero ordenar', 'Sin CRM ni seguimiento, la prueba no permite concluir nada.'],
              ]}
            />

            <H2 id="metodologia">¿Cómo probar ChatGPT Ads sin perder plata? Metodología de 4 semanas</H2>
            <P>
              Esta es la prueba que proponemos en M&amp;P. Los umbrales son criterio nuestro, no reglas de OpenAI, y se ajustan
              según el negocio. <Ext href={F.airops}>AirOps</Ext> recomienda algo parecido: tratar el gasto inicial como
              investigación y fijar la regla de corte antes de partir.
            </P>
            <H3>Antes de partir</H3>
            <Lista items={[
              <><strong>Confirma que tu rubro califica,</strong> tanto en el anuncio como en la página de destino.</>,
              <><strong>Calcula tu referencia:</strong> el costo por lead calificado actual en Google, con datos del CRM y no de la plataforma.</>,
              <><strong>Mira si ChatGPT ya te manda visitas:</strong> revisa ese tráfico en tu analítica. Es una señal de que tus clientes lo usan.</>,
              <><strong>Deja listo el seguimiento:</strong> UTM, píxel o API de conversiones, y una forma de marcar en el CRM los leads que vengan de ChatGPT.</>,
              <><strong>Trabaja con presupuesto adicional:</strong> no le quites inversión a Google durante la prueba, o no sabrás qué causó el cambio.</>,
              <><strong>Escribe la regla de decisión antes de lanzar,</strong> para no acomodarla después a los resultados.</>,
            ]} />
            <H3>¿Cómo se calcula el presupuesto?</H3>
            <P>
              La fórmula es: <strong>presupuesto = leads necesarios × (CPC ÷ tasa de conversión de la página)</strong>. Un ejemplo
              con supuestos, no con resultados: con un CPC de 3 a 5 dólares y una página que convierte 5%, cada lead cuesta de 60 a
              100 dólares, y juntar 20 leads requiere de 1.200 a 2.000 dólares. Si la conversión real fuera más baja, el costo
              sube en proporción: con 1%, serían de 300 a 500 dólares por lead. Si tu presupuesto no alcanza, alarga la prueba o
              concéntrala en un solo servicio. También puedes estimar el costo esperado con nuestro{' '}
              <Int href="/predictor">predictor de campañas</Int>.
            </P>
            <H3>¿Qué se hace cada semana?</H3>
            <Tabla
              cabecera={['Semana', 'Qué hacer', 'Qué mirar']}
              filas={[
                ['1', 'Objetivo de clics, 2 o 3 grupos por necesidad y varias variantes. Sin audiencias personalizadas: incluirlas exige 25.000 usuarios coincidentes.', 'Si entrega: aprobación, impresiones y volumen real en Chile.'],
                ['2', 'Pausar lo que no recibe clics y reescribir indicaciones. Comparar clics con visitas en la analítica.', 'CTR y CPC por grupo, y calidad de la visita.'],
                ['3', 'Concentrar en los mejores grupos. Si hay conversiones suficientes, abrir una campaña nueva con objetivo de conversión, porque el objetivo no se cambia en la misma.', 'Costo por lead y primeros leads en el CRM.'],
                ['4', 'Mantener estable para leer sin ruido y cerrar la comparación.', 'Costo por lead calificado frente a Google.'],
              ]}
            />
            <H3>¿Cómo se decide al terminar?</H3>
            <Lista items={[
              <><strong>Seguir:</strong> el costo por lead calificado queda hasta 1,3 veces el de Google, o hay ventas que lo justifican.</>,
              <><strong>Alargar:</strong> hay menos de 20 leads, porque aún no se puede concluir.</>,
              <><strong>Pausar:</strong> hay clics suficientes y ningún lead calificado. Se vuelve a probar en unos meses, cuando la plataforma tenga más volumen y formatos.</>,
            ]} />
            <P>
              Si la prueba sale bien y el presupuesto lo permite, el siguiente paso es medir incrementalidad, por ejemplo apagando
              la campaña en una zona y comparando. Con presupuestos chicos es difícil lograrlo, y no hay que forzar conclusiones.
            </P>

            <H2 id="errores">¿Qué errores conviene evitar en ChatGPT Ads?</H2>
            <Lista items={[
              <><strong>Comparar solo el CPC.</strong> Un clic más barato con menos conversión puede salir mucho más caro.</>,
              <><strong>Comparar CTR de fuentes distintas.</strong> Uno se mide por respuesta y otro por impresión.</>,
              <><strong>Mover plata de Google antes de tener datos.</strong> Se arriesga lo que ya vende por algo sin probar.</>,
              <><strong>Creer que un anuncio mejora la recomendación orgánica.</strong> OpenAI declara que no influye.</>,
              <><strong>Publicar para “ver cómo queda”.</strong> Una vez aprobados, los anuncios pueden empezar a gastar.</>,
              <><strong>Bloquear a los rastreadores de OpenAI.</strong> La página no se podrá revisar y el anuncio no saldrá.</>,
              <><strong>Olvidar que el gasto llega tarde al informe.</strong> Puede demorar de 7 a 8 horas en verse.</>,
              <><strong>Copiar los consejos de EE. UU. como si fueran de Chile.</strong> Cambian los rubros permitidos, y también los costos.</>,
            ]} />

            <H2 id="agencia">¿Cómo elegir una agencia para ChatGPT Ads en Chile?</H2>
            <P>
              La operación se parece poco a una campaña de Búsqueda clásica. Lo que más cambia es escribir indicaciones y producir
              variantes, y lo que más cuesta es medir bien. Como la plataforma es nueva, todavía nadie en Chile puede mostrar años
              de experiencia. Si evalúas una agencia, pide esto:
            </P>
            <Lista items={[
              <>Que revise la elegibilidad de tu rubro antes de cotizar.</>,
              <>Que muestre resultados propios con cifras, o que reconozca que todavía no los tiene.</>,
              <>Que mida en tu CRM y no solo en el Gestor de anuncios.</>,
              <>Que deje la cuenta publicitaria a nombre de tu empresa.</>,
              <>Que no te prometa aparecer en las respuestas por comprar anuncios.</>,
              <>Que proponga una regla para detener la prueba antes de lanzarla.</>,
            ]} />
            <P>
              En M&amp;P partimos por probar en nuestra propia marca antes de ofrecerlo como servicio regular, con esta misma
              metodología. Mientras tanto, trabajamos esto dentro de una estrategia de{' '}
              <Int href="/servicios/performance-marketing">performance marketing</Int>, sumando el canal solo cuando se justifica.
              Para criterios más generales, revisa{' '}
              <Int href="/blog/como-elegir-agencia-google-ads-chile">cómo elegir una agencia de Google Ads en Chile</Int>.
            </P>

            <H2 id="faq">Preguntas frecuentes sobre ChatGPT Ads en Chile</H2>
            <div className="space-y-6 mb-12">
              {FAQS.map((faq) => (
                <div key={faq.question} className="border border-slate-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <H2 id="fuentes">Fuentes</H2>
            <p className="text-lg text-gray-700 mb-3"><strong>Oficiales de OpenAI</strong> (consultadas el 2 de noviembre de 2026):</p>
            <Lista items={[
              <Ext key="1" href={F.anuncio}>ChatGPT Anuncios llega a 26 nuevos países (21 de octubre de 2026)</Ext>,
              <Ext key="2" href={F.medicion}>Nuevo formato y medición (5 de octubre de 2026)</Ext>,
              <Ext key="3" href={F.politicas}>Políticas de publicidad (10 de septiembre de 2026)</Ext>,
              <Ext key="4" href={F.disponibilidad}>Disponibilidad del Gestor de anuncios por país</Ext>,
              <Ext key="5" href={F.basicos}>Conceptos básicos de los anuncios en ChatGPT</Ext>,
              <Ext key="6" href={F.inicio}>Guía de inicio: primera campaña</Ext>,
              <Ext key="7" href={F.campanas}>Crear campañas y presupuestos mínimos</Ext>,
              <Ext key="8" href={F.grupos}>Crear grupos de anuncios</Ext>,
              <Ext key="9" href={F.anuncios}>Crear anuncios</Ext>,
              <Ext key="10" href={F.conversiones}>Campañas optimizadas para conversiones</Ext>,
              <Ext key="11" href={F.presupuesto}>Presupuestos diarios</Ext>,
              <Ext key="12" href={F.lanzar}>Lanzar campañas</Ext>,
              <Ext key="13" href={F.problemas}>Resolver problemas comunes</Ext>,
              <Ext key="14" href={F.faq}>Preguntas frecuentes</Ext>,
            ]} />
            <p className="text-lg text-gray-700 mb-3"><strong>De terceros.</strong> Workshop Digital la leímos directo; el resto, según se indica. No las verificamos de forma independiente:</p>
            <Lista items={[
              <Ext key="15" href={F.workshop}>Workshop Digital: primera prueba B2B (26 de agosto de 2026)</Ext>,
              <Ext key="16" href={F.airops}>AirOps: recopilación de rendimiento (2 de noviembre de 2026)</Ext>,
              <Ext key="17" href={F.graphite}>Search Engine Journal: informe de CTR de Graphite y Similarweb</Ext>,
              <Ext key="18" href={F.sej}>Search Engine Journal: seis meses de ChatGPT Ads</Ext>,
              <Ext key="19" href={F.wordstream}>WordStream y LocaliQ: referencias de Google Ads 2026</Ext>,
              <Ext key="20" href={F.digiday}>Digiday: baja de costos en ChatGPT Ads (abril de 2026)</Ext>,
              <Ext key="21" href={F.sel}>Search Engine Land: cómo lanzar campañas en ChatGPT</Ext>,
              <Ext key="22" href={F.itsitio}>IT Sitio: expansión en América Latina</Ext>,
            ]} />

            <div className="bg-slate-900 text-white rounded-2xl p-8 mt-12 not-prose">
              <h2 className="text-2xl font-bold mb-3">¿Tienes clara tu referencia antes de sumar un canal?</h2>
              <p className="text-slate-300 mb-6">
                Antes de probar algo nuevo, sirve saber cuánto debería costar hoy un lead en tu rubro.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/predictor" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                  Predictor de Campañas
                </Link>
                <Link href="/indicadores" className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors border border-white/20">
                  Termómetro Marketing Digital
                </Link>
                <Link href="/cotizador" className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors border border-white/20">
                  Cotizador
                </Link>
              </div>
            </div>

          </div>
        </div>

        <div className="container mx-auto px-6 max-w-4xl pb-16">
          <InternalLinksMesh currentPath="/blog/chatgpt-ads-chile-guia-agencia" showEditorial={false} />
        </div>
      </article>
    </>
  )
}
