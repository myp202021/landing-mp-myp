'use client'

import { useState, useEffect } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NuevaRespuestaPage() {
  const { isAuthenticated, user } = useSimpleAuth()
  const router = useRouter()

  const [nombre, setNombre] = useState('')
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [triggerTipo, setTriggerTipo] = useState('nuevo_lead')
  const [activa, setActiva] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sendingTest, setSendingTest] = useState(false)

  // Redirigir si no es cliente
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/crm/login')
    } else if (user?.role !== 'cliente') {
      router.push('/crm')
    }
  }, [isAuthenticated, user, router])

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('mensaje-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = mensaje
    const before = text.substring(0, start)
    const after = text.substring(end, text.length)

    setMensaje(before + variable + after)

    // Mover cursor después de la variable insertada
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + variable.length
      textarea.focus()
    }, 0)
  }

  const generarPreview = () => {
    let preview = mensaje
    preview = preview.replace(/{nombre}/g, 'Juan')
    preview = preview.replace(/{apellido}/g, 'Pérez')
    preview = preview.replace(/{email}/g, 'juan.perez@ejemplo.cl')
    preview = preview.replace(/{telefono}/g, '+56 9 1234 5678')
    preview = preview.replace(/{empresa}/g, 'Empresa Ejemplo S.A.')
    return preview
  }

  const enviarEmailTest = async () => {
    if (!asunto || !mensaje) {
      alert('Debes completar el asunto y el mensaje primero')
      return
    }

    if (!user?.username) return

    const emailUsuario = prompt('Ingresa el email donde quieres recibir la prueba:', user.username)
    if (!emailUsuario) return

    setSendingTest(true)
    try {
      const res = await fetch('/api/crm/emails/enviar-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailUsuario,
          nombre: user.nombre || 'Usuario',
          asunto,
          mensaje: generarPreview()
        })
      })

      if (res.ok) {
        alert('Email de prueba enviado correctamente. Revisa tu bandeja de entrada.')
      } else {
        const data = await res.json()
        alert(`Error al enviar email: ${data.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('Error enviando test:', error)
      alert('Error al enviar email de prueba')
    }
    setSendingTest(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.cliente_id) return

    setSaving(true)
    try {
      const res = await fetch('/api/crm/respuestas-automaticas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: user.cliente_id,
          nombre,
          asunto,
          mensaje,
          trigger_tipo: triggerTipo,
          activa
        })
      })

      if (res.ok) {
        alert('Respuesta automatica creada correctamente')
        router.push('/crm/cliente/respuestas-automaticas')
      } else {
        const data = await res.json()
        alert(`Error: ${data.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('Error creando respuesta:', error)
      alert('Error al crear respuesta automatica')
    }
    setSaving(false)
  }

  if (!isAuthenticated || user?.role !== 'cliente') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Nueva Respuesta Automatica</h1>
              <p className="text-blue-200 mt-1">Sistema de Gestion de Clientes · M&P Marketing y Performance</p>
            </div>
            <Link href="/crm/cliente/respuestas-automaticas">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Configuracion</h2>

                {/* Nombre */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de la Respuesta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Bienvenida a nuevos leads"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Un nombre descriptivo para identificar esta respuesta</p>
                </div>

                {/* Trigger */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cuando enviar <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={triggerTipo}
                    onChange={(e) => setTriggerTipo(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="nuevo_lead">Al recibir nuevo lead</option>
                    <option value="sin_contactar_24h">Lead sin contactar por 24 horas</option>
                    <option value="sin_contactar_48h">Lead sin contactar por 48 horas</option>
                  </select>
                </div>

                {/* Asunto */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Asunto del Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Gracias por contactarnos"
                    required
                  />
                </div>

                {/* Mensaje */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mensaje <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="mensaje-textarea"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={10}
                    placeholder="Escribe tu mensaje aqui. Usa las variables disponibles para personalizar."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Usa las variables de la derecha para personalizar el mensaje</p>
                </div>

                {/* Activa */}
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activa}
                      onChange={(e) => setActiva(e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Activar respuesta automatica</span>
                      <p className="text-xs text-gray-500">Los emails se enviaran automaticamente cuando se cumpla el trigger</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Crear Respuesta Automatica'}
                </button>
                <Link href="/crm/cliente/respuestas-automaticas" className="flex-shrink-0">
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                  >
                    Cancelar
                  </button>
                </Link>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Variables disponibles */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Variables Disponibles</h3>
              <p className="text-sm text-gray-600 mb-4">Haz clic para insertar en el mensaje</p>

              <div className="space-y-2">
                {[
                  { var: '{nombre}', desc: 'Nombre del lead' },
                  { var: '{apellido}', desc: 'Apellido del lead' },
                  { var: '{email}', desc: 'Email del lead' },
                  { var: '{telefono}', desc: 'Telefono del lead' },
                  { var: '{empresa}', desc: 'Empresa del lead' }
                ].map((item) => (
                  <button
                    key={item.var}
                    type="button"
                    onClick={() => insertVariable(item.var)}
                    className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition"
                  >
                    <code className="text-sm font-mono text-blue-700">{item.var}</code>
                    <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Asunto:</p>
                <p className="text-sm font-semibold text-gray-900 mb-4">{asunto || '(Sin asunto)'}</p>
                <p className="text-xs text-gray-500 mb-2">Mensaje:</p>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {generarPreview() || '(Sin mensaje)'}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Este preview muestra como se vera el email con datos de ejemplo
              </p>
            </div>

            {/* Enviar test */}
            <div className="bg-purple-50 rounded-xl shadow-md p-6 border border-purple-200">
              <h3 className="text-lg font-bold text-purple-900 mb-2">Probar Email</h3>
              <p className="text-sm text-purple-700 mb-4">
                Envia un email de prueba a tu correo para ver como se vera
              </p>
              <button
                type="button"
                onClick={enviarEmailTest}
                disabled={sendingTest || !asunto || !mensaje}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50"
              >
                {sendingTest ? 'Enviando...' : 'Enviar Email de Prueba'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
