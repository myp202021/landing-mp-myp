'use client'

import CRMLayout from '@/app/components/crm/CRMLayout'
import Button from '@/app/components/crm/Button'

export default function IntegracionesPage() {
  return (
    <CRMLayout title="Integraciones">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Integraciones Externas</h1>

        <div className="space-y-6">
          {/* Zapier */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">⚡</div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Zapier</h2>
                  <p className="text-gray-600 text-sm">Conecta formularios de Facebook Lead Ads</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold border border-green-300">
                Conectado
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
              <p className="text-sm text-gray-700 mb-2"><strong>Webhook endpoint:</strong></p>
              <code className="bg-white px-3 py-2 rounded text-blue-600 text-sm block border border-gray-300">
                https://www.mulleryperez.cl/api/leads/zapier
              </code>
            </div>
            <Button variant="secondary" onClick={() => window.location.href = '/ZAPIER_SETUP.md'}>
              Ver Documentacion
            </Button>
          </div>

          {/* Google Ads */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🎯</div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Google Ads</h2>
                  <p className="text-gray-600 text-sm">Sincroniza datos de campanas y costos</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold border border-yellow-300">
                Disponible
              </span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-4">
              <h3 className="text-blue-900 font-semibold mb-3 flex items-center gap-2">
                <span>📊</span> Datos que obtendras automaticamente:
              </h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Metricas por campana (impresiones, clicks, costo, CTR)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Costo por lead automatico desde campanas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>ROAS calculado en tiempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Leads desde Google Ads Lead Form Extensions</span>
                </li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => alert('Funcionalidad en desarrollo.\n\nRequiere:\n1. Configuracion de Google Ads API\n2. OAuth 2.0\n3. Developer Token de Google\n\nVer GOOGLE_ADS_INTEGRATION.md para mas detalles.')}
              >
                Conectar Google Ads
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/GOOGLE_ADS_INTEGRATION.md'}
              >
                Ver Plan Tecnico
              </Button>
            </div>
          </div>

          {/* Meta/Facebook */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">📘</div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Meta Business Manager</h2>
                  <p className="text-gray-600 text-sm">Datos de campanas de Facebook e Instagram</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-sm font-semibold">
                Proximamente
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Integracion con Meta Business Manager para obtener metricas de campanas de Facebook e Instagram Ads.
            </p>
            <Button variant="secondary" disabled>
              Proximamente
            </Button>
          </div>
        </div>
      </div>
    </CRMLayout>
  )
}
