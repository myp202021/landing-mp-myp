'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'

const TONOS = ['profesional', 'cercano', 'técnico', 'corporativo', 'juvenil', 'premium', 'educativo']
const PLATAFORMAS_OPTS = ['LinkedIn', 'Facebook/Instagram', 'TikTok', 'X/Twitter']
const FRECUENCIAS = ['2-3 posts/semana', '3-4 posts/semana', '4-5 posts/semana', '5+ posts/semana']

interface Competidor { nombre: string; web: string }

export default function BriefingPage() {
  const params = useParams()
  const router = useRouter()
  const clienteId = params?.clienteId as string

  const [cliente, setCliente] = useState<{ nombre: string; rubro: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [hasAnalysis, setHasAnalysis] = useState(false)

  // Form fields
  const [web, setWeb] = useState('')
  const [instagram, setInstagram] = useState('')
  const [rubro, setRubro] = useState('')
  const [productos, setProductos] = useState('')
  const [tono, setTono] = useState('profesional')
  const [plataformas, setPlataformas] = useState<string[]>(['Facebook/Instagram'])
  const [frecuencia, setFrecuencia] = useState('3-4 posts/semana')
  const [competidores, setCompetidores] = useState<Competidor[]>([{ nombre: '', web: '' }])
  const [prohibidas, setProhibidas] = useState('')
  const [reglas, setReglas] = useState('')
  const [cierre, setCierre] = useState('')
  const [modelo, setModelo] = useState('gpt-4o')

  const [sheetsLinks, setSheetsLinks] = useState('')

  // Analysis results
  const [analisisWeb, setAnalisisWeb] = useState<Record<string, unknown> | null>(null)
  const [analisisTono, setAnalisisTono] = useState<Record<string, unknown> | null>(null)
  const [analisisComp, setAnalisisComp] = useState<Record<string, unknown> | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const cRes = await fetch(`/api/crm/clientes?id=${clienteId}`)
      const cData = await cRes.json()
      if (cData.cliente) {
        setCliente({ nombre: cData.cliente.nombre, rubro: cData.cliente.rubro })
        if (!rubro) setRubro(cData.cliente.rubro || '')
      }

      const bRes = await fetch(`/api/crm/briefings?cliente_id=${clienteId}`)
      const bData = await bRes.json()
      if (bData.briefing) {
        const b = bData.briefing
        setWeb(b.web || '')
        setInstagram(b.instagram || '')
        setRubro(b.rubro || cData.cliente?.rubro || '')
        setProductos(b.productos || '')
        setTono(b.tono || 'profesional')
        setPlataformas(b.plataformas || ['Facebook/Instagram'])
        setFrecuencia(b.frecuencia || '3-4 posts/semana')
        setCompetidores(b.competidores?.length ? b.competidores : [{ nombre: '', web: '' }])
        setProhibidas((b.palabras_prohibidas || []).join(', '))
        setReglas(b.reglas_adicionales || '')
        setCierre(b.cierre_obligatorio || '')
        setModelo(b.modelo || 'gpt-4o')
        setSheetsLinks((b.sheets_links || []).join('\n'))
        if (b.analisis_web) { setAnalisisWeb(b.analisis_web); setHasAnalysis(true) }
        if (b.analisis_tono) setAnalisisTono(b.analisis_tono)
        if (b.analisis_competitivo) setAnalisisComp(b.analisis_competitivo)
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [clienteId])

  useEffect(() => { loadData() }, [loadData])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/crm/briefings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: clienteId,
          web, instagram, rubro, productos, tono, plataformas, frecuencia,
          competidores: competidores.filter(c => c.nombre || c.web),
          palabras_prohibidas: prohibidas.split(',').map(p => p.trim()).filter(Boolean),
          reglas_adicionales: reglas,
          cierre_obligatorio: cierre,
          modelo,
          sheets_links: sheetsLinks.split('\n').map(l => l.trim()).filter(Boolean),
        }),
      })
      alert('Briefing guardado')
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const handleAnalyze = async () => {
    await handleSave() // Save first
    setAnalyzing(true)
    try {
      const res = await fetch('/api/crm/briefings/analizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: clienteId }),
      })
      const data = await res.json()
      if (data.success) {
        setHasAnalysis(true)
        if (data.briefing.analisis_web) setAnalisisWeb(data.briefing.analisis_web)
        if (data.briefing.analisis_tono) setAnalisisTono(data.briefing.analisis_tono)
        if (data.briefing.analisis_competitivo) setAnalisisComp(data.briefing.analisis_competitivo)
        alert(`Análisis completado. Web: ${data.analisis.web ? '✅' : '❌'} · Tono: ${data.analisis.tono ? '✅' : '❌'} · Competidores: ${data.analisis.competidores ? '✅' : '❌'} · Copies encontrados: ${data.analisis.copies_encontrados}`)
      } else {
        alert(data.error || 'Error en análisis')
      }
    } catch (e) { console.error(e) }
    setAnalyzing(false)
  }

  const togglePlataforma = (p: string) => {
    setPlataformas(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const addCompetidor = () => setCompetidores(prev => [...prev, { nombre: '', web: '' }])
  const updateComp = (i: number, field: 'nombre' | 'web', val: string) => {
    setCompetidores(prev => prev.map((c, j) => j === i ? { ...c, [field]: val } : c))
  }
  const removeComp = (i: number) => setCompetidores(prev => prev.filter((_, j) => j !== i))

  if (loading) return <CRMLayout title="Briefing"><div className="py-20 text-center text-gray-400">Cargando...</div></CRMLayout>

  return (
    <CRMLayout title={`Briefing — ${cliente?.nombre || '...'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Back + header */}
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => router.push(`/crm/grillas/${clienteId}`)} className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-2 inline-block">← Volver a Grilla</button>
            <h2 className="text-xl font-bold text-gray-900">{cliente?.nombre}</h2>
            <p className="text-sm text-gray-500">{hasAnalysis ? '✅ Briefing analizado con IA' : '⚠️ Briefing sin análisis IA'}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              {saving ? 'Guardando...' : '💾 Guardar'}
            </button>
            <button onClick={handleAnalyze} disabled={analyzing} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50">
              {analyzing ? '🔄 Analizando (~30s)...' : '🤖 Analizar con IA'}
            </button>
          </div>
        </div>

        {/* Basic info */}
        <Section title="INFORMACIÓN BÁSICA">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Sitio web" value={web} onChange={setWeb} placeholder="https://ejemplo.cl" />
            <Field label="Instagram" value={instagram} onChange={setInstagram} placeholder="@cuenta" />
            <Field label="Rubro / Industria" value={rubro} onChange={setRubro} placeholder="Ej: E-commerce, HR Tech, Construcción" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo IA</label>
              <select value={modelo} onChange={e => setModelo(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="gpt-4o">GPT-4o (OpenAI)</option>
                <option value="claude-sonnet">Claude Sonnet (Anthropic)</option>
              </select>
            </div>
          </div>
          <Field label="Productos / Servicios" value={productos} onChange={setProductos} placeholder="Describe qué vende el cliente..." multiline />
        </Section>

        {/* Tone & style */}
        <Section title="TONO Y ESTILO">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tono</label>
              <select value={tono} onChange={e => setTono(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {TONOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
              <select value={frecuencia} onChange={e => setFrecuencia(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {FRECUENCIAS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <Field label="Cierre obligatorio" value={cierre} onChange={setCierre} placeholder="Ej: genera.cl — Hablemos de Productividad" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plataformas</label>
            <div className="flex flex-wrap gap-2">
              {PLATAFORMAS_OPTS.map(p => (
                <button key={p} onClick={() => togglePlataforma(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${plataformas.includes(p) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Competitors */}
        <Section title="COMPETIDORES">
          <div className="space-y-2">
            {competidores.map((c, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={c.nombre} onChange={e => updateComp(i, 'nombre', e.target.value)}
                  placeholder="Nombre" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <input type="text" value={c.web} onChange={e => updateComp(i, 'web', e.target.value)}
                  placeholder="https://competidor.cl" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                {competidores.length > 1 && (
                  <button onClick={() => removeComp(i)} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm">✕</button>
                )}
              </div>
            ))}
            <button onClick={addCompetidor} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Agregar competidor</button>
          </div>
        </Section>

        {/* Rules */}
        {/* Historical grillas */}
        <Section title="GRILLAS ANTERIORES (Google Sheets)">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Links a Google Sheets con grillas anteriores (uno por línea)</label>
            <p className="text-xs text-gray-500 mb-2">La IA descarga los copies, analiza el tono y estilo, y los usa como referencia para generar contenido calibrado. Los links deben ser públicos ("cualquier persona con el enlace").</p>
            <textarea
              value={sheetsLinks}
              onChange={e => setSheetsLinks(e.target.value)}
              rows={4}
              placeholder={"https://docs.google.com/spreadsheets/d/xxxx/edit?gid=123\nhttps://docs.google.com/spreadsheets/d/xxxx/edit?gid=456"}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            />
          </div>
        </Section>

        <Section title="REGLAS Y RESTRICCIONES">
          <Field label="Palabras prohibidas (separadas por coma)" value={prohibidas} onChange={setProhibidas} placeholder="Ej: solución, innovador, líder" />
          <Field label="Reglas adicionales" value={reglas} onChange={setReglas} placeholder="Ej: siempre mencionar acreditación DT, no usar datos de 2024..." multiline />
        </Section>

        {/* Analysis results */}
        {hasAnalysis && (
          <Section title="RESULTADO DEL ANÁLISIS IA">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analisisWeb && (
                <AnalysisCard title="Web / Productos" data={{
                  'Propuesta': (analisisWeb.propuesta_valor as string) || '',
                  'Productos': ((analisisWeb.productos_servicios as string[]) || []).join(', '),
                  'Diferenciadores': ((analisisWeb.diferenciadores as string[]) || []).join(', '),
                }} />
              )}
              {analisisTono && (
                <AnalysisCard title="Tono Detectado" data={{
                  'Tono': (analisisTono.tono_general as string) || '',
                  'Formalidad': `${analisisTono.nivel_formalidad || '?'}/10`,
                  'Temas': ((analisisTono.temas_fuertes as string[]) || []).join(', '),
                }} />
              )}
              {analisisComp && (
                <AnalysisCard title="Competitivo" data={{
                  'Categoría dice': (analisisComp.que_dicen_todos as string) || '',
                  'Solo este cliente': (analisisComp.que_dice_solo_este_cliente as string) || '',
                  'Ángulos': ((analisisComp.angulos_diferenciadores as string[]) || []).join(', '),
                }} />
              )}
            </div>
          </Section>
        )}
      </div>
    </CRMLayout>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
      <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, multiline }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  const cls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  )
}

function AnalysisCard({ title, data }: { title: string; data: Record<string, string> }) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <h4 className="text-sm font-bold text-gray-800 mb-2">{title}</h4>
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="mb-1">
          <span className="text-xs font-semibold text-gray-500">{k}: </span>
          <span className="text-xs text-gray-700">{v || '—'}</span>
        </div>
      ))}
    </div>
  )
}
