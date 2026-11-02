/**
 * Blog: ChatGPT Ads en Chile — proceso, políticas, comparación con Google y metodología de prueba
 * Fuentes oficiales de OpenAI leídas el 2 de noviembre de 2026
 */

import { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { createMetadata, createBreadcrumbSchema, createFAQPageSchema } from '@/lib/metadata'
import { createSpeakableSchema } from '@/lib/ai-search-optimization'
import InternalLinksMesh from '@/components/rankings/InternalLinksMesh'
import { SpeakableContent } from '@/components/AEOSchemas'

const URL_ARTICULO = 'https://www.mulleryperez.cl/blog/chatgpt-ads-chile-guia-agencia'
const TITULO = 'ChatGPT Ads en Chile: cómo anunciar y cómo se compara con Google Ads'
const DESCRIPCION = 'Guía de ChatGPT Ads en Chile con fuentes oficiales de OpenAI: quién puede anunciar, paso a paso, rubros prohibidos, costos, comparación con Google Ads y metodología de prueba de 4 semanas.'

const FUENTES = {
  anuncio: 'https://openai.com/es-ES/index/chatgpt-ads-expands-26-new-countries/',
  politicas: 'https://openai.com/es-ES/policies/ad-policies/',
  campanas: 'https://help.openai.com/en/articles/20001210-creating-campaigns-for-chatgpt-ads',
  grupos: 'https://help.openai.com/es-es/articles/20001211-create-ad-groups-for-chatgpt-ads',
  anuncios: 'https://help.openai.com/es-es/articles/20001212-creating-ads-for-chatgpt-ads',
  conversiones: 'https://help.openai.com/es-es/articles/20001412-conversion-optimized-campaigns',
  lanzar: 'https://help.openai.com/es-es/articles/20001209-launch-campaigns',
  airops: 'https://www.airops.com/blog/chatgpt-ads-performance',
  digitalApplied: 'https://www.digitalapplied.com/blog/chatgpt-ads-89-countries-26-new-markets',
  itsitio: 'https://itsitio.com/co/inteligencia-artificial/openai-amplia-los-anuncios-en-chatgpt-a-colombia-y-a-14-nuevos-mercados-de-america-latina/',
  techwyse: 'https://www.techwyse.com/news/ai-search/openai-chatgpt-ads-manager-cpc-bidding-launch',
}

const FAQS = [
  {
    question: '¿Se puede anunciar en ChatGPT desde Chile?',
    answer: 'Sí. OpenAI anunció el 21 de octubre de 2026 que ChatGPT Ads llega a 26 países más, entre ellos Chile, y que los anunciantes pueden entrar por socios tecnológicos o por su cuenta en el Gestor de anuncios. El despliegue es reciente, así que el volumen disponible en Chile todavía hay que comprobarlo con una prueba.',
  },
  {
    question: '¿Cuánto cuesta anunciar en ChatGPT en Chile?',
    answer: 'El presupuesto diario mínimo publicado por OpenAI es de 3.750 pesos chilenos si la cuenta factura en CLP, y de 25 dólares si factura en USD. El costo por clic lo define la subasta. OpenAI no publica promedios, y las cifras disponibles son de terceros y corresponden sobre todo a Estados Unidos.',
  },
  {
    question: '¿Qué rubros no pueden anunciar en ChatGPT en Chile?',
    answer: 'Según las políticas de OpenAI actualizadas al 10 de septiembre de 2026, fuera de Estados Unidos están prohibidos los servicios jurídicos y, por lo general, los servicios financieros y de salud. Tampoco se permiten alcohol, tabaco, apuestas, contenido político, drogas recreativas ni contenido para adultos. Además, se prohíben los anuncios de ofertas de empleo concretas y de viviendas concretas en venta o arriendo.',
  },
  {
    question: '¿Pagar anuncios en ChatGPT hace que mi marca aparezca en las respuestas?',
    answer: 'No. OpenAI declara que la publicidad no influye en las respuestas y que los anuncios van identificados y separados de ellas. Aparecer recomendado en la respuesta es un trabajo distinto, de posicionamiento orgánico en inteligencia artificial, también llamado GEO.',
  },
  {
    question: '¿ChatGPT Ads reemplaza a Google Ads?',
    answer: 'Con la evidencia disponible, no. Los datos públicos muestran clics más baratos pero tasas de clic y de conversión más bajas que en Google, con muestras chicas y provenientes de pocos casos. Lo razonable es probarlo con presupuesto adicional, sin quitarle inversión a una campaña de Google que ya genera ventas.',
  },
  {
    question: '¿Cómo se segmenta en ChatGPT si no hay palabras clave?',
    answer: 'Con indicaciones contextuales: frases que describen qué ofreces, a quién ayudas y cuándo eres útil. OpenAI aclara que no son palabras clave de concordancia exacta ni reglas de segmentación, y que no garantizan aparecer en conversaciones concretas. También se puede segmentar por país, plataforma y, donde esté disponible, región, ciudad o código postal.',
  },
  {
    question: '¿Quién ve los anuncios de ChatGPT?',
    answer: 'Solo las personas en los planes Gratis y Go. Las suscripciones Plus, Pro y Enterprise no tienen anuncios, y por eso alguien con Plus no verá la campaña aunque esté activa. OpenAI tampoco muestra anuncios en conversaciones sensibles, como las de salud mental.',
  },
]

export const metadata: Metadata = createMetadata({
  title: TITULO,
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
  ],
  path: '/blog/chatgpt-ads-chile-guia-agencia',
})

function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">{children}</h2>
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{children}</h3>
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-lg text-gray-700 leading-relaxed mb-6">{children}</p>
}

function Fuente({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{children}</a>
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

export default function ChatGPTAdsChilePage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Blog', url: 'https://www.mulleryperez.cl/blog' },
    { name: 'ChatGPT Ads en Chile', url: URL_ARTICULO },
  ])
  const faqSchema = createFAQPageSchema(FAQS)
  const speakableSchema = createSpeakableSchema({
    name: TITULO,
    url: URL_ARTICULO,
    speakableSelectors: ['.speakable', '[data-speakable]'],
  })
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITULO,
    description: DESCRIPCION,
    url: URL_ARTICULO,
    datePublished: '2026-11-02T12:00:00.000-03:00',
    dateModified: '2026-11-02T12:00:00.000-03:00',
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
    citation: Object.values(FUENTES),
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{TITULO}</h1>
              <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                Sí se puede anunciar en ChatGPT desde Chile. Esta guía explica el proceso, qué rubros quedan
                fuera, qué dicen los datos frente a Google Ads y cómo probarlo sin apostar a ciegas.
              </p>
            </SpeakableContent>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span>2 de noviembre de 2026</span>
              <span>&middot;</span>
              <span>12 min de lectura</span>
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
                <li><strong>Disponibilidad:</strong> Chile entró en la expansión anunciada el 21 de octubre de 2026.</li>
                <li><strong>Mínimo:</strong> 3.750 pesos diarios si la cuenta factura en CLP.</li>
                <li><strong>Quedan fuera en Chile:</strong> servicios jurídicos y, por lo general, financieros y de salud, entre otros.</li>
                <li><strong>Frente a Google:</strong> los datos públicos muestran clics más baratos, pero menos conversión. Las muestras son chicas y casi nada viene de Chile.</li>
                <li><strong>Nuestra recomendación:</strong> una prueba de 4 semanas con presupuesto adicional, medida por costo de lead calificado.</li>
              </ul>
            </div>

            <SpeakableContent>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Más de 1.200 millones de personas usan ChatGPT cada semana, según OpenAI, y parte de ese uso es
                comparar opciones antes de comprar. Desde el 21 de octubre, las empresas chilenas pueden pagar
                por aparecer junto a esas conversaciones. La pregunta útil no es si la plataforma es novedosa,
                sino si conviene ponerle plata hoy y cómo saberlo.
              </p>
            </SpeakableContent>

            <P>
              <strong>Cómo armamos esta guía.</strong> Leímos el 2 de noviembre de 2026 los anuncios, las
              políticas y el centro de ayuda de OpenAI, y separamos lo oficial de lo que informan terceros.
              La plataforma está en beta y cambia seguido, así que conviene revisar las políticas antes de
              lanzar. En M&amp;P aún no tenemos resultados propios de ChatGPT Ads que mostrar. Cuando los
              tengamos, los publicaremos con sus cifras.
            </P>

            <H2>¿Qué es ChatGPT Ads y dónde aparecen los anuncios?</H2>
            <P>
              Es la plataforma publicitaria de OpenAI. Los anuncios se muestran junto a las conversaciones,
              identificados y separados de la respuesta. <Fuente href={FUENTES.anuncio}>OpenAI informa</Fuente> más
              de 100.000 anunciantes y presencia en 89 países. Tres límites cambian lo que se puede esperar:
            </P>
            <Lista items={[
              <><strong>Solo planes Gratis y Go.</strong> Plus, Pro y Enterprise no tienen anuncios. Parte del público profesional queda fuera, y quien pruebe con una cuenta Plus no verá la campaña.</>,
              <><strong>No influyen en la respuesta.</strong> OpenAI declara que la publicidad no afecta lo que responde ChatGPT y que no vende los datos de sus clientes ni entrega las conversaciones a los anunciantes.</>,
              <><strong>No hay anuncios en contextos sensibles.</strong> Las <Fuente href={FUENTES.politicas}>políticas de OpenAI</Fuente> los excluyen de temas como salud mental, autolesiones, contenido político o seguridad infantil.</>,
            ]} />

            <H2>¿Se puede anunciar en ChatGPT desde Chile?</H2>
            <P>
              Sí. <Fuente href={FUENTES.anuncio}>El anuncio oficial</Fuente> nombra a Argentina, Chile, Colombia y
              Perú entre los 14 países nuevos de Latinoamérica, y <Fuente href={FUENTES.itsitio}>la prensa regional</Fuente> detalla
              el resto. Hay dos formas de entrar: por socios tecnológicos o por cuenta propia en el Gestor de anuncios
              (ads.openai.com). Según <Fuente href={FUENTES.digitalApplied}>Digital Applied</Fuente>, la
              entidad que anuncia y factura debe estar en un país disponible y el despliegue parte con poco volumen.
              Esos dos puntos no los confirmamos en documentos de OpenAI.
            </P>
            <P>
              Una regla oficial importa si vendes fuera de Chile: <Fuente href={FUENTES.campanas}>algunas cuentas
              nuevas</Fuente> solo pueden anunciar al comienzo en su país de origen. Se habilitan para otros mercados
              cuando se aprueba la verificación de identidad y alcanzan el gasto requerido en su país.
            </P>

            <H2>¿Qué rubros pueden anunciar en ChatGPT en Chile?</H2>
            <P>
              Esto se revisa antes que cualquier presupuesto, porque descarta a varias industrias de entrada.
              El cuadro resume las <Fuente href={FUENTES.politicas}>políticas actualizadas al 10 de septiembre de 2026</Fuente>:
            </P>
            <Tabla
              cabecera={['Rubro', 'Situación en Chile', 'Detalle']}
              filas={[
                ['Hogar y consumo, servicios locales, viajes y entretenimiento, productos digitales y educación', 'Foco actual', 'Son las categorías que OpenAI prioriza en esta etapa.'],
                ['Servicios jurídicos', 'Prohibido', 'Solo se permiten en EE. UU. Se excluye expresamente la asesoría y representación, también en reclamaciones.'],
                ['Servicios financieros', 'Prohibido por lo general', 'Fuera de EE. UU. Aplica a crédito, seguros, hipotecas e inversiones. Una app de presupuesto o un curso sin servicio financiero suelen estar permitidos.'],
                ['Salud y medicina', 'Prohibido por lo general', 'Fuera de EE. UU. El bienestar general sin afirmaciones médicas puede estar permitido.'],
                ['Inmobiliario', 'Con restricción', 'No se puede anunciar una vivienda concreta en venta o arriendo. Sí se puede enlazar a una plataforma, si ni el anuncio ni la página de destino mencionan una oferta concreta.'],
                ['Empleo', 'Con restricción', 'Misma regla: no se permiten ofertas de empleo concretas.'],
                ['Alcohol, tabaco y vapeo, apuestas, política, drogas recreativas, contenido para adultos', 'Prohibido', 'La regla alcanza también a la página de destino.'],
                ['Servicios B2B', 'Sin mención expresa', 'Las categorías publicadas apuntan al consumo. Hay que validarlo con un anuncio real antes de planificar.'],
              ]}
            />
            <P>
              La revisión cubre el título, el texto, la imagen y la página de destino. Un anuncio aceptable que lleva a
              una página con contenido no permitido se rechaza. OpenAI además se reserva el derecho de rechazar
              anuncios por su posición competitiva, de modo que tampoco conviene contar con esta vía para productos
              que compitan con los suyos.
            </P>

            <H2>¿Cómo se crea una campaña en ChatGPT Ads, paso a paso?</H2>
            <P>
              La estructura es de tres niveles: campaña, grupo de anuncios y anuncio. Los pasos siguientes vienen
              de las guías oficiales para <Fuente href={FUENTES.lanzar}>lanzar</Fuente> y <Fuente href={FUENTES.campanas}>crear
              campañas</Fuente>.
            </P>
            <H3>1. Preparar la cuenta</H3>
            <P>
              Se necesita una cuenta del Gestor de anuncios, el nombre y favicon del anunciante, y un perfil de
              facturación con método de pago. OpenAI puede pedir verificación del anunciante.
            </P>
            <H3>2. Elegir el objetivo</H3>
            <Lista items={[
              <><strong>Vistas (CPM):</strong> pagas por cada 1.000 impresiones. Sirve para dar a conocer una marca.</>,
              <><strong>Clics (CPC):</strong> pagas por cada clic válido hacia tu sitio.</>,
              <><strong>Conversiones:</strong> el sistema optimiza hacia un evento, pero <Fuente href={FUENTES.conversiones}>no pagas por conversión</Fuente>. Se factura por clic o por impresión.</>,
            ]} />
            <P>
              El objetivo no se cambia después de crear la campaña, y conviene decidirlo antes de partir. Para lanzar con
              conversiones hace falta el píxel o la API de conversiones instalados, y hoy solo se admiten eventos
              estándar, uno por campaña.
            </P>
            <H3>3. Definir presupuesto, fechas y ubicación</H3>
            <P>
              El presupuesto puede ser total o diario. El diario es un promedio semanal: un día puede gastar hasta el
              doble, sin superar siete veces el monto en la semana. El <Fuente href={FUENTES.campanas}>mínimo diario</Fuente> depende
              de la moneda de facturación. La tabla oficial indica 3.750 CLP y 25 USD, una diferencia grande que
              conviene comprobar al abrir la cuenta. Además del país, se puede apuntar a región, ciudad o código postal
              donde esté disponible, y por plataforma (apps de iOS y Android, y web).
            </P>
            <P>
              Un detalle fácil de pasar por alto: en la primera campaña puede no aparecer la opción de fechas antes de
              publicar. Si necesitas una fecha exacta de inicio, no publiques solo para llegar a ese ajuste, porque
              los anuncios podrían partir apenas se aprueben.
            </P>
            <H3>4. Armar grupos de anuncios con indicaciones contextuales</H3>
            <P>
              Cada grupo debe responder a una necesidad distinta. Aquí está la mayor diferencia con Google: en vez de
              palabras clave se escriben <Fuente href={FUENTES.grupos}>indicaciones contextuales</Fuente>, frases que
              describen qué ofreces, a quién ayudas y cuándo eres útil. OpenAI es explícito: no son concordancia exacta,
              no son reglas de segmentación y no garantizan aparecer en una conversación determinada.
            </P>
            <H3>5. Escribir los anuncios</H3>
            <P>
              Cada <Fuente href={FUENTES.lanzar}>anuncio</Fuente> lleva título (se recomiendan 16 a 24 caracteres, máximo
              50), texto (32 a 48, máximo 100), imagen cuadrada PNG o JPG de hasta 1200 × 1200, y página de destino.
              Desde el 26 de octubre existe un <Fuente href={FUENTES.anuncios}>formato de varias imágenes</Fuente> en beta
              abierta, con 4 a 6 imágenes cuadradas. OpenAI recomienda varias variantes por oferta, con enfoques
              distintos entre sí.
            </P>
            <H3>6. Revisar el sitio y el seguimiento</H3>
            <Lista items={[
              <>La página de destino no debe bloquear a los rastreadores <strong>OAI-AdsBot</strong> ni <strong>OAI-SearchBot</strong>. Hay que revisar robots.txt y el firewall.</>,
              <>Agrega etiquetas UTM a cada URL de destino para que la fuente se vea en tu analítica y en tu CRM.</>,
              <>Enlaza a la página más específica posible, no a la portada.</>,
            ]} />
            <H3>7. Lanzar y leer las primeras señales</H3>
            <P>
              Los anuncios pasan por revisión. Una vez activos, OpenAI indica que deberían recibir impresiones y clics
              dentro de 24 horas, y que los resultados pueden tardar hasta 7 horas en aparecer en el Gestor. Para más
              volumen existe la carga masiva por CSV.
            </P>

            <H2>¿Cómo se compara ChatGPT Ads con Google Ads?</H2>
            <P>
              Comparar con justicia exige separar dos cosas: cómo funciona cada plataforma, que está documentado, y
              cuánto rinde, donde la evidencia todavía es débil.
            </P>
            <H3>Cómo funciona cada una</H3>
            <Tabla
              cabecera={['Aspecto', 'ChatGPT Ads', 'Google Ads (Búsqueda)']}
              filas={[
                ['Qué activa el anuncio', 'Intención de la conversación y otras señales, orientado por indicaciones contextuales', 'Palabras clave que la persona busca'],
                ['Momento', 'Exploración y comparación, a veces antes de saber qué buscar', 'Búsqueda activa, a menudo con intención de compra'],
                ['Control de lo que activa el anuncio', 'Menor: no hay concordancia exacta', 'Mayor: concordancias y palabras negativas'],
                ['Madurez', 'Beta, poco más de 8 meses desde el lanzamiento', 'Plataforma con décadas de uso y datos locales'],
                ['Audiencia', 'Solo planes Gratis y Go', 'Quienes usan el buscador de Google'],
                ['Benchmarks de Chile', 'No encontramos datos públicos', 'Existen historiales de cuenta y referencias locales'],
              ]}
            />
            <H3>Qué dicen los datos de rendimiento</H3>
            <P>
              OpenAI no publica promedios. Lo que hay son cifras de terceros, recopiladas por <Fuente href={FUENTES.airops}>AirOps</Fuente>,
              casi todas de Estados Unidos y sin distinción fina por rubro:
            </P>
            <Tabla
              cabecera={['Fuente', 'ChatGPT', 'Google', 'Cómo leerlo']}
              filas={[
                ['Workshop Digital, una cuenta, agosto de 2026', 'CTR 1,06%, CPC US$3,14, 739 clics y 0 MQL con US$2.319', 'CTR 5,2%, CPC US$6,76 y 2 MQL', 'Un solo caso. Clic más barato y ningún lead calificado.'],
                ['StubGroup, conversión', '0,21%', '3,71%', 'Comercio de entradas, un rubro específico.'],
                ['Graphite y Similarweb, septiembre de 2026', 'CTR 0,73% por respuesta', 'Sin comparación directa', 'Mide de otra forma: no se compara con el CTR por impresión.'],
                ['WordStream / LocaliQ, 13.474 campañas', 'Sin dato', 'CTR 6,64%, CPC US$5,42, conversión 8,18%', 'Referencia amplia de Google, no de Chile.'],
              ]}
            />
            <P>
              También hay casos positivos, como una reducción de 15,3% del costo por adquisición atribuida a
              WeightWatchers, y <Fuente href={FUENTES.techwyse}>reportes</Fuente> de clics entre US$3 y US$22 según
              categoría. Varias de estas fuentes venden servicios o herramientas de publicidad, así que hay que leerlas
              con esa cautela.
            </P>
            <P>
              <strong>Nuestra lectura:</strong> un clic más barato no significa un cliente más barato. La evidencia
              pública indica que quien está explorando hace menos clic y convierte menos que quien busca en Google.
              Eso no descarta el canal, porque también puede influir en una compra posterior. Por eso OpenAI ofrece
              atribución posterior a la impresión, una medición que conviene mirar con cuidado porque suma conversiones
              que quizá habrían ocurrido de todos modos.
            </P>

            <H2>¿En qué se diferencian los anuncios en ChatGPT del GEO?</H2>
            <P>
              Se confunden a menudo y son dos compras distintas. Los anuncios son un espacio pagado, marcado como tal,
              que se detiene cuando se acaba el presupuesto. El GEO busca que ChatGPT y otros asistentes recomienden a
              tu empresa en la respuesta, sin pagar por cada aparición, y depende de tu contenido, tus menciones en
              otros sitios y lo que las fuentes dicen de ti.
            </P>
            <P>
              Como OpenAI declara que la publicidad no influye en las respuestas, una campaña no debería mejorar tu
              posición orgánica. Una empresa de un rubro prohibido, como un estudio jurídico, solo tiene hoy la vía
              orgánica en Chile. Una medición honesta de GEO también exige mirar ChatGPT de verdad y repetir cada
              pregunta, porque las respuestas varían de una vez a otra.
            </P>

            <H2>¿Cómo probar ChatGPT Ads sin perder plata? Metodología de 4 semanas</H2>
            <P>
              Esta es la prueba que proponemos en M&amp;P. Los umbrales son criterio nuestro, no reglas de OpenAI, y se
              ajustan según el negocio.
            </P>
            <H3>Antes de partir</H3>
            <Lista items={[
              <><strong>Confirma que tu rubro califica,</strong> tanto en el anuncio como en la página de destino.</>,
              <><strong>Calcula tu referencia:</strong> el costo por lead calificado actual en Google, con datos del CRM y no de la plataforma.</>,
              <><strong>Deja listo el seguimiento:</strong> UTM, píxel o API de conversiones, y una forma de marcar los leads que vengan de ChatGPT en el CRM.</>,
              <><strong>Trabaja con presupuesto adicional:</strong> no le quites inversión a Google durante la prueba, o no sabrás qué causó el cambio.</>,
            ]} />
            <H3>Cómo calcular el presupuesto</H3>
            <P>
              La fórmula es: <strong>presupuesto = leads necesarios × (CPC ÷ tasa de conversión de la página)</strong>.
              Un ejemplo ilustrativo, con supuestos y no con resultados: con un CPC de US$3 a US$5 y una página que
              convierte 5%, cada lead cuesta US$60 a US$100, y juntar 20 leads requiere US$1.200 a US$2.000. En Chile
              el clic podría costar menos, pero aún no hay datos públicos. Si tu presupuesto no alcanza para unos 20
              leads, alarga la prueba o concéntrala en un solo servicio.
            </P>
            <H3>Semana a semana</H3>
            <Tabla
              cabecera={['Semana', 'Qué hacer', 'Qué mirar']}
              filas={[
                ['1', 'Un objetivo de clics, 2 o 3 grupos por necesidad y varias variantes de anuncio. Sin audiencias personalizadas: incluirlas exige 25.000 usuarios coincidentes.', 'Si entrega: aprobación, impresiones y volumen real en Chile.'],
                ['2', 'Pausar lo que no recibe clics y reescribir indicaciones contextuales. Revisar las rutas en la analítica.', 'CTR y CPC por grupo, y calidad de la visita.'],
                ['3', 'Concentrar en los mejores grupos. Si hay conversiones suficientes, abrir una campaña nueva con objetivo de conversión, porque el objetivo no se cambia en la misma.', 'Costo por lead y primeros leads en el CRM.'],
                ['4', 'Mantener estable para leer sin ruido y cerrar la comparación.', 'Costo por lead calificado frente a Google.'],
              ]}
            />
            <H3>Cómo decidir al terminar</H3>
            <Lista items={[
              <><strong>Seguir:</strong> el costo por lead calificado queda hasta 1,3 veces el de Google, o hay ventas que lo justifican.</>,
              <><strong>Alargar:</strong> hay menos de 20 leads, porque aún no se puede concluir.</>,
              <><strong>Pausar:</strong> hay clics suficientes y ningún lead calificado. Se vuelve a probar en unos meses, cuando la plataforma tenga más volumen y formatos.</>,
            ]} />

            <H2>¿Cómo trabaja una agencia las campañas en ChatGPT?</H2>
            <P>
              La operación se parece poco a una campaña de Búsqueda clásica. Lo que más cambia es el trabajo de escribir
              las indicaciones y de producir variantes, y lo que más cuesta es medir bien. Si evalúas una agencia para
              esto, pide cuatro cosas: que revise la elegibilidad de tu rubro antes de cotizar, que muestre resultados
              propios o reconozca que no los tiene, que mida en tu CRM y no solo en el Gestor, y que te deje la cuenta a
              tu nombre.
            </P>
            <P>
              Las condiciones comerciales para agencias, como la facturación y los accesos entre cuentas, conviene
              confirmarlas directamente con OpenAI, porque todavía cambian. En M&amp;P partimos por probar en nuestra
              propia marca antes de ofrecerlo como servicio regular, con esta misma metodología.
            </P>

            <H2>Preguntas frecuentes sobre ChatGPT Ads en Chile</H2>
            <div className="space-y-6 mb-12">
              {FAQS.map((faq) => (
                <div key={faq.question} className="border border-slate-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <H2>Fuentes</H2>
            <p className="text-lg text-gray-700 mb-3"><strong>Oficiales de OpenAI</strong> (consultadas el 2 de noviembre de 2026):</p>
            <Lista items={[
              <Fuente key="1" href={FUENTES.anuncio}>ChatGPT Anuncios llega a 26 nuevos países (21 de octubre de 2026)</Fuente>,
              <Fuente key="2" href={FUENTES.politicas}>Políticas de publicidad (10 de septiembre de 2026)</Fuente>,
              <Fuente key="3" href={FUENTES.campanas}>Crear campañas y presupuestos mínimos</Fuente>,
              <Fuente key="4" href={FUENTES.grupos}>Crear grupos de anuncios</Fuente>,
              <Fuente key="5" href={FUENTES.anuncios}>Crear anuncios</Fuente>,
              <Fuente key="6" href={FUENTES.conversiones}>Campañas optimizadas para conversiones</Fuente>,
              <Fuente key="7" href={FUENTES.lanzar}>Lanzar campañas</Fuente>,
            ]} />
            <p className="text-lg text-gray-700 mb-3"><strong>De terceros</strong> (sin verificación independiente nuestra):</p>
            <Lista items={[
              <Fuente key="8" href={FUENTES.airops}>AirOps: recopilación de rendimiento de ChatGPT Ads</Fuente>,
              <Fuente key="9" href={FUENTES.digitalApplied}>Digital Applied: expansión a 89 países</Fuente>,
              <Fuente key="10" href={FUENTES.itsitio}>IT Sitio: expansión en América Latina</Fuente>,
              <Fuente key="11" href={FUENTES.techwyse}>TechWyse: Gestor de anuncios y pujas por clic</Fuente>,
            ]} />

            <div className="bg-slate-900 text-white rounded-2xl p-8 mt-12 not-prose">
              <h2 className="text-2xl font-bold mb-3">¿Tu campaña en Google tiene una referencia clara?</h2>
              <p className="text-slate-300 mb-6">
                Antes de sumar un canal nuevo, sirve saber cuánto debería costar hoy un lead en tu rubro.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/predictor" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                  Predictor de Campañas
                </Link>
                <Link href="/indicadores" className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors border border-white/20">
                  Termómetro Marketing Digital
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
