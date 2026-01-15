'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  Lightbulb,
  Target,
  Zap,
  MessageSquare,
  Building2,
  User,
  Mail,
  Phone,
  X,
  Unlock
} from 'lucide-react'

const INDUSTRIAS = [
  { value: 'ECOMMERCE', label: 'E-commerce' },
  { value: 'SAAS', label: 'Software / SaaS' },
  { value: 'SERVICIOS', label: 'Servicios Profesionales' },
  { value: 'SALUD', label: 'Salud / Medicina' },
  { value: 'EDUCACION', label: 'Educación' },
  { value: 'INMOBILIARIA', label: 'Inmobiliaria' },
  { value: 'GASTRONOMIA', label: 'Gastronomía' },
  { value: 'BELLEZA', label: 'Belleza / Estética' },
  { value: 'FITNESS', label: 'Fitness / Deportes' },
  { value: 'AUTOMOTRIZ', label: 'Automotriz' },
  { value: 'LEGAL', label: 'Servicios Legales' },
  { value: 'FINTECH', label: 'Fintech / Seguros' },
]

const PLATAFORMAS = [
  { value: 'GOOGLE_SEARCH', label: 'Google Search Ads' },
  { value: 'GOOGLE_DISPLAY', label: 'Google Display' },
  { value: 'META_FEED', label: 'Meta Ads (Feed)' },
  { value: 'META_STORIES', label: 'Meta Ads (Stories)' },
  { value: 'TIKTOK', label: 'TikTok Ads' },
  { value: 'LINKEDIN', label: 'LinkedIn Ads' },
]

const OBJETIVOS = [
  { value: 'VENTAS', label: 'Generar ventas' },
  { value: 'LEADS', label: 'Captar leads' },
  { value: 'TRAFICO', label: 'Tráfico web' },
  { value: 'AWARENESS', label: 'Awareness de marca' },
  { value: 'DESCARGAS', label: 'Descargas de app' },
]

// Plantillas de copies por plataforma y objetivo
const generarCopies = (data: any) => {
  const { producto, beneficio, audiencia, industria, plataforma, objetivo, urgencia, precio } = data

  const templates: any = {
    GOOGLE_SEARCH: {
      headlines: [
        `${producto} en Chile - Resultados Garantizados`,
        `${beneficio} | Cotiza Gratis Hoy`,
        `${producto} - ${urgencia ? 'Oferta Limitada' : 'Mejor Precio'}`,
        `¿Buscas ${producto}? Somos Expertos`,
        `${beneficio} en ${audiencia}`,
        `${producto} Profesional - Santiago`,
        precio ? `${producto} desde $${precio}` : `${producto} - Precio Justo`,
        `#1 en ${producto} Chile 2025`,
        `${beneficio} - Comprobado`,
        `${producto} | Envío Gratis Santiago`,
      ],
      descriptions: [
        `${beneficio}. Más de 500 clientes satisfechos en Chile. Cotización gratuita en 24 horas. ¡Contáctanos!`,
        `Especialistas en ${producto} para ${audiencia}. Garantía de satisfacción. Atención personalizada. Agenda tu cita.`,
        `¿Por qué elegirnos? ${beneficio}. Años de experiencia. Resultados medibles. Cotiza sin compromiso.`,
        `${producto} de calidad premium a precio justo. ${urgencia ? '⏰ Oferta válida hasta fin de mes.' : 'Consulta disponibilidad.'}`,
      ]
    },
    META_FEED: {
      primaryText: [
        `🎯 ${beneficio}\n\n¿Eres ${audiencia} y necesitas ${producto}?\n\nTenemos la solución perfecta para ti.\n\n${urgencia ? '⏰ Oferta por tiempo limitado' : '✅ Resultados garantizados'}\n\n👉 Haz clic para saber más`,
        `¿Sabías que el 80% de ${audiencia} ${beneficio.toLowerCase()} con ${producto}?\n\n🔥 En M&P te ayudamos a lograrlo.\n\n✓ Asesoría gratuita\n✓ Resultados en 30 días\n✓ Sin contratos largos\n\n💬 Escríbenos ahora`,
        `STOP ✋\n\nSi eres ${audiencia} y aún no tienes ${producto}, estás perdiendo dinero.\n\n${beneficio} está a un clic de distancia.\n\n${urgencia ? '🔥 Solo por esta semana' : '📞 Agenda tu llamada gratis'}`,
      ],
      headlines: [
        `${beneficio} - Descúbrelo`,
        `${producto} para ${audiencia}`,
        `Transforma tu negocio hoy`,
        urgencia ? `🔥 Última oportunidad` : `Cotiza gratis`,
      ]
    },
    META_STORIES: {
      primaryText: [
        `${beneficio} ✨\n\n→ Desliza para más info`,
        `${audiencia}: esto es para ti 👆\n\n${producto} que funciona`,
        `🚀 ${beneficio}\n\nToca para cotizar gratis`,
      ],
      headlines: [
        `${producto}`,
        `${beneficio}`,
        urgencia ? `Oferta HOY` : `Saber más`,
      ]
    },
    TIKTOK: {
      hooks: [
        `POV: Eres ${audiencia} y descubres ${producto} 🤯`,
        `${audiencia}: si no tienes ${producto}, NECESITAS ver esto`,
        `El secreto que ${audiencia} no quiere que sepas sobre ${producto}`,
        `Probé ${producto} por 30 días y esto pasó... 📈`,
        `3 razones por las que ${audiencia} está usando ${producto}`,
      ],
      ctas: [
        `Link en bio para cotizar gratis 👆`,
        `Comenta "INFO" y te escribo 💬`,
        `¿Quieres saber más? Síguenos ✨`,
        `Guarda este video para después 📌`,
      ]
    },
    LINKEDIN: {
      posts: [
        `🎯 ${beneficio}\n\nComo profesionales de ${industria}, sabemos que ${audiencia} enfrenta desafíos únicos.\n\nPor eso desarrollamos ${producto}: una solución diseñada específicamente para sus necesidades.\n\n✅ Resultados medibles\n✅ ROI comprobado\n✅ Implementación ágil\n\n¿Te gustaría saber cómo podemos ayudarte?\n\nComenta "INFO" o agenda una llamada (link en comentarios)`,
        `Después de trabajar con +50 empresas de ${industria}, identificamos el patrón #1 que separa a los que crecen de los que se estancan:\n\n${beneficio}\n\nNuestro ${producto} está diseñado para resolver exactamente esto.\n\n📊 Caso de éxito: Cliente aumentó resultados 40% en 60 días.\n\n¿Quieres los detalles? DM abiertos.`,
      ],
      headlines: [
        `${producto} para ${industria}`,
        `${beneficio} | B2B`,
        `Solución para ${audiencia}`,
      ]
    },
    GOOGLE_DISPLAY: {
      headlines: [
        `${producto}`,
        `${beneficio}`,
        audiencia,
        urgencia ? `Oferta Limitada` : `Cotiza Gratis`,
      ],
      descriptions: [
        `${beneficio}. Conoce más.`,
        `Para ${audiencia}. Resultados reales.`,
        `${producto} de calidad.`,
      ]
    }
  }

  return templates[plataforma] || templates.META_FEED
}

export default function GeneradorCopies() {
  const [formData, setFormData] = useState({
    producto: '',
    beneficio: '',
    audiencia: '',
    industria: 'ECOMMERCE',
    plataforma: 'META_FEED',
    objetivo: 'LEADS',
    urgencia: false,
    precio: '',
  })

  const [copies, setCopies] = useState<any>(null)
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [leadCaptured, setLeadCaptured] = useState(false)
  const [leadForm, setLeadForm] = useState({ nombre: '', email: '', empresa: '', telefono: '' })
  const [savingLead, setSavingLead] = useState(false)

  const handleGenerar = () => {
    if (!formData.producto || !formData.beneficio || !formData.audiencia) {
      alert('Por favor completa producto, beneficio y audiencia')
      return
    }

    const generatedCopies = generarCopies(formData)
    setCopies(generatedCopies)

    if (!leadCaptured) {
      setShowLeadModal(true)
    }
  }

  const handleCopy = (text: string, index: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleSaveLead = async () => {
    if (!leadForm.email || !leadForm.nombre) return
    setSavingLead(true)

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: leadForm.nombre,
          email: leadForm.email,
          empresa: leadForm.empresa || 'No especificada',
          telefono: leadForm.telefono || 'No especificado',
          solicitud: `Lead Generador Copies - Producto: ${formData.producto}, Plataforma: ${formData.plataforma}, Industria: ${formData.industria}`,
          destinatario: 'contacto@mulleryperez.cl',
          fuente: 'generador_copies'
        })
      })
      setLeadCaptured(true)
      setShowLeadModal(false)
    } catch (error) {
      console.error('Error saving lead:', error)
    } finally {
      setSavingLead(false)
    }
  }

  const regenerar = () => {
    const generatedCopies = generarCopies(formData)
    setCopies(generatedCopies)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/logo-color.png"
              alt="Muller y Pérez"
              width={140}
              height={45}
              className="h-11 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/labs"
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              ← Volver a Labs
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-36 pb-16 px-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-purple-500/10 border border-purple-400/20">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-200 text-sm font-medium">Generador de Copies</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Genera Copies para Ads{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              en Segundos
            </span>
          </h1>

          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Headlines, descripciones y textos optimizados para Google Ads, Meta, TikTok y LinkedIn
          </p>
        </div>
      </section>

      {/* Formulario */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Cuéntanos sobre tu negocio
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Qué vendes? *
                </label>
                <input
                  type="text"
                  placeholder="ej: Software de gestión, Tratamiento dental..."
                  value={formData.producto}
                  onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Beneficio principal *
                </label>
                <input
                  type="text"
                  placeholder="ej: Ahorra 10 horas semanales, Sonrisa perfecta..."
                  value={formData.beneficio}
                  onChange={(e) => setFormData({ ...formData, beneficio: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Quién es tu cliente ideal? *
                </label>
                <input
                  type="text"
                  placeholder="ej: Dueños de PYMEs, Mujeres 25-40 años..."
                  value={formData.audiencia}
                  onChange={(e) => setFormData({ ...formData, audiencia: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Precio (opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej: 49.990, Desde 99.000..."
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Industria
                </label>
                <select
                  value={formData.industria}
                  onChange={(e) => setFormData({ ...formData, industria: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none bg-white"
                >
                  {INDUSTRIAS.map((ind) => (
                    <option key={ind.value} value={ind.value}>{ind.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plataforma de destino
                </label>
                <select
                  value={formData.plataforma}
                  onChange={(e) => setFormData({ ...formData, plataforma: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none bg-white"
                >
                  {PLATAFORMAS.map((plat) => (
                    <option key={plat.value} value={plat.value}>{plat.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.urgencia}
                    onChange={(e) => setFormData({ ...formData, urgencia: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">Incluir urgencia/escasez en los copies</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleGenerar}
              className="mt-8 w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Generar Copies
            </button>
          </div>
        </div>
      </section>

      {/* Resultados */}
      {copies && (
        <section className="py-12 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                Tus Copies Generados
              </h2>
              <button
                onClick={regenerar}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerar
              </button>
            </div>

            {/* Google Search */}
            {copies.headlines && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Headlines (máx 30 caracteres)</h3>
                <div className="space-y-3">
                  {copies.headlines.map((headline: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 group hover:border-purple-300 transition-colors"
                    >
                      <div>
                        <p className="text-gray-900 font-medium">{headline}</p>
                        <p className="text-xs text-gray-500 mt-1">{headline.length} caracteres</p>
                      </div>
                      <button
                        onClick={() => handleCopy(headline, `headline-${idx}`)}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        {copiedIndex === `headline-${idx}` ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Descriptions */}
            {copies.descriptions && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Descripciones (máx 90 caracteres)</h3>
                <div className="space-y-3">
                  {copies.descriptions.map((desc: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 group hover:border-purple-300 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-gray-900">{desc}</p>
                        <p className="text-xs text-gray-500 mt-1">{desc.length} caracteres</p>
                      </div>
                      <button
                        onClick={() => handleCopy(desc, `desc-${idx}`)}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors ml-4"
                      >
                        {copiedIndex === `desc-${idx}` ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Text (Meta) */}
            {copies.primaryText && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Texto Principal (Feed/Stories)</h3>
                <div className="space-y-4">
                  {copies.primaryText.map((text: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-gray-900 whitespace-pre-line flex-1">{text}</p>
                        <button
                          onClick={() => handleCopy(text, `primary-${idx}`)}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors ml-4"
                        >
                          {copiedIndex === `primary-${idx}` ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TikTok Hooks */}
            {copies.hooks && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Hooks para TikTok</h3>
                <div className="space-y-3">
                  {copies.hooks.map((hook: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200 hover:border-pink-400 transition-colors"
                    >
                      <p className="text-gray-900">{hook}</p>
                      <button
                        onClick={() => handleCopy(hook, `hook-${idx}`)}
                        className="p-2 text-gray-400 hover:text-pink-600 transition-colors"
                      >
                        {copiedIndex === `hook-${idx}` ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TikTok CTAs */}
            {copies.ctas && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">CTAs para TikTok</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {copies.ctas.map((cta: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors"
                    >
                      <p className="text-gray-900">{cta}</p>
                      <button
                        onClick={() => handleCopy(cta, `cta-${idx}`)}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        {copiedIndex === `cta-${idx}` ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LinkedIn Posts */}
            {copies.posts && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Posts para LinkedIn</h3>
                <div className="space-y-4">
                  {copies.posts.map((post: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-6 bg-blue-50 rounded-xl border border-blue-200 hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-gray-900 whitespace-pre-line flex-1">{post}</p>
                        <button
                          onClick={() => handleCopy(post, `post-${idx}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors ml-4"
                        >
                          {copiedIndex === `post-${idx}` ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Quieres copies personalizados por expertos?
          </h2>
          <p className="text-gray-600 mb-8">
            Nuestro equipo de copywriters crea anuncios que convierten. Agenda una reunión gratis.
          </p>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
          >
            Hablar con un Experto
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Lead Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowLeadModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Unlock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">¡Copies generados!</h3>
              <p className="text-gray-600 mt-2">
                Déjanos tus datos para guardar tus copies y recibir más tips de copywriting.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={leadForm.nombre}
                    onChange={(e) => setLeadForm({ ...leadForm, nombre: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={leadForm.empresa}
                    onChange={(e) => setLeadForm({ ...leadForm, empresa: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLeadModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Saltar
              </button>
              <button
                onClick={handleSaveLead}
                disabled={savingLead || !leadForm.nombre || !leadForm.email}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors"
              >
                {savingLead ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 Muller y Pérez · M&P Labs</p>
          <div className="flex gap-6 text-sm">
            <Link href="/labs" className="text-gray-500 hover:text-purple-600 transition-colors">
              Labs
            </Link>
            <Link href="/blog" className="text-gray-500 hover:text-purple-600 transition-colors">
              Blog
            </Link>
            <Link href="/" className="text-gray-500 hover:text-purple-600 transition-colors">
              Inicio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
