'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import ContentProvider from 'destack/build/browser/ContentProvider'
import 'grapesjs/dist/css/grapes.min.css'

export default function EditClienteLandingPage() {
  const params = useParams()
  const router = useRouter()
  const [landing, setLanding] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadLanding()
  }, [params.id])

  async function loadLanding() {
    try {
      const { data, error } = await supabase
        .from('client_landings')
        .select('*')
        .eq('id', params.id)
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

  async function handleSave(data: any) {
    try {
      const { error } = await supabase
        .from('client_landings')
        .update({
          destack_config: data,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)

      if (error) throw error

      console.log('Landing guardada exitosamente')
    } catch (error) {
      console.error('Error saving landing:', error)
      alert('Error al guardar landing')
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
          <p className="text-sm text-gray-600">Editando landing page</p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Destack Editor */}
      <div className="flex-1 overflow-hidden">
        <ContentProvider
          data={landing.destack_config || {}}
          onSave={handleSave}
          standaloneServer={false}
        />
      </div>
    </div>
  )
}
