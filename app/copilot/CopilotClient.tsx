'use client'

import React, { useState, useEffect } from 'react'

function fmt(n: number) {
  return '$' + n.toLocaleString('es-CL')
}

function useScrollReveal() {
  useEffect(function() {
    var els = document.querySelectorAll('.reveal')
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    els.forEach(function(el) { observer.observe(el) })
    return function() { observer.disconnect() }
  }, [])
}

export default function ClippingClient() {
  var [anual, setAnual] = useState(true)
  var [trialEmail, setTrialEmail] = useState('')
  var [nombreEmpresa, setNombreEmpresa] = useState('')
  var [descripcion, setDescripcion] = useState('')
  var [url1, setUrl1] = useState('')
  var [url2, setUrl2] = useState('')
  var [url3, setUrl3] = useState('')
  var [enviado, setEnviado] = useState(false)
  var [trialId, setTrialId] = useState('')
  var [enviando, setEnviando] = useState(false)
  var [tab, setTab] = useState('diario')
  var [faqOpen, setFaqOpen] = useState(-1)
  var [modalOpen, setModalOpen] = useState('')

  useScrollReveal()

  async function handleTrial(e: any) {
    e.preventDefault()
    setEnviando(true)
    var urls = [url1, url2, url3].filter(function(u) { return u.trim() !== '' })
    var cuentas = urls.map(function(u) {
      var m = u.match(/instagram\.com\/([^/?]+)/)
      return { red: 'instagram', handle: m ? m[1] : u.trim() }
    })
    try {
      var res = await fetch('/api/copilot/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trialEmail, cuentas: cuentas, nombre_empresa: nombreEmpresa, descripcion: descripcion }),
      })
      if (res.ok) {
        var d = await res.json()
        setTrialId(d.id || '')
        setEnviado(true)
      }
    } catch (err) { console.error(err) }
    setEnviando(false)
  }

  function toggleFaq(i: number) {
    setFaqOpen(faqOpen === i ? -1 : i)
  }

  var faqs = [
    { q: 'Necesito instalar algo?', a: 'No. Radar funciona 100% por email. No hay dashboard, no hay login, no hay app. Solo tu bandeja de entrada.' },
    { q: 'Puedo monitorear cualquier cuenta?', a: 'Si, cualquier cuenta publica de Instagram, Facebook o LinkedIn. No necesitas ser seguidor.' },
    { q: 'Como se generan los copies sugeridos?', a: 'Analizamos que funciona en tu industria con IA (OpenAI + Claude). Los copies pasan por un revisor automatico de calidad antes de enviarse. Tu los adaptas y publicas.' },
    { q: 'Que incluye la grilla mensual?', a: '16 posts con formato sugerido, tema, copy completo, hashtags y calendario con dias y horarios optimos. Llega en PDF y Excel el 1ro de cada mes.' },
    { q: 'Que pasa despues de los 7 dias?', a: 'Recibes un email para elegir plan. Si no eliges, el servicio se desactiva solo. Sin cargos ni letra chica.' },
    { q: 'Puedo cancelar en cualquier momento?', a: 'Si. Planes mensuales cancelan cuando quieras. Anuales siguen activos hasta el fin del periodo.' },
    { q: 'Es seguro? Mis competidores se enteran?', a: 'No. Solo monitoreamos informacion publica. Tus competidores nunca saben que los observas.' },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <style>{'\
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }\
        @keyframes fadeInUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }\
        @keyframes float { 0%{transform:translateY(0)} 50%{transform:translateY(-4px)} 100%{transform:translateY(0)} }\
        .gradient-text { background:linear-gradient(135deg,#4F46E5,#7C3AED,#4F46E5); background-size:200% 200%; animation:gradientShift 4s ease infinite; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }\
        .reveal { opacity:0; transform:translateY(28px); transition:opacity 0.7s ease,transform 0.7s ease; }\
        .revealed { opacity:1; transform:translateY(0); }\
        .card-hover { transition:transform 0.3s ease,box-shadow 0.3s ease; }\
        .card-hover:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(79,70,229,0.12); }\
        .email-static { }\
        .toggle-knob { transition:transform 0.3s cubic-bezier(0.4,0,0.2,1); }\
      '}</style>

      {/* HERO */}
      <section className="px-6 pt-28 pb-20 min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-5 py-2 rounded-full mb-8 tracking-wide border border-indigo-100" style={{animation:'fadeInUp 0.6s ease forwards'}}>Nuevo producto M&P</div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight" style={{animation:'fadeInUp 0.6s ease 0.15s forwards',opacity:0}}>
            Publica contenido que funciona.<br/><span className="gradient-text">Basado en lo que hace tu competencia.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed" style={{animation:'fadeInUp 0.6s ease 0.3s forwards',opacity:0}}>
            Tres entregas automaticas en tu email: monitor diario con alertas, resumen semanal con 3 copies listos para publicar, y grilla mensual con 16 posts planificados.
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10" style={{animation:'fadeInUp 0.6s ease 0.4s forwards',opacity:0}}>
            Scraping + analisis IA + copies revisados + grilla mensual. Todo llega a tu correo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14" style={{animation:'fadeInUp 0.6s ease 0.5s forwards',opacity:0}}>
            <a href="#trial" className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300">Prueba gratis 7 dias</a>
            <a href="#ejemplos" className="border-2 border-gray-200 text-gray-700 font-bold px-8 py-4 rounded-xl text-lg hover:border-indigo-400 hover:text-indigo-600 transition">Ver informes de ejemplo</a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500" style={{animation:'fadeInUp 0.6s ease 0.6s forwards',opacity:0}}>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>4 redes monitoreadas</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span>11 medios de prensa</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>IA Claude + OpenAI</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span>PDF adjunto</span>
          </div>
        </div>
      </section>

      {/* QUE RECIBES */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 reveal">Que recibes con Radar</h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-14 reveal">Tres entregas automaticas en tu email. Tu solo lees, publicas y decides.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm card-hover reveal">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-xl mb-4">&#9993;</div>
              <div className="text-xs font-bold text-indigo-600 mb-3 tracking-wide">DIARIO - 7:30 AM</div>
              <h3 className="font-bold text-lg mb-4">Monitor de actividad</h3>
              <ul className="space-y-2.5 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">*</span> Posts nuevos por red social</li>
                <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">*</span> Engagement y metricas clave</li>
                <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">*</span> Analisis IA: que hicieron y por que importa</li>
                <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">*</span> Alertas: promos, ofertas laborales, inactividad</li>
                <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">*</span> PDF adjunto listo para compartir</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-7 border-2 border-indigo-600 shadow-xl relative card-hover reveal">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">Diferenciador</div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-xl mb-4">&#9998;</div>
              <div className="text-xs font-bold text-indigo-600 mb-3 tracking-wide">SEMANAL - Lunes 9 AM</div>
              <h3 className="font-bold text-lg mb-4">Comparativo + copies listos</h3>
              <ul className="space-y-2.5 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">*</span> Cuadro comparativo y ranking</li>
                <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">*</span> Tendencias y formato ganador</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold mt-0.5">+</span> <strong>3 copies sugeridos listos para publicar</strong></li>
                <li className="flex gap-2"><span className="text-green-500 font-bold mt-0.5">+</span> Generados con OpenAI + Claude + QA</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold mt-0.5">+</span> Basados en lo que funciona en tu industria</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm card-hover reveal">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-xl mb-4">&#128197;</div>
              <div className="text-xs font-bold text-indigo-600 mb-3 tracking-wide">MENSUAL - 1ro a las 9 AM</div>
              <h3 className="font-bold text-lg mb-4">Brief + grilla completa</h3>
              <ul className="space-y-2.5 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">*</span> Brief de consultoria estrategica</li>
                <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">*</span> Posicionamiento vs competidores</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold mt-0.5">+</span> <strong>Grilla mensual: 16 posts con copy listo</strong></li>
                <li className="flex gap-2"><span className="text-green-500 font-bold mt-0.5">+</span> Calendario sugerido con dias y horarios</li>
                <li className="flex gap-2"><span className="text-indigo-500 font-bold mt-0.5">*</span> PDF + Excel adjuntos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EJEMPLO INFORME SEMANAL */}
      <section className="px-6 py-20" id="ejemplos">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 reveal">Asi se ven los informes que recibes</h2>
          <p className="text-gray-500 text-center mb-10 reveal">Haz click en cada tab para ver un ejemplo real.</p>
          <div className="flex justify-center gap-2 mb-10 flex-wrap reveal">
            {['diario', 'semanal', 'mensual'].map(function(t) {
              return <button key={t} onClick={function() { setTab(t) }} className={'px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ' + (tab === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600')}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
            })}
          </div>

          <div className="reveal">
          {tab === 'diario' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden max-w-3xl mx-auto email-static">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-7">
                <p className="font-bold text-xl">Tu Copilot diario</p>
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
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">CafExpress - 3 posts</p>
                  <p className="text-sm text-gray-600 mb-2">PROMO FLASH! Maquina de cafe gratis por 3 meses...</p>
                  <div className="flex gap-3 text-xs text-gray-500"><span className="text-red-500 font-semibold">847 likes</span><span>92 comentarios</span><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">4x promedio</span></div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <p className="text-sm text-amber-800 font-medium">Vendomatica: 5 dias sin publicar</p>
                </div>
              </div>
              <div className="px-8 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">M&P Copilot by Muller y Perez | Informe diario | 7:30 AM</div>
              <div className="text-center py-4"><button onClick={function() { setModalOpen('diario') }} className="text-sm font-semibold text-indigo-600 border border-indigo-200 px-6 py-2.5 rounded-lg hover:bg-indigo-50 transition">Ver informe diario completo</button></div>
            </div>
          )}

          {tab === 'semanal' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden max-w-3xl mx-auto email-static">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-7">
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
              <div className="px-8 py-6 bg-green-50 border-t-2 border-green-200">
                <p className="font-bold text-green-800 mb-4 flex items-center gap-2"><span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span> Copies sugeridos para esta semana</p>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-5 border-l-4 border-green-500 shadow-sm">
                    <div className="flex gap-2 items-center mb-2"><span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">Reel</span><span className="text-xs text-gray-500">Respuesta a promo CafExpress</span></div>
                    <p className="text-sm text-gray-800 leading-relaxed">Tu oficina merece cafe de verdad. Prueba gratis 1 semana: sin compromisos, sin letras chicas, sin maquinas genericas...</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border-l-4 border-purple-500 shadow-sm">
                    <div className="flex gap-2 items-center mb-2"><span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">Carrusel</span><span className="text-xs text-gray-500">Angulo diferenciador: cafe especialidad</span></div>
                    <p className="text-sm text-gray-800 leading-relaxed">5 senales de que tu cafe de oficina necesita un upgrade. Slide 1: Si todos pasan de largo la cafetera...</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border-l-4 border-green-500 shadow-sm">
                    <div className="flex gap-2 items-center mb-2"><span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">Testimonio</span><span className="text-xs text-gray-500">Social proof (competidor lo uso esta semana)</span></div>
                    <p className="text-sm text-gray-800 leading-relaxed">Desde que cambiamos el cafe en la oficina, las reuniones de las 9 AM dejaron de ser un castigo...</p>
                  </div>
                </div>
                <p className="text-xs text-green-700 mt-4 font-medium">Generados con OpenAI + Claude + revision QA automatica. Listos para adaptar y publicar.</p>
              </div>
              <div className="px-8 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">M&P Copilot by Muller y Perez | Semanal | Lunes 9:00 AM</div>
              <div className="text-center py-4"><button onClick={function() { setModalOpen('semanal') }} className="text-sm font-semibold text-indigo-600 border border-indigo-200 px-6 py-2.5 rounded-lg hover:bg-indigo-50 transition">Ver informe semanal completo</button></div>
            </div>
          )}

          {tab === 'mensual' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden max-w-3xl mx-auto email-static">
              <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white px-8 py-7">
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
              <div className="px-8 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">M&P Copilot by Muller y Perez | Brief mensual | 1ro de cada mes 9:00 AM</div>
              <div className="text-center py-4"><button onClick={function() { setModalOpen('mensual') }} className="text-sm font-semibold text-indigo-600 border border-indigo-200 px-6 py-2.5 rounded-lg hover:bg-indigo-50 transition">Ver brief mensual completo</button></div>
            </div>
          )}
          </div>
        </div>
      </section>

      {/* DECISIONES */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 reveal">No te decimos que paso. Te decimos que hacer.</h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-14 reveal">Otras herramientas te dan datos. Radar te da decisiones y contenido listo.</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { sit: 'Tu competidor lanza una promo', act: 'Reaccionas el mismo dia con copy sugerido listo.' },
              { sit: 'Un competidor deja de publicar', act: 'Aumentas frecuencia para ocupar ese espacio.' },
              { sit: 'Un formato tiene 3x mas engagement', act: 'Tu grilla del mes ya lo prioriza automaticamente.' },
              { sit: 'Nadie habla de un tema relevante', act: 'Recibes el copy listo para posicionarte primero.' },
              { sit: 'No sabes que publicar esta semana', act: '3 copies llegan cada lunes basados en data real.' },
              { sit: 'Necesitas planificar el mes completo', act: 'Grilla de 16 posts con calendario y copy el dia 1.' },
            ].map(function(item, i) {
              return <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm card-hover reveal">
                <p className="font-bold text-gray-900 mb-3">{item.sit}</p>
                <p className="text-sm text-indigo-600 font-medium">{item.act}</p>
              </div>
            })}
          </div>
        </div>
      </section>

      {/* COMPARATIVA */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 reveal">Comparativa con otras herramientas</h2>
          <p className="text-gray-500 text-center mb-10 reveal">Precios en CLP, planes anuales para comparacion justa.</p>
          <div className="overflow-x-auto reveal">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden bg-white shadow-lg">
              <thead><tr className="bg-gray-900 text-white text-xs">
                <th className="px-4 py-3.5 text-left">Herramienta</th>
                <th className="px-4 py-3.5 text-center">Desde</th>
                <th className="px-4 py-3.5 text-center">Plan medio</th>
                <th className="px-4 py-3.5 text-center">Contrato</th>
                <th className="px-4 py-3.5 text-center">IA</th>
                <th className="px-4 py-3.5 text-center">Copies listos</th>
              </tr></thead>
              <tbody className="text-xs">
                <tr className="bg-indigo-50 font-semibold border-b border-indigo-100"><td className="px-4 py-3.5 text-indigo-700">Radar M&P <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px] ml-1">tu</span></td><td className="px-4 py-3.5 text-center text-indigo-700">$27.990</td><td className="px-4 py-3.5 text-center text-indigo-700">$54.990</td><td className="px-4 py-3.5 text-center">Mes a mes</td><td className="px-4 py-3.5 text-center">Nativo espanol</td><td className="px-4 py-3.5 text-center text-green-600 font-bold">Si</td></tr>
                <tr className="border-b"><td className="px-4 py-3">Brand24</td><td className="px-4 py-3 text-center">$76.000</td><td className="px-4 py-3 text-center">$143.000</td><td className="px-4 py-3 text-center">Anual obligatorio</td><td className="px-4 py-3 text-center">Ingles</td><td className="px-4 py-3 text-center text-gray-400">No</td></tr>
                <tr className="border-b bg-gray-50"><td className="px-4 py-3">Mention</td><td className="px-4 py-3 text-center">$39.000</td><td className="px-4 py-3 text-center">$80.000</td><td className="px-4 py-3 text-center">Anual obligatorio</td><td className="px-4 py-3 text-center">No</td><td className="px-4 py-3 text-center text-gray-400">No</td></tr>
                <tr><td className="px-4 py-3">Meltwater</td><td className="px-4 py-3 text-center">$480.000</td><td className="px-4 py-3 text-center">$960.000</td><td className="px-4 py-3 text-center">Anual 12 meses</td><td className="px-4 py-3 text-center">Si</td><td className="px-4 py-3 text-center text-gray-400">No</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-gray-50 px-6 py-20" id="planes">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 reveal">Planes</h2>
          <p className="text-gray-500 text-center mb-10 reveal">7 dias gratis. Sin contrato. Cancela cuando quieras.</p>
          <div className="flex items-center justify-center gap-4 mb-12 reveal">
            <span className={'text-sm font-semibold transition-colors duration-300 ' + (!anual ? 'text-gray-900' : 'text-gray-400')}>Mensual</span>
            <button onClick={function() { setAnual(!anual) }} className={'relative w-14 h-8 rounded-full transition-colors duration-300 ' + (anual ? 'bg-indigo-600' : 'bg-gray-300')}>
              <div className={'absolute top-1 w-6 h-6 bg-white rounded-full shadow-md toggle-knob ' + (anual ? 'translate-x-7' : 'translate-x-1')} />
            </button>
            <span className={'text-sm font-semibold transition-colors duration-300 ' + (anual ? 'text-gray-900' : 'text-gray-400')}>Anual <span className="text-green-600 text-xs font-bold ml-1 bg-green-50 px-2 py-0.5 rounded-full">-20%</span></span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl p-7 border-2 bg-white border-gray-200 card-hover reveal">
              <h3 className="text-xl font-bold mb-1">Starter</h3>
              <p className="text-gray-500 text-sm mb-5">5 cuentas | Solo Instagram</p>
              <div className="mb-6"><span className="text-4xl font-extrabold">{fmt(anual ? 27990 : 34990)}</span><span className="text-gray-500 text-sm"> /mes + IVA</span></div>
              <ul className="space-y-2.5 mb-8 text-sm text-gray-700">
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Email diario con posts</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> 5 cuentas Instagram</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Engagement por post</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> PDF adjunto</li>
                <li className="flex gap-2 text-gray-300"><span>-</span> Facebook y LinkedIn</li>
                <li className="flex gap-2 text-gray-300"><span>-</span> Copies semanales</li>
                <li className="flex gap-2 text-gray-300"><span>-</span> Grilla mensual</li>
              </ul>
              <a href="#trial" className="block text-center py-3.5 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Prueba gratis</a>
            </div>
            <div className="relative rounded-2xl p-7 border-2 bg-white border-indigo-600 shadow-xl shadow-indigo-100 card-hover reveal">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-md">Mas popular</div>
              <h3 className="text-xl font-bold mb-1">Pro</h3>
              <p className="text-gray-500 text-sm mb-5">15 cuentas | IG + FB + LinkedIn</p>
              <div className="mb-6"><span className="text-4xl font-extrabold text-indigo-700">{fmt(anual ? 54990 : 69990)}</span><span className="text-gray-500 text-sm"> /mes + IVA</span></div>
              <ul className="space-y-2.5 mb-8 text-sm text-gray-700">
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Todo lo de Starter</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> 15 cuentas multi-red</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Facebook y LinkedIn</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Resumen semanal IA</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> 3 copies semanales listos</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Grilla mensual 16 posts</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Dashboard web</li>
              </ul>
              <a href="#trial" className="block text-center py-3.5 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Prueba gratis</a>
            </div>
            <div className="rounded-2xl p-7 border-2 bg-white border-gray-200 card-hover reveal">
              <h3 className="text-xl font-bold mb-1">Business</h3>
              <p className="text-gray-500 text-sm mb-5">30 cuentas | IG + FB + LinkedIn</p>
              <div className="mb-6"><span className="text-4xl font-extrabold">{fmt(anual ? 94990 : 119990)}</span><span className="text-gray-500 text-sm"> /mes + IVA</span></div>
              <ul className="space-y-2.5 mb-8 text-sm text-gray-700">
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Todo lo de Pro</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> 30 cuentas multi-red</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Grilla 16 posts + calendario</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> PDF consultoria mensual</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Export Excel semanal</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Alertas por keyword</li>
                <li className="flex gap-2"><span className="text-green-500 font-bold">&#10003;</span> Benchmark semanal</li>
              </ul>
              <a href="#trial" className="block text-center py-3.5 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Prueba gratis</a>
            </div>
          </div>
        </div>
      </section>

      {/* TRIAL */}
      <section className="px-6 py-20" id="trial">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-xl p-8 reveal">
          <h2 className="text-2xl font-bold text-center mb-2">Activa tu Radar en 30 segundos</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Tu primer informe llega manana a las 7:30 AM. Sin tarjeta.</p>
          {enviado ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">&#10003;</div>
              <h3 className="text-xl font-bold mb-2">Copilot activado</h3>
              <p className="text-gray-500 mb-6">Manana a las 7:30 AM recibiras tu primer informe en <strong className="text-gray-900">{trialEmail}</strong></p>
              {trialId && (
                <div className="space-y-3">
                  <a href={'/copilot/configurar/' + trialId} className="block bg-indigo-600 text-white text-center py-3 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition">Configurar mis cuentas</a>
                  <a href={'/copilot/dashboard/' + trialId} className="block bg-gray-100 text-gray-700 text-center py-3 rounded-lg font-semibold text-sm hover:bg-gray-200 transition">Ver mi dashboard</a>
                </div>
              )}
              <p className="text-gray-400 text-xs mt-4">Revisa tu email para tus links privados</p>
            </div>
          ) : (
            <form onSubmit={handleTrial} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tu email</label>
                <input type="email" required value={trialEmail} onChange={function(e: any) { setTrialEmail(e.target.value) }} placeholder="tu@empresa.com" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre de tu empresa</label>
                <input type="text" required value={nombreEmpresa} onChange={function(e: any) { setNombreEmpresa(e.target.value) }} placeholder="Ej: Cafe Premium SpA" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">A que se dedica tu empresa</label>
                <input type="text" required value={descripcion} onChange={function(e: any) { setDescripcion(e.target.value) }} placeholder="Ej: Venta de cafe de especialidad para oficinas" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cuenta a monitorear 1</label>
                <input type="text" required value={url1} onChange={function(e: any) { setUrl1(e.target.value) }} placeholder="https://www.instagram.com/competidor/" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cuenta 2 <span className="font-normal text-gray-400">(opcional)</span></label>
                <input type="text" value={url2} onChange={function(e: any) { setUrl2(e.target.value) }} placeholder="https://www.instagram.com/competidor2/" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cuenta 3 <span className="font-normal text-gray-400">(opcional)</span></label>
                <input type="text" value={url3} onChange={function(e: any) { setUrl3(e.target.value) }} placeholder="https://www.instagram.com/competidor3/" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
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
      <section className="bg-gray-50 px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 reveal">Preguntas frecuentes</h2>
          <div className="space-y-0 reveal">
            {faqs.map(function(faq, i) {
              return <div key={i} className="border-b border-gray-200">
                <button onClick={function() { toggleFaq(i) }} className="w-full py-5 flex justify-between items-center text-left">
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <span className={'text-gray-400 text-xl ml-4 transition-transform duration-300 ' + (faqOpen === i ? 'rotate-45' : '')}>+</span>
                </button>
                <div className={'overflow-hidden transition-all duration-300 ' + (faqOpen === i ? 'max-h-40 pb-5' : 'max-h-0')}>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            })}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="px-6 py-20 reveal">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Radar en accion</h2>
          <p className="text-gray-500 text-center mb-10">Usado por el equipo de Muller y Perez para sus propios clientes</p>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6">
              <p className="text-sm opacity-80">Caso de uso real</p>
              <h3 className="text-xl font-bold mt-1">Genera HR monitorea a su competencia con Radar</h3>
            </div>
            <div className="px-8 py-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center"><div className="text-2xl font-bold text-indigo-600">5</div><div className="text-xs text-gray-500">Empresas monitoreadas</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-purple-600">4</div><div className="text-xs text-gray-500">Redes sociales</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-green-600">11</div><div className="text-xs text-gray-500">Medios de prensa</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-gray-900">7:30 AM</div><div className="text-xs text-gray-500">Informe cada dia</div></div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">Genera HR usa Radar para monitorear a Buk, Talana, Workera y GeoVictoria en Instagram, LinkedIn, Facebook y 11 medios de prensa chilenos. Cada lunes reciben 3 copies sugeridos listos para publicar basados en lo que funciona en su industria.</p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={function() { setModalOpen('diario') }} className="text-sm font-semibold text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50 transition">Ver informe diario</button>
                <button onClick={function() { setModalOpen('semanal') }} className="text-sm font-semibold text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50 transition">Ver informe semanal</button>
                <button onClick={function() { setModalOpen('mensual') }} className="text-sm font-semibold text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50 transition">Ver informe mensual</button>
                <button onClick={function() { setModalOpen('grilla') }} className="text-sm font-semibold text-green-700 border border-green-200 px-4 py-2 rounded-lg hover:bg-green-50 transition">Ver grilla 16 posts</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL INFORME COMPLETO */}
      {modalOpen !== '' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-8 pb-8 overflow-y-auto" onClick={function() { setModalOpen('') }}>
          <div className={'bg-white rounded-2xl shadow-2xl w-full mx-4 relative ' + (modalOpen === 'grilla' ? 'max-w-6xl' : 'max-w-3xl')} onClick={function(e: any) { e.stopPropagation() }}>
            <button onClick={function() { setModalOpen('') }} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 text-lg font-bold z-10">x</button>
            <div className="p-1">
              <iframe
                src={'/radar-ejemplos/' + modalOpen + '.html'}
                className="w-full border-0 rounded-xl"
                style={{ height: modalOpen === 'grilla' ? '3500px' : modalOpen === 'mensual' ? '3000px' : modalOpen === 'semanal' ? '4000px' : '2800px' }}
                title={'Ejemplo informe ' + modalOpen}
              />
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white px-6 py-12 text-center border-t border-gray-200">
        <p className="text-gray-500 text-sm">Radar es un producto de <a href="/" className="text-indigo-600 font-semibold hover:underline">Muller y Perez</a> | Performance Marketing | Santiago, Chile</p>
        <p className="mt-2 text-gray-400 text-sm">contacto@mulleryperez.cl</p>
      </footer>
    </div>
  )
}
