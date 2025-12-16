'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Plus, Eye, Edit2, Trash2, ExternalLink } from 'lucide-react'
import CRMLayout from '@/app/components/crm/CRMLayout'

interface Landing {
  id: string
  name: string
  slug: string
  published: boolean
  created_at: string
  updated_at: string
}

export default function ClienteLandingsPage() {
  const router = useRouter()
  const [landings, setLandings] = useState<Landing[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadUser()
    loadLandings()
  }, [])

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function loadLandings() {
    try {
      const { data, error } = await supabase
        .from('client_landings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLandings(data || [])
    } catch (error) {
      console.error('Error loading landings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function createNewLanding() {
    try {
      console.log('🎯 createNewLanding clicked!')
      console.log('User from hook:', user)

      if (!user) {
        alert('Error: No estás autenticado. Por favor recarga la página.')
        return
      }

      const name = prompt('Nombre de la landing:')
      if (!name) return

      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      console.log('Creating landing:', { client_id: user.id, name, slug })

      const { data, error } = await supabase
        .from('client_landings')
        .insert({
          client_id: user.id,
          name,
          slug,
          destack_config: {},
          published: false
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Landing created successfully:', data)
      router.push(`/crm/cliente/landings/${data.id}/edit`)
    } catch (error: any) {
      console.error('Error creating landing:', error)
      if (error.code === '23505') {
        alert('Ya existe una landing con ese nombre. Usa otro.')
      } else {
        alert(`Error al crear landing: ${error.message || 'Desconocido'}`)
      }
    }
  }

  async function deleteLanding(id: string, name: string) {
    if (!confirm(`¿Eliminar landing "${name}"?`)) return

    try {
      const { error } = await supabase
        .from('client_landings')
        .delete()
        .eq('id', id)

      if (error) throw error

      setLandings(landings.filter(l => l.id !== id))
    } catch (error) {
      console.error('Error deleting landing:', error)
      alert('Error al eliminar landing')
    }
  }

  async function togglePublish(id: string, currentState: boolean) {
    try {
      const { error } = await supabase
        .from('client_landings')
        .update({ published: !currentState })
        .eq('id', id)

      if (error) throw error

      setLandings(landings.map(l =>
        l.id === id ? { ...l, published: !currentState } : l
      ))
    } catch (error) {
      console.error('Error toggling publish:', error)
      alert('Error al cambiar estado de publicación')
    }
  }

  if (loading) {
    return (
      <CRMLayout title="Mis Landing Pages">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando landings...</p>
          </div>
        </div>
      </CRMLayout>
    )
  }

  return (
    <CRMLayout title="Mis Landing Pages">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mis Landing Pages</h2>
            <p className="text-gray-600 mt-1">
              Crea y gestiona tus landing pages para campañas
            </p>
          </div>
          <button
            onClick={createNewLanding}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Nueva Landing
          </button>
        </div>

        {/* Landings Grid */}
        {landings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes landing pages aún
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Crea tu primera landing page con nuestro editor visual.
              Arrastra y suelta componentes para construir páginas profesionales.
            </p>
            <button
              onClick={createNewLanding}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Crear Primera Landing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landings.map((landing) => (
              <div
                key={landing.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200"
              >
                {/* Preview placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Vista previa</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg truncate flex-1">
                      {landing.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      landing.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {landing.published ? 'Publicada' : 'Borrador'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 truncate">
                    /l/{user?.id?.slice(0, 8)}/{landing.slug}
                  </p>

                  <div className="text-xs text-gray-500 mb-4">
                    Creada: {new Date(landing.created_at).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/crm/cliente/landings/${landing.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>

                    {landing.published && (
                      <a
                        href={`/l/${user?.id}/${landing.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => togglePublish(landing.id, landing.published)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                        landing.published
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {landing.published ? 'Ocultar' : 'Publicar'}
                    </button>

                    <button
                      onClick={() => deleteLanding(landing.id, landing.name)}
                      className="flex items-center justify-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CRMLayout>
  )
}
