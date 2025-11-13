'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// Tipos
export type UserRole = 'admin' | 'cliente'

export interface User {
  username: string
  role: UserRole
  nombre: string
  cliente_id?: string  // UUID del cliente para filtrar datos
  debe_cambiar_password?: boolean  // Flag para forzar cambio de contraseña
}

export interface UserCredentials extends User {
  password: string
}

// NOTA: Usuarios hardcodeados eliminados por seguridad
// Todos los usuarios ahora deben estar en la base de datos

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

// Función para autenticar usuario contra base de datos
export async function authenticateUser(username: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    if (response.ok) {
      const { user } = await response.json()
      return {
        success: true,
        user
      }
    }

    // Intentar obtener detalles del error
    let errorMessage = 'Usuario o contraseña incorrectos'
    try {
      const errorData = await response.json()
      if (errorData.error) errorMessage = errorData.error
    } catch {}

    return {
      success: false,
      error: errorMessage
    }
  } catch (error) {
    console.error('Error en autenticación:', error)
    return {
      success: false,
      error: 'Error de conexión. Intenta nuevamente.'
    }
  }
}

// Obtener permisos por rol
export function getUserPermissions(role: UserRole) {
  if (role === 'admin') {
    return {
      canViewLeads: true,
      canEditLeads: true,
      canDeleteLeads: true,
      canViewClientes: true,
      canEditClientes: true,
      canViewCotizaciones: true,
      canCreateCotizaciones: true,
      canEditCotizaciones: true,
      canDeleteCotizaciones: true,
      canViewPlantillas: true,
      canEditPlantillas: true,
      canViewDashboard: true,
      canExportPDF: true
    }
  }

  // Cliente tiene acceso limitado
  return {
    canViewLeads: false,
    canEditLeads: false,
    canDeleteLeads: false,
    canViewClientes: false,
    canEditClientes: false,
    canViewCotizaciones: true, // Solo sus cotizaciones
    canCreateCotizaciones: false,
    canEditCotizaciones: false,
    canDeleteCotizaciones: false,
    canViewPlantillas: false,
    canEditPlantillas: false,
    canViewDashboard: false,
    canExportPDF: true
  }
}

// Context para autenticación
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<AuthResponse>
  logout: () => void
  permissions: ReturnType<typeof getUserPermissions> | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider
export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('crm_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('crm_user')
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<AuthResponse> => {
    const response = await authenticateUser(username, password)

    if (response.success && response.user) {
      setUser(response.user)
      localStorage.setItem('crm_user', JSON.stringify(response.user))
    }

    return response
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('crm_user')
    router.push('/crm/login')
  }

  const permissions = user ? getUserPermissions(user.role) : null

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    permissions
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar autenticación
export function useSimpleAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within SimpleAuthProvider')
  }
  return context
}
