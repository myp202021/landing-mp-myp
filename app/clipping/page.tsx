'use client'

import { useState } from 'react'

const PLANES = [
  { id: 'starter', nombre: 'Starter', cuentas: 5, canales: 'Instagram', ia: false, alertas: false, excel: false, mensual: 34990, anual: 27990, anualTotal: 335880, popular: false },
  { id: 'pro', nombre: 'Pro', cuentas: 15, canales: 'Instagram + Facebook + LinkedIn', ia: true, alertas: false, excel: false, mensual: 69990, anual: 54990, anualTotal: 659880, popular: true },
  { id: 'business', nombre: 'Business', cuentas: 30, canales: 'Instagram + Facebook + LinkedIn', ia: true, alertas: true, excel: true, mensual: 119990, anual: 94990, anualTotal: 1139880, popular: false },
]

const FEATURES = [
  { label: 'Email diario con posts nuevos', starter: true, pro: true, business: true },
  { label: 'Preview de texto + link directo al post', starter: true, pro: true, business: true },
  { label: 'Engagement por post (likes, comentarios)', starter: true, pro: true, business: true },
  { label: 'Facebook y LinkedIn', starter: false, pro: true, business: true },
  { label: 'Resumen semanal con ranking (cada lunes)', starter: false, pro: true, business: true },
  { label: 'Resumen mensual consolidado (1ro de cada mes)', starter: false, pro: true, business: true },
  { label: 'Análisis IA diario con insights accionables', starter: false, pro: false, business: true },
  { label: 'Alertas por keyword (cuando mencionan tu marca)', starter: false, pro: false, business: true },
  { label: 'Benchmark semanal vs tu propia cuenta', starter: false, pro: false, business: true },
  { label: 'Export semanal en Excel', starter: false, pro: false, business: true },
]

const COMPARATIVA = [
  { herramienta: 'Radar M&P', entry: '$27.990', medio: '$54.990', contrato: 'Mes a mes', ia: 'Nativo español', trial: '7 días gratis', highlight: true },
  { herramienta: 'Brand24', entry: '$76.000', medio: '$143.000', contrato: 'Anual obligatorio', ia: 'Inglés', trial: '14 días', highlight: false },
  { herramienta: 'Mention', entry: '$39.000', medio: '$80.000', contrato: 'Anual obligatorio', ia: 'No', trial: '14 días', highlight: false },
  { herramienta: 'Meltwater', entry: '$480.000', medio: '$960.000', contrato: 'Anual 12 meses', ia: 'Sí', trial: 'No', highlight: false },
]

function formatCLP(n: number) { return '$' + n.toLocaleString('es-CL') }

export default function ClippingPage() {
  const [anual, setAnual] = useState(true)
  const [trialEmail, setTrialEmail] = useState('')
  const [trialUrls, setTrialUrls] = useState(['', '', ''])
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [tab, setTab] = useState<'diario' | 'semanal' | 'mensual'>('diario')

  const handleTrial = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    const cuentas = trialUrls.filter(u => u.trim()).map(u => {
      const match = u.match(/instagram\.com\/([^/?]+)/)
      return { red: 'instagram', handle: match ? match[1] : u.trim() }
    })
    try {
      const res = await fetch('/api/clipping/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trialEmail, cuentas }),
      })
      if (res.ok) setEnviado(true)
    } catch (err) { console.error(err) }
    setEnviando(false)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ───── HERO ───── */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-6 pt-16 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <a href="/" className="inline-block text-indigo-600 font-bold text-sm tracking-wider mb-6 hover:underline">Muller y Pérez</a>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Sabe qué publica tu competencia<br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">antes de que te des cuenta</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Radar monitorea las cuentas de Instagram, Facebook y LinkedIn que tú elijas. Cada mañana recibes un email con todo lo que publicaron, cuánto engagement tuvo, y un análisis con IA que te dice qué significa y qué deberías hacer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#trial" className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">
              Prueba gratis 7 días
            </a>
            <a href="#ejemplos" className="border-2 border-gray-300 text-gray-700 font-bold px-8 py-4 rounded-xl text-lg hover:border-indigo-400 hover:text-indigo-600 transition">
              Ver ejemplo de informe
            </a>
          </div>
        </div>
      </section>

      {/* ───── QUÉ ES ───── */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">¿Qué es Radar?</h2>
        <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">Un servicio de monitoreo de redes sociales que te llega al email. Sin dashboards complicados, sin login, sin configuraciones. Solo la información que necesitas, cada mañana en tu bandeja de entrada.</p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: '📡', title: 'Monitoreo diario', desc: 'Scrapea Instagram, Facebook y LinkedIn de las cuentas que elijas. Cada día a las 7:00 AM.' },
            { icon: '📧', title: 'Email con todo', desc: 'Recibes un email con cada post nuevo: texto, engagement, link directo y tipo de contenido.' },
            { icon: '🤖', title: 'Análisis con IA', desc: 'La IA identifica patrones, oportunidades y te recomienda acciones concretas basadas en lo que hace tu competencia.' },
            { icon: '📊', title: 'Resumen semanal y mensual', desc: 'Cada lunes un cuadro comparativo semanal. El 1ro de cada mes un informe consolidado con tendencias, ranking y evolución.' },
          ].map(item => (
            <div key={item.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-sm mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── CÓMO FUNCIONA ───── */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Cómo funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Elige las cuentas', desc: 'Pega las URLs de Instagram, Facebook o LinkedIn de tu competencia, proveedores, influencers o quien quieras monitorear.' },
              { step: '2', title: 'Recibe tu radar diario', desc: 'Cada mañana a las 7:00 AM llega a tu email un informe con todo lo que publicaron en las últimas 24 horas.' },
              { step: '3', title: 'Toma mejores decisiones', desc: 'Usa los insights de la IA para ajustar tu estrategia, detectar oportunidades antes que tu competencia, y reaccionar rápido.' },
            ].map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0">{item.step}</div>
                <div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── EJEMPLOS DE INFORME ───── */}
      <section className="px-6 py-16 max-w-5xl mx-auto" id="ejemplos">
        <h2 className="text-2xl font-bold text-center mb-4">Esto es lo que recibes en tu email</h2>
        <p className="text-gray-500 text-center mb-8">Ejemplos reales de los informes diarios y semanales que llegan a tu bandeja de entrada.</p>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <button onClick={() => setTab('diario')} className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition ${tab === 'diario' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Informe diario
          </button>
          <button onClick={() => setTab('semanal')} className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition ${tab === 'semanal' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Resumen semanal (lunes)
          </button>
          <button onClick={() => setTab('mensual')} className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition ${tab === 'mensual' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Resumen mensual (1ro)
          </button>
        </div>

        {/* Email diario */}
        {tab === 'diario' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
            {/* Header email */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6">
              <p className="font-bold text-xl">📡 Tu Radar diario</p>
              <p className="text-sm opacity-90 mt-1">Jueves 17 de abril de 2026 · 5 cuentas monitoreadas · 8 posts nuevos</p>
            </div>

            {/* Resumen IA */}
            <div className="px-8 py-5 bg-indigo-50 border-b border-indigo-100">
              <p className="font-bold text-indigo-800 text-sm mb-2">🤖 Resumen inteligente</p>
              <ul className="text-sm text-indigo-900 space-y-1.5">
                <li>• <strong>CafExpress</strong> lanzó promoción agresiva: "máquina gratis por 3 meses si contratas antes del viernes". Tuvo 847 likes, que es 4× su promedio. Están buscando captar clientes rápido.</li>
                <li>• <strong>CorporateCoffee</strong> publicó su primer testimonio en video en 2 meses (Banco Estado como cliente). Están apostando por social proof.</li>
                <li>• <strong>Vendomatica</strong> lleva 5 días sin publicar. Posible cambio de estrategia o pausa interna.</li>
              </ul>
            </div>

            {/* Oportunidad */}
            <div className="px-8 py-4 bg-green-50 border-b border-green-100">
              <p className="font-bold text-green-800 text-sm mb-1">💡 Oportunidad detectada</p>
              <p className="text-sm text-green-900">Ningún competidor está hablando de café de especialidad para espacios de cowork. Es un ángulo disponible para que te posiciones primero esta semana.</p>
            </div>

            {/* Posts por cuenta */}
            <div className="px-8 py-6">
              <p className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">Detalle por cuenta</p>

              {/* Cuenta 1 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-700">CE</div>
                  <div><p className="font-bold text-sm">CafExpress</p><p className="text-xs text-gray-500">@cafexpress.cl · Instagram · 3 posts</p></div>
                </div>
                {[
                  { texto: '¡PROMO FLASH! Lleva una máquina de café automática a tu oficina GRATIS por 3 meses. Solo hasta el viernes. Link en bio.', likes: 847, comments: 92, tipo: 'Imagen' },
                  { texto: 'Nuestro blend del mes: Colombia Huila con notas a chocolate y frutos rojos. Disponible en todos los planes de oficina.', likes: 234, comments: 18, tipo: 'Carrusel' },
                  { texto: '¿Sabías que el café de tu oficina impacta la productividad de tu equipo? 3 datos que te van a sorprender...', likes: 156, comments: 12, tipo: 'Reel' },
                ].map((post, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 mb-2 border border-gray-100">
                    <p className="text-sm text-gray-800 mb-2">{post.texto}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>❤️ {post.likes.toLocaleString()}</span>
                      <span>💬 {post.comments}</span>
                      <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-600">{post.tipo}</span>
                      <a href="#" className="text-indigo-600 font-medium ml-auto">Ver post →</a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cuenta 2 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">CC</div>
                  <div><p className="font-bold text-sm">CorporateCoffee</p><p className="text-xs text-gray-500">@corporatecoffee.cl · Instagram · 2 posts</p></div>
                </div>
                {[
                  { texto: 'Banco Estado confió en nosotros para el café de sus 200+ sucursales. "La calidad del café cambió el ambiente de nuestras oficinas." — Gerente RRHH', likes: 412, comments: 45, tipo: 'Video' },
                  { texto: 'Del productor a tu taza: visitamos a nuestros proveedores en la zona cafetera de Colombia. Así garantizamos la trazabilidad.', likes: 189, comments: 23, tipo: 'Carrusel' },
                ].map((post, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 mb-2 border border-gray-100">
                    <p className="text-sm text-gray-800 mb-2">{post.texto}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>❤️ {post.likes.toLocaleString()}</span>
                      <span>💬 {post.comments}</span>
                      <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-600">{post.tipo}</span>
                      <a href="#" className="text-indigo-600 font-medium ml-auto">Ver post →</a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cuenta sin actividad */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <p className="text-sm text-amber-800">⚠️ <strong>Vendomatica</strong> — sin publicaciones en las últimas 24 horas (5 días inactivos).</p>
              </div>
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">
              Radar by Muller y Pérez · Reporte automático diario 7:00 AM · Lunes a domingo
            </div>
          </div>
        )}

        {/* Email semanal */}
        {tab === 'semanal' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6">
              <p className="font-bold text-xl">📊 Resumen semanal</p>
              <p className="text-sm opacity-90 mt-1">Semana del 14 al 20 de abril de 2026 · 5 cuentas · 31 posts totales</p>
            </div>

            {/* Cuadro comparativo */}
            <div className="px-8 py-6">
              <p className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">Cuadro comparativo semanal</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="px-4 py-3 text-left font-semibold">Cuenta</th>
                      <th className="px-4 py-3 text-center font-semibold">Posts</th>
                      <th className="px-4 py-3 text-center font-semibold">Likes total</th>
                      <th className="px-4 py-3 text-center font-semibold">Eng. prom.</th>
                      <th className="px-4 py-3 text-center font-semibold">vs sem. ant.</th>
                      <th className="px-4 py-3 text-center font-semibold">Formato top</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cuenta: 'CafExpress', posts: 12, likes: '4.230', eng: '3.8%', vs: '+45%', vsColor: 'text-green-600', top: 'Reels' },
                      { cuenta: 'CorporateCoffee', posts: 8, likes: '2.890', eng: '2.1%', vs: '+12%', vsColor: 'text-green-600', top: 'Video' },
                      { cuenta: 'Nespresso Pro', posts: 6, likes: '8.450', eng: '5.2%', vs: '-8%', vsColor: 'text-red-500', top: 'Carrusel' },
                      { cuenta: 'EssentialCoffee', posts: 4, likes: '320', eng: '0.9%', vs: '+5%', vsColor: 'text-green-600', top: 'Imagen' },
                      { cuenta: 'Vendomatica', posts: 1, likes: '45', eng: '0.3%', vs: '-78%', vsColor: 'text-red-500', top: 'Imagen' },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-4 py-3 font-semibold text-gray-900">{row.cuenta}</td>
                        <td className="px-4 py-3 text-center">{row.posts}</td>
                        <td className="px-4 py-3 text-center">{row.likes}</td>
                        <td className="px-4 py-3 text-center font-medium">{row.eng}</td>
                        <td className={`px-4 py-3 text-center font-bold ${row.vsColor}`}>{row.vs}</td>
                        <td className="px-4 py-3 text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">{row.top}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Análisis semanal IA */}
            <div className="px-8 py-5 bg-indigo-50 border-t border-indigo-100">
              <p className="font-bold text-indigo-800 text-sm mb-2">🤖 Análisis semanal</p>
              <ul className="text-sm text-indigo-900 space-y-2">
                <li>• <strong>CafExpress domina en volumen:</strong> 12 posts con foco en promociones agresivas. Su engagement subió 45% gracias al reel de la promo "máquina gratis". Están en modo captación.</li>
                <li>• <strong>Nespresso Pro tiene el mejor engagement</strong> (5.2%) a pesar de publicar menos. Su contenido editorial premium sigue funcionando. Pero bajaron 8% vs semana anterior.</li>
                <li>• <strong>Vendomatica en caída libre:</strong> 1 solo post, engagement 0.3%, baja de 78%. Si son tu competidor directo, es el momento de ocupar ese espacio.</li>
              </ul>
            </div>

            {/* Tendencias */}
            <div className="px-8 py-5 bg-green-50 border-t border-green-100">
              <p className="font-bold text-green-800 text-sm mb-2">📈 Tendencias de la semana</p>
              <ul className="text-sm text-green-900 space-y-1.5">
                <li>• Los <strong>Reels</strong> generaron 3× más engagement que las imágenes estáticas en todas las cuentas.</li>
                <li>• El tema <strong>"café de especialidad" y "origen del grano"</strong> tuvo tracción alta esta semana. 3 de 5 competidores publicaron sobre esto.</li>
                <li>• <strong>Día con más engagement:</strong> martes. <strong>Peor día:</strong> sábado.</li>
              </ul>
            </div>

            {/* Recomendaciones */}
            <div className="px-8 py-5 bg-purple-50 border-t border-purple-100">
              <p className="font-bold text-purple-800 text-sm mb-2">💡 Recomendaciones para esta semana</p>
              <ul className="text-sm text-purple-900 space-y-1.5">
                <li>1. <strong>Contraataca la promo de CafExpress:</strong> su oferta termina el viernes. Publica tu propia propuesta de valor el lunes antes de que el mercado la olvide.</li>
                <li>2. <strong>Publica más Reels:</strong> son el formato que más tracciona en tu industria esta semana.</li>
                <li>3. <strong>Ocupa el espacio de Vendomatica:</strong> están inactivos. Si comparten audiencia, puedes captar seguidores con contenido consistente.</li>
              </ul>
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">
              Radar by Muller y Pérez · Resumen semanal · Todos los lunes a las 9:00 AM
            </div>
          </div>
        )}
      </section>

        {/* Email mensual */}
        {tab === 'mensual' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-8 py-6">
              <p className="font-bold text-xl">📅 Resumen mensual</p>
              <p className="text-sm opacity-90 mt-1">Abril 2026 · 5 cuentas · 127 posts totales · 30 días monitoreados</p>
            </div>

            {/* Ranking del mes */}
            <div className="px-8 py-6">
              <p className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">Ranking de actividad del mes</p>
              <div className="space-y-3">
                {[
                  { pos: '1', cuenta: 'CafExpress', posts: 48, likes: '18.400', eng: '3.5%', trend: 'Subió 2 posiciones', trendColor: 'text-green-600' },
                  { pos: '2', cuenta: 'Nespresso Pro', posts: 24, likes: '35.200', eng: '5.1%', trend: 'Bajó 1 posición', trendColor: 'text-red-500' },
                  { pos: '3', cuenta: 'CorporateCoffee', posts: 32, likes: '11.800', eng: '2.3%', trend: 'Se mantuvo', trendColor: 'text-gray-500' },
                  { pos: '4', cuenta: 'EssentialCoffee', posts: 16, likes: '1.280', eng: '0.8%', trend: 'Se mantuvo', trendColor: 'text-gray-500' },
                  { pos: '5', cuenta: 'Vendomatica', posts: 7, likes: '310', eng: '0.3%', trend: 'Bajó 1 posición', trendColor: 'text-red-500' },
                ].map((row) => (
                  <div key={row.pos} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${row.pos === '1' ? 'bg-yellow-100 text-yellow-700' : row.pos === '2' ? 'bg-gray-200 text-gray-600' : row.pos === '3' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>{row.pos}</div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900">{row.cuenta}</p>
                      <p className="text-xs text-gray-500">{row.posts} posts · {row.likes} likes · {row.eng} engagement</p>
                    </div>
                    <span className={`text-xs font-semibold ${row.trendColor}`}>{row.trend}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evolución mensual */}
            <div className="px-8 py-5 bg-indigo-50 border-t border-indigo-100">
              <p className="font-bold text-indigo-800 text-sm mb-2">🤖 Análisis del mes</p>
              <ul className="text-sm text-indigo-900 space-y-2">
                <li>• <strong>CafExpress fue el más agresivo del mes</strong> con 48 posts (1.6 por día). Su estrategia cambió de branding a captación directa con promociones. Engagement promedio subió de 2.1% a 3.5%.</li>
                <li>• <strong>Nespresso Pro mantiene el mejor engagement</strong> (5.1%) con solo 24 posts. Calidad sobre cantidad. Su contenido editorial premium sigue siendo referencia del mercado.</li>
                <li>• <strong>Vendomatica en declive sostenido:</strong> de 28 posts en marzo a solo 7 en abril. Posible reestructuración interna o cambio de agencia.</li>
              </ul>
            </div>

            {/* Tendencias del mes */}
            <div className="px-8 py-5 bg-green-50 border-t border-green-100">
              <p className="font-bold text-green-800 text-sm mb-2">📈 Tendencias del mes</p>
              <ul className="text-sm text-green-900 space-y-1.5">
                <li>• <strong>Formato ganador:</strong> Reels representaron el 45% de los posts y generaron el 68% del engagement total.</li>
                <li>• <strong>Temas que traccionaron:</strong> sustentabilidad, origen del café, bienestar en la oficina.</li>
                <li>• <strong>Mejor día para publicar:</strong> martes y jueves. Peor: sábado y domingo.</li>
                <li>• <strong>Horario óptimo:</strong> 8:00-9:00 AM y 12:00-13:00 PM.</li>
              </ul>
            </div>

            {/* Recomendaciones */}
            <div className="px-8 py-5 bg-purple-50 border-t border-purple-100">
              <p className="font-bold text-purple-800 text-sm mb-2">💡 Plan de acción para el próximo mes</p>
              <ul className="text-sm text-purple-900 space-y-1.5">
                <li>1. <strong>Aumenta Reels a 50%+ de tu contenido</strong> — es el formato que más tracciona en tu industria.</li>
                <li>2. <strong>Publica martes y jueves entre 8-9 AM</strong> — es cuando tu audiencia está más activa.</li>
                <li>3. <strong>Capitaliza la caída de Vendomatica</strong> — su audiencia está buscando alternativas. Aumenta frecuencia.</li>
                <li>4. <strong>Prueba contenido de sustentabilidad</strong> — 3 de 5 competidores están hablando de esto y funciona.</li>
              </ul>
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">
              Radar by Muller y Pérez · Resumen mensual · El 1ro de cada mes a las 9:00 AM
            </div>
          </div>
        )}
      </section>

      {/* ───── COMPARATIVA ───── */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Cómo se compara con otras herramientas</h2>
          <p className="text-gray-500 text-center mb-8">Precios en CLP al tipo de cambio actual. Planes anuales para comparación justa.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden bg-white">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-4 py-3 text-left font-semibold">Herramienta</th>
                  <th className="px-4 py-3 text-center font-semibold">Plan entry/mes</th>
                  <th className="px-4 py-3 text-center font-semibold">Plan medio/mes</th>
                  <th className="px-4 py-3 text-center font-semibold">Contrato</th>
                  <th className="px-4 py-3 text-center font-semibold">IA</th>
                  <th className="px-4 py-3 text-center font-semibold">Trial</th>
                </tr>
              </thead>
              <tbody>
                {COMPARATIVA.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${row.highlight ? 'bg-indigo-50 font-semibold' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className={`px-4 py-3 ${row.highlight ? 'text-indigo-700' : 'text-gray-900'}`}>{row.herramienta} {row.highlight && <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full ml-1">tú</span>}</td>
                    <td className={`px-4 py-3 text-center ${row.highlight ? 'text-indigo-700' : ''}`}>{row.entry}</td>
                    <td className={`px-4 py-3 text-center ${row.highlight ? 'text-indigo-700' : ''}`}>{row.medio}</td>
                    <td className="px-4 py-3 text-center">{row.contrato}</td>
                    <td className="px-4 py-3 text-center">{row.ia}</td>
                    <td className="px-4 py-3 text-center">{row.trial}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ───── POR QUÉ RADAR ───── */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">¿Por qué Radar y no otra herramienta?</h2>
        <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">La diferencia no está en el monitoreo. Está en lo que haces con la información después.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="font-bold mb-2">Otras herramientas te dan datos</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Un dashboard con 47 métricas que nadie abre. Gráficos bonitos que no te dicen qué hacer. Reportes PDF que se acumulan sin leer.</p>
          </div>
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-6">
            <div className="text-2xl mb-3">🧠</div>
            <h3 className="font-bold text-indigo-900 mb-2">Radar te da decisiones</h3>
            <p className="text-indigo-800 text-sm leading-relaxed">Un email que lees en 2 minutos con acciones concretas: "tu competidor lanzó esta promo, responde con esto", "este formato les funciona, pruébalo tú".</p>
          </div>
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
            <div className="text-2xl mb-3">⏰</div>
            <h3 className="font-bold mb-2">Tiempo que recuperas</h3>
            <p className="text-gray-500 text-sm leading-relaxed">¿Cuánto tiempo pierdes entrando a cada red social de cada competidor cada día? Radar lo hace por ti todas las mañanas antes de que despiertes.</p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-center mb-6">Decisiones que puedes tomar con Radar</h3>
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {[
            { situacion: 'Tu competidor lanza una promoción agresiva', accion: 'Reaccionas el mismo día con tu propia oferta antes de que capte a tus clientes.' },
            { situacion: 'Detectas que un competidor dejó de publicar', accion: 'Aumentas tu frecuencia de contenido para ocupar ese espacio en el feed de la audiencia compartida.' },
            { situacion: 'Un formato (Reels, carrusel) tiene 3× más engagement', accion: 'Ajustas tu grilla de contenido para priorizar ese formato la próxima semana.' },
            { situacion: 'Nadie en tu industria habla de un tema relevante', accion: 'Te posicionas primero como referente en ese tema antes de que los demás reaccionen.' },
            { situacion: 'Un competidor sube un testimonio de cliente', accion: 'Preparas tu propio caso de éxito para publicar antes de que la audiencia lo olvide.' },
            { situacion: 'El engagement de tu competencia baja semana a semana', accion: 'Sabes que su contenido no está resonando. Aprovechas para probar ángulos que ellos abandonaron.' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-sm font-semibold text-gray-900 mb-1">Situación: {item.situacion}</p>
              <p className="text-sm text-indigo-700">→ {item.accion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section className="px-6 py-16 max-w-5xl mx-auto" id="planes">
        <h2 className="text-2xl font-bold text-center mb-2">Planes</h2>
        <p className="text-gray-500 text-center mb-8">7 días gratis en todos los planes. Sin contrato. Cancela cuando quieras.</p>

        <div className="flex items-center justify-center gap-4 mb-10">
          <span className={`text-sm font-medium ${!anual ? 'text-gray-900' : 'text-gray-400'}`}>Mensual</span>
          <button onClick={() => setAnual(!anual)} className={`relative w-14 h-7 rounded-full transition ${anual ? 'bg-indigo-600' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${anual ? 'translate-x-7' : 'translate-x-0.5'}`} />
          </button>
          <span className={`text-sm font-medium ${anual ? 'text-gray-900' : 'text-gray-400'}`}>
            Anual <span className="text-green-600 text-xs font-bold ml-1">ahorra 20%</span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANES.map(plan => (
            <div key={plan.id} className={`relative rounded-2xl p-6 border-2 bg-white ${plan.popular ? 'border-indigo-600 shadow-xl shadow-indigo-600/10' : 'border-gray-200'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">Más popular</div>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.nombre}</h3>
              <p className="text-gray-500 text-sm mb-4">{plan.cuentas} cuentas · {plan.canales}</p>
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-gray-900">{formatCLP(anual ? plan.anual : plan.mensual)}</span>
                <span className="text-gray-500 text-sm"> /mes + IVA</span>
                {anual && <p className="text-green-600 text-xs mt-1 font-semibold">Ahorras {formatCLP((plan.mensual - plan.anual) * 12)} al año</p>}
              </div>
              <ul className="space-y-2 mb-6">
                {FEATURES.map(f => {
                  const included = f[plan.id as keyof typeof f]
                  return (
                    <li key={f.label} className={`flex items-start gap-2 text-sm ${included ? 'text-gray-700' : 'text-gray-300'}`}>
                      <span className={`mt-0.5 font-bold ${included ? 'text-green-500' : 'text-gray-300'}`}>{included ? '✓' : '—'}</span>
                      {f.label}
                    </li>
                  )
                })}
              </ul>
              <a href="#trial" className={`block text-center py-3 rounded-xl font-bold text-sm transition ${plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Prueba gratis 7 días
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ───── TRIAL FORM ───── */}
      <section className="bg-gray-50 px-6 py-16" id="trial">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Prueba gratis 7 días</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Pega hasta 3 cuentas de Instagram y recibe tu primer informe mañana a las 7 AM. Sin tarjeta de crédito.</p>

          {enviado ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">¡Activado!</h3>
              <p className="text-gray-500">Mañana a las 7:00 AM recibirás tu primer Radar en <strong className="text-gray-900">{trialEmail}</strong></p>
            </div>
          ) : (
            <form onSubmit={handleTrial} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tu email corporativo</label>
                <input type="email" required value={trialEmail} onChange={e => setTrialEmail(e.target.value)} placeholder="tu@empresa.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              {trialUrls.map((url, i) => (
                <div key={i}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Cuenta a monitorear {i + 1} {i > 0 && <span className="font-normal text-gray-400">(opcional)</span>}
                  </label>
                  <input type="text" required={i === 0} value={url} onChange={e => { const n = [...trialUrls]; n[i] = e.target.value; setTrialUrls(n) }}
                    placeholder="https://www.instagram.com/competidor/"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
              ))}
              <button type="submit" disabled={enviando}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-600/20">
                {enviando ? 'Activando...' : 'Activar prueba gratuita'}
              </button>
              <p className="text-center text-gray-400 text-xs">Sin tarjeta de crédito. 7 días gratis. Después eliges tu plan o se cancela solo.</p>
            </form>
          )}
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Preguntas frecuentes</h2>
        {[
          { q: '¿Necesito instalar algo?', a: 'No. Radar funciona 100% por email. No hay dashboard, no hay login, no hay app. Recibes el informe en tu bandeja de entrada cada mañana.' },
          { q: '¿Puedo monitorear cualquier cuenta?', a: 'Sí, cualquier cuenta pública de Instagram, Facebook o LinkedIn. No necesitas ser seguidor ni tener relación con la cuenta.' },
          { q: '¿Qué pasa después de los 7 días gratis?', a: 'Recibes un email para elegir tu plan. Si no eliges ninguno, el servicio se desactiva solo. Sin cargos, sin letra chica.' },
          { q: '¿Puedo cambiar las cuentas que monitoreo?', a: 'Sí, puedes agregar, quitar o cambiar cuentas en cualquier momento respondiendo al email o por WhatsApp.' },
          { q: '¿Cómo funciona el análisis con IA?', a: 'Usamos inteligencia artificial para leer todos los posts del día, identificar patrones (promociones, cambios de tono, contenido viral) y generar recomendaciones accionables en español.' },
          { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí. En planes mensuales cancelas cuando quieras con 0 penalización. En planes anuales, el servicio sigue activo hasta el fin del periodo pagado.' },
        ].map((item, i) => (
          <details key={i} className="border-b border-gray-200 py-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
              {item.q}
              <span className="text-gray-400 group-open:rotate-45 transition-transform text-xl">+</span>
            </summary>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-gray-50 px-6 py-10 text-center text-gray-500 text-sm border-t border-gray-200">
        <p>Radar es un producto de <a href="/" className="text-indigo-600 font-semibold hover:underline">Muller y Pérez</a> · Performance Marketing · Santiago, Chile</p>
        <p className="mt-1 text-gray-400">contacto@mulleryperez.cl · +56 9 5419 7432</p>
      </footer>
    </div>
  )
}
