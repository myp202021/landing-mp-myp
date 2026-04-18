'use client'

import React, { useState } from 'react'

function fmt(n: number) {
  return '$' + n.toLocaleString('es-CL')
}

export default function ClippingClient() {
  var _a = useState(true), anual = _a[0], setAnual = _a[1]
  var _b = useState(''), trialEmail = _b[0], setTrialEmail = _b[1]
  var _c = useState(''), url1 = _c[0], setUrl1 = _c[1]
  var _d = useState(''), url2 = _d[0], setUrl2 = _d[1]
  var _e = useState(''), url3 = _e[0], setUrl3 = _e[1]
  var _f = useState(false), enviado = _f[0], setEnviado = _f[1]
  var _g = useState(false), enviando = _g[0], setEnviando = _g[1]
  var _h = useState('diario'), tab = _h[0], setTab = _h[1]

  async function handleTrial(e: any) {
    e.preventDefault()
    setEnviando(true)
    var urls = [url1, url2, url3].filter(function(u) { return u.trim() !== '' })
    var cuentas = urls.map(function(u) {
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
      <section className="px-6 pt-16 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide">Inteligencia competitiva + contenido listo para publicar</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Sabe que publica tu competencia.<br/>Y que deberias publicar tu.
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed">
            Radar monitorea a tus competidores en Instagram, Facebook y LinkedIn, analiza que les funciona y te entrega copies listos para publicar cada semana.
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            No es solo un monitor. Es tu pipeline de contenido competitivo: scraping + analisis IA + copies revisados + grilla mensual. Todo en tu email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#trial" className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Prueba gratis 7 dias</a>
            <a href="#ejemplos" className="border-2 border-gray-200 text-gray-700 font-bold px-8 py-4 rounded-xl text-lg hover:border-indigo-300 hover:text-indigo-600 transition">Ver ejemplos de informes</a>
          </div>
        </div>
      </section>

      {/* QUE RECIBES */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Que recibes con Radar</h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">Tres entregas automaticas en tu email. Tu solo lees, publicas y decides.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-indigo-600 mb-3">DIARIO - 7:30 AM</div>
              <h3 className="font-bold text-lg mb-3">Monitor de actividad</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-indigo-500 font-bold">*</span> Posts nuevos por red social</li>
                <li className="flex gap-2"><span className="text-indigo-500 font-bold">*</span> Engagement y metricas clave</li>
                <li className="flex gap-2"><span className="text-indigo-500 font-bold">*</span> Analisis IA: que hicieron y por que importa</li>
                <li className="flex gap-2"><span className="text-indigo-500 font-bold">*</span> Alertas: promos, ofertas laborales, inactividad</li>
                <li className="flex gap-2"><span className="text-indigo-500 font-bold">*</span> PDF adjunto listo para compartir</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-indigo-600 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">Diferenciador</div>
              <div className="text-xs font-bold text-indigo-600 mb-3">SEMANAL - Lunes 9 AM</div>
              <h3 className="font-bold text-lg mb-3">Comparativo + copies listos</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-indigo-500 font-bold">*</span> Cuadro comparativo y ranking</li>
                <li className="flex gap-2"><span className="text-indigo-500 font-bold">*</span> Tendencias y formato ganador</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">+</span> <strong>3 copies sugeridos listos para publicar</strong></li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">+</span> Generados con OpenAI + Claude + QA</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">+</span> Basados en lo que funciona en tu industria</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-indigo-600 mb-3">MENSUAL - 1ro a las 9 AM</div>
              <h3 className="font-bold text-lg mb-3">Brief + grilla completa</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-indigo-500 font-bold">*</span> Brief de consultoria estrategica</li>
                <li className="flex gap-2"><span className="text-indigo-500 font-bold">*</span> Posicionamiento vs competidores</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">+</span> <strong>Grilla mensual: 16 posts con copy listo</strong></li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">+</span> Calendario sugerido con dias y horarios</li>
                <li className="flex gap-2"><span className="text-indigo-500 font-bold">*</span> PDF + Excel adjuntos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EJEMPLO EMAIL */}
      <section className="px-6 py-16" id="ejemplos">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Asi se ven los informes que recibes</h2>
          <p className="text-gray-500 text-center mb-8">Haz click en cada tab para ver un ejemplo.</p>
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            <button onClick={function() { setTab('diario') }} className={'px-5 py-2.5 rounded-lg font-semibold text-sm transition ' + (tab === 'diario' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300')}>Diario</button>
            <button onClick={function() { setTab('semanal') }} className={'px-5 py-2.5 rounded-lg font-semibold text-sm transition ' + (tab === 'semanal' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300')}>Semanal</button>
            <button onClick={function() { setTab('mensual') }} className={'px-5 py-2.5 rounded-lg font-semibold text-sm transition ' + (tab === 'mensual' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300')}>Mensual</button>
          </div>

          {tab === 'diario' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6">
                <p className="font-bold text-xl">Tu Radar diario</p>
                <p className="text-sm opacity-90 mt-1">Martes 15 de abril de 2026 | 5 cuentas | 8 posts nuevos</p>
              </div>
              <div className="px-8 py-5 bg-indigo-50 border-b border-indigo-100">
                <p className="font-bold text-indigo-800 text-sm mb-2">Resumen IA</p>
                <p className="text-sm text-indigo-900"><strong>CafExpress</strong> lanzo promo agresiva (847 likes, 4x su promedio). <strong>Vendomatica</strong> lleva 5 dias inactivo.</p>
              </div>
              <div className="px-8 py-5 bg-green-50 border-b border-green-100">
                <p className="font-bold text-green-800 text-sm mb-1">Oportunidad detectada</p>
                <p className="text-sm text-green-900">Ningun competidor habla de cafe de especialidad para cowork. Angulo disponible.</p>
              </div>
              <div className="px-8 py-5">
                <p className="font-bold text-gray-900 text-sm mb-3">Detalle por cuenta</p>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-2">
                  <p className="text-sm font-semibold text-gray-900 mb-1">CafExpress - 3 posts</p>
                  <p className="text-sm text-gray-600 mb-2">PROMO FLASH! Maquina de cafe gratis por 3 meses...</p>
                  <div className="flex gap-3 text-xs text-gray-500"><span className="text-red-500 font-semibold">847 likes</span><span>92 comentarios</span><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">4x promedio</span></div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <p className="text-sm text-amber-800 font-medium">Vendomatica: 5 dias sin publicar</p>
                </div>
              </div>
              <div className="px-8 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">Radar by Muller y Perez | Informe diario | 7:30 AM</div>
            </div>
          )}

          {tab === 'semanal' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6">
                <p className="font-bold text-xl">Resumen semanal + copies sugeridos</p>
                <p className="text-sm opacity-90 mt-1">Semana del 7 al 13 de abril | 5 cuentas | 31 posts</p>
              </div>
              <div className="px-8 py-5">
                <p className="font-bold text-gray-900 text-sm mb-3">Cuadro comparativo</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead><tr className="bg-gray-900 text-white text-xs">
                      <th className="px-4 py-3 text-left">Cuenta</th>
                      <th className="px-3 py-3 text-center">Posts</th>
                      <th className="px-3 py-3 text-center">Eng.</th>
                      <th className="px-3 py-3 text-center">vs ant.</th>
                      <th className="px-3 py-3 text-center">Top formato</th>
                    </tr></thead>
                    <tbody className="text-xs">
                      <tr className="border-b"><td className="px-4 py-2.5 font-semibold">CafExpress</td><td className="px-3 py-2.5 text-center">12</td><td className="px-3 py-2.5 text-center">3.8%</td><td className="px-3 py-2.5 text-center text-green-600 font-bold">+45%</td><td className="px-3 py-2.5 text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Reels</span></td></tr>
                      <tr className="border-b bg-gray-50"><td className="px-4 py-2.5 font-semibold">Nespresso Pro</td><td className="px-3 py-2.5 text-center">6</td><td className="px-3 py-2.5 text-center">5.2%</td><td className="px-3 py-2.5 text-center text-red-500 font-bold">-8%</td><td className="px-3 py-2.5 text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Carrusel</span></td></tr>
                      <tr className="border-b"><td className="px-4 py-2.5 font-semibold">Vendomatica</td><td className="px-3 py-2.5 text-center">1</td><td className="px-3 py-2.5 text-center">0.3%</td><td className="px-3 py-2.5 text-center text-red-500 font-bold">-78%</td><td className="px-3 py-2.5 text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Imagen</span></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="px-8 py-5 bg-green-50 border-t border-green-100">
                <p className="font-bold text-green-800 text-sm mb-3">3 copies sugeridos para esta semana</p>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex gap-2 items-center mb-2"><span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded">Reel</span><span className="text-xs text-gray-500">Respuesta a promo CafExpress</span></div>
                    <p className="text-sm text-gray-800">Tu oficina merece cafe de verdad. Prueba gratis 1 semana: sin compromisos, sin letras chicas, sin maquinas genericas...</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex gap-2 items-center mb-2"><span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded">Carrusel</span><span className="text-xs text-gray-500">Angulo diferenciador: cafe especialidad</span></div>
                    <p className="text-sm text-gray-800">5 senales de que tu cafe de oficina necesita un upgrade. Slide 1: Si todos pasan de largo la cafetera...</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex gap-2 items-center mb-2"><span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">Testimonio</span><span className="text-xs text-gray-500">Social proof (competidor lo uso esta semana)</span></div>
                    <p className="text-sm text-gray-800">Desde que cambiamos el cafe en la oficina, las reuniones de las 9 AM dejaron de ser un castigo...</p>
                  </div>
                </div>
                <p className="text-xs text-green-700 mt-3 font-medium">Generados con OpenAI + Claude + revision QA automatica. Listos para adaptar y publicar.</p>
              </div>
              <div className="px-8 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">Radar by Muller y Perez | Semanal | Lunes 9:00 AM</div>
            </div>
          )}

          {tab === 'mensual' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white px-8 py-6">
                <p className="font-bold text-xl">Brief mensual + grilla de contenido</p>
                <p className="text-sm opacity-90 mt-1">Abril 2026 | 5 cuentas | 127 posts analizados</p>
              </div>
              <div className="px-8 py-5">
                <p className="font-bold text-gray-900 text-sm mb-3">Ranking del mes</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-yellow-50 rounded-xl p-3 border border-yellow-200">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-yellow-200 text-yellow-800">1</div>
                    <div className="flex-1"><p className="font-bold text-sm">CafExpress</p><p className="text-xs text-gray-500">48 posts | 3.5% engagement</p></div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-700">2</div>
                    <div className="flex-1"><p className="font-bold text-sm">Nespresso Pro</p><p className="text-xs text-gray-500">24 posts | 5.1% engagement</p></div>
                  </div>
                </div>
              </div>
              <div className="px-8 py-5 bg-indigo-50 border-t border-indigo-100">
                <p className="font-bold text-indigo-800 text-sm mb-2">Brief de posicionamiento</p>
                <p className="text-sm text-indigo-900">Tu marca publica menos que CafExpress pero con mejor engagement por post. Oportunidad en contenido educativo (nadie lo hace) y en horario martes/jueves 8-9 AM.</p>
              </div>
              <div className="px-8 py-5 bg-green-50 border-t border-green-100">
                <p className="font-bold text-green-800 text-sm mb-3">Grilla mensual: 16 posts con copy listo</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-green-200 rounded-lg overflow-hidden">
                    <thead><tr className="bg-green-800 text-white">
                      <th className="px-3 py-2 text-left">Dia</th>
                      <th className="px-3 py-2 text-left">Formato</th>
                      <th className="px-3 py-2 text-left">Tema</th>
                    </tr></thead>
                    <tbody>
                      <tr className="border-b border-green-100"><td className="px-3 py-2">Mar 6</td><td className="px-3 py-2"><span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Reel</span></td><td className="px-3 py-2">Detras de escena: proceso de tueste</td></tr>
                      <tr className="border-b border-green-100 bg-green-50/50"><td className="px-3 py-2">Jue 8</td><td className="px-3 py-2"><span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Carrusel</span></td><td className="px-3 py-2">5 errores al elegir cafe para oficina</td></tr>
                      <tr className="border-b border-green-100"><td className="px-3 py-2">Mar 13</td><td className="px-3 py-2"><span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Testimonio</span></td><td className="px-3 py-2">Caso de exito cliente corporativo</td></tr>
                      <tr className="border-b border-green-100 bg-green-50/50"><td className="px-3 py-2">Jue 15</td><td className="px-3 py-2"><span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Reel</span></td><td className="px-3 py-2">Comparativa: cafe generico vs especialidad</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-green-700 mt-2">+ 12 posts mas en el PDF adjunto con copy completo y hashtags.</p>
              </div>
              <div className="px-8 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">Radar by Muller y Perez | Brief mensual | 1ro de cada mes 9:00 AM</div>
            </div>
          )}
        </div>
      </section>

      {/* POR QUE RADAR */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">No te decimos que paso. Te decimos que hacer.</h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">Otras herramientas te dan datos. Radar te da decisiones y contenido listo.</p>
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <p className="font-bold text-gray-900 mb-2">Tu competidor lanza una promo</p>
              <p className="text-sm text-indigo-700 font-medium">Reaccionas el mismo dia con copy sugerido listo.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <p className="font-bold text-gray-900 mb-2">Un competidor deja de publicar</p>
              <p className="text-sm text-indigo-700 font-medium">Aumentas frecuencia para ocupar ese espacio.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <p className="font-bold text-gray-900 mb-2">Un formato tiene 3x mas engagement</p>
              <p className="text-sm text-indigo-700 font-medium">Tu grilla del mes ya lo prioriza automaticamente.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <p className="font-bold text-gray-900 mb-2">Nadie habla de un tema relevante</p>
              <p className="text-sm text-indigo-700 font-medium">Recibes el copy listo para posicionarte primero.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <p className="font-bold text-gray-900 mb-2">No sabes que publicar esta semana</p>
              <p className="text-sm text-indigo-700 font-medium">3 copies llegan cada lunes basados en data real.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <p className="font-bold text-gray-900 mb-2">Necesitas planificar el mes completo</p>
              <p className="text-sm text-indigo-700 font-medium">Grilla de 16 posts con calendario y copy el dia 1.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARATIVA */}
      <section className="px-6 py-16">
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
                <th className="px-4 py-3 text-center">Copies listos</th>
              </tr></thead>
              <tbody className="text-xs">
                <tr className="bg-indigo-50 font-semibold border-b"><td className="px-4 py-3 text-indigo-700">Radar M&P <span className="bg-indigo-600 text-white px-1.5 py-0.5 rounded text-[10px] ml-1">tu</span></td><td className="px-4 py-3 text-center text-indigo-700">$27.990</td><td className="px-4 py-3 text-center text-indigo-700">$54.990</td><td className="px-4 py-3 text-center">Mes a mes</td><td className="px-4 py-3 text-center">Nativo espanol</td><td className="px-4 py-3 text-center text-green-600 font-bold">Si</td></tr>
                <tr className="border-b"><td className="px-4 py-3">Brand24</td><td className="px-4 py-3 text-center">$76.000</td><td className="px-4 py-3 text-center">$143.000</td><td className="px-4 py-3 text-center">Anual obligatorio</td><td className="px-4 py-3 text-center">Ingles</td><td className="px-4 py-3 text-center text-gray-400">No</td></tr>
                <tr className="border-b bg-gray-50"><td className="px-4 py-3">Mention</td><td className="px-4 py-3 text-center">$39.000</td><td className="px-4 py-3 text-center">$80.000</td><td className="px-4 py-3 text-center">Anual obligatorio</td><td className="px-4 py-3 text-center">No</td><td className="px-4 py-3 text-center text-gray-400">No</td></tr>
                <tr><td className="px-4 py-3">Meltwater</td><td className="px-4 py-3 text-center">$480.000</td><td className="px-4 py-3 text-center">$960.000</td><td className="px-4 py-3 text-center">Anual 12 meses</td><td className="px-4 py-3 text-center">Si</td><td className="px-4 py-3 text-center text-gray-400">No</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-gray-50 px-6 py-16" id="planes">
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
                <li className="flex gap-2 text-gray-300"><span>-</span> Copies semanales</li>
                <li className="flex gap-2 text-gray-300"><span>-</span> Grilla mensual</li>
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
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Resumen semanal IA</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> 3 copies semanales listos</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Grilla mensual 16 posts</li>
                <li className="flex gap-2 text-gray-300"><span>-</span> Alertas por keyword</li>
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
      <section className="px-6 py-16" id="trial">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Activa tu Radar en 30 segundos</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Pega hasta 3 cuentas de Instagram. Tu primer informe llega manana a las 7:30 AM. Sin tarjeta.</p>
          {enviado ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">&#10003;</div>
              <h3 className="text-xl font-bold mb-2">Radar activado</h3>
              <p className="text-gray-500">Manana a las 7:30 AM recibiras tu primer informe en <strong className="text-gray-900">{trialEmail}</strong></p>
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
      <section className="bg-gray-50 px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Preguntas frecuentes</h2>
        <div className="space-y-0">
          <details className="border-b border-gray-200 py-4 group"><summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">Necesito instalar algo?<span className="text-gray-400 group-open:rotate-45 transition-transform text-xl ml-4">+</span></summary><p className="text-gray-600 text-sm mt-3 leading-relaxed">No. Radar funciona 100% por email. No hay dashboard, no hay login, no hay app. Solo tu bandeja de entrada.</p></details>
          <details className="border-b border-gray-200 py-4 group"><summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">Puedo monitorear cualquier cuenta?<span className="text-gray-400 group-open:rotate-45 transition-transform text-xl ml-4">+</span></summary><p className="text-gray-600 text-sm mt-3 leading-relaxed">Si, cualquier cuenta publica de Instagram, Facebook o LinkedIn. No necesitas ser seguidor.</p></details>
          <details className="border-b border-gray-200 py-4 group"><summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">Como se generan los copies sugeridos?<span className="text-gray-400 group-open:rotate-45 transition-transform text-xl ml-4">+</span></summary><p className="text-gray-600 text-sm mt-3 leading-relaxed">Analizamos que funciona en tu industria con IA (OpenAI + Claude). Los copies pasan por un revisor automatico de calidad antes de enviarse. Tu los adaptas y publicas.</p></details>
          <details className="border-b border-gray-200 py-4 group"><summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">Que incluye la grilla mensual?<span className="text-gray-400 group-open:rotate-45 transition-transform text-xl ml-4">+</span></summary><p className="text-gray-600 text-sm mt-3 leading-relaxed">16 posts con formato sugerido, tema, copy completo, hashtags y calendario con dias y horarios optimos. Llega en PDF y Excel el 1ro de cada mes.</p></details>
          <details className="border-b border-gray-200 py-4 group"><summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">Que pasa despues de los 7 dias?<span className="text-gray-400 group-open:rotate-45 transition-transform text-xl ml-4">+</span></summary><p className="text-gray-600 text-sm mt-3 leading-relaxed">Recibes un email para elegir plan. Si no eliges, el servicio se desactiva solo. Sin cargos ni letra chica.</p></details>
          <details className="border-b border-gray-200 py-4 group"><summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">Puedo cancelar en cualquier momento?<span className="text-gray-400 group-open:rotate-45 transition-transform text-xl ml-4">+</span></summary><p className="text-gray-600 text-sm mt-3 leading-relaxed">Si. Planes mensuales cancelan cuando quieras. Anuales siguen activos hasta el fin del periodo.</p></details>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-100 px-6 py-10 text-center text-gray-500 text-sm border-t border-gray-200">
        <p>Radar es un producto de <a href="/" className="text-indigo-600 font-semibold hover:underline">Muller y Perez</a> | Performance Marketing | Santiago, Chile</p>
        <p className="mt-1 text-gray-400">contacto@mulleryperez.cl</p>
      </footer>
    </div>
  )
}
