import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export const metadata = {
  title: 'Confirmacion — Radar | Muller y Perez',
  robots: 'noindex',
}

const FLOW_API_KEY = process.env.FLOW_API_KEY || ''
const FLOW_SECRET = process.env.FLOW_SECRET_KEY || ''
const FLOW_URL = 'https://www.flow.cl/api'

function signFlow(params: Record<string, string>): string {
  const sorted = Object.keys(params).sort().map(function(k) { return k + '=' + params[k] }).join('&')
  return crypto.createHmac('sha256', FLOW_SECRET).update(sorted).digest('hex')
}

async function flowRequest(endpoint: string, params: Record<string, string>) {
  params.apiKey = FLOW_API_KEY
  params.s = signFlow(params)
  const formBody = Object.keys(params).map(function(k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
  }).join('&')
  const res = await fetch(FLOW_URL + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody,
  })
  return await res.json()
}

async function getSuscripcionYActivar(email: string) {
  if (!email) return null
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data } = await supabase.from('clipping_suscripciones').select('*').eq('email', email).order('created_at', { ascending: false }).limit(1)
  if (!data || data.length === 0) return null

  const sub = data[0]

  if (sub.estado === 'trial' && sub.flow_customer_id && sub.flow_plan_pendiente) {
    try {
      const subData = await flowRequest('/subscription/create', {
        planId: sub.flow_plan_pendiente,
        customerId: sub.flow_customer_id,
        url_return: 'https://www.mulleryperez.cl/copilot/confirmacion?email=' + encodeURIComponent(email),
        url_callback: 'https://www.mulleryperez.cl/api/webhooks/flow',
      })

      if (subData.subscriptionId) {
        await supabase.from('clipping_suscripciones').update({
          flow_subscription_id: String(subData.subscriptionId),
          estado: 'activo',
          flow_plan_pendiente: null,
          updated_at: new Date().toISOString(),
        }).eq('id', sub.id)
        sub.estado = 'activo'
      }
    } catch (e) {
      console.error('Error activando suscripcion:', e)
    }
  }

  return sub
}

export default async function ConfirmacionPage({ searchParams }: { searchParams: { email?: string } }) {
  const sub = await getSuscripcionYActivar(searchParams.email || '')
  const activo = sub && sub.estado === 'activo'
  const trial = sub && sub.estado === 'trial'
  const pendiente = sub && !activo && !trial

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">

        {activo && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Copilot activado</h1>
            <p className="text-gray-600 mb-6">Tu suscripcion fue procesada exitosamente. Ya puedes configurar tus cuentas.</p>
            <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
              <p className="text-sm text-gray-700 mb-3"><strong>Siguiente paso: configura tus cuentas</strong></p>
              <div className="space-y-2">
                <a href={'/copilot/configurar/' + sub.id} className="block bg-indigo-600 text-white text-center py-3 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition">
                  Configurar mis cuentas
                </a>
                <a href={'/copilot/dashboard/' + sub.id} className="block bg-gray-200 text-gray-700 text-center py-3 rounded-lg font-semibold text-sm hover:bg-gray-300 transition">
                  Ver mi dashboard
                </a>
              </div>
            </div>
          </>
        )}

        {trial && (
          <>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Pago en proceso</h1>
            <p className="text-gray-600 mb-6">Tu pago esta siendo procesado. Cuando se confirme, recibiras un email con tus links de acceso. Esto puede tomar unos minutos.</p>
            <div className="bg-yellow-50 rounded-xl p-5 mb-6 text-left border border-yellow-200">
              <p className="text-sm text-yellow-800"><strong>Mientras tanto puedes seguir usando tu trial:</strong></p>
              <div className="space-y-2 mt-3">
                <a href={'/copilot/dashboard/' + sub.id} className="block bg-yellow-600 text-white text-center py-3 rounded-lg font-semibold text-sm hover:bg-yellow-700 transition">
                  Ver mi dashboard
                </a>
              </div>
            </div>
          </>
        )}

        {pendiente && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Pago no confirmado</h1>
            <p className="text-gray-600 mb-6">No pudimos confirmar tu pago. Si ya pagaste, puede tomar unos minutos en procesarse. Revisa tu email o contactanos.</p>
            <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
              <p className="text-sm text-gray-700">Si el problema persiste, escribenos a <a href="mailto:contacto@mulleryperez.cl" className="text-indigo-600 font-semibold">contacto@mulleryperez.cl</a></p>
            </div>
          </>
        )}

        {!sub && (
          <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
            <p className="text-sm text-gray-700 mb-2"><strong>No encontramos tu suscripcion</strong></p>
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li>Revisa tu email para los links de acceso</li>
              <li>Si acabas de pagar, puede tomar unos minutos</li>
              <li>Contactanos en contacto@mulleryperez.cl</li>
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
