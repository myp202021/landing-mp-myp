'use client'

import { useState, useEffect } from 'react'
import CRMLayout from '@/app/components/crm/CRMLayout'
import Button from '@/app/components/crm/Button'

export default function ConfiguracionCRM() {
  const [costoPorLeadGlobal, setCostoPorLeadGlobal] = useState(5000)

  useEffect(() => {
    const saved = localStorage.getItem('costoPorLeadGlobal')
    if (saved) setCostoPorLeadGlobal(Number(saved))
  }, [])

  const guardarConfig = () => {
    localStorage.setItem('costoPorLeadGlobal', costoPorLeadGlobal.toString())
    alert('Configuracion guardada correctamente')
  }

  return (
    <CRMLayout title="Configuracion">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Configuracion de Metricas</h1>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Costo por Lead</h2>
          <p className="text-gray-600 mb-6">
            Define el costo promedio por lead para calcular el ROAS. Este valor se usara para leads sin costo especifico.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Costo por Lead (CLP)
            </label>
            <input
              type="number"
              value={costoPorLeadGlobal}
              onChange={(e) => setCostoPorLeadGlobal(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="5000"
            />
            <p className="text-sm text-gray-500 mt-2">
              Ej: Si cada lead te cuesta $5,000 CLP en publicidad
            </p>
          </div>

          <Button variant="primary" onClick={guardarConfig}>
            Guardar Configuracion
          </Button>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Como se calcula el ROAS</h2>
          <div className="text-gray-700 space-y-3">
            <p><strong className="text-blue-900">ROAS</strong> = (Ventas Totales / Inversion Publicitaria)</p>
            <p className="text-sm bg-white p-3 rounded-lg border border-blue-200">
              <strong>Ejemplo:</strong> Si vendiste $1,000,000 CLP e invertiste $200,000 CLP en publicidad,
              tu ROAS es <strong className="text-green-600">5.0x</strong> (recuperaste 5 veces tu inversion)
            </p>
            <div className="pt-2">
              <p className="font-semibold text-gray-900">Otras metricas calculadas:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li><strong>Costo por Lead:</strong> Inversion total / Cantidad de leads</li>
                <li><strong>Costo por Contactado:</strong> Inversion de leads contactados / Cantidad contactados</li>
                <li><strong>Costo por Venta:</strong> Inversion de leads vendidos / Cantidad vendidos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CRMLayout>
  )
}
