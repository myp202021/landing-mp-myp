'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// Tipos
export type UserRole = 'admin' | 'cliente'

export interface User {
  username: string
  role: UserRole
  nombre: string
}

export interface UserCredentials extends User {
  password: string
}

// Usuarios hardcodeados (en producción esto debería estar en base de datos con hashing)
const USERS: UserCredentials[] = [
  {
    username: 'admin',
    password: 'MYP@admin2025!',
    role: 'admin',
    nombre: 'Administrador MYP'
  },
  {
    username: 'cliente1',
    password: 'Cliente@2025!',
    role: 'cliente',
    nombre: 'Cliente Demo'
  }
]

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

// Función para autenticar usuario
export function authenticateUser(username: string, password: string): AuthResponse {
  const userCred = USERS.find(u => u.username === username && u.password === password)

  if (userCred) {
    const { password: _, ...user } = userCred // Excluir password
    return {
      success: true,
      user
    }
  }

  return {
    success: false,
    error: 'Usuario o contraseña incorrectos'
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
  login: (username: string, password: string) => AuthResponse
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

  const login = (username: string, password: string): AuthResponse => {
    const response = authenticateUser(username, password)

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

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      permissions
    }}>
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
