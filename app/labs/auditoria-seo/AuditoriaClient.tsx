'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  ArrowRight,
  Globe,
  FileText,
  Image as ImageIcon,
  Link2,
  Zap,
  Shield,
  Share2,
  ChevronDown,
  ChevronUp,
  Download,
  Mail
} from 'lucide-react'

interface SEOIssue {
  type: 'error' | 'warning' | 'info' | 'success'
  category: string
  message: string
  details?: string
}

interface SEOAuditResult {
  url: string
  score: number
  loadTime: number
  issues: SEOIssue[]
  meta: {
    title: string | null
    titleLength: number
    description: string | null
    descriptionLength: number
    canonical: string | null
    robots: string | null
    viewport: string | null
    ogTitle: string | null
    ogDescription: string | null
    ogImage: string | null
    twitterCard: string | null
  }
  headings: {
    h1: string[]
    h2: string[]
    h3: string[]
    h4: string[]
    h5: string[]
    h6: string[]
  }
  images: {
    total: number
    withAlt: number
    withoutAlt: number
  }
  links: {
    internal: number
    external: number
  }
  technical: {
    hasHttps: boolean
    hasSchemaMarkup: boolean
    schemaTypes: string[]
    isIndexable: boolean
  }
}

const issueIcon = {
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  success: <CheckCircle className="w-5 h-5 text-green-500" />
}

const issueBg = {
  error: 'bg-red-50 border-red-200',
  warning: 'bg-amber-50 border-amber-200',
  info: 'bg-blue-50 border-blue-200',
  success: 'bg-green-50 border-green-200'
}

function ScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference

  const getColor = () => {
    if (score >= 80) return { stroke: '#22c55e', text: 'text-green-500', label: 'Excelente' }
    if (score >= 60) return { stroke: '#eab308', text: 'text-amber-500', label: 'Puede mejorar' }
    if (score >= 40) return { stroke: '#f97316', text: 'text-orange-500', label: 'Necesita trabajo' }
    return { stroke: '#ef4444', text: 'text-red-500', label: 'Crítico' }
  }

  const { stroke, text, label } = getColor()

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          <circle
            cx="72"
            cy="72"
            r="45"
            fill="none"
            stroke={stroke}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${text}`}>{score}</span>
          <span className="text-sm text-gray-500">/100</span>
        </div>
      </div>
      <span className={`mt-2 font-semibold ${text}`}>{label}</span>
    </div>
  )
}

function CategorySection({
  title,
  icon,
  issues,
  defaultOpen = false
}: {
  title: string
  icon: React.ReactNode
  issues: SEOIssue[]
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const errors = issues.filter(i => i.type === 'error').length
  const warnings = issues.filter(i => i.type === 'warning').length
  const successes = issues.filter(i => i.type === 'success').length

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {errors > 0 && (
              <span className="flex items-center gap-1 text-red-600">
                <AlertCircle className="w-4 h-4" /> {errors}
              </span>
            )}
            {warnings > 0 && (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertTriangle className="w-4 h-4" /> {warnings}
              </span>
            )}
            {successes > 0 && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" /> {successes}
              </span>
            )}
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
          {issues.map((issue, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-lg border ${issueBg[issue.type]}`}
            >
              {issueIcon[issue.type]}
              <div>
                <p className="font-medium text-gray-900">{issue.message}</p>
                {issue.details && (
                  <p className="text-sm text-gray-600 mt-1">{issue.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AuditoriaClient() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SEOAuditResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleAnalyze = async () => {
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al analizar la página')
        return
      }

      setResult(data)
    } catch {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would send the email to your backend/CRM
    // For now, just simulate success
    setEmailSent(true)
  }

  const groupedIssues = result?.issues.reduce((acc, issue) => {
    if (!acc[issue.category]) acc[issue.category] = []
    acc[issue.category].push(issue)
    return acc
  }, {} as Record<string, SEOIssue[]>)

  const categoryIcons: Record<string, React.ReactNode> = {
    'Meta': <FileText className="w-5 h-5 text-blue-600" />,
    'Mobile': <Globe className="w-5 h-5 text-purple-600" />,
    'Social': <Share2 className="w-5 h-5 text-pink-600" />,
    'Contenido': <FileText className="w-5 h-5 text-indigo-600" />,
    'Imágenes': <ImageIcon className="w-5 h-5 text-amber-600" />,
    'Links': <Link2 className="w-5 h-5 text-cyan-600" />,
    'Técnico': <Zap className="w-5 h-5 text-orange-600" />,
    'Seguridad': <Shield className="w-5 h-5 text-green-600" />,
    'Performance': <Zap className="w-5 h-5 text-red-600" />,
    'Indexación': <Search className="w-5 h-5 text-gray-600" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/labs" className="text-sm text-gray-600 hover:text-blue-600">
            ← Volver a Labs
          </Link>
          <Link href="/" className="text-sm font-medium text-blue-600">
            mulleryperez.cl
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Search className="w-4 h-4" />
            Herramienta Gratuita
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Auditoría SEO{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Instantánea
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10">
            Analiza tu sitio web y descubre problemas de SEO en segundos.
            Meta tags, headings, imágenes, velocidad y más.
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-2 max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder="Ingresa tu URL (ej: tusitio.cl)"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-lg"
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={loading || !url.trim()}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    Analizar
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3 max-w-2xl mx-auto">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {result && (
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Score Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ScoreGauge score={result.score} />

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Resultado del Análisis
                  </h2>
                  <p className="text-gray-600 mb-4 break-all">
                    {result.url}
                  </p>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Tiempo de carga:</span>
                      <span className="font-semibold">{(result.loadTime / 1000).toFixed(2)}s</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-gray-600">Errores:</span>
                      <span className="font-semibold">{result.issues.filter(i => i.type === 'error').length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-gray-600">Advertencias:</span>
                      <span className="font-semibold">{result.issues.filter(i => i.type === 'warning').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900">{result.headings.h1.length}</div>
                <div className="text-sm text-gray-600">H1</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900">{result.headings.h2.length}</div>
                <div className="text-sm text-gray-600">H2</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900">{result.images.total}</div>
                <div className="text-sm text-gray-600">Imágenes</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900">{result.links.internal}</div>
                <div className="text-sm text-gray-600">Links Int.</div>
              </div>
            </div>

            {/* Issues by Category */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-bold text-gray-900">Análisis Detallado</h3>

              {groupedIssues && Object.entries(groupedIssues).map(([category, issues]) => (
                <CategorySection
                  key={category}
                  title={category}
                  icon={categoryIcons[category] || <FileText className="w-5 h-5 text-gray-600" />}
                  issues={issues}
                  defaultOpen={issues.some(i => i.type === 'error')}
                />
              ))}
            </div>

            {/* Meta Preview */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Vista Previa en Google</h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="text-blue-700 text-lg hover:underline cursor-pointer truncate">
                  {result.meta.title || 'Sin título'}
                </div>
                <div className="text-green-700 text-sm truncate">
                  {result.url}
                </div>
                <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {result.meta.description || 'Sin meta descripción'}
                </div>
              </div>
            </div>

            {/* Lead Capture */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">
                    ¿Quieres el Reporte Completo en PDF?
                  </h3>
                  <p className="text-blue-100">
                    Incluye recomendaciones detalladas, checklist de mejoras y análisis de competencia.
                  </p>
                </div>

                {!emailSent ? (
                  <form onSubmit={handleEmailSubmit} className="flex gap-2 w-full md:w-auto">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="flex-1 md:w-64 px-4 py-3 rounded-xl text-gray-900 border-0 focus:ring-2 focus:ring-white"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Enviar
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-3 bg-white/20 rounded-xl px-6 py-4">
                    <Mail className="w-6 h-6" />
                    <span className="font-medium">Revisa tu email en unos minutos</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                ¿Necesitas ayuda para mejorar tu SEO?
              </p>
              <Link
                href="/cotizador"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Solicitar Cotización SEO
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features (when no result) */}
      {!result && !loading && (
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
              ¿Qué Analizamos?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Meta Tags</h3>
                <p className="text-gray-600 text-sm">
                  Título, descripción, Open Graph, Twitter Cards y más.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Estructura</h3>
                <p className="text-gray-600 text-sm">
                  Headings H1-H6, jerarquía de contenido y organización.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <ImageIcon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Imágenes</h3>
                <p className="text-gray-600 text-sm">
                  Alt text, optimización y accesibilidad de imágenes.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                  <Link2 className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Links</h3>
                <p className="text-gray-600 text-sm">
                  Links internos, externos y estructura de navegación.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Seguridad</h3>
                <p className="text-gray-600 text-sm">
                  HTTPS, certificado SSL y configuración segura.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
                <p className="text-gray-600 text-sm">
                  Tiempo de carga y optimización básica de velocidad.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>
            Herramienta gratuita de{' '}
            <Link href="/" className="text-blue-600 hover:underline">
              Muller y Pérez
            </Link>
            . Para un análisis profesional completo,{' '}
            <Link href="/cotizador" className="text-blue-600 hover:underline">
              contáctanos
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}
