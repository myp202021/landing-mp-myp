'use client'

import React, { useState } from 'react'

function formatPrice(n: number) {
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
    } catch (err) {
      console.error(err)
    }
    setEnviando(false)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <section className="bg-gradient-to-b from-gray-50 to-white px-6 pt-16 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <a href="/" className="inline-block text-indigo-600 font-bold text-sm tracking-wider mb-6 hover:underline">Muller y Perez</a>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Sabe que publica tu competencia<br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">antes de que te des cuenta</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Radar monitorea las cuentas de Instagram, Facebook y LinkedIn que tu elijas. Cada manana recibes un email con todo lo que publicaron, cuanto engagement tuvo, y un analisis con IA que te dice que significa y que deberias hacer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#trial" className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">
              Prueba gratis 7 dias
            </a>
            <a href="#ejemplos" className="border-2 border-gray-300 text-gray-700 font-bold px-8 py-4 rounded-xl text-lg hover:border-indigo-400 hover:text-indigo-600 transition">
              Ver ejemplo de informe
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Que es Radar?</h2>
        <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">Un servicio de monitoreo de redes sociales que te llega al email. Sin dashboards complicados, sin login, sin configuraciones. Solo la informacion que necesitas, cada manana en tu bandeja de entrada.</p>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl mb-3">📡</div>
            <h3 className="font-bold text-sm mb-2">Monitoreo diario</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Scrapea Instagram, Facebook y LinkedIn de las cuentas que elijas. Cada dia a las 7:00 AM.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-bold text-sm mb-2">Email con todo</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Recibes un email con cada post nuevo: texto, engagement, link directo y tipo de contenido.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-bold text-sm mb-2">Analisis con IA</h3>
            <p className="text-gray-500 text-sm leading-relaxed">La IA identifica patrones, oportunidades y te recomienda acciones concretas basadas en lo que hace tu competencia.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-sm mb-2">Resumen semanal y mensual</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Cada lunes un cuadro comparativo semanal. El 1ro de cada mes un informe consolidado con tendencias y ranking.</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Como funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="font-bold mb-1">Elige las cuentas</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Pega las URLs de Instagram, Facebook o LinkedIn de tu competencia, proveedores, influencers o quien quieras monitorear.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="font-bold mb-1">Recibe tu radar diario</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Cada manana a las 7:00 AM llega a tu email un informe con todo lo que publicaron en las ultimas 24 horas.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="font-bold mb-1">Toma mejores decisiones</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Usa los insights de la IA para ajustar tu estrategia, detectar oportunidades antes que tu competencia, y reaccionar rapido.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto" id="ejemplos">
        <h2 className="text-2xl font-bold text-center mb-4">Esto es lo que recibes en tu email</h2>
        <p className="text-gray-500 text-center mb-8">Ejemplos reales de los informes diarios, semanales y mensuales.</p>

        <div className="flex justify-center gap-2 mb-8">
          <button onClick={function() { setTab('diario') }} className={'px-6 py-2.5 rounded-lg font-semibold text-sm transition ' + (tab === 'diario' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
            Informe diario
          </button>
          <button onClick={function() { setTab('semanal') }} className={'px-6 py-2.5 rounded-lg font-semibold text-sm transition ' + (tab === 'semanal' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
            Resumen semanal (lunes)
          </button>
          <button onClick={function() { setTab('mensual') }} className={'px-6 py-2.5 rounded-lg font-semibold text-sm transition ' + (tab === 'mensual' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
            Resumen mensual (1ro)
          </button>
        </div>

        {tab === 'diario' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6">
              <p className="font-bold text-xl">Tu Radar diario</p>
              <p className="text-sm opacity-90 mt-1">Jueves 17 de abril de 2026 - 5 cuentas monitoreadas - 8 posts nuevos</p>
            </div>
            <div className="px-8 py-5 bg-indigo-50 border-b border-indigo-100">
              <p className="font-bold text-indigo-800 text-sm mb-2">Resumen inteligente</p>
              <ul className="text-sm text-indigo-900 space-y-1.5">
                <li>CafExpress lanzo promocion agresiva: maquina gratis por 3 meses si contratas antes del viernes. Tuvo 847 likes, que es 4x su promedio.</li>
                <li>CorporateCoffee publico su primer testimonio en video en 2 meses (Banco Estado como cliente). Estan apostando por social proof.</li>
                <li>Vendomatica lleva 5 dias sin publicar. Posible cambio de estrategia o pausa interna.</li>
              </ul>
            </div>
            <div className="px-8 py-4 bg-green-50 border-b border-green-100">
              <p className="font-bold text-green-800 text-sm mb-1">Oportunidad detectada</p>
              <p className="text-sm text-green-900">Ningun competidor esta hablando de cafe de especialidad para espacios de cowork. Es un angulo disponible para que te posiciones primero esta semana.</p>
            </div>
            <div className="px-8 py-6">
              <p className="font-bold text-gray-900 text-sm mb-4">Detalle por cuenta</p>
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-700">CE</div>
                  <div><p className="font-bold text-sm">CafExpress</p><p className="text-xs text-gray-500">@cafexpress.cl - Instagram - 3 posts</p></div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-2 border border-gray-100">
                  <p className="text-sm text-gray-800 mb-2">PROMO FLASH! Lleva una maquina de cafe automatica a tu oficina GRATIS por 3 meses. Solo hasta el viernes.</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>847 likes</span><span>92 comentarios</span><span className="bg-gray-200 px-2 py-0.5 rounded text-gray-600">Imagen</span><a href="#" className="text-indigo-600 font-medium ml-auto">Ver post</a>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-2 border border-gray-100">
                  <p className="text-sm text-gray-800 mb-2">Nuestro blend del mes: Colombia Huila con notas a chocolate y frutos rojos. Disponible en todos los planes de oficina.</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>234 likes</span><span>18 comentarios</span><span className="bg-gray-200 px-2 py-0.5 rounded text-gray-600">Carrusel</span><a href="#" className="text-indigo-600 font-medium ml-auto">Ver post</a>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <p className="text-sm text-amber-800">Vendomatica: sin publicaciones en las ultimas 24 horas (5 dias inactivos).</p>
              </div>
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">
              Radar by Muller y Perez - Reporte automatico diario 7:00 AM
            </div>
          </div>
        )}

        {tab === 'semanal' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6">
              <p className="font-bold text-xl">Resumen semanal</p>
              <p className="text-sm opacity-90 mt-1">Semana del 14 al 20 de abril de 2026 - 5 cuentas - 31 posts totales</p>
            </div>
            <div className="px-8 py-6">
              <p className="font-bold text-gray-900 text-sm mb-4">Cuadro comparativo semanal</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead><tr className="bg-gray-900 text-white">
                    <th className="px-4 py-3 text-left font-semibold">Cuenta</th>
                    <th className="px-4 py-3 text-center font-semibold">Posts</th>
                    <th className="px-4 py-3 text-center font-semibold">Likes</th>
                    <th className="px-4 py-3 text-center font-semibold">Eng.</th>
                    <th className="px-4 py-3 text-center font-semibold">vs anterior</th>
                    <th className="px-4 py-3 text-center font-semibold">Formato top</th>
                  </tr></thead>
                  <tbody>
                    <tr className="border-b border-gray-100"><td className="px-4 py-3 font-semibold">CafExpress</td><td className="px-4 py-3 text-center">12</td><td className="px-4 py-3 text-center">4.230</td><td className="px-4 py-3 text-center">3.8%</td><td className="px-4 py-3 text-center text-green-600 font-bold">+45%</td><td className="px-4 py-3 text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">Reels</span></td></tr>
                    <tr className="border-b border-gray-100 bg-gray-50"><td className="px-4 py-3 font-semibold">CorporateCoffee</td><td className="px-4 py-3 text-center">8</td><td className="px-4 py-3 text-center">2.890</td><td className="px-4 py-3 text-center">2.1%</td><td className="px-4 py-3 text-center text-green-600 font-bold">+12%</td><td className="px-4 py-3 text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">Video</span></td></tr>
                    <tr className="border-b border-gray-100"><td className="px-4 py-3 font-semibold">Nespresso Pro</td><td className="px-4 py-3 text-center">6</td><td className="px-4 py-3 text-center">8.450</td><td className="px-4 py-3 text-center">5.2%</td><td className="px-4 py-3 text-center text-red-500 font-bold">-8%</td><td className="px-4 py-3 text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">Carrusel</span></td></tr>
                    <tr className="border-b border-gray-100 bg-gray-50"><td className="px-4 py-3 font-semibold">Vendomatica</td><td className="px-4 py-3 text-center">1</td><td className="px-4 py-3 text-center">45</td><td className="px-4 py-3 text-center">0.3%</td><td className="px-4 py-3 text-center text-red-500 font-bold">-78%</td><td className="px-4 py-3 text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">Imagen</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-8 py-5 bg-indigo-50 border-t border-indigo-100">
              <p className="font-bold text-indigo-800 text-sm mb-2">Analisis semanal</p>
              <ul className="text-sm text-indigo-900 space-y-2">
                <li>CafExpress domina en volumen: 12 posts con foco en promociones agresivas. Su engagement subio 45% gracias al reel de la promo.</li>
                <li>Nespresso Pro tiene el mejor engagement (5.2%) a pesar de publicar menos. Su contenido editorial premium sigue funcionando.</li>
                <li>Vendomatica en caida libre: 1 solo post, engagement 0.3%, baja de 78%.</li>
              </ul>
            </div>
            <div className="px-8 py-5 bg-purple-50 border-t border-purple-100">
              <p className="font-bold text-purple-800 text-sm mb-2">Recomendaciones para esta semana</p>
              <ul className="text-sm text-purple-900 space-y-1.5">
                <li>1. Contraataca la promo de CafExpress: su oferta termina el viernes. Publica tu propuesta el lunes.</li>
                <li>2. Publica mas Reels: son el formato que mas tracciona en tu industria esta semana.</li>
                <li>3. Ocupa el espacio de Vendomatica: estan inactivos. Aumenta tu frecuencia.</li>
              </ul>
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">
              Radar by Muller y Perez - Resumen semanal - Todos los lunes a las 9:00 AM
            </div>
          </div>
        )}

        {tab === 'mensual' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-8 py-6">
              <p className="font-bold text-xl">Resumen mensual</p>
              <p className="text-sm opacity-90 mt-1">Abril 2026 - 5 cuentas - 127 posts totales - 30 dias monitoreados</p>
            </div>
            <div className="px-8 py-6">
              <p className="font-bold text-gray-900 text-sm mb-4">Ranking de actividad del mes</p>
              <div className="space-y-3">
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-yellow-100 text-yellow-700">1</div>
                  <div className="flex-1"><p className="font-bold text-sm">CafExpress</p><p className="text-xs text-gray-500">48 posts - 18.400 likes - 3.5% engagement</p></div>
                  <span className="text-xs font-semibold text-green-600">Subio 2 posiciones</span>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-600">2</div>
                  <div className="flex-1"><p className="font-bold text-sm">Nespresso Pro</p><p className="text-xs text-gray-500">24 posts - 35.200 likes - 5.1% engagement</p></div>
                  <span className="text-xs font-semibold text-red-500">Bajo 1 posicion</span>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-orange-100 text-orange-700">3</div>
                  <div className="flex-1"><p className="font-bold text-sm">CorporateCoffee</p><p className="text-xs text-gray-500">32 posts - 11.800 likes - 2.3% engagement</p></div>
                  <span className="text-xs font-semibold text-gray-500">Se mantuvo</span>
                </div>
              </div>
            </div>
            <div className="px-8 py-5 bg-indigo-50 border-t border-indigo-100">
              <p className="font-bold text-indigo-800 text-sm mb-2">Analisis del mes</p>
              <ul className="text-sm text-indigo-900 space-y-2">
                <li>CafExpress fue el mas agresivo del mes con 48 posts. Su estrategia cambio de branding a captacion directa.</li>
                <li>Nespresso Pro mantiene el mejor engagement (5.1%) con solo 24 posts. Calidad sobre cantidad.</li>
                <li>Vendomatica en declive: de 28 posts en marzo a solo 7 en abril.</li>
              </ul>
            </div>
            <div className="px-8 py-5 bg-green-50 border-t border-green-100">
              <p className="font-bold text-green-800 text-sm mb-2">Tendencias del mes</p>
              <ul className="text-sm text-green-900 space-y-1.5">
                <li>Formato ganador: Reels representaron el 45% de los posts y generaron el 68% del engagement.</li>
                <li>Temas que traccionaron: sustentabilidad, origen del cafe, bienestar en la oficina.</li>
                <li>Mejor dia: martes y jueves. Peor: sabado y domingo.</li>
              </ul>
            </div>
            <div className="px-8 py-5 bg-purple-50 border-t border-purple-100">
              <p className="font-bold text-purple-800 text-sm mb-2">Plan de accion para el proximo mes</p>
              <ul className="text-sm text-purple-900 space-y-1.5">
                <li>1. Aumenta Reels a 50%+ de tu contenido.</li>
                <li>2. Publica martes y jueves entre 8-9 AM.</li>
                <li>3. Capitaliza la caida de Vendomatica.</li>
                <li>4. Prueba contenido de sustentabilidad.</li>
              </ul>
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">
              Radar by Muller y Perez - Resumen mensual - El 1ro de cada mes a las 9:00 AM
            </div>
          </div>
        )}
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto" id="planes">
        <h2 className="text-2xl font-bold text-center mb-2">Planes</h2>
        <p className="text-gray-500 text-center mb-8">7 dias gratis en todos los planes. Sin contrato. Cancela cuando quieras.</p>

        <div className="flex items-center justify-center gap-4 mb-10">
          <span className={'text-sm font-medium ' + (!anual ? 'text-gray-900' : 'text-gray-400')}>Mensual</span>
          <button onClick={function() { setAnual(!anual) }} className={'relative w-14 h-7 rounded-full transition ' + (anual ? 'bg-indigo-600' : 'bg-gray-300')}>
            <div className={'absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ' + (anual ? 'translate-x-7' : 'translate-x-0.5')} />
          </button>
          <span className={'text-sm font-medium ' + (anual ? 'text-gray-900' : 'text-gray-400')}>
            Anual <span className="text-green-600 text-xs font-bold ml-1">ahorra 20%</span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl p-6 border-2 bg-white border-gray-200">
            <h3 className="text-xl font-bold mb-1">Starter</h3>
            <p className="text-gray-500 text-sm mb-4">5 cuentas - Instagram</p>
            <div className="mb-6">
              <span className="text-3xl font-extrabold text-gray-900">{formatPrice(anual ? 27990 : 34990)}</span>
              <span className="text-gray-500 text-sm"> /mes + IVA</span>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-gray-700">
              <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Email diario con posts nuevos</li>
              <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Engagement por post</li>
              <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Link directo al post</li>
              <li className="flex gap-2 text-gray-300"><span>&#8212;</span> Facebook y LinkedIn</li>
              <li className="flex gap-2 text-gray-300"><span>&#8212;</span> Resumen semanal con IA</li>
              <li className="flex gap-2 text-gray-300"><span>&#8212;</span> Resumen mensual</li>
            </ul>
            <a href="#trial" className="block text-center py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Prueba gratis 7 dias</a>
          </div>

          <div className="relative rounded-2xl p-6 border-2 bg-white border-indigo-600 shadow-xl shadow-indigo-600/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">Mas popular</div>
            <h3 className="text-xl font-bold mb-1">Pro</h3>
            <p className="text-gray-500 text-sm mb-4">15 cuentas - IG + FB + LinkedIn</p>
            <div className="mb-6">
              <span className="text-3xl font-extrabold text-gray-900">{formatPrice(anual ? 54990 : 69990)}</span>
              <span className="text-gray-500 text-sm"> /mes + IVA</span>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-gray-700">
              <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Todo lo de Starter</li>
              <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Facebook y LinkedIn</li>
              <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Resumen semanal con IA (lunes)</li>
              <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Resumen mensual (1ro)</li>
              <li className="flex gap-2 text-gray-300"><span>&#8212;</span> Alertas por keyword</li>
              <li className="flex gap-2 text-gray-300"><span>&#8212;</span> Benchmark semanal</li>
            </ul>
            <a href="#trial" className="block text-center py-3 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition">Prueba gratis 7 dias</a>
          </div>

          <div className="rounded-2xl p-6 border-2 bg-white border-gray-200">
            <h3 className="text-xl font-bold mb-1">Business</h3>
            <p className="text-gray-500 text-sm mb-4">30 cuentas - IG + FB + LinkedIn</p>
            <div className="mb-6">
              <span className="text-3xl font-extrabold text-gray-900">{formatPrice(anual ? 94990 : 119990)}</span>
              <span className="text-gray-500 text-sm"> /mes + IVA</span>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-gray-700">
              <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Todo lo de Pro</li>
              <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Analisis IA diario</li>
              <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Alertas por keyword</li>
              <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Benchmark semanal</li>
              <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Export semanal Excel</li>
            </ul>
            <a href="#trial" className="block text-center py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Prueba gratis 7 dias</a>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-16" id="trial">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Prueba gratis 7 dias</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Pega hasta 3 cuentas de Instagram y recibe tu primer informe manana a las 7 AM. Sin tarjeta.</p>

          {enviado ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">&#9989;</div>
              <h3 className="text-xl font-bold mb-2">Activado!</h3>
              <p className="text-gray-500">Manana a las 7:00 AM recibiras tu primer Radar en <strong className="text-gray-900">{trialEmail}</strong></p>
            </div>
          ) : (
            <form onSubmit={handleTrial} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tu email corporativo</label>
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
              <button type="submit" disabled={enviando} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-600/20">
                {enviando ? 'Activando...' : 'Activar prueba gratuita'}
              </button>
              <p className="text-center text-gray-400 text-xs">Sin tarjeta de credito. 7 dias gratis. Despues eliges tu plan o se cancela solo.</p>
            </form>
          )}
        </div>
      </section>

      <footer className="bg-gray-50 px-6 py-10 text-center text-gray-500 text-sm border-t border-gray-200">
        <p>Radar es un producto de <a href="/" className="text-indigo-600 font-semibold hover:underline">Muller y Perez</a> - Performance Marketing - Santiago, Chile</p>
        <p className="mt-1 text-gray-400">contacto@mulleryperez.cl</p>
      </footer>
    </div>
  )
}
