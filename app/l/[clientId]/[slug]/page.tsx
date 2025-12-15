import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { clientId: string, slug: string } }) {
  const supabase = await createClient()

  const { data: landing } = await supabase
    .from('client_landings')
    .select('name, meta_title, meta_description')
    .eq('client_id', params.clientId)
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!landing) {
    return {
      title: 'Página no encontrada',
    }
  }

  return {
    title: landing.meta_title || landing.name,
    description: landing.meta_description || `Landing page: ${landing.name}`,
  }
}

export default async function PublicLandingPage({
  params,
}: {
  params: { clientId: string; slug: string }
}) {
  const supabase = await createClient()

  // Obtener landing de la base de datos
  const { data: landing, error } = await supabase
    .from('client_landings')
    .select('*')
    .eq('client_id', params.clientId)
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (error || !landing) {
    notFound()
  }

  // Incrementar contador de vistas (async, sin esperar)
  supabase.rpc('increment_landing_view', { landing_uuid: landing.id }).then()

  // Renderizar HTML desde la configuración de Destack
  // Destack guarda el contenido en formato HTML en destack_config
  const htmlContent = landing.destack_config?.html || landing.destack_config || ''

  return (
    <div className="min-h-screen">
      {htmlContent && (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      )}
      {!htmlContent && (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Esta landing aún no tiene contenido</p>
        </div>
      )}
    </div>
  )
}

// Hacer esta página dinámica para analytics en tiempo real
export const dynamic = 'force-dynamic'
