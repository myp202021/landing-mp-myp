'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { trackLead, trackWhatsAppClick } from '@/lib/meta-pixel'
import {
  Calendar, MessageSquare, CheckCircle2, ArrowRight, Phone, Mail, MapPin,
  Shield, BarChart3, Users, Zap, Target, TrendingUp,
} from 'lucide-react'

/* ─── Portfolio pieces (best ones) ─── */
const portfolio = [
  { src: 'swing-55.jpg', client: 'Swing Producciones' },
  { src: 'genera-grilla-ig-2.jpg', client: 'Genera RRHH' },
  { src: 'halterlift-propuesta-1.jpg', client: 'Halterlift' },
  { src: 'rilay-grilla-1.jpg', client: 'Rilay Inmobiliaria' },
  { src: 'pregiata-14.jpg', client: 'Pregiata' },
  { src: 'power-energy-147.jpg', client: 'Power Energy' },
  { src: 'fuxion-11.jpg', client: 'Fuxion Logistics' },
  { src: 'tecnoinver-14.jpg', client: 'Tecnoinver' },
  { src: 'mint-copia-de-kuina.jpg', client: 'MINT' },
  { src: 'halterlift-propuesta-3.jpg', client: 'Halterlift' },
  { src: 'swing-16.jpg', client: 'Swing' },
  { src: 'genera-carrusel-mesa-de-trabajo-5.jpg', client: 'Genera' },
]

/* ─── Client logos ─── */
const logos = [
  'dezar.png', 'antartic.png', 'charriot.png', 'adimac.png', 'zero-water.png',
  'granarolo.png', 'elitsoft.png', 'invaswms.png', 'first-pack.png',
  'power-energy.png', 'hualpen.png', 'stocks.png', 'pregiata.png',
  'genera.png', 'jp-procesos.png', 'distec.png', 'pineapple-store.png',
  'rilay.png', 'halterlift.webp', 'premios-increibles.png', 'cym.png',
  'inacap.png', 'dmp.png', 'sgo.png', 'swing.png', 'atacama-experience.png',
  'byte-store.png', 'faretto.png', 'homar.png', 'ald.png', 'fuxion-logistics.png',
  'hl-soluciones.png', 'logo-forcmin-c.png', 'lopez-mateo.png', 'budnik.png',
  'sistematios.png', 'tecnomat.png', 'vemos-tu-auto.png', 'pro-acogida.png',
]

const platforms = ['Google Ads', 'Meta Ads', 'Instagram Ads', 'LinkedIn Ads', 'TikTok Ads', 'Google Analytics', 'Looker Studio', 'Tag Manager']

const industries = [
  'SaaS & Tecnología', 'Logística', 'Transporte', 'Salud',
  'E-commerce', 'Servicios B2B', 'Inmobiliaria', 'Educación',
  'Agroindustria', 'Eventos', 'Retail', 'Industrial',
  'Legal', 'Fintech', 'Turismo', 'Energía',
]

export default function AdsLanding() {
  const [formData, setFormData] = useState({
    nombre: '', empresa: '', email: '', telefono: '', cargo: '',
    enviando: false, enviado: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormData(p => ({ ...p, enviando: true }))
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre, empresa: formData.empresa,
          email: formData.email, telefono: formData.telefono,
          solicitud: `Cargo: ${formData.cargo}\n\nDesde Landing /ads`,
          destinatario: 'contacto@mulleryperez.cl', fuente: 'landing-ads',
        }),
      })
      if (res.ok) {
        trackLead({ nombre: formData.nombre, empresa: formData.empresa, cargo: formData.cargo, email: formData.email, telefono: formData.telefono, servicio: 'performance-marketing', fuente: 'landing-ads' })
        setFormData(p => ({ ...p, enviado: true, enviando: false }))
      } else { alert('Error al enviar.'); setFormData(p => ({ ...p, enviando: false })) }
    } catch { alert('Error al enviar.'); setFormData(p => ({ ...p, enviando: false })) }
  }

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-[#050510] text-white">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050510]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><Image src="/logo-blanco.png" alt="M&P" width={130} height={42} className="h-9 w-auto" priority /></Link>
          <button onClick={() => scrollTo('formulario')} className="px-6 py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-blue-50 transition-all text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Agendar reunión
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════
          HERO — Video background + strong headline
      ════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Hero background image (Santiago/Costanera) + video */}
        <div className="absolute inset-0">
          <Image src="/ads-hero-bg.jpg" alt="" fill className="object-cover" priority />
        </div>
        <video src="/ads-video-1.mp4" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" autoPlay muted loop playsInline />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/85 via-[#050510]/50 to-[#050510]" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-purple-900/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Copy */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-400/30">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-blue-200 text-sm font-medium">Agencia de Performance Marketing</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-6">
              ¿Tu agencia te muestra{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400">
                likes o clientes?
              </span>
            </h1>

            <p className="text-lg text-white/70 mb-3 leading-relaxed max-w-lg">
              Medimos lo que importa: cuánto cuesta cada lead, cada cliente, cada venta. Con eso proyectas y decides.
            </p>
            <p className="text-sm text-white/40 mb-8 max-w-lg">
              Equipo dedicado de 3 profesionales · Sin contrato de permanencia · Reportería ejecutiva semanal
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => scrollTo('formulario')} className="group flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl shadow-2xl shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] transition-all">
                <Calendar className="w-5 h-5" /> Agendar reunión
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="https://wa.me/56992258137?text=Hola%2C%20quiero%20información%20sobre%20servicios%20M%26P" target="_blank" rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick({ page: 'ads-hero', servicio: 'general' })}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 font-semibold rounded-xl transition-all">
                <MessageSquare className="w-5 h-5" /> WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Right — Form in hero */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden lg:block">
            {formData.enviado ? (
              <div className="bg-white/[0.08] backdrop-blur-xl border border-white/15 rounded-2xl p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Mensaje recibido</h3>
                <p className="text-white/50 mb-5 text-sm">Te contactaremos dentro de las próximas horas.</p>
                <a href="https://wa.me/56992258137" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors text-sm">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/[0.08] backdrop-blur-xl border border-white/15 rounded-2xl p-7 space-y-3.5">
                <h3 className="text-lg font-bold text-white mb-1">Agenda tu reunión con M&P</h3>
                <p className="text-white/40 text-xs mb-2">Sin compromiso. Te contactamos en menos de 24 hrs.</p>
                {[
                  { key: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Juan Pérez' },
                  { key: 'empresa', label: 'Empresa', type: 'text', placeholder: 'Tu empresa' },
                  { key: 'email', label: 'Email', type: 'email', placeholder: 'juan@empresa.cl' },
                  { key: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '+56 9 1234 5678' },
                  { key: 'cargo', label: 'Cargo', type: 'text', placeholder: 'Gerente comercial' },
                ].map(f => (
                  <div key={f.key}>
                    <input type={f.type} required value={(formData as any)[f.key]}
                      onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white placeholder-white/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all text-sm"
                      placeholder={f.placeholder} />
                  </div>
                ))}
                <button type="submit" disabled={formData.enviando}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                  {formData.enviando ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enviando...</> : <><Calendar className="w-4 h-4" />Agendar reunión</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          LOGOS — Visible, white bg cards, animated
      ════════════════════════════════════════════ */}
      <section className="py-16 bg-[#050510] overflow-hidden">
        <p className="text-center text-xs text-white/40 mb-8 tracking-[0.2em] uppercase font-semibold">
          +40 empresas confían en nosotros
        </p>
        <div className="relative">
          <div className="flex animate-scroll-left gap-4">
            {[...logos, ...logos].map((l, i) => (
              <div key={i} className="flex-shrink-0 w-32 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/20 hover:scale-105 transition-transform">
                <Image src={`/clientes/${l}`} alt="" width={90} height={45} className="object-contain max-h-10 max-w-[80px]" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050510] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050510] to-transparent z-10 pointer-events-none" />
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PROBLEM / SOLUTION
      ════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">El problema con la mayoría de las agencias</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Te prometen el mundo, te muestran dashboards bonitos, y al final no sabes cuánto te costó cada cliente.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-red-400 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-sm">✕</span>
                Lo que hacen otras agencias
              </h3>
              <ul className="space-y-4">
                {['Te prometen triplicar ventas sin conocer tu negocio', 'Hablan de impresiones y likes como si fueran clientes', 'Dashboards incompletos o métricas irrelevantes', 'No ajustan por tu ciclo de venta real', 'No sabes qué hace tu competencia'].map(t => (
                  <li key={t} className="flex items-start gap-3 text-white/60 text-sm"><span className="text-red-400 mt-0.5 font-bold">—</span>{t}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></span>
                Lo que hace M&P
              </h3>
              <ul className="space-y-4">
                {['CPL, CPA, CAC, ROAS — métricas de negocio real', 'Ajustamos campañas al ciclo real de venta', 'Benchmark de competencia en cada reporte', 'Reportería ejecutiva semanal y mensual', 'Equipo dedicado de 3 profesionales'].map(t => (
                  <li key={t} className="flex items-start gap-3 text-white/70 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />{t}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          DIFFERENTIATORS — Glass cards with icons
      ════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        {/* Background blobs */}
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-[150px] -translate-y-1/2" />

        <div className="max-w-6xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por qué M&P es diferente</h2>
            <p className="text-white/50 text-lg">No somos la agencia más barata. Somos la que te muestra números reales.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Shield, title: 'Sin contrato de permanencia', desc: 'Si no funciona, te vas. Nuestra retención del 95% se basa en resultados, no en obligaciones.', color: 'blue' },
              { icon: Users, title: 'Equipo dedicado de 3 áreas', desc: 'Paid Media + Publicista + Diseñador. No un freelancer compartido entre 20 cuentas.', color: 'purple' },
              { icon: BarChart3, title: 'Métricas de negocio reales', desc: 'CPL, CPA, CAC, ROAS. Lo que importa para tomar decisiones comerciales.', color: 'cyan' },
              { icon: Target, title: 'Benchmark de competencia', desc: 'En cada reporte ves cómo está tu industria y qué hace tu competencia.', color: 'emerald' },
              { icon: Zap, title: 'Transparencia total', desc: 'Acceso 24/7 a tus cuentas publicitarias. Los datos son tuyos, siempre.', color: 'amber' },
              { icon: TrendingUp, title: 'Reportería semanal', desc: 'No esperas un mes para saber qué pasa. Informes cada semana con decisiones accionables.', color: 'rose' },
            ].map((d, i) => {
              const colors: Record<string, string> = { blue: 'from-blue-500 to-blue-600', purple: 'from-purple-500 to-purple-600', cyan: 'from-cyan-500 to-cyan-600', emerald: 'from-emerald-500 to-emerald-600', amber: 'from-amber-500 to-amber-600', rose: 'from-rose-500 to-rose-600' }
              return (
                <motion.div key={d.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-7 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[d.color]} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <d.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold mb-2 text-white">{d.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{d.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PORTFOLIO — Real work, visible images
      ════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#050510] via-[#0a0a25] to-[#050510]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trabajo real, no mockups</h2>
            <p className="text-white/50 text-lg">Piezas reales creadas para nuestros clientes.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolio.map((p, i) => (
              <motion.div key={p.src} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer">
                <Image src={`/brochure/${p.src}`} alt={p.client} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width:768px) 50vw, 25vw" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-semibold text-sm">{p.client}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PLATFORMS + INDUSTRIES
      ════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Plataformas que operamos</h2>
            <p className="text-white/50 text-lg mb-10">Tu inversión pasa por estas plataformas. Nosotros las operamos con datos.</p>
            <div className="flex flex-wrap justify-center gap-3 mb-20">
              {platforms.map(p => (
                <div key={p} className="px-6 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm font-semibold text-white/80 hover:bg-white/[0.12] hover:border-white/[0.2] transition-all">
                  {p}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-2xl font-bold mb-3">+15 industrias atendidas</h3>
            <p className="text-white/40 mb-8">Cada industria tiene su ciclo de venta, su ticket promedio y su competencia.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {industries.map(ind => (
                <span key={ind} className="px-4 py-2 rounded-full text-sm font-medium bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-blue-500/15 hover:border-blue-400/30 hover:text-blue-300 transition-all cursor-default">
                  {ind}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          METHODOLOGY — Timeline
      ════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#050510] via-[#080820] to-[#050510]">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Metodología clara desde el día 1</h2>
            <p className="text-white/50 text-lg">Sabemos exactamente qué hacer cada semana.</p>
          </motion.div>

          <div className="space-y-6">
            {[
              { step: '01', day: 'Día 1', title: 'Plan de trabajo', desc: 'Roles claros, entregables definidos, expectativas alineadas.' },
              { step: '02', day: 'Semana 1', title: 'Benchmark + Setup', desc: 'Análisis de mercado, competencia y configuración de campañas.' },
              { step: '03', day: 'Semana 2', title: 'Lanzamiento', desc: 'Campañas activas con testeo de mensajes y creatividades.' },
              { step: '04', day: 'Semana 3', title: 'Optimización', desc: 'Ajustes por ciclo de venta y comparativa con competencia.' },
              { step: '05', day: 'Semana 4', title: 'Reporte 360°', desc: 'Visión completa con métricas ejecutivas y plan siguiente.' },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] transition-all">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20">
                  {s.step}
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{s.day}</span>
                  <h3 className="text-lg font-bold text-white mt-1">{s.title}</h3>
                  <p className="text-white/50 text-sm mt-1">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FORM — Conversion point
      ════════════════════════════════════════════ */}
      <section id="formulario" className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Conversemos sobre{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">tu negocio</span>
            </h2>
            <p className="text-white/50 text-lg mb-8 leading-relaxed">
              Agenda una reunión de 30 minutos. Analizamos tu situación actual, tu competencia, y te mostramos qué podemos hacer con números reales.
            </p>
            <div className="space-y-5">
              {[
                { icon: Phone, label: 'Teléfono', value: '+56 9 9225 8137', href: 'tel:+56992258137' },
                { icon: Mail, label: 'Email', value: 'contacto@mulleryperez.cl', href: 'mailto:contacto@mulleryperez.cl' },
                { icon: MapPin, label: 'Oficina', value: 'Badajoz 100, Of 523 — Las Condes', href: '' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                    <c.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 font-medium">{c.label}</p>
                    {c.href ? <a href={c.href} className="text-white/80 hover:text-white transition-colors text-sm">{c.value}</a> : <p className="text-white/80 text-sm">{c.value}</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {formData.enviado ? (
              <div className="bg-white/[0.04] border border-emerald-500/20 rounded-2xl p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Mensaje recibido</h3>
                <p className="text-white/50 mb-6">Te contactaremos dentro de las próximas horas.</p>
                <a href="https://wa.me/56992258137" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/[0.04] border border-white/[0.1] rounded-2xl p-8 space-y-4 backdrop-blur-sm">
                {[
                  { key: 'nombre', label: 'Nombre completo', type: 'text', placeholder: 'Juan Pérez' },
                  { key: 'empresa', label: 'Empresa', type: 'text', placeholder: 'Tu empresa' },
                  { key: 'email', label: 'Email', type: 'email', placeholder: 'juan@empresa.cl' },
                  { key: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '+56 9 1234 5678' },
                  { key: 'cargo', label: 'Cargo', type: 'text', placeholder: 'Gerente comercial' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs text-white/50 mb-1.5 font-medium">{f.label}</label>
                    <input type={f.type} required value={(formData as any)[f.key]}
                      onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all text-sm"
                      placeholder={f.placeholder} />
                  </div>
                ))}
                <button type="submit" disabled={formData.enviando}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                  {formData.enviando ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enviando...</> : <><Calendar className="w-5 h-5" />Agendar reunión</>}
                </button>
                <p className="text-[11px] text-white/30 text-center">Sin compromiso. Te contactamos en menos de 24 horas.</p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-white/30 hover:text-white/50 transition-colors text-sm">mulleryperez.cl</Link>
          <p className="text-white/20 text-xs">&copy; {new Date().getFullYear()} Muller y Pérez. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/56992258137" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-emerald-400 transition-colors"><MessageSquare className="w-5 h-5" /></a>
            <a href="https://www.linkedin.com/company/m%C3%BCller-y-p%C3%A9rez/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-blue-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
