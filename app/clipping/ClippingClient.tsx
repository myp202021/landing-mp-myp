'use client'

import React, { useState } from 'react'

function fmt(n: number) {
  return '$' + n.toLocaleString('es-CL')
}

export default function ClippingClient() {
  const [anual, setAnual] = useState(true)
  const [trialEmail, setTrialEmail] = useState('')
  const [url1, setUrl1] = useState('')
  const [url2, setUrl2] = useState('')
  const [url3, setUrl3] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [tab, setTab] = useState('diario')

  async function handleTrial(e: any) {
    e.preventDefault()
    setEnviando(true)
    var urls = [url1, url2, url3].filter(function(u: string) { return u.trim() !== '' })
    var cuentas = urls.map(function(u: string) {
      var m = u.match(/instagram\.com\/([^/?]+)/)
      return { red: 'instagram', handle: m ? m[1] : u.trim() }
    })
    try {
      var res = await fetch('/api/clipping/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trialEmail, cuentas: cuentas }),
      })
      if (res.ok) { setEnviado(true) }
    } catch (err) { console.error(err) }
    setEnviando(false)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-20">

      {/* HERO */}
      <section className="px-6 pt-12 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide">Nuevo producto M&P</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Sabes que publico tu competencia ayer?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed">
            Si la respuesta es no, estas tomando decisiones a ciegas.
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            Radar monitorea las cuentas de Instagram, Facebook y LinkedIn que tu elijas y te envia un informe cada manana a las 7 AM. Sin dashboards, sin login. Solo un email con todo lo que necesitas saber.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#trial" className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Prueba gratis 7 dias</a>
            <a href="#ejemplos" className="border-2 border-gray-200 text-gray-700 font-bold px-8 py-4 rounded-xl text-lg hover:border-indigo-300 hover:text-indigo-600 transition">Ver ejemplos de informes</a>
          </div>
        </div>
      </section>

      {/* PREGUNTAS QUE GENERAN URGENCIA */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Te has preguntado alguna vez...</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <p className="text-lg font-bold text-gray-900 mb-2">Por que mi competidor tiene mas engagement que yo?</p>
              <p className="text-sm text-gray-500">Radar te muestra exactamente que formatos y temas les funcionan. Cada dia, con numeros reales.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <p className="text-lg font-bold text-gray-900 mb-2">Mi competencia lanzo una promo y no me entere?</p>
              <p className="text-sm text-gray-500">Con Radar te habrias enterado a las 7 AM del mismo dia. Tiempo suficiente para reaccionar.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <p className="text-lg font-bold text-gray-900 mb-2">Cuanto tiempo pierdo revisando las redes de cada competidor?</p>
              <p className="text-sm text-gray-500">En promedio, 45 minutos al dia. Radar lo hace en 2 minutos de lectura cada manana.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <p className="text-lg font-bold text-gray-900 mb-2">Estoy publicando lo correcto o estoy copiando sin saber?</p>
              <p className="text-sm text-gray-500">El resumen semanal te compara contra tu competencia: frecuencia, engagement, formatos y temas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* QUE ES Y COMO FUNCIONA */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Que recibes con Radar</h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">Tres informes automaticos que llegan a tu email. Tu solo lees y decides.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">&#128225;</div>
              <h3 className="font-bold text-lg mb-2">Informe diario</h3>
              <p className="text-gray-500 text-sm">Todos los dias a las 7 AM. Cada post nuevo de tus competidores con texto, engagement y link directo. Resumen IA con lo que importa.</p>
              <p className="text-indigo-600 text-xs font-bold mt-3">Lunes a domingo, 7:00 AM</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">&#128202;</div>
              <h3 className="font-bold text-lg mb-2">Resumen semanal</h3>
              <p className="text-gray-500 text-sm">Cada lunes: cuadro comparativo con posts, likes, engagement, variacion vs semana anterior y formato top de cada cuenta. Recomendaciones de la IA.</p>
              <p className="text-purple-600 text-xs font-bold mt-3">Cada lunes, 9:00 AM</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">&#128197;</div>
              <h3 className="font-bold text-lg mb-2">Resumen mensual</h3>
              <p className="text-gray-500 text-sm">El 1ro de cada mes: ranking de actividad, tendencias del mes, mejor dia y horario para publicar, plan de accion para el mes siguiente.</p>
              <p className="text-green-600 text-xs font-bold mt-3">El 1ro de cada mes, 9:00 AM</p>
            </div>
          </div>
        </div>
      </section>

      {/* EJEMPLOS DE INFORME */}
      <section className="bg-gray-50 px-6 py-16" id="ejemplos">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Asi se ven los informes que recibes</h2>
          <p className="text-gray-500 text-center mb-8">Haz click en cada tab para ver el ejemplo completo.</p>

          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            <button onClick={function() { setTab('diario') }} className={'px-5 py-2.5 rounded-lg font-semibold text-sm transition ' + (tab === 'diario' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300')}>Informe diario</button>
            <button onClick={function() { setTab('semanal') }} className={'px-5 py-2.5 rounded-lg font-semibold text-sm transition ' + (tab === 'semanal' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300')}>Resumen semanal</button>
            <button onClick={function() { setTab('mensual') }} className={'px-5 py-2.5 rounded-lg font-semibold text-sm transition ' + (tab === 'mensual' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300')}>Resumen mensual</button>
          </div>

          {tab === 'diario' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6">
                <p className="font-bold text-xl">Tu Radar diario</p>
                <p className="text-sm opacity-90 mt-1">Jueves 17 de abril de 2026 | 5 cuentas monitoreadas | 8 posts nuevos</p>
              </div>
              <div className="px-8 py-5 bg-indigo-50 border-b border-indigo-100">
                <p className="font-bold text-indigo-800 text-sm mb-3">Resumen inteligente</p>
                <div className="space-y-2 text-sm text-indigo-900">
                  <p><strong>CafExpress</strong> lanzo promocion agresiva: maquina gratis por 3 meses. 847 likes, 4x su promedio habitual. Estan en modo captacion.</p>
                  <p><strong>CorporateCoffee</strong> publico testimonio video de Banco Estado. Primer contenido de social proof en 2 meses.</p>
                  <p><strong>Vendomatica</strong> lleva 5 dias sin publicar. Posible cambio de estrategia interna.</p>
                </div>
              </div>
              <div className="px-8 py-4 bg-green-50 border-b border-green-100">
                <p className="font-bold text-green-800 text-sm mb-1">Oportunidad detectada</p>
                <p className="text-sm text-green-900">Ningun competidor habla de cafe de especialidad para cowork. Angulo disponible para posicionarte esta semana.</p>
              </div>
              <div className="px-8 py-6">
                <p className="font-bold text-gray-900 text-sm mb-4 tracking-wide">Detalle por cuenta</p>
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-700">CE</div>
                    <div><p className="font-bold text-sm">CafExpress</p><p className="text-xs text-gray-500">@cafexpress.cl | Instagram | 3 posts</p></div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-2 border border-gray-100">
                    <p className="text-sm text-gray-800 mb-2">PROMO FLASH! Lleva una maquina de cafe automatica a tu oficina GRATIS por 3 meses. Solo hasta el viernes.</p>
                    <div className="flex gap-4 text-xs text-gray-500 items-center">
                      <span className="text-red-500 font-semibold">847 likes</span>
                      <span>92 comentarios</span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium">Imagen</span>
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">4x promedio</span>
                      <a href="#" className="text-indigo-600 font-semibold ml-auto">Ver post</a>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-2 border border-gray-100">
                    <p className="text-sm text-gray-800 mb-2">Nuestro blend del mes: Colombia Huila con notas a chocolate y frutos rojos.</p>
                    <div className="flex gap-4 text-xs text-gray-500 items-center">
                      <span>234 likes</span>
                      <span>18 comentarios</span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium">Carrusel</span>
                      <a href="#" className="text-indigo-600 font-semibold ml-auto">Ver post</a>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-sm text-amber-800 font-medium">Vendomatica: sin publicaciones en 24 horas (5 dias inactivos)</p>
                </div>
              </div>
              <div className="px-8 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">Radar by Muller y Perez | Informe diario automatico | 7:00 AM</div>
            </div>
          )}

          {tab === 'semanal' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6">
                <p className="font-bold text-xl">Resumen semanal</p>
                <p className="text-sm opacity-90 mt-1">Semana del 14 al 20 de abril de 2026 | 5 cuentas | 31 posts</p>
              </div>
              <div className="px-8 py-6">
                <p className="font-bold text-gray-900 text-sm mb-4 tracking-wide">Cuadro comparativo</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead><tr className="bg-gray-900 text-white text-xs">
                      <th className="px-4 py-3 text-left">Cuenta</th>
                      <th className="px-3 py-3 text-center">Posts</th>
                      <th className="px-3 py-3 text-center">Likes</th>
                      <th className="px-3 py-3 text-center">Eng.</th>
                      <th className="px-3 py-3 text-center">vs anterior</th>
                      <th className="px-3 py-3 text-center">Top formato</th>
                    </tr></thead>
                    <tbody className="text-xs">
                      <tr className="border-b"><td className="px-4 py-3 font-semibold">CafExpress</td><td className="px-3 py-3 text-center">12</td><td className="px-3 py-3 text-center">4.230</td><td className="px-3 py-3 text-center font-semibold">3.8%</td><td className="px-3 py-3 text-center text-green-600 font-bold">+45%</td><td className="px-3 py-3 text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Reels</span></td></tr>
                      <tr className="border-b bg-gray-50"><td className="px-4 py-3 font-semibold">CorporateCoffee</td><td className="px-3 py-3 text-center">8</td><td className="px-3 py-3 text-center">2.890</td><td className="px-3 py-3 text-center font-semibold">2.1%</td><td className="px-3 py-3 text-center text-green-600 font-bold">+12%</td><td className="px-3 py-3 text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Video</span></td></tr>
                      <tr className="border-b"><td className="px-4 py-3 font-semibold">Nespresso Pro</td><td className="px-3 py-3 text-center">6</td><td className="px-3 py-3 text-center">8.450</td><td className="px-3 py-3 text-center font-semibold">5.2%</td><td className="px-3 py-3 text-center text-red-500 font-bold">-8%</td><td className="px-3 py-3 text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Carrusel</span></td></tr>
                      <tr className="border-b bg-gray-50"><td className="px-4 py-3 font-semibold">EssentialCoffee</td><td className="px-3 py-3 text-center">4</td><td className="px-3 py-3 text-center">320</td><td className="px-3 py-3 text-center font-semibold">0.9%</td><td className="px-3 py-3 text-center text-green-600 font-bold">+5%</td><td className="px-3 py-3 text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Imagen</span></td></tr>
                      <tr><td className="px-4 py-3 font-semibold">Vendomatica</td><td className="px-3 py-3 text-center">1</td><td className="px-3 py-3 text-center">45</td><td className="px-3 py-3 text-center font-semibold">0.3%</td><td className="px-3 py-3 text-center text-red-500 font-bold">-78%</td><td className="px-3 py-3 text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Imagen</span></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="px-8 py-5 bg-indigo-50 border-t border-indigo-100">
                <p className="font-bold text-indigo-800 text-sm mb-2">Analisis de la semana</p>
                <div className="text-sm text-indigo-900 space-y-2">
                  <p><strong>CafExpress domina en volumen:</strong> 12 posts con foco en promociones agresivas. Engagement subio 45% gracias al reel de la promo.</p>
                  <p><strong>Nespresso tiene el mejor engagement</strong> (5.2%) a pesar de publicar menos. Contenido editorial premium.</p>
                  <p><strong>Vendomatica en caida:</strong> 1 solo post, engagement 0.3%, baja de 78%. Si comparten audiencia, es momento de ocupar ese espacio.</p>
                </div>
              </div>
              <div className="px-8 py-5 bg-purple-50 border-t border-purple-100">
                <p className="font-bold text-purple-800 text-sm mb-2">Que hacer esta semana</p>
                <div className="text-sm text-purple-900 space-y-1.5">
                  <p>1. <strong>Contraataca la promo de CafExpress</strong> antes de que el mercado la olvide.</p>
                  <p>2. <strong>Publica mas Reels</strong>: es el formato que mas tracciona esta semana.</p>
                  <p>3. <strong>Ocupa el espacio de Vendomatica:</strong> estan inactivos. Aumenta frecuencia.</p>
                </div>
              </div>
              <div className="px-8 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">Radar by Muller y Perez | Resumen semanal | Cada lunes 9:00 AM</div>
            </div>
          )}

          {tab === 'mensual' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white px-8 py-6">
                <p className="font-bold text-xl">Resumen mensual</p>
                <p className="text-sm opacity-90 mt-1">Abril 2026 | 5 cuentas | 127 posts | 30 dias monitoreados</p>
              </div>
              <div className="px-8 py-6">
                <p className="font-bold text-gray-900 text-sm mb-4 tracking-wide">Ranking del mes</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-yellow-200 text-yellow-800">1</div>
                    <div className="flex-1"><p className="font-bold text-sm">CafExpress</p><p className="text-xs text-gray-500">48 posts | 18.400 likes | 3.5% engagement</p></div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Subio 2 pos.</span>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-700">2</div>
                    <div className="flex-1"><p className="font-bold text-sm">Nespresso Pro</p><p className="text-xs text-gray-500">24 posts | 35.200 likes | 5.1% engagement</p></div>
                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">Bajo 1 pos.</span>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-orange-100 text-orange-700">3</div>
                    <div className="flex-1"><p className="font-bold text-sm">CorporateCoffee</p><p className="text-xs text-gray-500">32 posts | 11.800 likes | 2.3% engagement</p></div>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">Igual</span>
                  </div>
                </div>
              </div>
              <div className="px-8 py-5 bg-green-50 border-t border-green-100">
                <p className="font-bold text-green-800 text-sm mb-2">Tendencias del mes</p>
                <div className="text-sm text-green-900 space-y-1.5">
                  <p><strong>Formato ganador:</strong> Reels = 45% de posts pero 68% del engagement total.</p>
                  <p><strong>Temas que traccionaron:</strong> sustentabilidad, origen del cafe, bienestar oficina.</p>
                  <p><strong>Mejor dia:</strong> martes y jueves. <strong>Mejor hora:</strong> 8-9 AM y 12-13 PM.</p>
                </div>
              </div>
              <div className="px-8 py-5 bg-purple-50 border-t border-purple-100">
                <p className="font-bold text-purple-800 text-sm mb-2">Plan de accion para mayo</p>
                <div className="text-sm text-purple-900 space-y-1.5">
                  <p>1. Aumenta Reels a 50%+ de tu contenido.</p>
                  <p>2. Publica martes y jueves entre 8-9 AM.</p>
                  <p>3. Capitaliza la caida de Vendomatica: su audiencia busca alternativas.</p>
                  <p>4. Prueba contenido de sustentabilidad: 3 de 5 competidores ya lo hacen.</p>
                </div>
              </div>
              <div className="px-8 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">Radar by Muller y Perez | Resumen mensual | El 1ro de cada mes 9:00 AM</div>
            </div>
          )}
        </div>
      </section>

      {/* POR QUE RADAR */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Otras herramientas te dan datos. Radar te da decisiones.</h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">La diferencia no esta en monitorear. Esta en lo que haces con la informacion despues.</p>
          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="font-bold text-gray-900 mb-2">Tu competidor lanza una promo agresiva</p>
              <p className="text-sm text-indigo-700 font-medium">Reaccionas el mismo dia con tu propia oferta.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="font-bold text-gray-900 mb-2">Un competidor deja de publicar</p>
              <p className="text-sm text-indigo-700 font-medium">Aumentas frecuencia para ocupar ese espacio en el feed.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="font-bold text-gray-900 mb-2">Un formato tiene 3x mas engagement</p>
              <p className="text-sm text-indigo-700 font-medium">Ajustas tu grilla para priorizar ese formato la proxima semana.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="font-bold text-gray-900 mb-2">Nadie habla de un tema relevante</p>
              <p className="text-sm text-indigo-700 font-medium">Te posicionas primero como referente antes que los demas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARATIVA */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Comparativa con otras herramientas</h2>
          <p className="text-gray-500 text-center mb-8">Precios en CLP, planes anuales para comparacion justa.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden bg-white">
              <thead><tr className="bg-gray-900 text-white text-xs">
                <th className="px-4 py-3 text-left">Herramienta</th>
                <th className="px-4 py-3 text-center">Desde</th>
                <th className="px-4 py-3 text-center">Plan medio</th>
                <th className="px-4 py-3 text-center">Contrato</th>
                <th className="px-4 py-3 text-center">IA</th>
                <th className="px-4 py-3 text-center">Trial</th>
              </tr></thead>
              <tbody className="text-xs">
                <tr className="bg-indigo-50 font-semibold border-b"><td className="px-4 py-3 text-indigo-700">Radar M&P <span className="bg-indigo-600 text-white px-1.5 py-0.5 rounded text-[10px] ml-1">tu</span></td><td className="px-4 py-3 text-center text-indigo-700">$27.990</td><td className="px-4 py-3 text-center text-indigo-700">$54.990</td><td className="px-4 py-3 text-center">Mes a mes</td><td className="px-4 py-3 text-center">Nativo espanol</td><td className="px-4 py-3 text-center">7 dias gratis</td></tr>
                <tr className="border-b"><td className="px-4 py-3">Brand24</td><td className="px-4 py-3 text-center">$76.000</td><td className="px-4 py-3 text-center">$143.000</td><td className="px-4 py-3 text-center">Anual obligatorio</td><td className="px-4 py-3 text-center">Ingles</td><td className="px-4 py-3 text-center">14 dias</td></tr>
                <tr className="border-b bg-gray-50"><td className="px-4 py-3">Mention</td><td className="px-4 py-3 text-center">$39.000</td><td className="px-4 py-3 text-center">$80.000</td><td className="px-4 py-3 text-center">Anual obligatorio</td><td className="px-4 py-3 text-center">No</td><td className="px-4 py-3 text-center">14 dias</td></tr>
                <tr><td className="px-4 py-3">Meltwater</td><td className="px-4 py-3 text-center">$480.000</td><td className="px-4 py-3 text-center">$960.000</td><td className="px-4 py-3 text-center">Anual 12 meses</td><td className="px-4 py-3 text-center">Si</td><td className="px-4 py-3 text-center">No</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 py-16" id="planes">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Planes</h2>
          <p className="text-gray-500 text-center mb-8">7 dias gratis. Sin contrato. Cancela cuando quieras.</p>
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className={'text-sm font-medium ' + (!anual ? 'text-gray-900' : 'text-gray-400')}>Mensual</span>
            <button onClick={function() { setAnual(!anual) }} className={'relative w-14 h-7 rounded-full transition ' + (anual ? 'bg-indigo-600' : 'bg-gray-300')}>
              <div className={'absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ' + (anual ? 'translate-x-7' : 'translate-x-0.5')} />
            </button>
            <span className={'text-sm font-medium ' + (anual ? 'text-gray-900' : 'text-gray-400')}>Anual <span className="text-green-600 text-xs font-bold ml-1">-20%</span></span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl p-6 border-2 bg-white border-gray-200">
              <h3 className="text-xl font-bold mb-1">Starter</h3>
              <p className="text-gray-500 text-sm mb-4">5 cuentas | Solo Instagram</p>
              <div className="mb-6"><span className="text-3xl font-extrabold">{fmt(anual ? 27990 : 34990)}</span><span className="text-gray-500 text-sm"> /mes + IVA</span></div>
              <ul className="space-y-2 mb-6 text-sm text-gray-700">
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Email diario con posts</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Engagement por post</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Link directo</li>
                <li className="flex gap-2 text-gray-300"><span>-</span> Facebook y LinkedIn</li>
                <li className="flex gap-2 text-gray-300"><span>-</span> Resumen semanal IA</li>
                <li className="flex gap-2 text-gray-300"><span>-</span> Resumen mensual</li>
              </ul>
              <a href="#trial" className="block text-center py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Prueba gratis</a>
            </div>
            <div className="relative rounded-2xl p-6 border-2 bg-white border-indigo-600 shadow-xl shadow-indigo-100">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">Mas popular</div>
              <h3 className="text-xl font-bold mb-1">Pro</h3>
              <p className="text-gray-500 text-sm mb-4">15 cuentas | IG + FB + LinkedIn</p>
              <div className="mb-6"><span className="text-3xl font-extrabold">{fmt(anual ? 54990 : 69990)}</span><span className="text-gray-500 text-sm"> /mes + IVA</span></div>
              <ul className="space-y-2 mb-6 text-sm text-gray-700">
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Todo lo de Starter</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Facebook y LinkedIn</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Resumen semanal IA (lunes)</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Resumen mensual (1ro)</li>
                <li className="flex gap-2 text-gray-300"><span>-</span> Alertas por keyword</li>
                <li className="flex gap-2 text-gray-300"><span>-</span> Benchmark semanal</li>
              </ul>
              <a href="#trial" className="block text-center py-3 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition">Prueba gratis</a>
            </div>
            <div className="rounded-2xl p-6 border-2 bg-white border-gray-200">
              <h3 className="text-xl font-bold mb-1">Business</h3>
              <p className="text-gray-500 text-sm mb-4">30 cuentas | IG + FB + LinkedIn</p>
              <div className="mb-6"><span className="text-3xl font-extrabold">{fmt(anual ? 94990 : 119990)}</span><span className="text-gray-500 text-sm"> /mes + IVA</span></div>
              <ul className="space-y-2 mb-6 text-sm text-gray-700">
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Todo lo de Pro</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Analisis IA diario</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Alertas por keyword</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Benchmark semanal</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Export Excel semanal</li>
              </ul>
              <a href="#trial" className="block text-center py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Prueba gratis</a>
            </div>
          </div>
        </div>
      </section>

      {/* TRIAL */}
      <section className="bg-gray-50 px-6 py-16" id="trial">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Activa tu Radar en 30 segundos</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Pega hasta 3 cuentas de Instagram. Tu primer informe llega manana a las 7 AM. Sin tarjeta.</p>
          {enviado ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">&#10003;</div>
              <h3 className="text-xl font-bold mb-2">Radar activado</h3>
              <p className="text-gray-500">Manana a las 7:00 AM recibiras tu primer informe en <strong className="text-gray-900">{trialEmail}</strong></p>
            </div>
          ) : (
            <form onSubmit={handleTrial} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tu email</label>
                <input type="email" required value={trialEmail} onChange={function(e: any) { setTrialEmail(e.target.value) }} placeholder="tu@empresa.com" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cuenta a monitorear 1</label>
                <input type="text" required value={url1} onChange={function(e: any) { setUrl1(e.target.value) }} placeholder="https://www.instagram.com/competidor/" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cuenta 2 <span className="font-normal text-gray-400">(opcional)</span></label>
                <input type="text" value={url2} onChange={function(e: any) { setUrl2(e.target.value) }} placeholder="https://www.instagram.com/competidor2/" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cuenta 3 <span className="font-normal text-gray-400">(opcional)</span></label>
                <input type="text" value={url3} onChange={function(e: any) { setUrl3(e.target.value) }} placeholder="https://www.instagram.com/competidor3/" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button type="submit" disabled={enviando} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-200">
                {enviando ? 'Activando...' : 'Activar prueba gratuita'}
              </button>
              <p className="text-center text-gray-400 text-xs">Sin tarjeta. 7 dias gratis. Se cancela solo si no eliges plan.</p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Preguntas frecuentes</h2>
        <div className="space-y-0">
          <details className="border-b border-gray-200 py-4 group"><summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">Necesito instalar algo?<span className="text-gray-400 group-open:rotate-45 transition-transform text-xl ml-4">+</span></summary><p className="text-gray-600 text-sm mt-3 leading-relaxed">No. Radar funciona 100% por email. No hay dashboard, no hay login, no hay app. Solo tu bandeja de entrada.</p></details>
          <details className="border-b border-gray-200 py-4 group"><summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">Puedo monitorear cualquier cuenta?<span className="text-gray-400 group-open:rotate-45 transition-transform text-xl ml-4">+</span></summary><p className="text-gray-600 text-sm mt-3 leading-relaxed">Si, cualquier cuenta publica de Instagram, Facebook o LinkedIn. No necesitas ser seguidor.</p></details>
          <details className="border-b border-gray-200 py-4 group"><summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">Que pasa despues de los 7 dias?<span className="text-gray-400 group-open:rotate-45 transition-transform text-xl ml-4">+</span></summary><p className="text-gray-600 text-sm mt-3 leading-relaxed">Recibes un email para elegir plan. Si no eliges, el servicio se desactiva solo. Sin cargos ni letra chica.</p></details>
          <details className="border-b border-gray-200 py-4 group"><summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">Como funciona el analisis con IA?<span className="text-gray-400 group-open:rotate-45 transition-transform text-xl ml-4">+</span></summary><p className="text-gray-600 text-sm mt-3 leading-relaxed">Usamos inteligencia artificial para leer todos los posts, identificar patrones y generar recomendaciones accionables en espanol.</p></details>
          <details className="border-b border-gray-200 py-4 group"><summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">Puedo cancelar en cualquier momento?<span className="text-gray-400 group-open:rotate-45 transition-transform text-xl ml-4">+</span></summary><p className="text-gray-600 text-sm mt-3 leading-relaxed">Si. Planes mensuales cancelan cuando quieras. Anuales siguen activos hasta el fin del periodo.</p></details>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-50 px-6 py-10 text-center text-gray-500 text-sm border-t border-gray-200">
        <p>Radar es un producto de <a href="/" className="text-indigo-600 font-semibold hover:underline">Muller y Perez</a> | Performance Marketing | Santiago, Chile</p>
        <p className="mt-1 text-gray-400">contacto@mulleryperez.cl</p>
      </footer>
    </div>
  )
}
