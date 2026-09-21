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

/* --- PLANS DATA --- */
var plans = [
  {
    name: 'Setup',
    price: 200000,
    sessions: '1 sesion, 90 min',
    desc: 'Tu primer agente funcionando',
    features: [
      'Instalacion Claude Code',
      'Memoria persistente (CLAUDE.md + auto-memory)',
      'Hooks (SessionStart, formateo)',
      'Primer agente funcional',
      'Conexion a tu primer servicio',
    ],
    cta: 'Agendar setup',
    popular: false,
  },
  {
    name: 'Completo',
    price: 700000,
    sessions: '4 sesiones 1:1',
    desc: 'Sistema operativo con IA completo',
    features: [
      'Todo lo del Setup +',
      'Agentes diarios (blog SEO, rankings) + GitHub Actions',
      'Integraciones (WP API, Gmail, CRM, Resend)',
      'Cotizaciones/PDFs profesionales',
      'Master Agent (reporte diario, monitoreo)',
      'Soporte WhatsApp entre sesiones',
    ],
    cta: 'Empezar programa',
    popular: true,
  },
  {
    name: 'Agencia',
    price: 1500000,
    sessions: 'Presencial Santiago',
    desc: 'Implementacion para equipos',
    features: [
      'Todo lo del Completo +',
      'Sesion presencial 4 horas con equipo',
      'Setup multi-usuario',
      'Repos y workflows por cliente',
      'Dashboard operativo',
      '1 mes soporte post-implementacion',
    ],
    cta: 'Hablar con Christopher',
    popular: false,
  },
]

/* --- FAQ DATA --- */
var faqs = [
  { q: '¿Necesito saber programar?', a: 'No. Claude Code programa por ti. Tu describes lo que necesitas en lenguaje natural y Claude Code ejecuta: crea archivos, instala dependencias, conecta APIs, deploya sitios.' },
  { q: '¿Que es Claude Code?', a: 'Es la herramienta CLI de Anthropic que lee archivos, ejecuta comandos, conecta APIs y tiene memoria persistente. No es un chat — es un sistema operativo que ejecuta acciones reales en tu computador.' },
  { q: '¿En que se diferencia de ChatGPT?', a: 'ChatGPT es un chat. Claude Code es un sistema operativo que ejecuta acciones reales: lee tu disco, crea archivos, conecta APIs, recuerda todo, y corre agentes en segundo plano.' },
  { q: '¿Cuanto dura cada sesion?', a: '90 minutos por videollamada. En el programa Completo son 4 sesiones de 90 minutos cada una.' },
  { q: '¿Puedo hacer las sesiones online?', a: 'Si, todas son por videollamada. El programa Agencia incluye opcion presencial en Santiago.' },
  { q: '¿Que resultados puedo esperar?', a: 'Desde la primera sesion tendras un agente funcionando — blog diario, reporte automatico, o el que elijas segun tu negocio.' },
  { q: '¿Funciona para cualquier industria?', a: 'Si. Tenemos clientes en educacion, salud, inmobiliario, energia, legal, retail y mas.' },
  { q: '¿Incluye soporte despues?', a: 'El programa Completo incluye soporte WhatsApp entre sesiones. El Agencia incluye 1 mes post-implementacion.' },
]

var WA_LINK = 'https://wa.me/56992258137?text=Hola%20Christopher,%20me%20interesa%20la%20consultor%C3%ADa%20Claude%20Code'

/* --- COMPONENT --- */
export default function CopilotClient() {
  var [faqOpen, setFaqOpen] = useState(-1)
  var [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', mensaje: '' })
  var [enviando, setEnviando] = useState(false)
  var [enviado, setEnviado] = useState(false)

  useScrollReveal()

  function scrollTo(id: string) {
    var el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      var res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          solicitud: 'Consultoria Claude Code\n\n' + formData.mensaje,
          destinatario: 'contacto@mulleryperez.cl',
          fuente: 'landing-copilot-claude-code',
        }),
      })
      if (res.ok) {
        setEnviado(true)
      } else {
        alert('Error al enviar. Intenta por WhatsApp.')
      }
    } catch {
      alert('Error al enviar. Intenta por WhatsApp.')
    }
    setEnviando(false)
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* --- GLOBAL STYLES --- */}
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
          .problem-grid { grid-template-columns: 1fr !important; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .profiles-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />

      {/* ================================================================= */}
      {/* SECTION 1 — HERO */}
      {/* ================================================================= */}
      <section style={{ background: 'linear-gradient(180deg, #0F0A2E 0%, #1a1145 50%, #0F0A2E 100%)', padding: '120px 24px 80px', color: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div className="reveal" style={{ display: 'inline-block', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 100, padding: '8px 24px', marginBottom: 28, fontSize: 13, fontWeight: 700, color: '#C4B5FD', letterSpacing: 2, textTransform: 'uppercase' as const }}>
            Consultoria 1:1
          </div>

          <h1 className="reveal" style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px', color: 'white', maxWidth: 800, marginLeft: 'auto', marginRight: 'auto' }}>
            Instala un sistema operativo con IA que{' '}
            <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>gestione tu negocio</span>
          </h1>

          <p className="reveal" style={{ fontSize: 19, lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', margin: '0 auto 20px', maxWidth: 700 }}>
            Una sola herramienta que lee archivos, envia mails, deploya sitios, genera PDFs, gestiona repos y conecta APIs — mientras tu duermes.
          </p>

          <p className="reveal" style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.45)', margin: '0 auto 36px', maxWidth: 680 }}>
            Christopher Muller opera una agencia de 33 clientes y $80-100M CLP en pauta mensual 100% desde Claude Code. Ahora enseña como replicar este sistema.
          </p>

          <div className="reveal" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '16px 36px', fontSize: 17 }}>
              Agendar sesion
            </a>
            <button className="btn-secondary" onClick={function() { scrollTo('programa') }} style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              Ver programa
            </button>
          </div>

          {/* KPI boxes */}
          <div className="reveal kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
            {[
              { num: '33', label: 'Clientes gestionados' },
              { num: '96+', label: 'Articulos/semana automaticos' },
              { num: '7', label: 'Repos con agentes' },
              { num: '15 min', label: 'Por cotizacion profesional' },
            ].map(function(kpi, i) {
              return (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{kpi.num}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{kpi.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 2 — EL PROBLEMA */}
      {/* ================================================================= */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
              Lo que hacen la mayoria de profesionales hoy
            </h2>
          </div>

          <div className="problem-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            {/* Left — BAD */}
            <div className="reveal" style={{ background: 'linear-gradient(135deg, #FEF2F2, #FFF5F5)', border: '1px solid #FECACA', borderRadius: 20, padding: '36px 32px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#DC2626', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 32, height: 32, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>&#x2717;</span>
                La realidad actual
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Horas en tareas repetitivas (reportes, propuestas, emails, contenido)',
                  '10+ herramientas que no se hablan (Canva, ChatGPT, Notion, Slack, Sheets)',
                  'No pueden escalar — ellos SON el cuello de botella',
                  'Pagan por IA que apenas usan o usan superficialmente',
                  'Todo es manual — no tienen sistemas automatizados',
                  'Su "estrategia de IA" es copy-paste desde ChatGPT',
                ].map(function(item, i) {
                  return (
                    <li key={i} style={{ padding: '10px 0', fontSize: 15, color: '#7F1D1D', display: 'flex', alignItems: 'flex-start', gap: 12, lineHeight: 1.5 }}>
                      <span style={{ color: '#DC2626', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>—</span>
                      {item}
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Right — GOOD */}
            <div className="reveal" style={{ background: 'linear-gradient(135deg, #F0FDF4, #F5FFF9)', border: '1px solid #BBF7D0', borderRadius: 20, padding: '36px 32px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#059669', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 32, height: 32, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>&#x2713;</span>
                Lo que instalamos
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Una herramienta que lee/escribe archivos, envia mails, deploya sitios, llama APIs',
                  'Agentes automatizados que trabajan mientras duermes',
                  'Memoria persistente que conoce tus clientes y contexto',
                  'Integraciones reales (WordPress, HubSpot, Salesforce, Gmail, Google Ads)',
                  'Entregables profesionales en minutos (PDFs, propuestas, auditorias)',
                ].map(function(item, i) {
                  return (
                    <li key={i} style={{ padding: '10px 0', fontSize: 15, color: '#14532D', display: 'flex', alignItems: 'flex-start', gap: 12, lineHeight: 1.5 }}>
                      <span style={{ color: '#059669', fontWeight: 700, flexShrink: 0, fontSize: 16 }}>&#x2713;</span>
                      {item}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Dark callout */}
          <div className="reveal" style={{ marginTop: 40, background: '#111827', borderRadius: 20, padding: '32px 40px', textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: 'white', margin: 0, lineHeight: 1.6 }}>
              ChatGPT es un chat. Claude Code es un <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>sistema operativo</span>.
              <br/>
              <span style={{ fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>
                Lee tu disco, ejecuta codigo, conecta APIs, recuerda todo, y corre agentes en segundo plano.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 3 — RESULTADOS REALES */}
      {/* ================================================================= */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #111827 0%, #1E1B4B 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px' }}>
              Esto no son demos — son sistemas corriendo en produccion
            </h2>
            <p style={{ fontSize: 17, color: '#94a3b8' }}>Resultados reales de la agencia operada 100% con Claude Code.</p>
          </div>

          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {[
              {
                title: 'SEO automatizado',
                items: [
                  '4 clientes con agentes de blog diario (Halterlift, DMP, LabLab, Wiseplan)',
                  'Publicacion automatica L-V 07:30, 10.000+ caracteres',
                  'DevuelveMiPie: 98 articulos, schemas inyectados',
                  'Wiseplan: score SEO de 4.1 a 7.1 en una sesion',
                ],
                color: '#818cf8',
              },
              {
                title: 'Licitaciones con IA',
                items: [
                  'Licitacion Santo Tomas: 52 archivos, 9 carpetas, QA automatico',
                  'Cotizaciones A4 en 15 minutos con diseño profesional',
                  'Propuestas con data de mercado real',
                ],
                color: '#c084fc',
              },
              {
                title: 'Operaciones diarias',
                items: [
                  'Master Agent: reporte diario con status de workflows',
                  '22 workflows caducos identificados y limpiados',
                  'Mails profesionales enviados desde terminal',
                ],
                color: '#f472b6',
              },
              {
                title: 'Dashboards y CRM',
                items: [
                  'Integracion Salesforce Marketing Cloud',
                  'Dashboards en tiempo real (Vercel + Supabase)',
                  'Fiscalizacion WhatsApp con Twilio',
                ],
                color: '#34d399',
              },
            ].map(function(card, i) {
              return (
                <div key={i} className="reveal card-hover" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px' }}>
                  <div style={{ width: 48, height: 4, background: card.color, borderRadius: 4, marginBottom: 20 }}></div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', margin: '0 0 16px' }}>{card.title}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {card.items.map(function(item, j) {
                      return (
                        <li key={j} style={{ padding: '6px 0', fontSize: 14, color: '#94a3b8', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.6 }}>
                          <span style={{ color: card.color, fontWeight: 700, flexShrink: 0 }}>&#x2713;</span>
                          {item}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 4 — EL PROGRAMA */}
      {/* ================================================================= */}
      <section id="programa" style={{ padding: '80px 24px', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
              Programa de consultoria <span className="gradient-text">Claude Code</span>
            </h2>
            <p style={{ fontSize: 17, color: '#6B7280' }}>Tres niveles segun lo que necesitas. Precios + IVA.</p>
          </div>

          <div className="plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, alignItems: 'start' }}>
            {plans.map(function(plan, i) {
              return (
                <div key={i} className={'reveal plan-card' + (plan.popular ? ' popular' : '')}>
                  {plan.popular && (
                    <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #4338CA, #7C3AED)', color: 'white', fontSize: 12, fontWeight: 700, padding: '6px 20px', borderRadius: 100, textTransform: 'uppercase' as const, letterSpacing: 1, whiteSpace: 'nowrap' as const }}>
                      Mas popular
                    </div>
                  )}
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>{plan.name}</h3>
                  <p style={{ fontSize: 13, color: '#7C3AED', fontWeight: 600, margin: '0 0 8px' }}>{plan.sessions}</p>
                  <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 20px' }}>{plan.desc}</p>
                  <div style={{ marginBottom: 24 }}>
                    <span style={{ fontSize: 38, fontWeight: 800, color: '#111827' }}>{fmt(plan.price)}</span>
                    <span style={{ fontSize: 14, color: '#9CA3AF', marginLeft: 4 }}>CLP</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                    {plan.features.map(function(f, fi) {
                      return (
                        <li key={fi} style={{ padding: '8px 0', fontSize: 15, color: '#374151', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>&#x2713;</span>
                          {f}
                        </li>
                      )
                    })}
                  </ul>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className={plan.popular ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>
                    {plan.cta}
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 5 — COMO FUNCIONA */}
      {/* ================================================================= */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
              Las 4 sesiones del programa
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { step: '1', title: 'Setup + Memoria + Hooks + Primer agente', desc: 'Instalamos Claude Code, configuramos la memoria persistente que conoce tu negocio, activamos hooks de formateo y creamos tu primer agente funcional.', color: '#4338CA' },
              { step: '2', title: 'Agentes diarios + GitHub Actions', desc: 'Configuramos agentes que corren automaticamente (blog SEO, rankings, reportes) y los conectamos a GitHub Actions para ejecucion programada.', color: '#7C3AED' },
              { step: '3', title: 'Integraciones + Cotizaciones/PDFs', desc: 'Conectamos Claude Code a tus herramientas (WordPress, Gmail, CRM, Google Ads) y configuramos generacion de cotizaciones y PDFs profesionales.', color: '#A855F7' },
              { step: '4', title: 'Master Agent + Dashboard operativo', desc: 'Creamos el agente maestro que monitorea todos los demas, genera reportes diarios y te mantiene al tanto de todo lo que pasa en tu negocio.', color: '#C084FC' },
            ].map(function(s, i) {
              return (
                <div key={i} className="reveal" style={{ display: 'flex', alignItems: 'flex-start', gap: 24, background: '#F9FAFB', borderRadius: 20, padding: '28px 32px', border: '1px solid #F3F4F6' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 20, flexShrink: 0 }}>
                    {s.step}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{s.title}</h3>
                    <p style={{ fontSize: 15, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 6 — PARA QUIEN */}
      {/* ================================================================= */}
      <section style={{ padding: '80px 24px', background: '#F5F3FF' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
              ¿Es para ti?
            </h2>
          </div>

          <div className="reveal profiles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
            {[
              { title: 'Agencias de marketing digital', desc: 'Que quieren escalar sin contratar mas personas.' },
              { title: 'Consultores independientes', desc: 'Que son el cuello de botella de su propio negocio.' },
              { title: 'Equipos tech', desc: 'Que quieren automatizar operaciones repetitivas.' },
              { title: 'Usuarios de ChatGPT', desc: 'Que quieren pasar al siguiente nivel con IA que ejecuta.' },
              { title: 'Fundadores de startups', desc: 'Que necesitan hacer mas con menos recursos.' },
            ].map(function(profile, i) {
              return (
                <div key={i} className="card-hover" style={{ background: 'white', borderRadius: 16, padding: '28px 24px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{profile.title}</h3>
                  <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>{profile.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Requirements callout */}
          <div className="reveal" style={{ background: 'white', borderRadius: 20, padding: '32px 36px', border: '1px solid #E5E7EB', maxWidth: 700, margin: '0 auto' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 20px' }}>Lo que necesitas</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'Mac o PC con terminal',
                'Cuenta Anthropic (se configura en la sesion)',
                'Un negocio real con procesos repetitivos',
                'NO necesitas saber programar',
              ].map(function(req, i) {
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#374151' }}>
                    <span style={{ color: '#7C3AED', fontWeight: 700 }}>&#x2713;</span>
                    {req}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 7 — SOBRE CHRISTOPHER */}
      {/* ================================================================= */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
              Quien te asesora
            </h2>
          </div>

          <div className="reveal" style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ width: 160, height: 160, borderRadius: 20, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo-color.png" alt="Christopher Muller — Muller y Perez" style={{ width: '80%', height: 'auto', objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1, minWidth: 300 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>Christopher Muller</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
                {[
                  'Ingeniero Civil Industrial + MBA Universidad de Chile',
                  '20+ años en tecnologia, marketing digital e IA',
                  'Fundador de Muller y Perez (33 clientes, $80-100M pauta mensual)',
                  'Opera 100% de su agencia con Claude Code',
                  'Referente en IA aplicada a marketing en Chile',
                ].map(function(item, i) {
                  return (
                    <li key={i} style={{ padding: '6px 0', fontSize: 15, color: '#374151', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.5 }}>
                      <span style={{ color: '#7C3AED', fontWeight: 700, flexShrink: 0 }}>&#x2713;</span>
                      {item}
                    </li>
                  )
                })}
              </ul>
              <div style={{ background: '#F5F3FF', borderLeft: '4px solid #7C3AED', borderRadius: 8, padding: '16px 20px' }}>
                <p style={{ fontSize: 15, fontStyle: 'italic', color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                  &ldquo;Si buscan &lsquo;mejores agencias performance marketing Chile&rsquo; en Google o ChatGPT, nos van a encontrar.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 8 — FAQ */}
      {/* ================================================================= */}
      <section style={{ padding: '80px 24px', background: '#F9FAFB' }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
              Preguntas frecuentes
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(function(faq, i) {
              var isOpen = faqOpen === i
              return (
                <div key={i} className="reveal" style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden', transition: 'all 0.3s' }}>
                  <button
                    onClick={function() { setFaqOpen(isOpen ? -1 : i) }}
                    style={{ width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#111827', fontFamily: 'Inter, sans-serif' }}
                  >
                    {faq.q}
                    <span style={{ fontSize: 20, color: '#7C3AED', transition: 'transform 0.3s', transform: isOpen ? 'rotate(45deg)' : 'none', flexShrink: 0, marginLeft: 12 }}>+</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 24px 20px', fontSize: 15, color: '#6B7280', lineHeight: 1.7 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 9 — CONTACTO */}
      {/* ================================================================= */}
      <section id="contacto" style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F3FF 100%)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
              Agenda tu sesion
            </h2>
          </div>

          <div className="reveal contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
            {/* Left — Direct contact */}
            <div>
              <p style={{ fontSize: 17, color: '#6B7280', lineHeight: 1.7, margin: '0 0 28px' }}>
                Escribe por el formulario o contacta directamente por WhatsApp. Respondemos el mismo dia.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textAlign: 'center' }}>
                  Escribir por WhatsApp
                </a>
              </div>
              <div style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.8 }}>
                <p style={{ margin: '0 0 4px' }}>+56 9 9225 8137</p>
                <p style={{ margin: '0 0 4px' }}>contacto@mulleryperez.cl</p>
                <p style={{ margin: 0 }}>Badajoz 100 Of 523, Las Condes</p>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              {enviado ? (
                <div style={{ background: 'white', borderRadius: 20, padding: 40, border: '1px solid #E5E7EB', textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>&#x2705;</div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Mensaje recibido</h3>
                  <p style={{ fontSize: 15, color: '#6B7280', margin: '0 0 20px' }}>Te contactaremos dentro de las proximas horas.</p>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    WhatsApp directo
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 20, padding: '36px 32px', border: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <input
                      type="text" required placeholder="Nombre"
                      className="input-field"
                      value={formData.nombre}
                      onChange={function(e) { setFormData(function(p) { return { ...p, nombre: e.target.value } }) }}
                    />
                    <input
                      type="email" required placeholder="Email"
                      className="input-field"
                      value={formData.email}
                      onChange={function(e) { setFormData(function(p) { return { ...p, email: e.target.value } }) }}
                    />
                    <input
                      type="tel" required placeholder="Telefono"
                      className="input-field"
                      value={formData.telefono}
                      onChange={function(e) { setFormData(function(p) { return { ...p, telefono: e.target.value } }) }}
                    />
                    <textarea
                      placeholder="¿Que quieres automatizar?"
                      className="input-field"
                      rows={4}
                      style={{ resize: 'vertical' }}
                      value={formData.mensaje}
                      onChange={function(e) { setFormData(function(p) { return { ...p, mensaje: e.target.value } }) }}
                    />
                    <button type="submit" className="btn-primary" style={{ width: '100%', textAlign: 'center', opacity: enviando ? 0.6 : 1 }} disabled={enviando}>
                      {enviando ? 'Enviando...' : 'Agendar sesion de setup'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* FOOTER */}
      {/* ================================================================= */}
      <footer style={{ padding: '40px 24px', background: '#111827', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#9CA3AF', margin: 0 }}>
          Muller y Perez &middot; <a href="https://www.mulleryperez.cl" style={{ color: '#A5B4FC', textDecoration: 'none' }}>mulleryperez.cl</a> &middot; Badajoz 100 Of 523, Las Condes &middot; +56 9 9225 8137
        </p>
      </footer>
    </div>
  )
}
