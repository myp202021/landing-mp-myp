import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export const metadata = {
  title: 'Suscripcion confirmada — Radar | Muller y Perez',
  robots: 'noindex',
}

async function getSuscripcion(email: string) {
  if (!email) return null
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data } = await supabase.from('clipping_suscripciones').select('id, email, nombre, plan, estado').eq('email', email).order('created_at', { ascending: false }).limit(1)
  return data && data.length > 0 ? data[0] : null
}

export default async function ConfirmacionPage({ searchParams }: { searchParams: { email?: string } }) {
  const sub = await getSuscripcion(searchParams.email || '')

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Radar activado</h1>
        <p className="text-gray-600 mb-6">Tu suscripcion fue procesada. Recibiras un email con tus links privados.</p>

        {sub && (
          <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
            <p className="text-sm text-gray-700 mb-3"><strong>Siguiente paso: configura tus cuentas</strong></p>
            <div className="space-y-2">
              <a href={'/radar/configurar/' + sub.id} className="block bg-indigo-600 text-white text-center py-3 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition">
                Configurar mis cuentas
              </a>
              <a href={'/radar/' + sub.id} className="block bg-gray-200 text-gray-700 text-center py-3 rounded-lg font-semibold text-sm hover:bg-gray-300 transition">
                Ver mi dashboard
              </a>
            </div>
          </div>
        )}

        {!sub && (
          <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
            <p className="text-sm text-gray-700 mb-2"><strong>Que sigue:</strong></p>
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li>Revisa tu email para los links de configuracion</li>
              <li>Configura las cuentas que quieres monitorear</li>
              <li>Tu primer informe llega manana a las 7:30 AM</li>
            </ul>
          </div>
        )}

        <Link href="/clipping" className="text-indigo-600 font-semibold hover:underline text-sm">
          Volver a Radar
        </Link>
      </div>
    </div>
  )
}
