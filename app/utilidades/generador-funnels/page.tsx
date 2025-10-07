'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Workflow, ArrowRight, Download, Copy, RefreshCw, CheckCircle2 } from 'lucide-react'
import { createSoftwareAppSchema, addCanonicalLink, createBreadcrumbSchema } from '@/lib/metadata'

interface FunnelStage {
  etapa: string
  descripcion: string
  campos_requeridos: string
}

interface FunnelTemplate {
  nombre: string
  descripcion: string
  etapas: FunnelStage[]
}

const funnelTemplates: { [key: string]: FunnelTemplate } = {
  b2b_high_quotes: {
    nombre: "Funnel B2B - Alto Ticket con Cotizaciones",
    descripcion: "Proceso largo de cotización y seguimiento para proyectos B2B de alto valor con múltiples puntos de contacto.",
    etapas: [
      { etapa: "Lead", descripcion: "Contacto inicial desde formulario web, llamada o referido", campos_requeridos: "Nombre, Email, Teléfono, Empresa, Cargo" },
      { etapa: "Calificado", descripcion: "Lead validado con presupuesto y necesidad real", campos_requeridos: "Presupuesto estimado, Fecha inicio proyecto, Necesidad específica" },
      { etapa: "Reunión Agendada", descripcion: "Primera reunión comercial confirmada", campos_requeridos: "Fecha reunión, Participantes, Agenda" },
      { etapa: "Reunión Realizada", descripcion: "Reunión ejecutada, se levantaron requerimientos", campos_requeridos: "Notas reunión, Requerimientos clave, Próximos pasos" },
      { etapa: "Cotización Enviada", descripcion: "Propuesta económica y técnica enviada al cliente", campos_requeridos: "Monto cotización, Fecha envío, Vigencia cotización" },
      { etapa: "Negociación", descripcion: "Cliente solicita ajustes, se negocia precio o condiciones", campos_requeridos: "Objeciones, Contrapropuesta, Descuentos aplicados" },
      { etapa: "Cerrado-Ganado", descripcion: "Cliente acepta cotización y firma contrato", campos_requeridos: "Monto final, Fecha firma contrato, Forma de pago" },
      { etapa: "Cerrado-Perdido", descripcion: "Cliente rechaza o elige competencia", campos_requeridos: "Motivo pérdida, Competidor ganador, Aprendizaje" }
    ]
  },
  b2b_medium_visits: {
    nombre: "Funnel B2B - Visitas y Demostraciones",
    descripcion: "Ciclo medio de venta B2B con visitas técnicas o demos de producto/servicio.",
    etapas: [
      { etapa: "Lead", descripcion: "Contacto inicial", campos_requeridos: "Nombre, Email, Teléfono, Empresa" },
      { etapa: "Contactado", descripcion: "Primer contacto telefónico o por email exitoso", campos_requeridos: "Fecha contacto, Canal, Respuesta del lead" },
      { etapa: "Visita Agendada", descripcion: "Visita técnica o demo programada", campos_requeridos: "Fecha visita, Dirección, Participantes" },
      { etapa: "Visita Realizada", descripcion: "Se ejecutó visita o demostración", campos_requeridos: "Feedback cliente, Interés mostrado, Objeciones" },
      { etapa: "Propuesta Enviada", descripcion: "Se envía propuesta comercial", campos_requeridos: "Monto propuesta, Condiciones, Vigencia" },
      { etapa: "Cerrado-Ganado", descripcion: "Cliente acepta propuesta", campos_requeridos: "Monto final, Forma de pago, Fecha inicio" },
      { etapa: "Cerrado-Perdido", descripcion: "Oportunidad perdida", campos_requeridos: "Motivo rechazo, Competencia, Lección aprendida" }
    ]
  },
  b2b_low_whatsapp: {
    nombre: "Funnel B2B - Bajo Ticket por WhatsApp",
    descripcion: "Ciclo rápido B2B para servicios de bajo monto, principalmente por WhatsApp.",
    etapas: [
      { etapa: "Lead", descripcion: "Contacto inicial por WhatsApp, formulario o redes", campos_requeridos: "Nombre, Teléfono, Empresa" },
      { etapa: "Conversación Iniciada", descripcion: "Cliente responde y muestra interés", campos_requeridos: "Necesidad expresada, Urgencia" },
      { etapa: "Cotización Enviada", descripcion: "Se envía cotización por WhatsApp o email", campos_requeridos: "Monto, Condiciones, Plazo entrega" },
      { etapa: "Cerrado-Ganado", descripcion: "Cliente acepta y paga", campos_requeridos: "Monto pagado, Método pago, Fecha entrega" },
      { etapa: "Cerrado-Perdido", descripcion: "Cliente no responde o rechaza", campos_requeridos: "Motivo, Seguimiento futuro" }
    ]
  },
  b2c_high_visits: {
    nombre: "Funnel B2C - Alto Ticket con Visitas",
    descripcion: "Venta B2C de alto valor que requiere visitas (ej: seguros, inmobiliaria, educación).",
    etapas: [
      { etapa: "Lead", descripcion: "Contacto inicial desde anuncio o formulario", campos_requeridos: "Nombre, Email, Teléfono, Interés" },
      { etapa: "Calificado", descripcion: "Se valida capacidad de compra y necesidad", campos_requeridos: "Presupuesto, Urgencia, Perfil cliente" },
      { etapa: "Visita Agendada", descripcion: "Se programa reunión o visita presencial", campos_requeridos: "Fecha, Lugar, Tipo visita" },
      { etapa: "Visita Realizada", descripcion: "Se ejecuta reunión/visita", campos_requeridos: "Feedback, Nivel interés, Próximos pasos" },
      { etapa: "Propuesta Enviada", descripcion: "Se envía oferta personalizada", campos_requeridos: "Monto, Condiciones pago, Beneficios" },
      { etapa: "Cerrado-Ganado", descripcion: "Cliente compra", campos_requeridos: "Monto venta, Forma pago, Fecha entrega/inicio" },
      { etapa: "Cerrado-Perdido", descripcion: "Cliente no compra", campos_requeridos: "Motivo, Objeción principal, Retomar en futuro" }
    ]
  },
  b2c_medium_whatsapp: {
    nombre: "Funnel B2C - Ticket Medio por WhatsApp",
    descripcion: "Venta B2C de ticket medio principalmente por WhatsApp (ej: reparaciones, servicios profesionales).",
    etapas: [
      { etapa: "Lead", descripcion: "Contacto inicial", campos_requeridos: "Nombre, Teléfono, Necesidad" },
      { etapa: "Conversación Activa", descripcion: "Cliente responde, se asesora por WhatsApp", campos_requeridos: "Detalles necesidad, Presupuesto aproximado" },
      { etapa: "Cotización Enviada", descripcion: "Se envía cotización", campos_requeridos: "Monto, Plazo, Condiciones" },
      { etapa: "Seguimiento", descripcion: "Cliente pide más información o tiempo para decidir", campos_requeridos: "Dudas, Objeciones, Fecha re-contacto" },
      { etapa: "Cerrado-Ganado", descripcion: "Cliente acepta y agenda/paga", campos_requeridos: "Monto, Fecha servicio, Método pago" },
      { etapa: "Cerrado-Perdido", descripcion: "Cliente no avanza", campos_requeridos: "Motivo, Competencia, Seguimiento" }
    ]
  },
  b2c_low_ecommerce: {
    nombre: "Funnel B2C - Bajo Ticket E-commerce",
    descripcion: "Venta digital rápida, compra online directa (ej: retail, productos digitales).",
    etapas: [
      { etapa: "Visitante Web", descripcion: "Usuario llega al sitio/tienda online", campos_requeridos: "Fuente tráfico, Página entrada" },
      { etapa: "Producto Visto", descripcion: "Usuario ve detalle de producto", campos_requeridos: "Producto visto, Tiempo en página" },
      { etapa: "Agregado al Carro", descripcion: "Usuario agrega producto al carrito", campos_requeridos: "Producto, Cantidad, Valor" },
      { etapa: "Checkout Iniciado", descripcion: "Usuario inicia proceso de pago", campos_requeridos: "Email, Método pago seleccionado" },
      { etapa: "Compra Realizada", descripcion: "Pago exitoso", campos_requeridos: "Monto, Método pago, Número orden" },
      { etapa: "Abandonado", descripcion: "Usuario abandona sin comprar", campos_requeridos: "Etapa abandono, Motivo posible, Remarketing" }
    ]
  },
  b2b_medium_ecommerce: {
    nombre: "Funnel B2B - E-commerce Mayorista",
    descripcion: "Venta B2B online para distribuidores, mayoristas o compras corporativas recurrentes.",
    etapas: [
      { etapa: "Registro Corporativo", descripcion: "Empresa se registra en plataforma B2B", campos_requeridos: "Razón social, RUT, Email corporativo, Giro" },
      { etapa: "Cuenta Aprobada", descripcion: "Se valida empresa y activa cuenta", campos_requeridos: "Fecha aprobación, Línea crédito, Condiciones pago" },
      { etapa: "Primera Orden", descripcion: "Cliente hace primer pedido online", campos_requeridos: "Productos, Monto orden, Método pago" },
      { etapa: "Orden Procesada", descripcion: "Pedido despachado o en preparación", campos_requeridos: "Número orden, Fecha despacho, Tracking" },
      { etapa: "Cliente Recurrente", descripcion: "Cliente hace más de 3 compras", campos_requeridos: "Total compras, Frecuencia, Ticket promedio" },
      { etapa: "Inactivo", descripcion: "Cliente no compra hace 60+ días", campos_requeridos: "Última compra, Motivo inactividad, Plan reactivación" }
    ]
  },
  b2c_high_quotes: {
    nombre: "Funnel B2C - Alto Ticket con Cotización",
    descripcion: "Venta B2C de alto valor con cotización personalizada (ej: remodelaciones, eventos, vehículos).",
    etapas: [
      { etapa: "Lead", descripcion: "Cliente solicita cotización", campos_requeridos: "Nombre, Email, Teléfono, Tipo proyecto" },
      { etapa: "Levantamiento", descripcion: "Se recopila información detallada del proyecto", campos_requeridos: "Detalles proyecto, Presupuesto, Plazo esperado" },
      { etapa: "Cotización Enviada", descripcion: "Se envía propuesta detallada", campos_requeridos: "Monto, Incluye, Plazo ejecución, Vigencia" },
      { etapa: "Seguimiento", descripcion: "Cliente evalúa, se responden dudas", campos_requeridos: "Dudas cliente, Ajustes solicitados, Competencia" },
      { etapa: "Negociación", descripcion: "Se ajusta propuesta", campos_requeridos: "Descuentos, Condiciones nuevas, Monto final propuesto" },
      { etapa: "Cerrado-Ganado", descripcion: "Cliente acepta y firma/paga", campos_requeridos: "Monto final, Anticipo, Fecha inicio" },
      { etapa: "Cerrado-Perdido", descripcion: "Cliente no avanza", campos_requeridos: "Motivo, Feedback, Recontacto futuro" }
    ]
  },
  default: {
    nombre: "Funnel Genérico Multicanal",
    descripcion: "Funnel estándar adaptable a diversos modelos de negocio y canales de venta.",
    etapas: [
      { etapa: "Lead", descripcion: "Contacto inicial desde cualquier canal", campos_requeridos: "Nombre, Email/Teléfono, Fuente" },
      { etapa: "Contactado", descripcion: "Primer contacto exitoso", campos_requeridos: "Fecha contacto, Canal, Interés" },
      { etapa: "Calificado", descripcion: "Se valida ajuste producto-cliente", campos_requeridos: "Necesidad, Presupuesto, Decisor" },
      { etapa: "Propuesta", descripcion: "Se presenta solución/oferta", campos_requeridos: "Tipo propuesta, Monto, Condiciones" },
      { etapa: "Negociación", descripcion: "Se trabajan objeciones", campos_requeridos: "Objeciones, Ajustes, Compromiso" },
      { etapa: "Cerrado-Ganado", descripcion: "Venta concretada", campos_requeridos: "Monto, Fecha cierre, Método pago" },
      { etapa: "Cerrado-Perdido", descripcion: "Oportunidad perdida", campos_requeridos: "Motivo, Aprendizaje, Seguimiento" }
    ]
  }
}

export default function GeneradorFunnels() {
  useEffect(() => {
    document.title = 'Generador de Funnels CRM - Crea tu Embudo de Ventas | M&P'

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Genera funnels de ventas personalizados para tu CRM en 4 pasos. B2B, B2C, e-commerce, WhatsApp, cotizaciones. Exporta en CSV. Herramienta gratuita.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Genera funnels de ventas personalizados para tu CRM en 4 pasos. B2B, B2C, e-commerce, WhatsApp, cotizaciones. Exporta en CSV. Herramienta gratuita.'
      document.head.appendChild(meta)
    }

    addCanonicalLink('/utilidades/generador-funnels')
  }, [])

  const funnelSchema = createSoftwareAppSchema(
    'Generador de Funnels CRM - Embudo de Ventas',
    'Herramienta gratuita para crear funnels de ventas personalizados para tu sistema CRM. Incluye templates para B2B, B2C, e-commerce, ventas por WhatsApp, cotizaciones y visitas. Exporta en formato CSV con etapas, descripciones y campos requeridos.',
    'https://agencia.mulleryperez.cl/utilidades/generador-funnels'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://agencia.mulleryperez.cl' },
    { name: 'Utilidades', url: 'https://agencia.mulleryperez.cl/utilidades' },
    { name: 'Generador Funnels', url: 'https://agencia.mulleryperez.cl/utilidades/generador-funnels' }
  ])

  const [step, setStep] = useState(1)
  const [tipoNegocio, setTipoNegocio] = useState('')
  const [tipoCliente, setTipoCliente] = useState('')
  const [modeloVenta, setModeloVenta] = useState('')
  const [herramientas, setHerramientas] = useState('')
  const [funnelGenerado, setFunnelGenerado] = useState<FunnelTemplate | null>(null)
  const [copied, setCopied] = useState(false)

  const resetForm = () => {
    setStep(1)
    setTipoNegocio('')
    setTipoCliente('')
    setModeloVenta('')
    setHerramientas('')
    setFunnelGenerado(null)
    setCopied(false)
  }

  const goToStep = (targetStep: number) => {
    if (targetStep === 1) {
      setStep(1)
    } else if (targetStep === 2 && tipoNegocio) {
      setStep(2)
    } else if (targetStep === 3 && tipoCliente) {
      setStep(3)
    } else if (targetStep === 4 && modeloVenta) {
      setStep(4)
    }
  }

  const generarFunnel = () => {
    let templateKey = ''

    // Lógica de selección de template según combinaciones
    if (tipoNegocio === 'b2b' && tipoCliente === 'high' && modeloVenta === 'quotes') {
      templateKey = 'b2b_high_quotes'
    } else if (tipoNegocio === 'b2b' && tipoCliente === 'medium' && modeloVenta === 'visits') {
      templateKey = 'b2b_medium_visits'
    } else if (tipoNegocio === 'b2b' && tipoCliente === 'low' && modeloVenta === 'whatsapp') {
      templateKey = 'b2b_low_whatsapp'
    } else if (tipoNegocio === 'b2c' && tipoCliente === 'high' && modeloVenta === 'visits') {
      templateKey = 'b2c_high_visits'
    } else if (tipoNegocio === 'b2c' && tipoCliente === 'medium' && modeloVenta === 'whatsapp') {
      templateKey = 'b2c_medium_whatsapp'
    } else if (tipoNegocio === 'b2c' && tipoCliente === 'low' && modeloVenta === 'ecommerce') {
      templateKey = 'b2c_low_ecommerce'
    } else if (tipoNegocio === 'b2b' && tipoCliente === 'medium' && modeloVenta === 'ecommerce') {
      templateKey = 'b2b_medium_ecommerce'
    } else if (tipoNegocio === 'b2c' && tipoCliente === 'high' && modeloVenta === 'quotes') {
      templateKey = 'b2c_high_quotes'
    } else {
      templateKey = 'default'
    }

    setFunnelGenerado(funnelTemplates[templateKey])
    setStep(5)
  }

  const exportToCSV = () => {
    if (!funnelGenerado) return

    let csv = 'Etapa,Descripción,Campos Requeridos\n'
    funnelGenerado.etapas.forEach(etapa => {
      csv += `"${etapa.etapa}","${etapa.descripcion}","${etapa.campos_requeridos}"\n`
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `funnel_${funnelGenerado.nombre.toLowerCase().replace(/\s+/g, '_')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyToClipboard = () => {
    if (!funnelGenerado) return

    let text = `${funnelGenerado.nombre}\n${funnelGenerado.descripcion}\n\n`
    funnelGenerado.etapas.forEach((etapa, idx) => {
      text += `${idx + 1}. ${etapa.etapa}\n`
      text += `   Descripción: ${etapa.descripcion}\n`
      text += `   Campos: ${etapa.campos_requeridos}\n\n`
    })

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const puedeAvanzar = () => {
    if (step === 1) return tipoNegocio !== ''
    if (step === 2) return tipoCliente !== ''
    if (step === 3) return modeloVenta !== ''
    if (step === 4) return herramientas !== ''
    return false
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(funnelSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
        {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/utilidades" className="text-sm font-semibold text-gray-700 hover:text-purple-600 transition-all">
            ← Volver a Utilidades
          </Link>
          <div className="text-right">
            <h1 className="text-lg font-bold text-gray-900">Generador de Funnels CRM</h1>
            <p className="text-xs text-gray-600">Personalizado para tu negocio</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-purple-100 border border-purple-200">
            <Workflow className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700 text-sm font-semibold">Configurador Inteligente</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Crea tu funnel de ventas<br />perfecto para CRM
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Responde 4 preguntas y obtén un funnel personalizado con todas las etapas y campos necesarios
          </p>
        </div>

        {/* Progress Bar */}
        {step < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map(num => (
                <div key={num} className="flex items-center flex-1">
                  <button
                    onClick={() => goToStep(num)}
                    disabled={num > step}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      num < step
                        ? 'bg-purple-600 text-white cursor-pointer hover:bg-purple-700'
                        : num === step
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {num}
                  </button>
                  {num < 4 && (
                    <div className={`flex-1 h-1 mx-2 ${num < step ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 px-2">
              <span>Tipo Negocio</span>
              <span>Tipo Cliente</span>
              <span>Modelo Venta</span>
              <span>Herramientas</span>
            </div>
          </div>
        )}

        {/* Step 1: Tipo Negocio */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">¿Qué tipo de negocio tienes?</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setTipoNegocio('b2b')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  tipoNegocio === 'b2b'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-3">🏢</div>
                <h4 className="font-bold text-gray-900 mb-2">B2B</h4>
                <p className="text-sm text-gray-600">Vendes a otras empresas</p>
              </button>
              <button
                onClick={() => setTipoNegocio('b2c')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  tipoNegocio === 'b2c'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-3">👤</div>
                <h4 className="font-bold text-gray-900 mb-2">B2C</h4>
                <p className="text-sm text-gray-600">Vendes a consumidores finales</p>
              </button>
              <button
                onClick={() => setTipoNegocio('both')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  tipoNegocio === 'both'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-3">🔄</div>
                <h4 className="font-bold text-gray-900 mb-2">Ambos</h4>
                <p className="text-sm text-gray-600">B2B y B2C</p>
              </button>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!puedeAvanzar()}
              className="w-full mt-8 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Siguiente <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Tipo Cliente */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">¿Cómo son tus clientes?</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setTipoCliente('high')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  tipoCliente === 'high'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-3">💎</div>
                <h4 className="font-bold text-gray-900 mb-2">Alta Inversión</h4>
                <p className="text-sm text-gray-600">Ticket alto, ciclo largo, varias reuniones</p>
              </button>
              <button
                onClick={() => setTipoCliente('medium')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  tipoCliente === 'medium'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-3">💼</div>
                <h4 className="font-bold text-gray-900 mb-2">Inversión Media</h4>
                <p className="text-sm text-gray-600">Ticket medio, algunos seguimientos</p>
              </button>
              <button
                onClick={() => setTipoCliente('low')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  tipoCliente === 'low'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-3">⚡</div>
                <h4 className="font-bold text-gray-900 mb-2">Compra Rápida</h4>
                <p className="text-sm text-gray-600">Ticket bajo, decisión rápida</p>
              </button>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-xl transition-all"
              >
                Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!puedeAvanzar()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Siguiente <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Modelo Venta */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">¿Cómo vendes?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setModeloVenta('ecommerce')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  modeloVenta === 'ecommerce'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-3">🛒</div>
                <h4 className="font-bold text-gray-900 mb-2">E-commerce</h4>
                <p className="text-sm text-gray-600">Tienda online, carrito de compra</p>
              </button>
              <button
                onClick={() => setModeloVenta('whatsapp')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  modeloVenta === 'whatsapp'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-3">💬</div>
                <h4 className="font-bold text-gray-900 mb-2">WhatsApp</h4>
                <p className="text-sm text-gray-600">Conversaciones directas por WhatsApp</p>
              </button>
              <button
                onClick={() => setModeloVenta('visits')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  modeloVenta === 'visits'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-3">🤝</div>
                <h4 className="font-bold text-gray-900 mb-2">Visitas/Demos</h4>
                <p className="text-sm text-gray-600">Reuniones presenciales o demostraciones</p>
              </button>
              <button
                onClick={() => setModeloVenta('quotes')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  modeloVenta === 'quotes'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-3">📋</div>
                <h4 className="font-bold text-gray-900 mb-2">Cotizaciones</h4>
                <p className="text-sm text-gray-600">Propuestas personalizadas</p>
              </button>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-xl transition-all"
              >
                Atrás
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!puedeAvanzar()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Siguiente <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Herramientas */}
        {step === 4 && (
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">¿Qué herramientas usas?</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setHerramientas('excel')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  herramientas === 'excel'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-3">📊</div>
                <h4 className="font-bold text-gray-900 mb-2">Excel/Sheets</h4>
                <p className="text-sm text-gray-600">Planillas manuales</p>
              </button>
              <button
                onClick={() => setHerramientas('crm')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  herramientas === 'crm'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-3">⚙️</div>
                <h4 className="font-bold text-gray-900 mb-2">CRM</h4>
                <p className="text-sm text-gray-600">Sistema especializado</p>
              </button>
              <button
                onClick={() => setHerramientas('basic')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  herramientas === 'basic'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-3">📝</div>
                <h4 className="font-bold text-gray-900 mb-2">Básico</h4>
                <p className="text-sm text-gray-600">Papel, notas, memoria</p>
              </button>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-xl transition-all"
              >
                Atrás
              </button>
              <button
                onClick={generarFunnel}
                disabled={!puedeAvanzar()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Generar Funnel <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Resultados */}
        {step === 5 && funnelGenerado && (
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{funnelGenerado.nombre}</h3>
                  <p className="text-gray-600">{funnelGenerado.descripcion}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-all text-sm font-semibold"
                  >
                    <Download className="w-4 h-4" /> CSV
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-all text-sm font-semibold"
                  >
                    <Copy className="w-4 h-4" /> {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Etapa</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Descripción</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Campos Requeridos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funnelGenerado.etapas.map((etapa, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                        <td className="py-4 px-4 font-semibold text-gray-900">{etapa.etapa}</td>
                        <td className="py-4 px-4 text-gray-700">{etapa.descripcion}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{etapa.campos_requeridos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" /> Crear Otro Funnel
              </button>
              <Link
                href="/utilidades"
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 rounded-xl transition-all text-center"
              >
                Volver a Utilidades
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2024 Muller y Pérez · Funnels optimizados para tu CRM</p>
        </div>
      </footer>
      </div>
    </>
  )
}
