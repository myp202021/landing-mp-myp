import { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'

const URL = 'https://www.mulleryperez.cl/equipo/christopher-muller'
const DESC = 'Christopher Müller, ingeniero civil industrial y MBA de la Universidad de Chile, fundador de Muller y Pérez. 20 años en marketing, canales digitales y negocio en Transbank, Hibu, Guru, Cencosud y Banco Internacional.'

export const metadata: Metadata = {
  title: 'Christopher Müller — Fundador de Muller y Pérez | Marketing digital y performance',
  description: DESC,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Christopher Müller — Fundador de Muller y Pérez',
    description: DESC,
    url: URL,
    type: 'profile',
    images: [{ url: 'https://www.mulleryperez.cl/og-image.jpg', width: 1200, height: 630 }]
  }
}

// Trayectoria tomada del perfil de LinkedIn de Christopher (revisado 9 nov 2026). No agregar cifras sin fuente.
const trayectoria = [
  { empresa: 'Muller y Pérez', cargo: 'Fundador', periodo: '2020 – hoy', texto: 'Agencia de marketing digital y performance que opera como el departamento de marketing de sus clientes B2B y B2C: paid media, contenido y diseño, con medición, CRM y agentes de IA propios.' },
  { empresa: 'Genera HR Digital', cargo: 'Director', periodo: '2021 – 2022', texto: 'Director en una empresa con más de 35 años en soluciones de gestión de personas.' },
  { empresa: 'Guru Soluciones (páginas amarillas y startups digitales, 11 países)', cargo: 'Gerente Comercial Chile', periodo: '2016 – 2018', texto: 'Lideró comercial y marketing en Chile. Primer país del grupo en volver a crecer en ventas y clientes (+15% en 2017) con EBITDA positivo, revirtiendo más de 10 años de caída de la industria; incremento comercial de +120%.' },
  { empresa: 'Hibu (Reino Unido)', cargo: 'Gerente de Marketing', periodo: '2014 – 2016', texto: 'Marketing y business intelligence, pricing y mix de productos y canales. La renovación de clientes de primer año subió de 20% a 40%; los nuevos servicios generaron USD 1 millón entre 2015 y 2018.' },
  { empresa: 'Transbank', cargo: 'Jefe de Canales Digitales · Jefe de Producto Internet', periodo: '2010 – 2014', texto: 'A cargo de transbank.cl y webpay.cl. Los clientes registrados pasaron de 3.500 a 45.000, con más de 20.000 activos. Afiliación Express permitió vender con Webpay en 24 horas y llegó a más del 50% de las captaciones de e-commerce en Chile.' },
  { empresa: 'Banco Internacional', cargo: 'Jefe de Internet Banking', periodo: '2009 – 2010', texto: 'Desarrollo del canal Internet para banca empresas.' },
  { empresa: 'Cencosud', cargo: 'Ingeniero de Proyectos E-commerce', periodo: '2007 – 2009', texto: 'Tarjeta Más online y venta online del SOAP.' },
  { empresa: 'Penta Analytics', cargo: 'Analista, Gerencia Comercial', periodo: '2006 – 2007', texto: 'Informes de ventas en supermercados para proveedores como CMPC, Coca-Cola, Nestlé, Carozzi y Clorox.' }
]

const formacion = [
  { titulo: 'MBA, Estrategia Empresarial', lugar: 'Universidad de Chile (FEN)', periodo: '2015 – 2016' },
  { titulo: 'Ingeniero Civil Industrial, aprobado con distinción', lugar: 'Universidad de Chile', periodo: '2000 – 2007' },
  { titulo: 'Diplomado en Habilidades Directivas, Negociación e Innovación', lugar: 'Universidad Adolfo Ibáñez', periodo: '2012 – 2013' }
]

const estudios = [
  { href: '/benchmark-cpl-chile-2026', titulo: 'Benchmark de costo por lead en Chile 2026' },
  { href: '/investigacion/estudio-performance-marketing-chile-2026', titulo: 'Benchmarks de performance marketing Chile 2026' },
  { href: '/estudio-benchmark-marketing-digital-chile-2026', titulo: 'ROAS, CAC y conversión por industria' },
  { href: '/estudio-costos-marketing-digital-chile-2026', titulo: 'Costos del marketing digital en Chile 2026' },
  { href: '/estudio-ia-marketing-digital-chile-2026', titulo: 'IA en marketing digital en Chile 2026' },
  { href: '/investigacion/google-meridian-marketing-mix-modeling-chile', titulo: 'Google Meridian y marketing mix modeling en Chile' },
  { href: '/mejores-agencias-marketing-digital-chile', titulo: 'Ranking de agencias de marketing digital en Chile (9 reglas públicas)' }
]

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': URL + '#persona',
  name: 'Christopher Müller',
  alternateName: 'Christopher Muller',
  url: URL,
  sameAs: ['https://www.linkedin.com/in/christophermullerm/'],
  jobTitle: 'Fundador',
  worksFor: { '@type': 'Organization', name: 'Muller y Pérez', url: 'https://www.mulleryperez.cl' },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Universidad de Chile' },
    { '@type': 'CollegeOrUniversity', name: 'Universidad Adolfo Ibáñez' }
  ],
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'Ingeniero Civil Industrial', recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Universidad de Chile' } },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'MBA', recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Universidad de Chile' } }
  ],
  knowsAbout: ['Marketing digital', 'Performance marketing', 'Google Ads', 'Meta Ads', 'Estrategia comercial', 'Canales digitales', 'E-commerce', 'Pricing', 'Generación de leads B2B', 'GEO (optimización para motores de IA)', 'Medición y atribución', 'Inteligencia artificial aplicada al marketing'],
  knowsLanguage: ['es', 'en'],
  nationality: { '@type': 'Country', name: 'Chile' },
  description: DESC
}

const profileSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: URL,
  mainEntity: { '@id': URL + '#persona' }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.mulleryperez.cl/' },
    { '@type': 'ListItem', position: 2, name: 'Equipo', item: 'https://www.mulleryperez.cl/equipo' },
    { '@type': 'ListItem', position: 3, name: 'Christopher Müller', item: URL }
  ]
}

export default function ChristopherMullerPage() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SiteHeader />

      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-blue-50 via-white to-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-blue-600 font-semibold mb-4">Muller y Pérez — Equipo</p>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">Christopher Müller</h1>
          <p className="text-xl text-blue-600 font-semibold mb-6">Fundador de Muller y Pérez · Ingeniero Civil Industrial y MBA, Universidad de Chile</p>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            Christopher Müller lleva 20 años en marketing, canales digitales y negocio. Antes de fundar Muller y Pérez fue gerente comercial de Guru Soluciones,
            gerente de marketing de Hibu y jefe de canales digitales de Transbank, donde estuvo a cargo de transbank.cl y webpay.cl.
            Partió en e-commerce en Cencosud y en internet banking en Banco Internacional.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Su premisa: las decisiones de marketing no se basan en intuición, se construyen sobre datos, contexto y modelo de negocio.
            En Muller y Pérez asesora directamente a gerencias generales en estrategia comercial, marketing y crecimiento.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://www.linkedin.com/in/christophermullerm/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-blue-800 transition-all">LinkedIn</a>
            <Link href="/" className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-lg font-semibold text-sm hover:border-blue-600 hover:text-blue-600 transition-all">Ver Muller y Pérez</Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Trayectoria</h2>
          <ol className="relative border-l-2 border-blue-100 ml-2">
            {trayectoria.map(t => (
              <li key={t.empresa} className="mb-8 ml-6">
                <span className="absolute -left-[9px] mt-1.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
                <p className="text-sm text-gray-500">{t.periodo}</p>
                <h3 className="text-lg font-bold text-gray-900">{t.cargo} · {t.empresa}</h3>
                <p className="text-gray-600 leading-relaxed mt-1">{t.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Formación</h2>
          <ul className="space-y-4">
            {formacion.map(f => (
              <li key={f.titulo} className="bg-white border border-gray-200 rounded-lg px-5 py-4">
                <p className="font-bold text-gray-900">{f.titulo}</p>
                <p className="text-sm text-gray-600">{f.lugar} · {f.periodo}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Estudios y rankings que dirige</h2>
          <p className="text-gray-500 mb-8">Investigación de Muller y Pérez sobre costos, resultados e inteligencia artificial en el marketing digital chileno.</p>
          <ul className="space-y-3">
            {estudios.map(e => (
              <li key={e.href}><Link href={e.href} className="text-blue-700 font-semibold hover:underline">{e.titulo} →</Link></li>
            ))}
          </ul>
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline mt-8">Ver todos sus artículos en el blog →</Link>
        </div>
      </section>
    </div>
  )
}
