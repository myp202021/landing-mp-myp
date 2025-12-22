'use client'

import { useState, useEffect } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CRMLayout from '@/app/components/crm/CRMLayout'
import MetricCard from '@/app/components/crm/MetricCard'
import Button from '@/app/components/crm/Button'

interface Lead {
  id: number
  cliente_id: string
  nombre?: string
  email?: string
  telefono?: string
  empresa?: string
  nombre_empresa?: string
  fuente: string
  campana_nombre?: string
  ad_nombre?: string
  form_nombre?: string
  contactado: boolean
  fecha_contacto?: string
  vendido: boolean
  monto_vendido?: number
  razon_no_venta?: string
  observaciones?: string
  notas?: string
  fecha_ingreso: string
  prioridad?: boolean
  costo_publicidad?: number
}

export default function ClienteDashboard() {
  const { isAuthenticated, user } = useSimpleAuth()
  const router = useRouter()

  const [leads, setLeads] = useState<Lead[]>([])
  const [inversionMensual, setInversionMensual] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [leadHistorial, setLeadHistorial] = useState<any[]>([])
  const [loadingHistorial, setLoadingHistorial] = useState(false)

  // Modal para agregar lead manual
  const [showAgregarLeadModal, setShowAgregarLeadModal] = useState(false)
  const [nuevoLead, setNuevoLead] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    fuente: 'email', // default
    observaciones: ''
  })

  // Estados para filtros de fecha
  const [fechaDesde, setFechaDesde] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  const [fechaHasta, setFechaHasta] = useState<Date>(new Date())
  const [filtrosAplicados, setFiltrosAplicados] = useState(false)

  // Redirigir si no es cliente Y VERIFICAR DATOS ACTUALIZADOS
  useEffect(() => {
    async function checkAndLoadData() {
      if (!isAuthenticated) {
        router.push('/crm/login')
        return
      }

      if (user?.role !== 'cliente') {
        router.push('/crm')
        return
      }

      // SIEMPRE refrescar datos desde Supabase al cargar el dashboard
      console.log('🔄 Verificando datos actualizados del usuario desde Supabase...')

      try {
        const response = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user.username })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            // Actualizar localStorage con datos frescos
            const updatedUser = data.user
            localStorage.setItem('crm_user', JSON.stringify(updatedUser))
            console.log('✅ Sesión actualizada:', updatedUser)

            // Verificar si tiene cliente_id después de actualizar
            if (!updatedUser.cliente_id) {
              console.error('❌ Usuario no tiene cliente_id asignado')
              alert('⚠️ Tu cuenta no tiene un cliente asignado. Contacta al administrador.')
              router.push('/crm/login')
              return
            }

            // Si el cliente_id cambió, recargar la página para que use los datos nuevos
            if (user.cliente_id !== updatedUser.cliente_id) {
              console.log('🔄 cliente_id actualizado, recargando página...')
              window.location.reload()
              return
            }
          }
        } else {
          console.warn('⚠️ No se pudo refrescar la sesión, continuando con datos locales')
        }
      } catch (error) {
        console.error('Error refrescando sesión:', error)
      }

      // Verificar cliente_id antes de cargar datos
      if (!user?.cliente_id) {
        console.error('❌ Usuario sin cliente_id')
        alert('⚠️ Tu cuenta no tiene un cliente asignado. Contacta al administrador.')
        router.push('/crm/login')
        return
      }

      loadData()
    }

    checkAndLoadData()
  }, [isAuthenticated, user, router])

  const loadData = async () => {
    setLoading(true)
    try {
      // Filtrar leads por cliente_id del usuario
      if (!user?.cliente_id) {
        console.error('❌ No se puede cargar leads: cliente_id es null')
        setLoading(false)
        return
      }

      let url = `/api/crm/leads?limit=500&cliente_id=${user.cliente_id}`

      const resLeads = await fetch(url)
      const dataLeads = await resLeads.json()

      setLeads(dataLeads.leads || [])

      // Cargar inversión mensual del cliente
      if (user?.cliente_id) {
        const resCliente = await fetch(`/api/crm/clientes?id=${user.cliente_id}`)
        const dataCliente = await resCliente.json()
        if (dataCliente.cliente?.inversion_mensual) {
          setInversionMensual(Number(dataCliente.cliente.inversion_mensual))
        }
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
    setLoading(false)
  }

  // Función para calcular horas desde ingreso
  const getHorasSinContacto = (lead: Lead): number => {
    if (lead.contactado) return 0
    const fechaIngreso = new Date(lead.fecha_ingreso)
    const ahora = new Date()
    const diff = ahora.getTime() - fechaIngreso.getTime()
    return Math.floor(diff / (1000 * 60 * 60)) // horas
  }

  // Función para obtener color del semáforo
  const getSemaforoColor = (horas: number): string => {
    if (horas === 0) return 'bg-gray-400' // Contactado
    if (horas < 24) return 'bg-green-500' // Verde: menos de 24h
    if (horas < 48) return 'bg-yellow-500' // Amarillo: 24-48h
    return 'bg-red-500' // Rojo: más de 48h
  }

  // Función para obtener texto del semáforo
  const getSemaforoTexto = (horas: number): string => {
    if (horas === 0) return 'Ya contactado'
    if (horas < 24) return `${horas}h`
    const dias = Math.floor(horas / 24)
    const horasRestantes = horas % 24
    return `${dias}d ${horasRestantes}h`
  }

  const loadLeadHistorial = async (leadId: number) => {
    setLoadingHistorial(true)
    try {
      const res = await fetch(`/api/crm/leads/historial?lead_id=${leadId}`)
      const data = await res.json()
      setLeadHistorial(data.historial || [])
    } catch (error) {
      console.error('Error cargando historial:', error)
      setLeadHistorial([])
    }
    setLoadingHistorial(false)
  }

  const updateLead = async (leadId: number, updates: any) => {
    try {
      // Obtener lead actual para comparar cambios
      const leadActual = editingLead

      const res = await fetch('/api/crm/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, ...updates })
      })

      if (res.ok) {
        // Registrar cambios en historial
        const cambios = []
        if (leadActual) {
          if (updates.contactado !== undefined && updates.contactado !== leadActual.contactado) {
            cambios.push({
              campo: 'contactado',
              antes: leadActual.contactado ? 'Sí' : 'No',
              despues: updates.contactado ? 'Sí' : 'No'
            })
          }
          if (updates.vendido !== undefined && updates.vendido !== leadActual.vendido) {
            cambios.push({
              campo: 'vendido',
              antes: leadActual.vendido ? 'Sí' : 'No',
              despues: updates.vendido ? 'Sí' : 'No'
            })
          }
          if (updates.monto_vendido !== undefined && updates.monto_vendido !== leadActual.monto_vendido) {
            cambios.push({
              campo: 'monto_vendido',
              antes: leadActual.monto_vendido || 0,
              despues: updates.monto_vendido || 0
            })
          }
        }

        // Guardar en historial (no esperar respuesta, continuar aunque falle)
        if (cambios.length > 0) {
          fetch('/api/crm/leads/historial', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lead_id: leadId,
              usuario: user?.nombre || 'Cliente',
              accion: 'actualizar',
              descripcion: `Cambios: ${cambios.map(c => `${c.campo} (${c.antes} → ${c.despues})`).join(', ')}`
            })
          }).catch(err => console.error('Error guardando historial:', err))
        }

        await loadData()
        setEditingLead(null)
        alert('Lead actualizado exitosamente')
      }
    } catch (error) {
      console.error('Error actualizando lead:', error)
      alert('Error actualizando lead')
    }
  }

  const crearLeadManual = async () => {
    // Validar que el usuario tenga cliente_id
    if (!user?.cliente_id) {
      alert('⚠️ Error: No tienes un cliente asignado. Contacta al administrador.')
      return
    }

    // Validar campos requeridos
    if (!nuevoLead.nombre && !nuevoLead.email && !nuevoLead.telefono) {
      alert('Debes proporcionar al menos nombre, email o teléfono')
      return
    }

    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...nuevoLead,
          cliente_id: user.cliente_id // Asignar automáticamente el cliente_id del usuario
        })
      })

      const data = await res.json()

      if (res.ok) {
        alert(`✅ Lead creado exitosamente desde ${nuevoLead.fuente}`)
        setShowAgregarLeadModal(false)
        // Resetear formulario
        setNuevoLead({
          nombre: '',
          email: '',
          telefono: '',
          empresa: '',
          fuente: 'email',
          observaciones: ''
        })

        // Registrar en historial
        if (data.lead?.id) {
          fetch('/api/crm/leads/historial', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lead_id: data.lead.id,
              usuario: user?.nombre || 'Cliente',
              accion: 'crear',
              descripcion: `Lead creado manualmente desde ${nuevoLead.fuente}`
            })
          }).catch(err => console.error('Error guardando historial:', err))
        }

        await loadData()
      } else {
        alert(`❌ Error creando lead: ${data.error}`)
      }
    } catch (error) {
      console.error('Error creando lead:', error)
      alert('❌ Error creando lead')
    }
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

  if (loading) {
    return (
      <CRMLayout title="Dashboard Cliente" authenticated onRefresh={loadData}>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      </CRMLayout>
    )
  }

  // Aplicar filtros de fecha a los leads
  const aplicarFiltros = () => {
    setFiltrosAplicados(true)
  }

  const limpiarFiltros = () => {
    setFechaDesde(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    setFechaHasta(new Date())
    setFiltrosAplicados(false)
  }

  // Filtrar leads por fecha si los filtros están aplicados
  const leadsFiltrados = filtrosAplicados
    ? leads.filter(lead => {
        const fechaLead = new Date(lead.fecha_ingreso)
        return fechaLead >= fechaDesde && fechaLead <= fechaHasta
      })
    : leads

  // Calcular métricas con leads filtrados
  const totalLeads = leadsFiltrados.length
  const leadsContactados = leadsFiltrados.filter(l => l.contactado).length
  const leadsVendidos = leadsFiltrados.filter(l => l.vendido).length
  const totalVendido = leadsFiltrados.filter(l => l.monto_vendido).reduce((sum, l) => sum + Number(l.monto_vendido || 0), 0)
  const tasaConversion = totalLeads > 0 ? ((leadsVendidos / totalLeads) * 100).toFixed(1) : '0'

  // CPF (Costo Por Formulario) = Inversión / N° Leads
  const cpf = (inversionMensual > 0 && totalLeads > 0)
    ? Math.round(inversionMensual / totalLeads)
    : 0

  // ROAS (Return on Ad Spend) = Ventas / Inversión
  const roas = inversionMensual > 0 ? (totalVendido / inversionMensual).toFixed(2) : '0.00'

  // ROA (Return on Advertising) = ((Ventas - Inversión) / Inversión) * 100
  const roa = inversionMensual > 0
    ? (((totalVendido - inversionMensual) / inversionMensual) * 100).toFixed(1)
    : '0.0'

  // Ordenar leads filtrados por prioridad y fecha
  const sortedLeads = [...leadsFiltrados].sort((a, b) => {
    // Primero por prioridad (prioritarios arriba)
    if (a.prioridad && !b.prioridad) return -1
    if (!a.prioridad && b.prioridad) return 1
    // Luego por fecha (más recientes primero)
    return new Date(b.fecha_ingreso).getTime() - new Date(a.fecha_ingreso).getTime()
  })

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <CRMLayout title="Dashboard Cliente - Muller y Perez" authenticated onRefresh={loadData}>
      {/* Bienvenida */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user.nombre}
        </h2>
        <p className="text-gray-600 mt-2">
          Aquí puedes ver y gestionar tus leads de marketing
        </p>
      </div>

      {/* Filtros de Fecha */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-6 mb-8 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-purple-900">
            Filtros de Fecha para Métricas
          </h3>
          {filtrosAplicados && (
            <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
              Filtros Activos
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Fecha Desde
            </label>
            <input
              type="date"
              value={formatDateForInput(fechaDesde)}
              onChange={(e) => setFechaDesde(new Date(e.target.value))}
              className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={formatDateForInput(fechaHasta)}
              onChange={(e) => setFechaHasta(new Date(e.target.value))}
              className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={aplicarFiltros}
              className="w-full px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition font-semibold shadow-md"
            >
              Aplicar Filtros
            </button>
          </div>
          <div className="flex items-end">
            <button
              onClick={limpiarFiltros}
              className="w-full px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition font-semibold shadow-md"
            >
              Limpiar
            </button>
          </div>
        </div>
        <p className="text-xs text-purple-800 mt-3 font-medium">
          {filtrosAplicados
            ? `Mostrando métricas desde ${fechaDesde.toLocaleDateString('es-CL')} hasta ${fechaHasta.toLocaleDateString('es-CL')}`
            : 'Por defecto: últimos 30 días. Aplica filtros para personalizar el rango de fechas.'}
        </p>
      </div>

      {/* Inversión Mensual */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-orange-900 mb-2">
              💰 Inversión Mensual en Publicidad
            </label>
            <p className="text-xs text-orange-700 mb-3">
              Esta inversión se usa para calcular CPF, ROAS y ROA. Actualízala mensualmente.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">$</span>
              <input
                type="number"
                value={inversionMensual}
                onChange={(e) => setInversionMensual(parseFloat(e.target.value) || 0)}
                className="px-4 py-2 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 font-semibold w-48"
                placeholder="0"
                min="0"
              />
              <button
                onClick={async () => {
                  if (!user?.cliente_id) return
                  try {
                    const res = await fetch('/api/crm/clientes', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        id: user.cliente_id,
                        inversion_mensual: inversionMensual
                      })
                    })
                    if (res.ok) {
                      alert('✅ Inversión mensual actualizada')
                      loadData()
                    } else {
                      alert('❌ Error actualizando inversión')
                    }
                  } catch (error) {
                    console.error('Error:', error)
                    alert('❌ Error actualizando inversión')
                  }
                }}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-md"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-8">
        <MetricCard
          title="Total Leads"
          value={totalLeads}
          icon="📊"
          color="blue"
        />
        <MetricCard
          title="Contactados"
          value={leadsContactados}
          subtitle={`${totalLeads > 0 ? ((leadsContactados / totalLeads) * 100).toFixed(1) : 0}%`}
          icon="📞"
          color="blue"
        />
        <MetricCard
          title="Vendidos"
          value={leadsVendidos}
          subtitle={`${tasaConversion}% conversión`}
          icon="✅"
          color="green"
        />
        <MetricCard
          title="Total Vendido"
          value={`$${totalVendido.toLocaleString('es-CL')}`}
          icon="💰"
          color="green"
        />
        <MetricCard
          title="CPF"
          value={`$${cpf.toLocaleString('es-CL')}`}
          subtitle="Costo por lead"
          icon="💵"
          color="orange"
        />
        <MetricCard
          title="ROAS"
          value={`${roas}x`}
          subtitle={`Inversión: $${inversionMensual.toLocaleString('es-CL')}`}
          icon="📈"
          color="purple"
        />
        <MetricCard
          title="ROA"
          value={`${roa}%`}
          subtitle="Retorno de inversión"
          icon="📊"
          color="green"
        />
      </div>

      {/* Tabla de Leads */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="bg-blue-900 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Mis Leads</h3>
          <div className="flex gap-2">
            {/* Botón Exportar CSV */}
            <button
              onClick={() => {
                const csvContent = [
                  ['Fecha', 'Nombre', 'Email', 'Teléfono', 'Empresa', 'Fuente', 'Estado', 'Monto Vendido', 'Observaciones'].join(','),
                  ...sortedLeads.map(lead => [
                    new Date(lead.fecha_ingreso).toLocaleDateString('es-CL'),
                    `"${(lead.nombre || '').replace(/"/g, '""')}"`,
                    lead.email || '',
                    lead.telefono || '',
                    `"${(lead.nombre_empresa || lead.empresa || '').replace(/"/g, '""')}"`,
                    lead.fuente || '',
                    lead.vendido ? 'Vendido' : lead.contactado ? 'Contactado' : 'Nuevo',
                    lead.monto_vendido || '',
                    `"${(lead.observaciones || '').replace(/"/g, '""')}"`
                  ].join(','))
                ].join('\n')

                const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`
                link.click()
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm flex items-center gap-2 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              CSV
            </button>

            {/* Botón Exportar vCard (Contactos) */}
            <button
              onClick={() => {
                const vcards = sortedLeads
                  .filter(lead => lead.telefono || lead.email)
                  .map(lead => {
                    let tel = (lead.telefono || '').replace(/\s/g, '').replace(/-/g, '')
                    if (tel && !tel.startsWith('+')) {
                      tel = tel.startsWith('56') ? '+' + tel : '+56' + tel
                    }

                    const lines = [
                      'BEGIN:VCARD',
                      'VERSION:3.0',
                      `FN:${lead.nombre || lead.nombre_empresa || lead.empresa || 'Lead'}`,
                    ]

                    if (lead.nombre_empresa || lead.empresa) {
                      lines.push(`ORG:${lead.nombre_empresa || lead.empresa}`)
                    }
                    if (tel) {
                      lines.push(`TEL;TYPE=WORK:${tel}`)
                    }
                    if (lead.email) {
                      lines.push(`EMAIL;TYPE=WORK:${lead.email}`)
                    }

                    const notas = []
                    if (lead.fuente) notas.push(`Fuente: ${lead.fuente}`)
                    if (lead.observaciones) notas.push(lead.observaciones)
                    if (notas.length > 0) {
                      lines.push(`NOTE:${notas.join(' | ')}`)
                    }

                    lines.push('END:VCARD')
                    return lines.join('\n')
                  })

                if (vcards.length === 0) {
                  alert('No hay leads con teléfono o email para exportar')
                  return
                }

                const blob = new Blob([vcards.join('\n')], { type: 'text/vcard;charset=utf-8' })
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `contactos_leads_${new Date().toISOString().split('T')[0]}.vcf`
                link.click()

                alert(`Se exportaron ${vcards.length} contactos. Abre el archivo .vcf para importarlos a tus contactos.`)
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm flex items-center gap-2 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Contactos
            </button>

            <Button
              onClick={() => setShowAgregarLeadModal(true)}
              variant="primary"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              + Agregar Lead
            </Button>
          </div>
        </div>

        {sortedLeads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes leads
            </h3>
            <p className="text-gray-600">
              Aún no se han recibido leads para tu cuenta
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Fuente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">
                    Tiempo sin contacto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedLeads.map(lead => (
                  <tr
                    key={lead.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      lead.prioridad ? 'bg-yellow-50 border-l-4 border-l-yellow-500' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(lead.fecha_ingreso).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{lead.nombre || 'Sin nombre'}</div>
                      <div className="text-sm text-gray-600">{lead.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.nombre_empresa || lead.empresa || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.telefono || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {lead.fuente}<br/>
                      <span className="text-xs text-gray-500">{lead.ad_nombre || lead.form_nombre}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const horas = getHorasSinContacto(lead)
                        return (
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getSemaforoColor(horas)} animate-pulse`} />
                            <span className="text-sm font-medium text-gray-700">{getSemaforoTexto(horas)}</span>
                          </div>
                        )
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.vendido ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">
                          Vendido
                        </span>
                      ) : lead.contactado ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                          Contactado
                        </span>
                      ) : lead.razon_no_venta ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 border border-red-300">
                          Negativo
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                          Nuevo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lead.monto_vendido ? `$${Number(lead.monto_vendido).toLocaleString('es-CL')}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setEditingLead(lead)
                          loadLeadHistorial(lead.id)
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Editar
                      </button>
                      <Link
                        href={`/crm/cotizaciones/nueva?lead_id=${lead.id}&cliente_id=${lead.cliente_id}`}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        Cotizar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de edición de lead */}
      {editingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">Editar Lead</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Contactado
                  </label>
                  <select
                    value={editingLead.contactado ? 'true' : 'false'}
                    onChange={(e) => setEditingLead({...editingLead, contactado: e.target.value === 'true'})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Vendido
                  </label>
                  <select
                    value={editingLead.vendido ? 'true' : 'false'}
                    onChange={(e) => setEditingLead({...editingLead, vendido: e.target.value === 'true'})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </div>
              </div>

              {editingLead.vendido && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Monto Vendido (CLP)
                  </label>
                  <input
                    type="number"
                    value={editingLead.monto_vendido || ''}
                    onChange={(e) => setEditingLead({...editingLead, monto_vendido: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Ej: 1500000"
                  />
                </div>
              )}

              {!editingLead.vendido && editingLead.contactado && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Razón de no venta
                  </label>
                  <input
                    type="text"
                    value={editingLead.razon_no_venta || ''}
                    onChange={(e) => setEditingLead({...editingLead, razon_no_venta: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Ej: Precio muy alto, no está interesado, etc."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={editingLead.observaciones || ''}
                  onChange={(e) => setEditingLead({...editingLead, observaciones: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                  rows={2}
                  placeholder="Observaciones generales..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notas Detalladas
                </label>
                <textarea
                  value={editingLead.notas || ''}
                  onChange={(e) => setEditingLead({...editingLead, notas: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                  rows={4}
                  placeholder="Detalles de la conversación, seguimientos, próximos pasos..."
                />
              </div>

              {/* Historial del Lead */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">📋 Historial de Cambios</h3>
                {loadingHistorial ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : leadHistorial.length === 0 ? (
                  <div className="text-center py-4 text-slate-500 text-sm">
                    No hay historial de cambios para este lead
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 uppercase">Fecha</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 uppercase">Usuario</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 uppercase">Cambio</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {leadHistorial.map((item, index) => (
                          <tr key={index} className="text-sm">
                            <td className="px-3 py-2 text-slate-600">
                              {new Date(item.created_at).toLocaleString('es-CL')}
                            </td>
                            <td className="px-3 py-2 text-slate-700 font-medium">{item.usuario}</td>
                            <td className="px-3 py-2 text-slate-600">{item.descripcion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={() => setEditingLead(null)}
                  variant="secondary"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => updateLead(editingLead.id, {
                    contactado: editingLead.contactado,
                    vendido: editingLead.vendido,
                    monto_vendido: editingLead.monto_vendido || null,
                    razon_no_venta: editingLead.razon_no_venta || null,
                    observaciones: editingLead.observaciones || null,
                    notas: editingLead.notas || null
                  })}
                  variant="primary"
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar Lead Manual */}
      {showAgregarLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="bg-gradient-to-r from-green-900 to-green-800 text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">Agregar Lead Manual</h2>
              <p className="text-green-200 text-sm mt-1">
                Agrega leads desde Email, WhatsApp u otras fuentes
              </p>
            </div>
            <div className="p-6 space-y-4">
              {/* Fuente */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fuente del Lead *
                </label>
                <select
                  value={nuevoLead.fuente}
                  onChange={(e) => setNuevoLead({...nuevoLead, fuente: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="email">📧 Email</option>
                  <option value="whatsapp">💬 WhatsApp</option>
                  <option value="meta">📱 Meta (Facebook/Instagram)</option>
                  <option value="zapier">⚡ Zapier</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={nuevoLead.nombre}
                    onChange={(e) => setNuevoLead({...nuevoLead, nombre: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="Nombre del contacto"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={nuevoLead.email}
                    onChange={(e) => setNuevoLead({...nuevoLead, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="email@ejemplo.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Telefono */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={nuevoLead.telefono}
                    onChange={(e) => setNuevoLead({...nuevoLead, telefono: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                {/* Empresa */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={nuevoLead.empresa}
                    onChange={(e) => setNuevoLead({...nuevoLead, empresa: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="Nombre de la empresa"
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={nuevoLead.observaciones}
                  onChange={(e) => setNuevoLead({...nuevoLead, observaciones: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Notas adicionales sobre este lead..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Debes proporcionar al menos uno de los siguientes: nombre, email o teléfono.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={() => {
                    setShowAgregarLeadModal(false)
                    setNuevoLead({
                      nombre: '',
                      email: '',
                      telefono: '',
                      empresa: '',
                      fuente: 'email',
                      observaciones: ''
                    })
                  }}
                  variant="secondary"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={crearLeadManual}
                  variant="primary"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Crear Lead
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información de contacto */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-2">
          ¿Necesitas ayuda?
        </h4>
        <p className="text-blue-800">
          Contacta a tu ejecutivo de cuenta o escríbenos a <a href="mailto:contacto@mulleryperez.cl" className="underline font-medium">contacto@mulleryperez.cl</a>
        </p>
      </div>
    </CRMLayout>
  )
}
