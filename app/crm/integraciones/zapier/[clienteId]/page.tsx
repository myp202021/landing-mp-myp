'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'
import Button from '@/app/components/crm/Button'
import { useSimpleAuth } from '@/lib/auth/simple-auth'

interface Cliente {
  id: string
  nombre: string
  zapier_webhook_url: string | null
  zapier_activo: boolean
}

interface TestLead {
  nombre: string
  email: string
  telefono: string
}

export default function ZapierWizardPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useSimpleAuth()
  const clienteId = params.clienteId as string

  const [loading, setLoading] = useState(true)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [testLead, setTestLead] = useState<TestLead>({
    nombre: '',
    email: '',
    telefono: ''
  })
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'checking' | 'success' | 'error'>('idle')
  const [testMessage, setTestMessage] = useState('')
  const [saving, setSaving] = useState(false)

  // Proteger ruta - solo admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      alert('Acceso denegado. Solo administradores pueden configurar integraciones.')
      router.push('/crm')
    }
  }, [user, router])

  // Cargar datos del cliente
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const res = await fetch(`/api/crm/clientes/${clienteId}`)
        if (!res.ok) throw new Error('Error cargando cliente')
        const data = await res.json()
        setCliente(data.cliente)

        // Generar webhook URL
        const url = `https://www.mulleryperez.cl/api/webhooks/meta-leads?cliente_id=${clienteId}`
        setWebhookUrl(url)

        // Si ya está configurado, ir al paso 4
        if (data.cliente.zapier_activo && data.cliente.zapier_webhook_url) {
          setCurrentStep(4)
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error cargando datos del cliente')
      } finally {
        setLoading(false)
      }
    }

    if (clienteId) {
      fetchCliente()
    }
  }, [clienteId])

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTestLead = async () => {
    if (!testLead.nombre || !testLead.email || !testLead.telefono) {
      alert('Por favor completa todos los campos del formulario de prueba')
      return
    }

    setTestStatus('sending')
    setTestMessage('Enviando lead de prueba...')

    try {
      // Enviar lead de prueba
      const sendRes = await fetch('/api/webhooks/meta-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: clienteId,
          nombre: testLead.nombre,
          email: testLead.email,
          telefono: testLead.telefono,
          origen: 'test_zapier',
          metadata: {
            test: true,
            wizard_step: 'test_conexion'
          }
        })
      })

      if (!sendRes.ok) {
        throw new Error('Error enviando lead de prueba')
      }

      setTestStatus('checking')
      setTestMessage('Lead enviado. Verificando recepción...')

      // Verificar si llegó el lead (polling cada 2s por 30s)
      let attempts = 0
      const maxAttempts = 15
      const checkInterval = setInterval(async () => {
        attempts++

        try {
          const checkRes = await fetch(`/api/crm/leads?cliente_id=${clienteId}&limit=1`)
          const checkData = await checkRes.json()

          if (checkData.leads && checkData.leads.length > 0) {
            const lastLead = checkData.leads[0]
            if (lastLead.origen === 'test_zapier' && lastLead.email === testLead.email) {
              clearInterval(checkInterval)
              setTestStatus('success')
              setTestMessage('Conexión exitosa! El lead de prueba fue recibido correctamente.')

              // Registrar evento exitoso
              await fetch('/api/crm/integraciones/historial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  cliente_id: clienteId,
                  tipo: 'zapier',
                  accion: 'test_exitoso',
                  descripcion: 'Prueba de conexión exitosa',
                  webhook_url: webhookUrl,
                  metadata: { test_lead: testLead }
                })
              })
            }
          }
        } catch (error) {
          console.error('Error verificando lead:', error)
        }

        if (attempts >= maxAttempts) {
          clearInterval(checkInterval)
          setTestStatus('error')
          setTestMessage('No se detectó el lead. Verifica que Zapier esté correctamente configurado.')

          // Registrar evento fallido
          await fetch('/api/crm/integraciones/historial', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cliente_id: clienteId,
              tipo: 'zapier',
              accion: 'test_fallido',
              descripcion: 'La prueba de conexión no detectó el lead',
              webhook_url: webhookUrl,
              metadata: { test_lead: testLead }
            })
          })
        }
      }, 2000)
    } catch (error) {
      console.error('Error en prueba:', error)
      setTestStatus('error')
      setTestMessage('Error al enviar el lead de prueba')
    }
  }

  const handleActivateIntegration = async () => {
    if (testStatus !== 'success') {
      if (!confirm('No has realizado una prueba exitosa. ¿Deseas activar la integración de todas formas?')) {
        return
      }
    }

    setSaving(true)
    try {
      // Actualizar cliente
      const updateRes = await fetch(`/api/crm/clientes/${clienteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zapier_activo: true,
          zapier_webhook_url: webhookUrl
        })
      })

      if (!updateRes.ok) throw new Error('Error actualizando cliente')

      // Registrar en historial
      await fetch('/api/crm/integraciones/historial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: clienteId,
          tipo: 'zapier',
          accion: 'activado',
          descripcion: `Integración Zapier activada para ${cliente?.nombre}`,
          webhook_url: webhookUrl,
          metadata: {
            activated_from_wizard: true,
            test_status: testStatus
          }
        })
      })

      alert('Integración activada exitosamente!')
      router.push('/crm/integraciones')
    } catch (error) {
      console.error('Error activando integración:', error)
      alert('Error activando la integración')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <CRMLayout title="Configurar Zapier">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </CRMLayout>
    )
  }

  if (!cliente) {
    return (
      <CRMLayout title="Error">
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">Cliente no encontrado</p>
          <Button onClick={() => router.push('/crm/integraciones')} className="mt-4">
            Volver a Integraciones
          </Button>
        </div>
      </CRMLayout>
    )
  }

  const steps = [
    { number: 1, title: 'Introducción', icon: '📖' },
    { number: 2, title: 'Generar Webhook', icon: '🔗' },
    { number: 3, title: 'Configuración', icon: '⚙️' },
    { number: 4, title: 'Prueba y Activación', icon: '✅' }
  ]

  return (
    <CRMLayout title={`Configurar Zapier - ${cliente.nombre}`}>
      <div className="max-w-5xl mx-auto">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                      currentStep >= step.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? '✓' : step.icon}
                  </div>
                  <p className={`mt-2 text-sm font-semibold ${
                    currentStep >= step.number ? 'text-blue-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenido por paso */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          {/* Paso 1: Introducción */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-4xl">📖</span>
                Bienvenido al Asistente de Configuración Zapier
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  Zapier te permite conectar automáticamente tus formularios de Facebook Lead Ads
                  con este CRM.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-bold text-blue-900 mb-3 text-lg">Beneficios:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 text-xl">✓</span>
                      <span>Leads automáticos: Los contactos llegarán instantáneamente a tu CRM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 text-xl">✓</span>
                      <span>Sin trabajo manual: Olvídate de copiar y pegar datos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 text-xl">✓</span>
                      <span>Respuesta rápida: Contacta a tus leads cuando aún están interesados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 text-xl">✓</span>
                      <span>Métricas precisas: Calcula automáticamente el costo por lead</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                    <span>⏱️</span>
                    Tiempo estimado:
                  </h3>
                  <p className="text-yellow-800">10-15 minutos para completar la configuración</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-2">Requisitos previos:</h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Cuenta de Zapier (puede ser gratuita)</li>
                    <li>• Acceso a Facebook Business Manager</li>
                    <li>• Campaña activa de Lead Ads en Facebook</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button onClick={() => setCurrentStep(2)} size="lg">
                  Comenzar Configuración →
                </Button>
              </div>
            </div>
          )}

          {/* Paso 2: Generar Webhook */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-4xl">🔗</span>
                Generar URL del Webhook
              </h2>

              <div className="space-y-6">
                <p className="text-gray-700 text-lg">
                  Esta es la URL única que usarás en Zapier para enviar los leads a este cliente.
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-lg p-6">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    URL del Webhook:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={webhookUrl}
                      readOnly
                      className="flex-1 px-4 py-3 border border-blue-300 rounded-lg bg-white text-blue-700 font-mono text-sm"
                    />
                    <Button onClick={handleCopyWebhook}>
                      {copied ? '✓ Copiado!' : '📋 Copiar'}
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-green-600 text-sm mt-2 font-semibold">
                      ✓ URL copiada al portapapeles
                    </p>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                    <span>⚠️</span>
                    Importante:
                  </h3>
                  <ul className="space-y-1 text-yellow-800">
                    <li>• Esta URL es única para este cliente</li>
                    <li>• No la compartas públicamente</li>
                    <li>• La necesitarás en el siguiente paso</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                  ← Anterior
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Siguiente: Configurar Zapier →
                </Button>
              </div>
            </div>
          )}

          {/* Paso 3: Instrucciones de Configuración */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-4xl">⚙️</span>
                Configurar Zapier
              </h2>

              <div className="space-y-6">
                <p className="text-gray-700 text-lg">
                  Sigue estos pasos para conectar Facebook Lead Ads con tu CRM:
                </p>

                <div className="space-y-4">
                  {/* Paso 1 */}
                  <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                        1
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">Accede a Zapier</h4>
                        <p className="text-gray-700 mb-3">
                          Ve a{' '}
                          <a
                            href="https://zapier.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            zapier.com
                          </a>{' '}
                          e inicia sesión (o crea una cuenta gratuita)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Paso 2 */}
                  <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                        2
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">Crear nuevo Zap</h4>
                        <p className="text-gray-700 mb-3">
                          Haz clic en "Create Zap" o "Crear Zap"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Paso 3 */}
                  <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                        3
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">Configurar Trigger</h4>
                        <p className="text-gray-700 mb-2">En la sección "Trigger" (Disparador):</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                          <li>Busca y selecciona "Facebook Lead Ads"</li>
                          <li>Evento: "New Lead" (Nuevo Lead)</li>
                          <li>Conecta tu cuenta de Facebook</li>
                          <li>Selecciona la página y el formulario</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Paso 4 */}
                  <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                        4
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">Configurar Action (Acción)</h4>
                        <p className="text-gray-700 mb-2">En la sección "Action":</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                          <li>Busca y selecciona "Webhooks by Zapier"</li>
                          <li>Evento: "POST"</li>
                          <li>URL: Pega la URL del paso anterior</li>
                          <li>Payload Type: "JSON"</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Paso 5 */}
                  <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                        5
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">Mapear campos</h4>
                        <p className="text-gray-700 mb-2">En "Data" del Webhook, agrega estos campos:</p>
                        <div className="bg-gray-50 p-4 rounded border border-gray-200 font-mono text-sm space-y-1">
                          <div><span className="text-blue-600">nombre:</span> [Nombre del lead]</div>
                          <div><span className="text-blue-600">email:</span> [Email del lead]</div>
                          <div><span className="text-blue-600">telefono:</span> [Teléfono del lead]</div>
                          <div><span className="text-blue-600">origen:</span> zapier</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Paso 6 */}
                  <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                        6
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">Activar el Zap</h4>
                        <p className="text-gray-700">
                          Haz clic en "Publish" o "Publicar" para activar la integración
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="secondary" onClick={() => setCurrentStep(2)}>
                  ← Anterior
                </Button>
                <Button onClick={() => setCurrentStep(4)}>
                  Ya configuré, continuar →
                </Button>
              </div>
            </div>
          )}

          {/* Paso 4: Prueba y Activación */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-4xl">✅</span>
                Prueba y Activación
              </h2>

              <div className="space-y-6">
                <p className="text-gray-700 text-lg">
                  Envía un lead de prueba para verificar que la conexión funciona correctamente.
                </p>

                {/* Formulario de prueba */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg p-6">
                  <h3 className="font-bold text-green-900 mb-4 text-lg">
                    Formulario de Prueba
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nombre:
                      </label>
                      <input
                        type="text"
                        value={testLead.nombre}
                        onChange={(e) => setTestLead({ ...testLead, nombre: e.target.value })}
                        placeholder="Juan Pérez"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email:
                      </label>
                      <input
                        type="email"
                        value={testLead.email}
                        onChange={(e) => setTestLead({ ...testLead, email: e.target.value })}
                        placeholder="juan@ejemplo.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Teléfono:
                      </label>
                      <input
                        type="tel"
                        value={testLead.telefono}
                        onChange={(e) => setTestLead({ ...testLead, telefono: e.target.value })}
                        placeholder="+56912345678"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <Button
                      onClick={handleTestLead}
                      disabled={testStatus === 'sending' || testStatus === 'checking'}
                      className="w-full"
                    >
                      {testStatus === 'sending' || testStatus === 'checking'
                        ? 'Probando conexión...'
                        : '🧪 Enviar Lead de Prueba'}
                    </Button>
                  </div>
                </div>

                {/* Mensaje de estado */}
                {testStatus !== 'idle' && (
                  <div
                    className={`border rounded-lg p-6 ${
                      testStatus === 'success'
                        ? 'bg-green-50 border-green-300'
                        : testStatus === 'error'
                        ? 'bg-red-50 border-red-300'
                        : 'bg-blue-50 border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {testStatus === 'sending' || testStatus === 'checking' ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                      ) : testStatus === 'success' ? (
                        <span className="text-3xl">✅</span>
                      ) : (
                        <span className="text-3xl">❌</span>
                      )}
                      <p
                        className={`font-semibold ${
                          testStatus === 'success'
                            ? 'text-green-900'
                            : testStatus === 'error'
                            ? 'text-red-900'
                            : 'text-blue-900'
                        }`}
                      >
                        {testMessage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Botón de activación */}
                <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
                  <h3 className="font-bold text-blue-900 mb-3 text-lg">
                    Activar Integración
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {testStatus === 'success'
                      ? 'La prueba fue exitosa. Puedes activar la integración ahora.'
                      : 'Puedes activar la integración sin realizar la prueba, pero se recomienda verificar primero.'}
                  </p>
                  <Button
                    onClick={handleActivateIntegration}
                    disabled={saving}
                    size="lg"
                    className="w-full"
                  >
                    {saving ? 'Activando...' : '✅ Activar Integración Zapier'}
                  </Button>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="secondary" onClick={() => setCurrentStep(3)}>
                  ← Anterior
                </Button>
                <Button variant="secondary" onClick={() => router.push('/crm/integraciones')}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </CRMLayout>
  )
}
