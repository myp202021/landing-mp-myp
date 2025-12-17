'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EditClienteLandingPage() {
  const params = useParams()
  const router = useRouter()
  const [landing, setLanding] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const editorRef = useRef<HTMLDivElement>(null)
  const grapesjsEditor = useRef<any>(null)

  useEffect(() => {
    loadLanding()
  }, [params?.id])

  // Cargar GrapesJS solo en el cliente
  useEffect(() => {
    if (!landing || typeof window === 'undefined') return

    const initEditor = async () => {
      try {
        // @ts-ignore
        const grapesjs = (await import('grapesjs')).default
        // @ts-ignore
        const presetWebpage = (await import('grapesjs-preset-webpage')).default

        // Cargar CSS
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/grapesjs/dist/css/grapes.min.css'
        document.head.appendChild(link)

        if (editorRef.current && !grapesjsEditor.current) {
          grapesjsEditor.current = grapesjs.init({
            container: editorRef.current,
            fromElement: true,
            height: 'calc(100vh - 80px)',
            width: '100%',
            storageManager: false,
            plugins: [presetWebpage],
            pluginsOpts: {
              'gjs-preset-webpage': {
                modalImportTitle: 'Importar',
                modalImportLabel: '<div>Pega tu HTML aquí</div>',
                modalImportContent: (editor: any) => editor.getHtml(),
              }
            },
            canvas: {
              styles: [
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
              ]
            }
          })

          // Cargar contenido guardado
          if (landing.destack_config && landing.destack_config.html) {
            grapesjsEditor.current.setComponents(landing.destack_config.html)
            if (landing.destack_config.css) {
              grapesjsEditor.current.setStyle(landing.destack_config.css)
            }
          }

          // Auto-guardar cada 30 segundos
          setInterval(() => {
            if (grapesjsEditor.current) {
              handleSave()
            }
          }, 30000)
        }
      } catch (error) {
        console.error('Error loading GrapesJS:', error)
        alert('Error al cargar el editor. Por favor recarga la página.')
      }
    }

    initEditor()

    return () => {
      if (grapesjsEditor.current) {
        grapesjsEditor.current.destroy()
      }
    }
  }, [landing])

  async function loadLanding() {
    try {
      const { data, error } = await supabase
        .from('client_landings')
        .select('*')
        .eq('id', params?.id)
        .single()

      if (error) throw error

      setLanding(data)
    } catch (error) {
      console.error('Error loading landing:', error)
      alert('Error al cargar landing')
      router.push('/crm/cliente/landings')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      if (!grapesjsEditor.current) return

      const html = grapesjsEditor.current.getHtml()
      const css = grapesjsEditor.current.getCss()

      const { error } = await supabase
        .from('client_landings')
        .update({
          destack_config: { html, css },
          updated_at: new Date().toISOString()
        })
        .eq('id', params?.id)

      if (error) throw error

      console.log('Landing guardada exitosamente')
    } catch (error) {
      console.error('Error saving landing:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando editor...</p>
        </div>
      </div>
    )
  }

  if (!landing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Landing no encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{landing.name}</h1>
          <p className="text-sm text-gray-600">Editor de landing page</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            💾 Guardar
          </button>
          <button
            onClick={() => router.push('/crm/cliente/landings')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            ← Volver
          </button>
          <a
            href={`/l/${landing.client_id}/${landing.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors font-medium"
          >
            Ver Landing →
          </a>
        </div>
      </div>

      {/* Editor */}
      <div ref={editorRef} className="flex-1"></div>
    </div>
  )
}
