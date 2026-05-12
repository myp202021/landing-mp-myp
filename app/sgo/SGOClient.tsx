'use client'

import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'

var products = [
  {
    icon: '📋',
    name: 'Libro de Obras Digital (LOD)',
    desc: 'Registro digital de todas las anotaciones, observaciones e instrucciones de obra. Cumple con la normativa del Ministerio de Obras Públicas. Trazabilidad completa con firma electrónica y marcas de tiempo.',
    color: '#00C9DB',
  },
  {
    icon: '💬',
    name: 'Libro de Comunicaciones Electrónico (LCE)',
    desc: 'Canal formal y trazable para todas las comunicaciones entre mandante, contratista e inspección fiscal. Notificaciones en tiempo real y registro auditable de cada intercambio.',
    color: '#3B82F6',
  },
  {
    icon: '🔍',
    name: 'Libro de Consultoría Digital',
    desc: 'Gestión integral del proceso de consultoría en obras públicas. Control de hitos, entregables y observaciones con flujo de aprobación digital.',
    color: '#8B5CF6',
  },
  {
    icon: '📁',
    name: 'Gestor Documental',
    desc: 'Administración centralizada de todos los documentos de obra: planos, especificaciones técnicas, informes y certificados. Versionamiento automático y acceso controlado por rol.',
    color: '#F59E0B',
  },
]

var stats = [
  { n: '700+', l: 'Obras conectadas' },
  { n: '100%', l: 'Normativa MOP' },
  { n: '24/7', l: 'Disponibilidad' },
  { n: '3', l: 'Perfiles de usuario' },
]

var valueProps = [
  {
    icon: '✅',
    title: 'Cumplimiento normativo MOP',
    desc: 'El Libro de Obras Digital es obligatorio para obras públicas en Chile. SGO cumple con todos los requisitos del Ministerio de Obras Públicas, asegurando que tu empresa esté al día con la regulación.',
  },
  {
    icon: '📡',
    title: 'Trazabilidad en tiempo real',
    desc: 'Cada anotación, comunicación y documento queda registrado con fecha, hora y autor. Accede al historial completo de cualquier obra desde cualquier dispositivo.',
  },
  {
    icon: '📂',
    title: 'Gestión documental centralizada',
    desc: 'Todos los documentos de obra en un solo lugar: planos, informes, certificados y comunicaciones. Sin papeles perdidos, sin versiones desactualizadas.',
  },
  {
    icon: '👥',
    title: 'Multi-perfil: constructora, consultora e IFO',
    desc: 'Diseñado para los tres actores clave de una obra pública: empresa constructora, consultora y equipo de inspección fiscal. Cada uno con su vista y permisos específicos.',
  },
  {
    icon: '🔒',
    title: 'Seguridad y validez legal',
    desc: 'Firma electrónica avanzada, encriptación de datos y respaldo en la nube. Cada registro tiene validez legal equivalente al libro de obras físico.',
  },
  {
    icon: '📊',
    title: 'Reportes y analítica',
    desc: 'Dashboards con el estado de cada obra, alertas de plazos y reportes exportables. Visibilidad total para la toma de decisiones.',
  },
]

var testimonials = [
  {
    name: 'Esteban Rocha',
    company: 'Inversiones Petrohue',
    text: 'SGO nos permitió digitalizar completamente el control de nuestras obras. La trazabilidad del Libro de Obras Digital nos da tranquilidad frente a cualquier auditoría del MOP.',
  },
  {
    name: 'Rigoberto Sierra',
    company: 'Dacamros',
    text: 'Desde que implementamos SGO, la comunicación entre nuestros equipos en terreno y la inspección fiscal es mucho más fluida. Todo queda registrado y accesible en tiempo real.',
  },
]

var faqs = [
  {
    q: '¿Qué es el Libro de Obras Digital y por qué es obligatorio?',
    a: 'El Libro de Obras Digital (LOD) es el registro electrónico oficial de una obra pública en Chile. El Ministerio de Obras Públicas exige su uso para garantizar la trazabilidad y transparencia en la ejecución de proyectos de infraestructura. SGO cumple con todos los requisitos normativos.',
  },
  {
    q: '¿SGO sirve para obras privadas o solo públicas?',
    a: 'SGO está diseñado principalmente para obras públicas reguladas por el MOP, pero sus herramientas de gestión documental y comunicaciones también son útiles para obras privadas que buscan profesionalizar su control de obra.',
  },
  {
    q: '¿Cómo se implementa SGO en una obra?',
    a: 'La implementación es rápida: se configura la obra en la plataforma, se asignan los roles (constructora, consultora, IFO) y cada usuario accede desde su navegador o dispositivo móvil. El equipo de soporte de SGO acompaña todo el proceso.',
  },
  {
    q: '¿Puedo acceder a SGO desde terreno?',
    a: 'Sí. SGO es una plataforma web responsive que funciona desde cualquier dispositivo con conexión a internet: computador, tablet o celular. Ideal para registrar anotaciones directamente desde la obra.',
  },
  {
    q: '¿Qué pasa con los datos si termina la obra?',
    a: 'Todos los registros, comunicaciones y documentos quedan almacenados de forma segura en la plataforma. Puedes acceder al historial completo de cualquier obra finalizada cuando lo necesites, cumpliendo con los plazos de retención exigidos por el MOP.',
  },
  {
    q: '¿Cómo contacto a SGO para una demostración?',
    a: 'Puedes llamar al +56 2 268 48 887, enviar un correo a contacto@sgo.cl o visitar las oficinas en Sucre 2680, Ñuñoa, Santiago. Para soporte técnico: +56 2 292 98 180 o soporte@sgo.cl.',
  },
]

export default function SGOClient() {
  return (
    <>
      <SiteHeader />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sgoFloat { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,-15px); } }
        @keyframes sgoPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes sgoFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .sgo-faq-toggle { cursor: pointer; }
        .sgo-faq-toggle:hover { background: rgba(0,201,219,0.06) !important; }
      `}} />

      {/* HERO */}
      <div style={{ background: '#0A1628', position: 'relative', padding: '120px 24px 80px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, background: 'rgba(0,201,219,0.1)', borderRadius: '50%', filter: 'blur(100px)', top: -150, left: -150, animation: 'sgoFloat 10s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, background: 'rgba(59,130,246,0.08)', borderRadius: '50%', filter: 'blur(80px)', bottom: -100, right: -100, animation: 'sgoFloat 10s ease-in-out infinite 3s' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #0A1628, #132240)', border: '2px solid rgba(0,201,219,0.3)', borderRadius: 16, padding: '12px 28px', marginBottom: 28 }}>
            <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: 4, color: '#00C9DB' }}>SGO</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginLeft: 12 }}>Sistema de Gestión de Obras</span>
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.08, letterSpacing: -2, maxWidth: 800, margin: '0 auto 24px', color: '#fff' }}>
            El software que{' '}
            <span style={{ background: 'linear-gradient(135deg, #00C9DB, #3B82F6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              digitaliza la gestión de obras
            </span>{' '}
            en Chile
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.65 }}>
            Libro de Obras Digital, Comunicaciones Electrónicas y Gestión Documental. Todo en una plataforma. Más de 700 obras conectadas. Cumplimiento normativo MOP garantizado.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a href="#contacto" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #00C9DB, #3B82F6)', color: '#fff', padding: '18px 42px', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 0 40px rgba(0,201,219,0.3)' }}>
              Solicitar demostración
            </a>
            <a href="#productos" style={{ display: 'inline-block', background: 'transparent', color: '#00C9DB', padding: '18px 42px', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', border: '2px solid rgba(0,201,219,0.3)' }}>
              Ver productos
            </a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 48, flexWrap: 'wrap' }}>
            {stats.map(function(s) {
              return <div key={s.n} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 900, background: 'linear-gradient(135deg, #00C9DB, #3B82F6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: 0.5 }}>{s.l}</div>
              </div>
            })}
          </div>
        </div>
      </div>

      {/* VALUE PROPS */}
      <div style={{ background: '#0D1B32', padding: '72px 24px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', color: '#fff', letterSpacing: -1, marginBottom: 12 }}>
          ¿Por qué{' '}
          <span style={{ background: 'linear-gradient(135deg, #00C9DB, #3B82F6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            elegir SGO
          </span>?
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
          La plataforma líder en gestión digital de obras públicas y privadas en Chile.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 1060, margin: '0 auto' }}>
          {valueProps.map(function(v) {
            return <div key={v.title} style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(0,201,219,0.1)', borderRadius: 18, padding: '28px 24px' }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{v.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{v.title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{v.desc}</div>
            </div>
          })}
        </div>
      </div>

      {/* PRODUCTS */}
      <div id="productos" style={{ background: '#0A1628', padding: '72px 24px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', color: '#fff', letterSpacing: -1, marginBottom: 12 }}>
          Productos{' '}
          <span style={{ background: 'linear-gradient(135deg, #00C9DB, #3B82F6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            SGO
          </span>
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
          Cuatro herramientas integradas para el control total de tus obras.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {products.map(function(p) {
            return <div key={p.name} style={{ background: '#0D1B32', border: '1px solid rgba(0,201,219,0.1)', borderRadius: 20, padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: p.color, opacity: 0.04, borderRadius: '50%', filter: 'blur(30px)' }} />
              <div style={{ fontSize: 36, marginBottom: 16 }}>{p.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: p.color, marginBottom: 10 }}>{p.name}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{p.desc}</div>
            </div>
          })}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background: '#0D1B32', padding: '72px 24px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', color: '#fff', letterSpacing: -1, marginBottom: 12 }}>
          ¿Quién usa{' '}
          <span style={{ background: 'linear-gradient(135deg, #00C9DB, #3B82F6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            SGO
          </span>?
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
          Tres perfiles, una plataforma. Cada actor de la obra con su vista y permisos.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {[
            { icon: '🏗️', title: 'Empresas Constructoras', desc: 'Registra avances, responde observaciones y mantén el Libro de Obras Digital al día. Cumple con la normativa MOP sin papeles.', color: '#00C9DB' },
            { icon: '📐', title: 'Consultoras', desc: 'Supervisa obras con acceso en tiempo real al libro de consultoría, comunicaciones y documentos. Todo trazable y auditable.', color: '#3B82F6' },
            { icon: '🏛️', title: 'Inspección Fiscal (IFO)', desc: 'Fiscaliza obras con visibilidad total: anotaciones, plazos, documentos y comunicaciones formales en un solo lugar.', color: '#8B5CF6' },
          ].map(function(u) {
            return <div key={u.title} style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(0,201,219,0.1)', borderRadius: 18, padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{u.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: u.color, marginBottom: 10 }}>{u.title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{u.desc}</div>
            </div>
          })}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ background: '#0A1628', padding: '72px 24px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', color: '#fff', letterSpacing: -1, marginBottom: 12 }}>
          Lo que dicen{' '}
          <span style={{ background: 'linear-gradient(135deg, #00C9DB, #3B82F6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            nuestros clientes
          </span>
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 48 }}>
          Empresas que ya digitalizaron sus obras con SGO.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 800, margin: '0 auto' }}>
          {testimonials.map(function(t) {
            return <div key={t.name} style={{ background: '#0D1B32', border: '1px solid rgba(0,201,219,0.12)', borderRadius: 20, padding: '32px 28px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 20, left: 24, fontSize: 48, color: 'rgba(0,201,219,0.1)', fontWeight: 900, lineHeight: 1 }}>&ldquo;</div>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 20, position: 'relative', zIndex: 1, paddingTop: 8 }}>
                {t.text}
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                <div style={{ fontSize: 13, color: '#00C9DB' }}>{t.company}</div>
              </div>
            </div>
          })}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: '#0D1B32', padding: '72px 24px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', color: '#fff', letterSpacing: -1, marginBottom: 12 }}>
          Preguntas{' '}
          <span style={{ background: 'linear-gradient(135deg, #00C9DB, #3B82F6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            frecuentes
          </span>
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 48 }}>
          Todo lo que necesitas saber sobre SGO y el Libro de Obras Digital.
        </p>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map(function(f) {
            return <details key={f.q} className="sgo-faq-toggle" style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(0,201,219,0.1)', borderRadius: 14, overflow: 'hidden' }}>
              <summary style={{ padding: '18px 24px', fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {f.q}
                <span style={{ color: '#00C9DB', fontSize: 20, fontWeight: 300, marginLeft: 16, flexShrink: 0 }}>+</span>
              </summary>
              <div style={{ padding: '0 24px 18px', fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                {f.a}
              </div>
            </details>
          })}
        </div>
      </div>

      {/* CTA / CONTACT */}
      <div id="contacto" style={{ background: '#0A1628', padding: '72px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(0,201,219,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Digitaliza la gestión de{' '}
            <span style={{ background: 'linear-gradient(135deg, #00C9DB, #3B82F6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              tus obras hoy
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, maxWidth: 520, margin: '0 auto 40px' }}>
            Más de 700 obras ya confían en SGO. Solicita una demostración y descubre cómo cumplir con la normativa MOP de forma simple y eficiente.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 48 }}>
            <a href="tel:+56226848887" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg, #00C9DB, #3B82F6)', color: '#fff', padding: '18px 36px', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 0 40px rgba(0,201,219,0.25)' }}>
              Llamar al +56 2 268 48 887
            </a>
            <a href="mailto:contacto@sgo.cl" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'transparent', color: '#00C9DB', padding: '18px 36px', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', border: '2px solid rgba(0,201,219,0.3)' }}>
              contacto@sgo.cl
            </a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.3)', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Oficina</div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>Sucre 2680, Ñuñoa, Santiago</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.3)', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Soporte técnico</div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>+56 2 292 98 180 · soporte@sgo.cl</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.3)', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Web</div>
              <a href="https://beta.sgo.cl" target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, color: '#00C9DB', textDecoration: 'none' }}>beta.sgo.cl</a>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: 32, fontSize: 13, color: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#0A1628' }}>
        <strong style={{ color: 'rgba(255,255,255,0.4)' }}>SGO — Sistema de Gestión de Obras</strong> · Sucre 2680, Ñuñoa, Santiago · contacto@sgo.cl
        <br />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', marginTop: 8, display: 'inline-block' }}>Desarrollado por <a href="https://www.mulleryperez.cl" style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>Muller y Pérez</a></span>
      </footer>
    </>
  )
}
