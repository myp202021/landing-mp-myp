import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Target, ShoppingCart, Zap, BarChart3, DollarSign, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Estrategia Meta Ads para E-commerce en Chile (ROI 8.5x Comprobado)',
  description: 'Estrategia completa de Meta Ads (Facebook e Instagram) para e-commerce: campañas de prospecting, retargeting, Advantage+ Shopping y casos reales Chile 2025 con ROAS 8.5x.',
  keywords: 'meta ads ecommerce chile, facebook ads ecommerce, estrategia facebook ads, instagram ads ecommerce, roas meta ads',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/estrategia-meta-ads-ecommerce-chile'
  },
  openGraph: {
    title: 'Estrategia Meta Ads para E-commerce en Chile (ROI 8.5x)',
    description: 'Estrategia completa: prospecting, retargeting, Advantage+ y casos reales con ROAS 8.5x.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/estrategia-meta-ads-ecommerce-chile',
    publishedTime: '2025-10-08T20:00:00Z'
  }
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-white">
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/"><img src="/logo-color.png" alt="Muller y Pérez" className="h-11 w-auto" /></Link>
          <Link href="/blog" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Blog
          </Link>
        </div>
      </header>

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-bold">Meta Ads</span>
            <p className="text-gray-500 mt-4">8 de octubre, 2025 · 20 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Estrategia Meta Ads para E-commerce en Chile (ROI 8.5x Comprobado)
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            La estrategia exacta que usamos en M&P para llevar e-commerce chilenos de ROAS 2.1x a 8.5x en 90 días:
            estructura de campañas, creatividades que convierten, presupuesto y casos reales con números transparentes.
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-pink-50 border-l-4 border-pink-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📌 Lo que aprenderás</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Estructura de cuenta Meta Ads para e-commerce (3 campañas fundamentales)</li>
                <li>Cómo escalar de $500k a $3M/mes sin quemar presupuesto</li>
                <li>Creatividades que convierten: formatos, hooks y estructura</li>
                <li>Advantage+ Shopping Campaigns: cuándo y cómo usarlas</li>
                <li>3 casos reales Chile con ROAS 6.2x - 8.5x</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-pink-600" />
              Estructura de Cuenta (3 Campañas Fundamentales)
            </h2>

            <p className="text-gray-700 mb-8">
              La mayoría de e-commerce comete el error de crear 10-15 campañas mezcladas. <strong>La estructura correcta tiene solo 3 campañas:</strong>
            </p>

            <div className="space-y-6 mb-12">
              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-7 h-7 text-green-600" />
                  Campaña 1: Prospecting (Audiencias Frías)
                </h3>
                <p className="text-gray-700 mb-4"><strong>Objetivo:</strong> Traer gente nueva que NO te conoce</p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-bold text-gray-900 mb-2">Configuración:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Objetivo: <strong>Ventas</strong> (Conversiones)</li>
                    <li>• Audiencia: <strong>Broad (Amplia)</strong> + Exclusión de clientes existentes</li>
                    <li>• Ubicaciones: <strong>Feed Facebook e Instagram</strong> (NO Stories al principio)</li>
                    <li>• Presupuesto: <strong>60% del total</strong></li>
                  </ul>
                </div>
                <p className="text-sm text-green-700"><strong>Meta Chile 2025:</strong> ROAS 3-5x en prospecting es excelente</p>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-7 h-7 text-blue-600" />
                  Campaña 2: Retargeting (Audiencias Cálidas)
                </h3>
                <p className="text-gray-700 mb-4"><strong>Objetivo:</strong> Convertir a quienes ya interactuaron con tu marca</p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-bold text-gray-900 mb-2">Configuración:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Objetivo: <strong>Ventas</strong></li>
                    <li>• Audiencia: Visitantes últimos 30 días + Carrito abandonado</li>
                    <li>• Creatividades: <strong>Testimonios + Descuentos + Urgencia</strong></li>
                    <li>• Presupuesto: <strong>25% del total</strong></li>
                  </ul>
                </div>
                <p className="text-sm text-blue-700"><strong>Meta Chile 2025:</strong> ROAS 8-12x en retargeting es normal</p>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-7 h-7 text-purple-600" />
                  Campaña 3: Advantage+ Shopping (Automatizada)
                </h3>
                <p className="text-gray-700 mb-4"><strong>Objetivo:</strong> Dejar que Meta optimice automáticamente</p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-bold text-gray-900 mb-2">Configuración:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Tipo: <strong>Advantage+ Shopping Campaign</strong></li>
                    <li>• Audiencia: <strong>Automática</strong> (Meta decide)</li>
                    <li>• Catálogo vinculado</li>
                    <li>• Presupuesto: <strong>15% del total</strong> (testing)</li>
                  </ul>
                </div>
                <p className="text-sm text-purple-700"><strong>Nota:</strong> Solo si tienes Pixel con > 50 conversiones/semana</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              Presupuesto y Escalamiento
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Regla de Oro: Escala 20% Cada 3 Días</h3>
              <p className="text-gray-700 mb-4">
                Aumentar presupuesto muy rápido resetea el algoritmo de Meta. La forma correcta:
              </p>
              <div className="space-y-3 text-gray-700 text-sm">
                <p><strong>Día 1-3:</strong> Presupuesto inicial (ej: $10.000/día)</p>
                <p><strong>Día 4-6:</strong> Si ROAS > objetivo, aumenta +20% ($12.000/día)</p>
                <p><strong>Día 7-9:</strong> Si sigue rentable, +20% más ($14.400/día)</p>
                <p><strong>Y así sucesivamente...</strong></p>
              </div>
              <p className="text-sm text-orange-700 mt-4">
                ⚠️ <strong>Error común:</strong> Aumentar de $10k a $30k de un día para otro → ROAS se derrumba
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ejemplo Real: Escalamiento de $500k a $3M/mes</h3>
              <div className="space-y-2 text-gray-700 text-sm">
                <p><strong>Mes 1:</strong> $500.000 presupuesto → ROAS 5.2x</p>
                <p><strong>Mes 2:</strong> $850.000 presupuesto (+70%) → ROAS 4.8x</p>
                <p><strong>Mes 3:</strong> $1.400.000 presupuesto (+65%) → ROAS 4.6x</p>
                <p><strong>Mes 4:</strong> $2.100.000 presupuesto (+50%) → ROAS 4.4x</p>
                <p><strong>Mes 5:</strong> $3.000.000 presupuesto (+43%) → ROAS 4.2x</p>
              </div>
              <p className="text-sm text-green-700 font-bold mt-4">
                💰 Resultado: De $2.6M a $12.6M en ventas mensuales
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Creatividades que Convierten
            </h2>

            <p className="text-gray-700 mb-6">
              El 70% del éxito en Meta Ads está en las creatividades. La mejor estructura de cuenta no sirve de nada con anuncios feos.
            </p>

            <div className="space-y-6 mb-12">
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Formato #1: UGC (User Generated Content)</h3>
                <p className="text-gray-700 mb-4 text-sm">
                  Videos de clientes reales usando tu producto. <strong>El formato que mejor convierte en 2025.</strong>
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold text-gray-900 mb-2">Estructura del video:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• <strong>0-3 seg:</strong> Hook potente ("Compré esto y cambió mi vida")</li>
                    <li>• <strong>3-8 seg:</strong> Muestra el producto en uso</li>
                    <li>• <strong>8-15 seg:</strong> Beneficio principal + transformación</li>
                    <li>• <strong>15-20 seg:</strong> CTA ("Link en bio")</li>
                  </ul>
                </div>
                <p className="text-sm text-green-700 mt-3">✅ <strong>Costo:</strong> $50.000-$150.000 por UGC (Chile 2025)</p>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Formato #2: Carousel de Producto</h3>
                <p className="text-gray-700 mb-4 text-sm">
                  3-7 imágenes mostrando el producto desde diferentes ángulos + beneficios
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold text-gray-900 mb-2">Estructura del carousel:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• <strong>Slide 1:</strong> Producto hero shot con fondo limpio</li>
                    <li>• <strong>Slide 2:</strong> Producto en uso (lifestyle)</li>
                    <li>• <strong>Slide 3:</strong> Beneficio #1 con texto grande</li>
                    <li>• <strong>Slide 4:</strong> Beneficio #2</li>
                    <li>• <strong>Slide 5:</strong> Testimonial o review 5 estrellas</li>
                    <li>• <strong>Slide 6:</strong> Oferta/descuento</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Formato #3: Video Testimonial</h3>
                <p className="text-gray-700 mb-4 text-sm">
                  Cliente contando su experiencia mirando a cámara. <strong>Funciona muy bien para productos > $50.000</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Tip: Subtítulos obligatorios (85% ve videos sin sonido)
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">⚡ Regla de las 3 Variantes</h3>
              <p className="text-gray-700 mb-4">
                Por cada campaña, crea 3 anuncios con diferentes hooks/creatividades:
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• <strong>Anuncio A:</strong> Hook de problema ("¿Cansado de...?")</li>
                <li>• <strong>Anuncio B:</strong> Hook de beneficio ("Ahorra 40% en...")</li>
                <li>• <strong>Anuncio C:</strong> Hook de social proof ("1,200 clientes felices")</li>
              </ul>
              <p className="text-sm text-gray-700 mt-4">
                Meta optimizará automáticamente hacia la que mejor convierta.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              Casos Reales Chile 2025
            </h2>

            <div className="space-y-8 mb-12">
              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">📊 Caso 1: Ropa Deportiva (ROAS 8.5x)</h3>
                <p className="text-gray-700 mb-4">E-commerce de ropa deportiva mujer, ticket promedio $28.500</p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-bold text-gray-900 mb-2">Estrategia:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• 15 UGC videos de clientas reales</li>
                    <li>• Prospecting: Broad audience 25-45 años Chile</li>
                    <li>• Retargeting: 7, 15 y 30 días</li>
                    <li>• Advantage+ Testing: 15% presupuesto</li>
                  </ul>
                </div>
                <p className="text-gray-700 mb-2"><strong>Resultados (90 días):</strong></p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Inversión: $3.200.000</li>
                  <li>• Ventas: $27.200.000</li>
                  <li>• <strong>ROAS: 8.5x</strong></li>
                  <li>• CPA: $6.850</li>
                  <li>• Best performer: UGC videos (ROAS 11.2x)</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">📊 Caso 2: Cosmética Natural (ROAS 6.2x)</h3>
                <p className="text-gray-700 mb-4">Productos de skincare natural, ticket promedio $19.800</p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-bold text-gray-900 mb-2">Estrategia:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Carousels de antes/después</li>
                    <li>• Prospecting: Intereses skincare, cosmética natural</li>
                    <li>• Retargeting agresivo con descuento 20%</li>
                    <li>• Quiz interactivo ("¿Qué tipo de piel tienes?")</li>
                  </ul>
                </div>
                <p className="text-gray-700 mb-2"><strong>Resultados (60 días):</strong></p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Inversión: $1.800.000</li>
                  <li>• Ventas: $11.160.000</li>
                  <li>• <strong>ROAS: 6.2x</strong></li>
                  <li>• CPA: $8.200</li>
                  <li>• Best performer: Carousel antes/después (ROAS 7.8x)</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">📊 Caso 3: Accesorios Tech (ROAS 7.1x)</h3>
                <p className="text-gray-700 mb-4">Gadgets y accesorios tecnológicos, ticket promedio $42.000</p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-bold text-gray-900 mb-2">Estrategia:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Videos cortos (5-8 seg) mostrando funcionalidad</li>
                    <li>• Prospecting: Lookalike de compradores (1% Chile)</li>
                    <li>• Dynamic Product Ads para retargeting</li>
                    <li>• Advantage+ para productos nuevos</li>
                  </ul>
                </div>
                <p className="text-gray-700 mb-2"><strong>Resultados (120 días):</strong></p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Inversión: $5.400.000</li>
                  <li>• Ventas: $38.340.000</li>
                  <li>• <strong>ROAS: 7.1x</strong></li>
                  <li>• CPA: $11.500</li>
                  <li>• Best performer: Videos cortos funcionalidad (ROAS 9.2x)</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Conclusión: De 0 a ROAS 8x
            </h2>

            <p className="text-gray-700 mb-6">
              La clave para ROAS alto en Meta Ads para e-commerce:
            </p>

            <ul className="space-y-2 text-gray-700 mb-8">
              <li>✅ <strong>Estructura simple:</strong> 3 campañas (Prospecting + Retargeting + Advantage+)</li>
              <li>✅ <strong>Creatividades ganadoras:</strong> UGC videos > Carousels > Static images</li>
              <li>✅ <strong>Escalar inteligente:</strong> +20% cada 3 días (no de golpe)</li>
              <li>✅ <strong>Testing constante:</strong> 3 variantes mínimo por campaña</li>
              <li>✅ <strong>Pixel bien configurado:</strong> Sin data = sin optimización</li>
            </ul>

            <div className="bg-gradient-to-br from-pink-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres implementar esta estrategia?
              </h3>
              <p className="text-xl text-pink-100 mb-8">
                Te ayudamos a estructurar, optimizar y escalar tus campañas Meta Ads con creatividades que convierten.
              </p>
              <Link
                href="https://wa.me/56992258137?text=Hola%2C%20quiero%20mejorar%20mi%20ROAS%20en%20Meta%20Ads"
                className="inline-block bg-white text-pink-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                Hablar con un Especialista
              </Link>
              <p className="text-pink-100 text-sm mt-4">
                📊 Auditoría + Plan de Acción en 48 horas
              </p>
            </div>
          </div>
        </div>
      </article>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/"><img src="/logo-white.png" alt="Muller y Pérez" className="h-10 w-auto mx-auto mb-6" /></Link>
          <p className="text-gray-400">© 2025 Muller y Pérez. Marketing Digital Basado en Datos.</p>
        </div>
      </footer>
    </div>
  )
}
