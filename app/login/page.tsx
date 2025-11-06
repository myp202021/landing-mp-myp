'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Admin login
      if (username === 'admin' && password === 'myp2025') {
        router.push('/crm')
        return
      }

      // Client login - verificar si el username es un UUID válido
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

      if (uuidRegex.test(username)) {
        // Verificar que el cliente existe
        const res = await fetch(`/api/crm/clientes?id=${username}`)
        const data = await res.json()

        if (res.ok && data.clientes && data.clientes.length > 0) {
          const cliente = data.clientes[0]

          // Verificar contraseña (por ahora, la contraseña es el nombre del cliente en minúsculas sin espacios)
          const expectedPassword = cliente.nombre.toLowerCase().replace(/\s+/g, '')

          if (password === expectedPassword) {
            router.push(`/cliente/${username}`)
            return
          }
        }
      }

      setError('Usuario o contraseña incorrectos')
    } catch (err) {
      console.error('Error en login:', err)
      setError('Error al iniciar sesión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Acceso Clientes</h1>
          <p className="text-gray-600">Muller y Pérez CRM</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="admin o UUID de cliente"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Admin:</span> usuario "admin" | contraseña "myp2025"
          </p>
          <p className="text-xs text-gray-500 mt-2">
            <span className="font-semibold">Clientes:</span> usar UUID + contraseña personalizada
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}
