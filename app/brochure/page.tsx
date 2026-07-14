import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brochure — Muller y Pérez | Performance Marketing Chile',
  description: 'Portfolio completo de diseño, contenido y campañas digitales. Más de 40 clientes en 15+ industrias. Gráficas, reels y resultados reales.',
}

const industries = [
  {
    name: 'Eventos y Entretenimiento',
    description: 'Campañas para conciertos, festivales y plataformas de streaming en vivo.',
    pieces: [
      { src: '/brochure/swing-1.jpg', client: 'Swing Producciones', type: 'Post', desc: 'Engagement interactivo — artistas internacionales' },
      { src: '/brochure/swing-2.jpg', client: 'Swing Producciones', type: 'Post', desc: 'Gira promocional conciertos' },
      { src: '/brochure/mint-1.jpg', client: 'MINT', type: 'Post', desc: 'Lanzamiento plataforma streaming en vivo' },
    ],
  },
  {
    name: 'Tecnología y SaaS',
    description: 'Contenido para software B2B, cloud hosting y plataformas de gestión.',
    pieces: [
      { src: '/brochure/genera-1.jpg', client: 'Genera', type: 'Post', desc: 'Contenido educativo RR.HH. — Software de asistencia' },
      { src: '/brochure/tecnoinver-1.jpg', client: 'Tecnoinver', type: 'Post', desc: 'Avatares con IA — Cloud & Datacenter' },
      { src: '/brochure/invas-1.jpg', client: 'Invas WMS', type: 'Post', desc: 'Webinar logística — Gestión de inventarios' },
    ],
  },
  {
    name: 'Industria y B2B',
    description: 'Grúas, iluminación industrial, logística internacional y agroindustria.',
    pieces: [
      { src: '/brochure/halterlift-1.jpg', client: 'Halterlift', type: 'Post', desc: 'Grúas horquilla eléctricas — Producto hero' },
      { src: '/brochure/power-energy-1.jpg', client: 'Power Energy', type: 'Post', desc: 'Iluminación LED industrial' },
      { src: '/brochure/fuxion-1.jpg', client: 'Fuxion Logistics', type: 'Post', desc: 'Flete aéreo, marítimo y terrestre' },
      { src: '/brochure/jp-procesos-1.jpg', client: 'JP Procesos', type: 'Post', desc: 'Maquinaria agroindustrial' },
    ],
  },
  {
    name: 'Inmobiliaria y Financiero',
    description: 'Proyectos inmobiliarios, créditos hipotecarios y corretaje de propiedades.',
    pieces: [
      { src: '/brochure/rilay-1.jpg', client: 'Rilay Inmobiliaria', type: 'Post', desc: 'Construcción de casas — Puerto Varas' },
      { src: '/brochure/4life-1.jpg', client: '4Life Hipotecario', type: 'Post', desc: 'Crédito hipotecario — Campaña emocional' },
    ],
  },
  {
    name: 'Retail y Producto',
    description: 'Muebles de oficina, tecnología Apple, heladerías y accesorios premium.',
    pieces: [
      { src: '/brochure/pregiata-1.jpg', client: 'Pregiata', type: 'Post', desc: 'Mobiliario de oficina premium' },
      { src: '/brochure/pineapple-1.jpg', client: 'PineApple Store', type: 'Post', desc: 'Apple Magic Mouse — Producto' },
      { src: '/brochure/cioccolati-1.jpg', client: 'Cioccolati', type: 'Post', desc: 'Helados artesanales — Campaña de producto' },
    ],
  },
  {
    name: 'Educación',
    description: 'Campañas de matrículas, cursos y educación continua.',
    pieces: [
      { src: '/brochure/inacap-1.jpg', client: 'INACAP', type: 'Post', desc: 'Educación Continua — Más de 400 cursos' },
    ],
  },
  {
    name: 'Transporte',
    description: 'Contenido para empresas de transporte interurbano.',
    pieces: [
      { src: '/brochure/hualpen-1.jpg', client: 'Buses Hualpén', type: 'Post', desc: 'Experiencia de viaje — Branding emocional' },
    ],
  },
  {
    name: 'Alimentos y Distribución',
    description: 'Mercado mayorista, productos alimenticios y distribución.',
    pieces: [
      { src: '/brochure/iruzun-1.jpg', client: 'Irurzun', type: 'Post', desc: 'Productos esenciales — Mercado mayorista' },
    ],
  },
]

const stats = [
  { number: '+40', label: 'Clientes activos' },
  { number: '15+', label: 'Industrias' },
  { number: '3', label: 'Diseñadores' },
  { number: '+500', label: 'Piezas al mes' },
]

export default function BrochurePage() {
  return (
    <div className="min-h-screen bg-[#0A0A14] text-white">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
        <div className="max-w-6xl mx-auto px-6 py-20 relative">
          <div className="flex items-center gap-4 mb-8">
            <Image
              src="/logo-blanco.png"
              alt="Muller y Pérez"
              width={200}
              height={50}
              className="h-10 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Diseño y contenido<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              que convierte
            </span>
          </h1>
          <p className="text-xl text-blue-200/70 max-w-2xl mb-10">
            Más de 40 empresas confían en nuestro equipo para diseño de campañas, contenido para redes sociales y producción audiovisual. Cada pieza está pensada para generar resultados medibles.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur rounded-xl p-5 border border-white/10">
                <p className="text-3xl font-bold text-blue-400">{s.number}</p>
                <p className="text-sm text-blue-200/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Qué hacemos</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🎨', title: 'Gráficas para redes', desc: 'Posts, carruseles, stories e infografías diseñadas para cada industria y plataforma.' },
            { icon: '🎬', title: 'Reels y video', desc: 'Producción de reels, motion graphics y contenido audiovisual optimizado para engagement.' },
            { icon: '📊', title: 'Campañas de performance', desc: 'Google Ads, Meta Ads y LinkedIn Ads con foco en conversión y retorno medible.' },
          ].map((s) => (
            <div key={s.title} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/30 transition-colors">
              <span className="text-3xl">{s.icon}</span>
              <h3 className="font-semibold mt-3 mb-2">{s.title}</h3>
              <p className="text-sm text-blue-200/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      {industries.map((industry, idx) => (
        <section
          key={industry.name}
          className={`py-16 px-6 ${idx % 2 === 0 ? 'bg-[#0A0A14]' : 'bg-white/[0.02]'}`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
                {industry.name}
              </p>
              <p className="text-sm text-blue-200/50">{industry.description}</p>
            </div>

            <div className={`grid gap-4 ${
              industry.pieces.length === 1
                ? 'grid-cols-1 max-w-md'
                : industry.pieces.length === 2
                ? 'grid-cols-2 max-w-3xl'
                : industry.pieces.length === 4
                ? 'grid-cols-2 md:grid-cols-4'
                : 'grid-cols-2 md:grid-cols-3'
            }`}>
              {industry.pieces.map((piece) => (
                <div
                  key={piece.src}
                  className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-600/10"
                >
                  <div style={{ aspectRatio: '4/5' }} className="relative">
                    <Image
                      src={piece.src}
                      alt={`${piece.client} — ${piece.desc} | Muller y Pérez`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-white font-bold text-sm">{piece.client}</p>
                    <p className="text-white/60 text-xs">{piece.type}</p>
                    <p className="text-white/40 text-xs mt-0.5">{piece.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Equipo creativo */}
      <section className="py-16 px-6 bg-gradient-to-b from-blue-950/30 to-[#0A0A14]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Equipo creativo dedicado</h2>
          <p className="text-blue-200/60 max-w-2xl mx-auto mb-10">
            Tres diseñadores especializados por industria. Cada cliente tiene un creativo asignado que conoce su marca, su tono y su audiencia.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Greta', clients: 'Genera, Halterlift, Rilay, Premios Increíbles, Cioccolati', focus: 'SaaS, industria y lifestyle' },
              { name: 'Romina', clients: '4Life, Invas, Irurzun, JP Procesos, Pregiata, Stocks', focus: 'B2B, retail y financiero' },
              { name: 'Marcelo', clients: 'Swing, MINT, Power Energy, Tecnoinver, PineApple, INACAP, Hualpén, Fuxion', focus: 'Eventos, tecnología y transporte' },
            ].map((d) => (
              <div key={d.name} className="bg-white/5 rounded-xl p-6 border border-white/10 text-left">
                <p className="text-lg font-bold text-blue-400">{d.name}</p>
                <p className="text-xs text-blue-200/40 mt-1 mb-3">{d.focus}</p>
                <p className="text-sm text-blue-200/60">{d.clients}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Necesitas contenido que convierta?
          </h2>
          <p className="text-blue-200/60 mb-8">
            Hablemos de tu marca. Diseño + performance + datos = resultados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/56962143960?text=Hola%2C%20vi%20el%20brochure%20y%20me%20interesa%20saber%20m%C3%A1s"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
            >
              WhatsApp directo
            </a>
            <a
              href="https://www.mulleryperez.cl/#contacto"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
            >
              Agendar reunión
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Image
            src="/logo-blanco.png"
            alt="Muller y Pérez"
            width={150}
            height={40}
            className="h-8 w-auto opacity-50"
          />
          <p className="text-xs text-white/30">
            Muller y Pérez — Performance Marketing Chile — mulleryperez.cl
          </p>
        </div>
      </footer>
    </div>
  )
}
