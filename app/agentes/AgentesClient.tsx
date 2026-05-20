'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'

var terminalLines = [
  { delay: 400, html: '<span style="color:#4B5563">07:30</span> <span style="color:#818CF8">▸ Agente iniciado</span> — tema: <span style="color:#F9A8D4">"Cómo recuperar el pie de tu departamento"</span>' },
  { delay: 1000, html: '<span style="color:#4B5563">07:30</span> Generando artículo con IA...' },
  { delay: 2000, html: '<span style="color:#4B5563">07:31</span> <span style="color:#34D399">✓</span> Artículo generado — <span style="color:#F9A8D4">12.847 caracteres</span> · 8 secciones · tabla · 5 FAQ' },
  { delay: 800, html: '<span style="color:#4B5563">07:31</span> <span style="color:#34D399">✓</span> Calidad verificada — estructura SEO completa' },
  { delay: 800, html: '<span style="color:#4B5563">07:32</span> <span style="color:#818CF8">▸ Publicando...</span>' },
  { delay: 1000, html: '<span style="color:#4B5563">07:32</span> <span style="color:#34D399">✓ Publicado</span> → <span style="color:#60A5FA;text-decoration:underline">devuelvemipie.cl/como-recuperar-pie-departamento/</span>' },
  { delay: 600, html: '<span style="color:#4B5563">07:32</span> <span style="color:#34D399">✓</span> Meta description + keyword configurados' },
  { delay: 600, html: '<span style="color:#4B5563">07:32</span> <span style="color:#34D399">✓</span> Email de confirmación enviado' },
  { delay: 800, html: '' },
  { delay: 300, html: '<span style="color:#4B5563">07:32</span> <span style="color:#818CF8">Artículo #24 del mes.</span> Próximo: mañana 07:30 AM.' },
]

function TerminalAnimation() {
  var ref = useRef<HTMLDivElement>(null)

  useEffect(function() {
    function run() {
      if (!ref.current) return
      ref.current.innerHTML = ''
      var d = 0
      terminalLines.forEach(function(l) {
        d += l.delay
        setTimeout(function() {
          if (!ref.current) return
          var div = document.createElement('div')
          div.style.cssText = 'opacity:0;transform:translateY(8px);animation:lineIn 0.4s ease forwards'
          div.innerHTML = l.html
          ref.current.appendChild(div)
          ref.current.scrollTop = ref.current.scrollHeight
        }, d)
      })
      return d
    }
    var total = run() || 8000
    var interval = setInterval(function() { run() }, total + 4000)
    return function() { clearInterval(interval) }
  }, [])

  return <div ref={ref} style={{ padding: 20, fontSize: 12, lineHeight: 1.7, minHeight: 180, maxHeight: 200, overflow: 'hidden', color: '#94A3B8' }} />
}

export default function AgentesClient() {
  return (
    <>
      <SiteHeader />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes lineIn { to { opacity: 1; transform: translateY(0); } }
        @keyframes orbFloat { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,-20px); } }
      `}} />

      {/* HERO */}
      <div style={{ background: '#07061A', position: 'relative', padding: '120px 24px 60px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, background: 'rgba(37,99,235,0.15)', borderRadius: '50%', filter: 'blur(80px)', top: -100, left: -100, animation: 'orbFloat 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, background: 'rgba(147,51,234,0.12)', borderRadius: '50%', filter: 'blur(80px)', bottom: -150, right: -150, animation: 'orbFloat 8s ease-in-out infinite 2s' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2.5, color: '#818CF8', textTransform: 'uppercase', marginBottom: 20 }}>Posicionamiento IA + Google</p>
          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, maxWidth: 750, margin: '0 auto 24px', color: '#fff' }}>
            Tu sitio <span style={{ background: 'linear-gradient(135deg, #60A5FA, #C084FC, #F472B6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>publicando contenido SEO</span> todos los días
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.65 }}>
            Un agente de IA escribe, optimiza y publica artículos en tu blog automáticamente. Google te indexa. Los buscadores de IA te citan. Tu sitio crece mientras duermes.
          </p>
          <Link href="#planes" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff', padding: '18px 42px', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
            Ver planes desde $69.990/mes →
          </Link>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 36 }}>
            {[{ n: '24', l: 'artículos / mes' }, { n: '100%', l: 'automático' }, { n: '$2.916', l: 'por artículo' }].map(function(s) {
              return <div key={s.n} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 900, background: 'linear-gradient(135deg, #60A5FA, #C084FC)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.l}</div>
              </div>
            })}
          </div>
        </div>
      </div>

      {/* FLOW DIAGRAM */}
      <div style={{ background: '#07061A', padding: '56px 24px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', color: '#fff', letterSpacing: -1, marginBottom: 12 }}>
          Así funciona el <span style={{ background: 'linear-gradient(135deg, #60A5FA, #C084FC)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>agente</span>
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 36 }}>Configuramos tu sitio una vez. Después, el agente trabaja solo todos los días.</p>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <svg viewBox="0 0 820 360" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 820, margin: '0 auto', display: 'block' }}>
            <defs>
              <linearGradient id="g1" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor="#2563EB" stopOpacity="0.7"/><stop offset="100%" stopColor="#7C3AED" stopOpacity="0.7"/></linearGradient>
              <linearGradient id="g2" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor="#7C3AED" stopOpacity="0.7"/><stop offset="100%" stopColor="#EC4899" stopOpacity="0.7"/></linearGradient>
              <linearGradient id="g3" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor="#EC4899" stopOpacity="0.7"/><stop offset="100%" stopColor="#10B981" stopOpacity="0.7"/></linearGradient>
              <linearGradient id="glV" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#7C3AED" stopOpacity="0.6"/><stop offset="100%" stopColor="#10B981" stopOpacity="0.6"/></linearGradient>
              <filter id="gl"><feGaussianBlur stdDeviation="4"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            {/* Lines */}
            <line x1="175" y1="75" x2="270" y2="75" stroke="url(#g1)" strokeWidth="2.5" filter="url(#gl)"/>
            <line x1="450" y1="75" x2="540" y2="75" stroke="url(#g2)" strokeWidth="2.5" filter="url(#gl)"/>
            <line x1="640" y1="105" x2="640" y2="165" stroke="url(#g3)" strokeWidth="2" filter="url(#gl)" opacity="0.6"/>
            <line x1="640" y1="165" x2="490" y2="165" stroke="#10B981" strokeWidth="1.5" filter="url(#gl)" opacity="0.4"/>
            <line x1="640" y1="165" x2="640" y2="225" stroke="#818CF8" strokeWidth="1.5" filter="url(#gl)" opacity="0.4"/>
            <line x1="640" y1="165" x2="780" y2="165" stroke="#10B981" strokeWidth="1.5" filter="url(#gl)" opacity="0.4"/>
            <line x1="490" y1="215" x2="570" y2="275" stroke="#10B981" strokeWidth="1.5" filter="url(#gl)" opacity="0.3"/>
            <line x1="640" y1="275" x2="640" y2="285" stroke="#10B981" strokeWidth="1.5" filter="url(#gl)" opacity="0.3"/>
            <line x1="780" y1="215" x2="700" y2="275" stroke="#10B981" strokeWidth="1.5" filter="url(#gl)" opacity="0.3"/>
            {/* Particles */}
            <circle r="5" fill="#60A5FA" filter="url(#gl)"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 175 75 L 270 75"/></circle>
            <circle r="5" fill="#C084FC" filter="url(#gl)"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 450 75 L 540 75"/></circle>
            <circle r="4" fill="#34D399" filter="url(#gl)"><animateMotion dur="2s" repeatCount="indefinite" path="M 640 105 L 640 165 L 640 225"/></circle>
            {/* Node: Tu negocio */}
            <rect x="15" y="35" width="160" height="80" rx="16" fill="#0C0B24" stroke="#2563EB" strokeWidth="2" filter="url(#gl)"/>
            <text x="95" y="68" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800" fontFamily="Inter">Tu negocio</text>
            <text x="95" y="88" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="Inter">Rubro · Keywords · Tono</text>
            {/* Node: Agente IA */}
            <rect x="270" y="30" width="180" height="90" rx="18" fill="#0C0B24" stroke="#7C3AED" strokeWidth="2.5" filter="url(#gl)"/>
            <text x="360" y="62" textAnchor="middle" fill="#C084FC" fontSize="16" fontWeight="900" fontFamily="Inter">Agente IA</text>
            <text x="360" y="82" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="Inter">Escribe · Optimiza · Publica</text>
            <text x="360" y="100" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="Inter">24 artículos / mes automático</text>
            {/* Node: Tu sitio */}
            <rect x="540" y="35" width="200" height="80" rx="16" fill="#0C0B24" stroke="#EC4899" strokeWidth="2" filter="url(#gl)"/>
            <text x="640" y="65" textAnchor="middle" fill="#F472B6" fontSize="14" fontWeight="800" fontFamily="Inter">Tu sitio web</text>
            <text x="640" y="85" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="Inter">Blog con artículos SEO + Schemas</text>
            {/* Output: Google */}
            <rect x="425" y="170" width="130" height="45" rx="12" fill="rgba(16,185,129,0.08)" stroke="#10B981" strokeWidth="1.5"/>
            <text x="490" y="191" textAnchor="middle" fill="#34D399" fontSize="11" fontWeight="700" fontFamily="Inter">Google</text>
            <text x="490" y="206" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="Inter">Te posiciona</text>
            {/* Output: Buscadores IA */}
            <rect x="575" y="225" width="130" height="50" rx="12" fill="rgba(129,140,248,0.08)" stroke="#818CF8" strokeWidth="1.5"/>
            <text x="640" y="248" textAnchor="middle" fill="#A5B4FC" fontSize="11" fontWeight="700" fontFamily="Inter">Buscadores IA</text>
            <text x="640" y="264" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="Inter">Te citan</text>
            {/* Output: Schemas */}
            <rect x="715" y="170" width="100" height="45" rx="12" fill="rgba(99,102,241,0.08)" stroke="#6366F1" strokeWidth="1.5"/>
            <text x="765" y="191" textAnchor="middle" fill="#818CF8" fontSize="11" fontWeight="700" fontFamily="Inter">Schemas</text>
            <text x="765" y="206" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="Inter">La IA te entiende</text>
            {/* Leads */}
            <rect x="540" y="285" width="200" height="55" rx="16" fill="rgba(16,185,129,0.06)" stroke="#10B981" strokeWidth="2" filter="url(#gl)"/>
            <text x="640" y="310" textAnchor="middle" fill="#34D399" fontSize="15" fontWeight="900" fontFamily="Inter">Leads orgánicos</text>
            <text x="640" y="328" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="Inter">Sin pauta · 24/7 · Crecen cada mes</text>
          </svg>
        </div>
      </div>

      {/* SEO vs GEO */}
      <div style={{ background: '#07061A', padding: '56px 24px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', color: '#fff', letterSpacing: -1, marginBottom: 12 }}>
          <span style={{ background: 'linear-gradient(135deg, #60A5FA, #C084FC)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>SEO + GEO:</span> los dos motores que necesitas
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>Google sigue siendo el 85% del tráfico. Pero la IA ya responde el 30% de las consultas sin que el usuario haga clic. Necesitas ambos.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900, margin: '0 auto 40px' }}>
          {/* SEO */}
          <div style={{ background: '#0F0D2E', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: '32px 28px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#34D399', marginBottom: 8 }}>SEO</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Posicionamiento en Google</div>
            <ul style={{ listStyle: 'none', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#34D399', fontWeight: 800 }}>✓</span>Meta descriptions, títulos, H1/H2 optimizados</li>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#34D399', fontWeight: 800 }}>✓</span>Sitemap XML + links internos</li>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#34D399', fontWeight: 800 }}>✓</span>Google indexa tu contenido y lo muestra en resultados</li>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#34D399', fontWeight: 800 }}>✓</span>Aparecer cuando alguien busca tu servicio en Google</li>
            </ul>
          </div>
          {/* GEO */}
          <div style={{ background: '#0F0D2E', border: '1px solid rgba(129,140,248,0.2)', borderRadius: 20, padding: '32px 28px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#818CF8', marginBottom: 8 }}>GEO</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Posicionamiento en buscadores de IA</div>
            <ul style={{ listStyle: 'none', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#818CF8', fontWeight: 800 }}>✓</span>Schemas JSON-LD (knowsAbout, FAQPage, Speakable)</li>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#818CF8', fontWeight: 800 }}>✓</span>Contenido tipo "respuesta directa" que la IA puede citar</li>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#818CF8', fontWeight: 800 }}>✓</span>Datos estructurados que los LLMs entienden y referencian</li>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#818CF8', fontWeight: 800 }}>✓</span>Que ChatGPT, Gemini, Perplexity y Claude te mencionen</li>
            </ul>
          </div>
        </div>
        <div style={{ background: '#0F0D2E', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 16, padding: '24px 32px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>¿Por qué necesitas ambos?</div>
          <ul style={{ listStyle: 'none', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
            <li style={{ padding: '2px 0 2px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>→</span>Si solo tienes SEO, Google te muestra pero la IA no te cita</li>
            <li style={{ padding: '2px 0 2px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>→</span>Si solo tienes GEO, la IA te cita pero Google no te posiciona</li>
            <li style={{ padding: '2px 0 2px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>→</span><strong style={{ color: '#C084FC' }}>El agente M&P hace ambas cosas:</strong> artículos SEO + schemas GEO en cada publicación</li>
          </ul>
        </div>
      </div>

      {/* TERMINAL */}
      <div style={{ background: '#07061A', padding: '0 24px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ background: '#0F0D2E', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ background: '#1A1745', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontSize: 12, color: '#64748B', marginLeft: 8 }}>Agente M&P — publicando en tu sitio ahora</span>
            </div>
            <TerminalAnimation />
          </div>
        </div>
      </div>

      {/* CASES */}
      <div style={{ background: '#07061A', padding: '56px 24px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', color: '#fff', letterSpacing: -1, marginBottom: 12 }}>
          Empresas que ya <span style={{ background: 'linear-gradient(135deg, #34D399, #60A5FA)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>lo activaron</span>
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 40 }}>Resultados reales, no promesas.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
          {[
            { rubro: 'Software de logística', rubroColor: '#818CF8', name: 'invasWMS', before: '14', after: '30', results: ['Ranking #1 "mejores WMS Chile" con artículo de 23.000 palabras', 'Aparece en buscadores de IA al buscar por su industria', 'Blog diario + ranking semanal corriendo automático'], tag: 'Setup en 2 días', tagBg: 'rgba(99,102,241,0.15)', tagColor: '#A5B4FC' },
            { rubro: 'Servicio legal inmobiliario', rubroColor: '#C084FC', name: 'DevuelveMiPie', before: '2', after: '9', results: ['De blog muerto (2023) a 9 artículos con keywords de alto valor', 'Google Search Console verificado y sitemap indexado', '3 schemas activos — la IA ya sabe qué hace la empresa'], tag: 'Setup en 1 día', tagBg: 'rgba(192,132,252,0.15)', tagColor: '#C084FC' },
            { rubro: 'Agencia de marketing', rubroColor: '#6EE7B7', name: 'mulleryperez.cl', before: '5', after: '50+', results: ['Ranking "mejores agencias Chile" posicionado en primera página', 'FAQs desplegables aparecen directamente en resultados de Google', 'Genera leads orgánicos todos los meses sin invertir en pauta'], tag: 'Crecimiento continuo', tagBg: 'rgba(52,211,153,0.15)', tagColor: '#6EE7B7' },
          ].map(function(c) {
            return <div key={c.name} style={{ background: '#0F0D2E', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ padding: '22px 20px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: c.rubroColor, marginBottom: 6 }}>{c.rubro}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 16 }}>{c.name}</div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <div style={{ flex: 1, textAlign: 'center', padding: '12px 8px', borderRadius: 12, background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#EF4444' }}>{c.before}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>POSTS ANTES</div>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 18, paddingTop: 14, color: 'rgba(255,255,255,0.15)' }}>→</div>
                  <div style={{ flex: 1, textAlign: 'center', padding: '12px 8px', borderRadius: 12, background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#34D399' }}>{c.after}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>POSTS DESPUÉS</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '14px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <ul style={{ listStyle: 'none', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                  {c.results.map(function(r, i) { return <li key={i} style={{ padding: '3px 0 3px 18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>→</span>{r}</li> })}
                </ul>
                <div style={{ display: 'inline-block', marginTop: 12, fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 8, background: c.tagBg, color: c.tagColor }}>{c.tag}</div>
              </div>
            </div>
          })}
        </div>
      </div>

      {/* PRICING */}
      <div id="planes" style={{ background: '#07061A', padding: '56px 24px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', color: '#fff', letterSpacing: -1, marginBottom: 12 }}>
          Planes de <span style={{ background: 'linear-gradient(135deg, #60A5FA, #C084FC)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>setup inicial</span>
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 40 }}>Preparamos tu sitio para Google y los buscadores de IA. Una sola vez.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 800, margin: '0 auto 28px' }}>
          {[
            { name: 'Básico', desc: 'Sitios hasta 10 páginas', price: '$290.000', featured: false, items: ['Diagnóstico SEO completo', 'Meta descriptions en todas las páginas', 'Schemas para Google y buscadores de IA', 'Google Search Console + sitemap', '5 artículos iniciales publicados', 'Configuración del agente', 'Correcciones técnicas'] },
            { name: 'Medio', desc: 'Sitios de 11 a 30 páginas', price: '$490.000', featured: true, items: ['Todo lo del Básico, más:', 'Meta descriptions en hasta 30 páginas', '9 artículos + 2 rankings pilar', 'Redirects 301 para URLs rotas', 'Schema avanzado para buscadores de IA', 'Links cruzados entre artículos', 'Reporte de implementación'] },
          ].map(function(p) {
            return <div key={p.name} style={{ background: '#0F0D2E', border: p.featured ? '2px solid transparent' : '1px solid rgba(99,102,241,0.12)', borderRadius: 20, padding: '32px 28px', backgroundImage: p.featured ? 'linear-gradient(#0F0D2E, #0F0D2E), linear-gradient(135deg, #2563EB, #9333EA)' : undefined, backgroundOrigin: p.featured ? 'padding-box, border-box' : undefined, backgroundClip: p.featured ? 'padding-box, border-box' : undefined, boxShadow: p.featured ? '0 0 40px rgba(99,102,241,0.12)' : undefined }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4, ...(p.featured ? { background: 'linear-gradient(135deg, #60A5FA, #C084FC)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' } : {}) }}>{p.name}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>{p.desc}</div>
              <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: '#fff', marginBottom: 4, ...(p.featured ? { background: 'linear-gradient(135deg, #60A5FA, #C084FC)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' } : {}) }}>{p.price}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>+ IVA · Pago único</div>
              <ul style={{ listStyle: 'none' }}>
                {p.items.map(function(item, i) { return <li key={i} style={{ fontSize: 13, padding: '5px 0 5px 22px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)' }}><span style={{ position: 'absolute', left: 0, color: '#34D399', fontWeight: 800 }}>✓</span>{item}</li> })}
              </ul>
            </div>
          })}
        </div>
        <div style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED, #EC4899)', borderRadius: 20, padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 800, margin: '0 auto', boxShadow: '0 0 60px rgba(99,102,241,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60%', right: '-10%', width: 300, height: 300, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Blog IA Mensual</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>24 artículos/mes · Publicación automática · Email con link al post · Sin permanencia</div>
          </div>
          <div style={{ textAlign: 'right', position: 'relative' }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: -2 }}>$69.990</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>+ IVA /mes</div>
          </div>
        </div>
      </div>

      {/* COMPATIBILIDAD */}
      <div style={{ background: '#07061A', padding: '56px 24px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', color: '#fff', letterSpacing: -1, marginBottom: 12 }}>
          ¿En qué casos <span style={{ background: 'linear-gradient(135deg, #60A5FA, #C084FC)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>aplica</span>?
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 40 }}>Depende de tu plataforma y hosting actual.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
          {/* Verde - Funciona */}
          <div style={{ background: '#0F0D2E', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, padding: '28px 24px' }}>
            <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 8, background: 'rgba(16,185,129,0.12)', color: '#34D399', fontSize: 12, fontWeight: 700, marginBottom: 16 }}>Funciona automático</div>
            <ul style={{ listStyle: 'none', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#34D399', fontWeight: 800 }}>✓</span>WordPress versión 5.0+</li>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#34D399', fontWeight: 800 }}>✓</span>Acceso admin o App Password</li>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#34D399', fontWeight: 800 }}>✓</span>Hosting permite requests externos (99% de los casos)</li>
            </ul>
          </div>
          {/* Amarillo - Setup especial */}
          <div style={{ background: '#0F0D2E', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 20, padding: '28px 24px' }}>
            <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 8, background: 'rgba(245,158,11,0.12)', color: '#F59E0B', fontSize: 12, fontWeight: 700, marginBottom: 16 }}>Requiere setup especial</div>
            <ul style={{ listStyle: 'none', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#F59E0B', fontWeight: 800 }}>!</span>Wix, Shopify o Squarespace (se puede, config extra)</li>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#F59E0B', fontWeight: 800 }}>!</span>WordPress muy viejo (&lt; 5.0)</li>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#F59E0B', fontWeight: 800 }}>!</span>Hosting con Cloudflare WAF estricto</li>
            </ul>
          </div>
          {/* Rojo - No aplica */}
          <div style={{ background: '#0F0D2E', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 20, padding: '28px 24px' }}>
            <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.12)', color: '#EF4444', fontSize: 12, fontWeight: 700, marginBottom: 16 }}>No aplica</div>
            <ul style={{ listStyle: 'none', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#EF4444', fontWeight: 800 }}>✗</span>Landing page sin blog</li>
              <li style={{ padding: '3px 0 3px 22px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#EF4444', fontWeight: 800 }}>✗</span>Sitio estático puro HTML sin CMS</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#07061A', padding: '64px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 16, position: 'relative' }}>
          ¿Listo para que <span style={{ background: 'linear-gradient(135deg, #60A5FA, #C084FC)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>tu sitio trabaje por ti</span>?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, maxWidth: 480, margin: '0 auto 36px', position: 'relative' }}>Agenda una reunión de 30 minutos. Te mostramos cómo funciona con tu sitio.</p>
        <a href="https://wa.me/56992258137?text=Hola%2C%20me%20interesa%20el%20agente%20de%20blog%20IA%20para%20mi%20sitio" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff', padding: '18px 42px', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 0 40px rgba(99,102,241,0.4)', position: 'relative' }}>
          Agendar reunión gratuita →
        </a>
      </div>

      <footer style={{ textAlign: 'center', padding: 32, fontSize: 13, color: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#07061A' }}>
        <strong style={{ color: 'rgba(255,255,255,0.4)' }}>Muller y Pérez · Performance Marketing</strong> · contacto@mulleryperez.cl
      </footer>
    </>
  )
}
