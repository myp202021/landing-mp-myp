import Link from 'next/link'

export const metadata = {
  title: 'Suscripcion confirmada — Radar | Muller y Perez',
  robots: 'noindex',
}

export default function ConfirmacionPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Radar activado</h1>
        <p className="text-gray-600 mb-6">Tu suscripcion fue procesada. Recibiras tu primer informe manana a las 7:30 AM en tu email.</p>
        <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
          <p className="text-sm text-gray-700 mb-2"><strong>Que sigue:</strong></p>
          <ul className="text-sm text-gray-600 space-y-1.5">
            <li>Manana a las 7:30 AM llega tu primer Radar diario</li>
            <li>Cada lunes a las 9 AM recibiras el resumen semanal</li>
            <li>El 1ro de cada mes llega el informe mensual con PDF</li>
          </ul>
        </div>
        <Link href="/clipping" className="text-indigo-600 font-semibold hover:underline text-sm">
          Volver a Radar
        </Link>
      </div>
    </div>
  )
}
