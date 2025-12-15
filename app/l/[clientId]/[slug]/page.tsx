import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { renderStatic } from 'destack/build/server'

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

  // Renderizar HTML estático desde la configuración de Destack
  const html = await renderStatic(landing.destack_config || {})

  return (
    <div className="min-h-screen">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

// Generar rutas estáticas para las landings publicadas
export async function generateStaticParams() {
  const supabase = await createClient()

  const { data: landings } = await supabase
    .from('client_landings')
    .select('client_id, slug')
    .eq('published', true)

  if (!landings) return []

  return landings.map((landing) => ({
    clientId: landing.client_id,
    slug: landing.slug,
  }))
}

// Revalidar cada 60 segundos
export const revalidate = 60
