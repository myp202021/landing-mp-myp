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

/* ─── IMAGE URLS (mockups reales del producto) ─── */
var IMG_DASHBOARD = '/copilot/mockup-dashboard.png'
var IMG_SOCIAL = '/copilot/mockup-email-diario.png'
var IMG_TEAM = '/copilot/mockup-copies.png'
var IMG_MOBILE = '/copilot/mockup-email-diario.png'
var IMG_CALENDAR = '/copilot/mockup-grilla.png'
var IMG_AI = '/copilot/mockup-copies.png'
var IMG_REPORTS = '/copilot/mockup-reporte.png'
var IMG_ENGAGEMENT = '/copilot/mockup-auditoria.png'
var IMG_BENCHMARK = '/copilot/mockup-dashboard.png'

/* ─── FEATURE CARDS DATA ─── */
var featureCards = [
  { title: 'Monitoreo de competencia', desc: 'Observa qué publican tus competidores en Instagram, LinkedIn, Facebook y prensa. Cada día, sin que muevas un dedo.', img: '/copilot/mockup-email-diario.png', icon: '🔍' },
  { title: 'Copies listos para publicar', desc: 'Tres agentes de IA trabajan en cadena: briefing, redacción y control de calidad. Recibes el copy final listo.', img: '/copilot/mockup-copies.png', icon: '✍️' },
  { title: 'Grilla mensual con calendario', desc: 'Hasta 16 posts por mes con copy, hashtags y sugerencia de diseño. Todo organizado por semana.', img: '/copilot/mockup-grilla.png', icon: '📅' },
  { title: 'Guiones de reels y stories', desc: 'Scripts listos para grabar: gancho, desarrollo y cierre. Con timing y sugerencias visuales.', img: '/copilot/mockup-auditoria.png', icon: '🎬' },
  { title: 'WhatsApp + Email', desc: 'Te llega todo donde ya estás. Notificaciones diarias, semanales y mensuales según tu plan.', img: '/copilot/mockup-email-diario.png', icon: '📲' },
  { title: 'Reporte ejecutivo', desc: 'Un PDF de 1 página con lo esencial: qué hizo la competencia, qué publicaste, qué viene. Para tu jefe.', img: '/copilot/mockup-reporte.png', icon: '📊' },
]

/* ─── PLANS DATA ─── */
var plans = [
  {
    name: 'Starter',
    price: 34990,
    desc: 'Ideal para comenzar a monitorear',
    features: [
      '5 cuentas Instagram',
      'Análisis diario con IA',
      '4 posts en grilla mensual',
      'Email diario',
      'Dashboard básico',
    ],
    cta: 'Comenzar gratis',
    popular: false,
  },
  {
    name: 'Pro',
    price: 69990,
    desc: 'El más elegido por equipos de marketing',
    features: [
      '15 cuentas IG + LinkedIn + Facebook',
      'Copies semanales listos para publicar',
      '8 posts en grilla mensual',
      'WhatsApp + Email',
      'Auditoría mensual de perfil',
      'Reporte ejecutivo PDF',
      'Banco de ideas acumulativo',
    ],
    cta: 'Probar gratis 7 días',
    popular: true,
  },
  {
    name: 'Business',
    price: 119990,
    desc: 'Para marcas que quieren dominar',
    features: [
      '30 cuentas multi-red',
      'Guiones de reels y stories',
      '16 posts + sugerencias de imagen',
      'Benchmark mensual de competidores',
      'Reunión estratégica mensual',
      'Excel descargable de grilla',
      'Todo lo de Pro incluido',
    ],
    cta: 'Hablar con ventas',
    popular: false,
  },
]

/* ─── DEEP DIVE DATA ─── */
var deepDive = [
  {
    title: 'Informe diario en tu correo',
    desc: 'Cada mañana recibes un email con todo lo que publicó tu competencia, análisis de IA, y oportunidades detectadas. Sin abrir ninguna red social.',
    img: '/copilot/mockup-email-diario.png',
    reverse: false,
  },
  {
    title: 'Copies y grilla listos para publicar',
    desc: 'Tres agentes de IA generan copies semanales con score de calidad. La grilla mensual llega con 16 posts organizados por fecha, plataforma y tipo.',
    img: '/copilot/mockup-grilla.png',
    reverse: true,
  },
  {
    title: 'Auditoría mensual de tu marca',
    desc: 'Cada mes, Copilot evalúa tus redes sociales y te entrega un score por canal con recomendaciones concretas para mejorar tu presencia digital.',
    img: '/copilot/mockup-auditoria.png',
    reverse: false,
  },
  {
    title: 'Dashboard completo en tiempo real',
    desc: 'Competencia, contenido, auditoría, guiones, ideas y reporte ejecutivo. Todo en un solo lugar con datos que se actualizan cada día.',
    img: '/copilot/mockup-dashboard.png',
    reverse: true,
  },
]

/* ─── COMPONENT ─── */
export default function CopilotClient() {
  var [trialEmail, setTrialEmail] = useState('')
  var [nombreEmpresa, setNombreEmpresa] = useState('')
  var [descripcion, setDescripcion] = useState('')
  var [url1, setUrl1] = useState('')
  var [url2, setUrl2] = useState('')
  var [url3, setUrl3] = useState('')
  var [enviado, setEnviado] = useState(false)
  var [enviando, setEnviando] = useState(false)
  var [tab, setTab] = useState('competencia')
  var [faqOpen, setFaqOpen] = useState(-1)
  var [modalOpen, setModalOpen] = useState(false)

  useScrollReveal()

  function handleTrial(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    fetch('/api/copilot/trial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: trialEmail,
        nombre_empresa: nombreEmpresa,
        descripcion: descripcion,
        competidores: [url1, url2, url3].filter(Boolean),
      }),
    })
      .then(function(res) { return res.json() })
      .then(function(data) {
        setEnviando(false)
        setEnviado(true)
        if (data.id) {
          window.location.href = '/copilot/dashboard/' + data.id
        }
      })
      .catch(function() {
        setEnviando(false)
        alert('Error al enviar. Intenta de nuevo.')
      })
  }

  function scrollTo(id: string) {
    var el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ─── GLOBAL STYLES ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .revealed { opacity: 1; transform: none; }
        .gradient-text { background: linear-gradient(135deg, #4338CA, #7C3AED); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .btn-primary { background: linear-gradient(135deg, #4338CA, #7C3AED); color: white; border: none; padding: 14px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: inline-block; text-decoration: none; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.35); }
        .btn-secondary { background: white; color: #4338CA; border: 2px solid #E0E7FF; padding: 12px 30px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: inline-block; text-decoration: none; }
        .btn-secondary:hover { border-color: #7C3AED; background: #F5F3FF; }
        .card-hover { transition: all 0.3s; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
        .plan-card { border: 2px solid #E5E7EB; border-radius: 20px; padding: 40px 32px; background: white; transition: all 0.3s; }
        .plan-card.popular { border-color: #7C3AED; box-shadow: 0 8px 40px rgba(124,58,237,0.15); position: relative; }
        .input-field { width: 100%; padding: 14px 18px; border: 2px solid #E5E7EB; border-radius: 12px; font-size: 15px; font-family: Inter, sans-serif; transition: border-color 0.3s; outline: none; box-sizing: border-box; }
        .input-field:focus { border-color: #7C3AED; }
        @media (max-width: 768px) {
          .hero-grid { flex-direction: column !important; }
          .feature-grid { grid-template-columns: 1fr !important; }
          .plans-grid { grid-template-columns: 1fr !important; }
          .deep-row { flex-direction: column !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — HERO */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #FFFFFF 100%)', padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60 }} className="hero-grid">
          {/* Left */}
          <div style={{ flex: 1 }}>
            <div className="reveal" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #EEF2FF, #F3E8FF)', borderRadius: 100, padding: '8px 20px', marginBottom: 24, fontSize: 14, fontWeight: 600, color: '#4338CA' }}>
              Potenciado con IA · OpenAI + Claude
            </div>
            <h1 className="reveal" style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, margin: '0 0 20px', color: '#111827' }}>
              Tu <span className="gradient-text">copiloto</span> de marketing digital
            </h1>
            <p className="reveal" style={{ fontSize: 19, lineHeight: 1.65, color: '#6B7280', margin: '0 0 32px', maxWidth: 520 }}>
              Monitorea a tu competencia, genera contenido con IA, recibe grillas mensuales y reportes ejecutivos. Todo automático, cada semana en tu email y WhatsApp.
            </p>
            <div className="reveal" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
              <button className="btn-primary" onClick={function() { scrollTo('trial') }}>
                Probar gratis 7 días
              </button>
              <button className="btn-secondary" onClick={function() { scrollTo('que-incluye') }}>
                Ver qué incluye
              </button>
            </div>
            <p className="reveal" style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
              Sin tarjeta · Se cancela solo · 100+ empresas
            </p>
          </div>

          {/* Right — Mock Dashboard Card */}
          <div className="reveal" style={{ flex: 1, maxWidth: 520 }}>
            <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
              {/* Tab bar */}
              <div style={{ display: 'flex', borderBottom: '1px solid #F3F4F6', padding: '0 24px' }}>
                {['Competencia', 'Contenido', 'Mi marca'].map(function(t) {
                  var isActive = tab === t.toLowerCase().replace(' ', '-')
                  return (
                    <button key={t} onClick={function() { setTab(t.toLowerCase().replace(' ', '-')) }} style={{ padding: '14px 20px', fontSize: 14, fontWeight: isActive ? 700 : 500, color: isActive ? '#4338CA' : '#9CA3AF', borderBottom: isActive ? '3px solid #4338CA' : '3px solid transparent', background: 'none', border: 'none', borderBottomWidth: 3, borderBottomStyle: 'solid', borderBottomColor: isActive ? '#4338CA' : 'transparent', cursor: 'pointer' }}>
                      {t}
                    </button>
                  )
                })}
              </div>
              {/* Card content */}
              <div style={{ padding: 24 }}>
                {tab === 'competencia' && (
                  <>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                      <div style={{ flex: 1, background: '#F5F3FF', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Posts detectados hoy</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#4338CA' }}>24</div>
                      </div>
                      <div style={{ flex: 1, background: '#F0FDF4', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Empresas monitoreadas</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#059669' }}>5</div>
                      </div>
                    </div>
                    <img src="/copilot/mockup-email-diario.png" alt="Informe diario de competencia" style={{ width: '100%', borderRadius: 12, height: 180, objectFit: 'cover' }} />
                  </>
                )}
                {tab === 'contenido' && (
                  <>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                      <div style={{ flex: 1, background: '#F5F3FF', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Copies generados</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#4338CA' }}>8</div>
                      </div>
                      <div style={{ flex: 1, background: '#F0FDF4', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Score promedio</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#059669' }}>84</div>
                      </div>
                    </div>
                    <img src="/copilot/mockup-copies.png" alt="Copies generados por IA" style={{ width: '100%', borderRadius: 12, height: 180, objectFit: 'cover' }} />
                  </>
                )}
                {tab === 'mi-marca' && (
                  <>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                      <div style={{ flex: 1, background: '#F5F3FF', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Score de perfil</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#4338CA' }}>76</div>
                      </div>
                      <div style={{ flex: 1, background: '#F0FDF4', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Redes auditadas</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#059669' }}>3</div>
                      </div>
                    </div>
                    <img src="/copilot/mockup-auditoria.png" alt="Auditoría de marca" style={{ width: '100%', borderRadius: 12, height: 180, objectFit: 'cover' }} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 2 — WHAT COPILOT DOES */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="que-incluye" style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
              Todo lo que hace <span className="gradient-text">Copilot</span> por ti
            </h2>
            <p style={{ fontSize: 18, color: '#6B7280', maxWidth: 600, margin: '0 auto' }}>
              Seis capacidades que trabajan juntas, cada día, sin que tengas que hacer nada.
            </p>
          </div>

          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {featureCards.map(function(card, i) {
              return (
                <div key={i} className="reveal card-hover" style={{ background: 'white', borderRadius: 20, overflow: 'hidden', border: '1px solid #F3F4F6', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <img src={card.img} alt={card.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  <div style={{ padding: '24px 24px 28px' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{card.title}</h3>
                    <p style={{ fontSize: 15, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>{card.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 3 — HOW IT WORKS */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
              Cómo funciona
            </h2>
            <p style={{ fontSize: 18, color: '#6B7280' }}>
              Tres pasos. Cinco minutos de setup. Después, Copilot trabaja solo.
            </p>
          </div>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { step: '1', title: 'Configura tus competidores', desc: 'Elige las cuentas de Instagram, LinkedIn y Facebook que quieres observar. Solo URLs, nada más.', icon: '⚙️' },
              { step: '2', title: 'Copilot trabaja por ti', desc: 'Analiza publicaciones, genera copies con 3 agentes IA, arma tu grilla mensual y audita tu perfil.', icon: '🤖' },
              { step: '3', title: 'Recibe todo listo', desc: 'Email diario con insights, semanal con copies, mensual con grilla completa + Excel + PDF ejecutivo.', icon: '📬' },
            ].map(function(s, i) {
              return (
                <div key={i} className="reveal" style={{ textAlign: 'center', padding: '40px 24px', background: 'white', borderRadius: 20, border: '1px solid #F3F4F6' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #EEF2FF, #F3E8FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>
                    {s.icon}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 8 }}>Paso {s.step}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 10px' }}>{s.title}</h3>
                  <p style={{ fontSize: 15, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 4 — FEATURES DEEP DIVE */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
              Funcionalidades que marcan <span className="gradient-text">la diferencia</span>
            </h2>
          </div>

          {deepDive.map(function(item, i) {
            return (
              <div key={i} className="reveal deep-row" style={{ display: 'flex', alignItems: 'center', gap: 60, marginBottom: 80, flexDirection: item.reverse ? 'row-reverse' : 'row' }}>
                <div style={{ flex: 1 }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', borderRadius: 20, objectFit: 'cover', maxHeight: 340 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>{item.title}</h3>
                  <p style={{ fontSize: 17, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 4B — EJEMPLO DE INFORMES */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #111827 0%, #1E1B4B 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px' }}>
              Así se ven tus informes
            </h2>
            <p style={{ fontSize: 18, color: '#94a3b8' }}>
              Recibes todo en tu correo, listo para leer. Sin login, sin apps.
            </p>
          </div>

          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {[
              { img: '/copilot/mockup-email-diario.png', title: 'Informe diario', desc: 'Cada mañana: qué publicó tu competencia, análisis IA y oportunidades detectadas.', tag: 'Email diario' },
              { img: '/copilot/mockup-copies.png', title: 'Resumen semanal', desc: 'Copies sugeridos con score QA, guiones de reels y acciones recomendadas. Con Excel adjunto.', tag: 'Email + Excel' },
              { img: '/copilot/mockup-reporte.png', title: 'Resumen mensual', desc: 'Grilla completa, auditoría de perfil, reporte ejecutivo. Con Excel y PDF adjuntos.', tag: 'Email + Excel + PDF' },
            ].map(function(item, i) {
              return (
                <div key={i} className="reveal card-hover" style={{ background: '#0F0D2E', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '20px 20px 0 0' }} />
                  <div style={{ padding: '24px 24px 28px' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px' }}>{item.title}</h3>
                    <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.6 }}>{item.desc}</p>
                    <span style={{ display: 'inline-block', background: 'rgba(124,58,237,0.2)', color: '#A78BFA', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 100 }}>{item.tag}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 4C — SOCIAL PROOF */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#F5F3FF' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#111827', margin: '0 0 40px' }}>
              Empresas que ya usan <span className="gradient-text">Copilot</span>
            </h2>
            <div style={{ background: 'white', borderRadius: 20, padding: '48px 40px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: 20, fontStyle: 'italic', color: '#374151', lineHeight: 1.7, margin: '0 0 24px' }}>
                &ldquo;Copilot nos permite saber exactamente qué está haciendo nuestra competencia cada día. Los copies sugeridos nos ahorran horas de trabajo semanal.&rdquo;
              </p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                Genera HR
              </p>
              <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 32px' }}>
                Control de asistencia líder en Chile
              </p>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
                100+ empresas confían en Copilot
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 5 — PLANS */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
              Planes simples, sin letra chica
            </h2>
            <p style={{ fontSize: 18, color: '#6B7280' }}>Todos los planes incluyen 7 días gratis. Precios + IVA.</p>
          </div>

          <div className="plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, alignItems: 'start' }}>
            {plans.map(function(plan, i) {
              return (
                <div key={i} className={'reveal plan-card' + (plan.popular ? ' popular' : '')}>
                  {plan.popular && (
                    <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #4338CA, #7C3AED)', color: 'white', fontSize: 12, fontWeight: 700, padding: '6px 20px', borderRadius: 100, textTransform: 'uppercase' as const, letterSpacing: 1 }}>
                      Más elegido
                    </div>
                  )}
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>{plan.name}</h3>
                  <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 20px' }}>{plan.desc}</p>
                  <div style={{ marginBottom: 24 }}>
                    <span style={{ fontSize: 40, fontWeight: 800, color: '#111827' }}>{fmt(plan.price)}</span>
                    <span style={{ fontSize: 15, color: '#9CA3AF', marginLeft: 4 }}>/mes</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                    {plan.features.map(function(f, fi) {
                      return (
                        <li key={fi} style={{ padding: '8px 0', fontSize: 15, color: '#374151', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✓</span>
                          {f}
                        </li>
                      )
                    })}
                  </ul>
                  <button className={plan.popular ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%', textAlign: 'center' }} onClick={function() { scrollTo('trial') }}>
                    {plan.cta}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 6 — TRIAL FORM */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="trial" style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F3FF 100%)' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 12px' }}>
              Activa tu <span className="gradient-text">Copilot</span> gratis
            </h2>
            <p style={{ fontSize: 17, color: '#6B7280' }}>7 días sin costo. Configura en 2 minutos.</p>
          </div>

          {enviado ? (
            <div className="reveal" style={{ textAlign: 'center', background: 'white', borderRadius: 20, padding: 48, border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>Copilot activado</h3>
              <p style={{ fontSize: 16, color: '#6B7280' }}>Revisa tu email para los próximos pasos.</p>
            </div>
          ) : (
            <form onSubmit={handleTrial} className="reveal" style={{ background: 'white', borderRadius: 20, padding: '40px 36px', border: '1px solid #E5E7EB', boxShadow: '0 8px 40px rgba(0,0,0,0.04)' }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email corporativo</label>
                <input type="email" required className="input-field" placeholder="tu@empresa.cl" value={trialEmail} onChange={function(e) { setTrialEmail(e.target.value) }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Nombre de tu empresa</label>
                <input type="text" required className="input-field" placeholder="Mi Empresa SpA" value={nombreEmpresa} onChange={function(e) { setNombreEmpresa(e.target.value) }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Describe tu empresa en 1 línea</label>
                <input type="text" className="input-field" placeholder="Vendemos X a Y en Chile" value={descripcion} onChange={function(e) { setDescripcion(e.target.value) }} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Competidores a monitorear</label>
              </div>
              <div style={{ marginBottom: 12 }}>
                <input type="url" className="input-field" placeholder="https://instagram.com/competidor1" value={url1} onChange={function(e) { setUrl1(e.target.value) }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input type="url" className="input-field" placeholder="https://instagram.com/competidor2" value={url2} onChange={function(e) { setUrl2(e.target.value) }} />
              </div>
              <div style={{ marginBottom: 28 }}>
                <input type="url" className="input-field" placeholder="https://instagram.com/competidor3" value={url3} onChange={function(e) { setUrl3(e.target.value) }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', textAlign: 'center', fontSize: 17, padding: '16px 32px' }} disabled={enviando}>
                {enviando ? 'Activando...' : 'Activar mi Copilot gratis'}
              </button>
              <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 16, marginBottom: 0 }}>
                Sin tarjeta de crédito · Cancela cuando quieras
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 7 — FOOTER */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer style={{ padding: '40px 24px', background: '#111827', textAlign: 'center' }}>
        <p style={{ fontSize: 15, color: '#9CA3AF', margin: 0 }}>
          M&amp;P Copilot by <a href="https://www.mulleryperez.cl" style={{ color: '#A5B4FC', textDecoration: 'none' }}>Muller y Pérez</a> · mulleryperez.cl
        </p>
      </footer>
    </div>
  )
}
