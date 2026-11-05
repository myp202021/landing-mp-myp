import Image from 'next/image'

/** Testimonios escritos + schema de reseñas (aggregateRating) del home anterior, sin cambios de contenido. */
export default function Testimonios() {
  return (
    <section id="testimonios" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="testimonios-titulo">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 id="testimonios-titulo" className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Resultados reales, relaciones de largo plazo
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Testimonio 2 — Cristian Pregiata, Pregiata SPA */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 border border-gray-100 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden p-2">
                <Image src="/clientes/pregiata.png" alt="Pregiata" width={40} height={40} className="w-full h-full object-contain" loading="lazy" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Cristian Pregiata</p>
                <p className="text-xs text-gray-500">Director, Pregiata SPA</p>
              </div>
            </div>
            <blockquote className="text-gray-700 text-sm leading-relaxed flex-1">
              &ldquo;Trabajar con M&P ha sido un antes y un después para Pregiata. Sus campañas en Google Ads han sido un verdadero motor de crecimiento. Gracias a la actualización de redes sociales y la creación de reels, logramos un alcance mucho mayor. M&P es un aliado estratégico que aporta resultados reales.&rdquo;
            </blockquote>
            <div className="flex mt-4 text-yellow-400 text-sm">★★★★★</div>
          </div>

          {/* Testimonio 3 — Rodrigo Conejera, Fuxion Logistics */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 border border-gray-100 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden p-2">
                <Image src="/clientes/fuxion-logistics.png" alt="Fuxion Logistics" width={40} height={40} className="w-full h-full object-contain" loading="lazy" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Rodrigo Conejera</p>
                <p className="text-xs text-gray-500">Gerente, Fuxion Logistics</p>
              </div>
            </div>
            <blockquote className="text-gray-700 text-sm leading-relaxed flex-1">
              &ldquo;M&P nos ha apoyado en todo el proceso de marketing: diseños, planificación y grabación de contenido, siempre con buena disposición. Gestionan nuestro CEM de Google y sabemos que vamos construyendo una base sólida. Mención especial para Nicole, cuya cercanía y profesionalismo hacen que todo sea más fluido.&rdquo;
            </blockquote>
            <div className="flex mt-4 text-yellow-400 text-sm">★★★★★</div>
          </div>
        </div>
      </div>

      {/* Schema Review para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Muller y Pérez",
            "url": "https://www.mulleryperez.cl",
            "review": [
              {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Alex Matheu" },
                "reviewBody": "Llevamos varios meses trabajando con M&P y estamos muy contentos. Destacamos su creatividad, pero también el orden y profesionalidad con que manejan todo: reportes, campañas y seguimiento constante. Su esfuerzo por potenciar nuestra presencia digital se nota día a día. Un equipo comprometido.",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "itemReviewed": { "@type": "Organization", "name": "Muller y Pérez" }
              },
              {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Cristian Pregiata" },
                "reviewBody": "Trabajar con M&P ha sido un antes y un después para Pregiata. Sus campañas en Google Ads han sido un verdadero motor de crecimiento. Gracias a la actualización de redes sociales y la creación de reels, logramos un alcance mucho mayor. M&P es un aliado estratégico que aporta resultados reales.",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "itemReviewed": { "@type": "Organization", "name": "Muller y Pérez" }
              },
              {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Rodrigo Conejera" },
                "reviewBody": "M&P nos ha apoyado en todo el proceso de marketing: diseños, planificación y grabación de contenido, siempre con buena disposición. Gestionan nuestro CEM de Google y sabemos que vamos construyendo una base sólida. Mención especial para Nicole, cuya cercanía y profesionalismo hacen que todo sea más fluido.",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "itemReviewed": { "@type": "Organization", "name": "Muller y Pérez" }
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": "115",
              "bestRating": "5"
            }
          })
        }}
      />
    </section>
  )
}
