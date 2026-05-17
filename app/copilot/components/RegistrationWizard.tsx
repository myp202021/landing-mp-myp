'use client'

import React, { useState } from 'react'

var RUBROS = [
  'tecnología', 'salud', 'inmobiliaria', 'retail', 'educación',
  'gastronomía', 'construcción', 'transporte', 'turismo',
  'maquinaria', 'servicios profesionales', 'otro'
]

var TONOS = [
  { value: 'profesional', label: 'Profesional' },
  { value: 'cercano', label: 'Cercano' },
  { value: 'técnico', label: 'Técnico' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'creativo', label: 'Creativo' },
]

var STEP_LABELS = ['Tu empresa', '¿Qué hacen?', 'Tu competencia', 'Tu voz', 'Tu brief']

interface WizardProps {
  onSuccess: (data: { id: string; password?: string }) => void
}

export default function RegistrationWizard({ onSuccess }: WizardProps) {
  var [step, setStep] = useState(0)
  var [enviando, setEnviando] = useState(false)
  var [formError, setFormError] = useState('')

  // Step 1
  var [nombreEmpresa, setNombreEmpresa] = useState('')
  var [email, setEmail] = useState('')
  var [web, setWeb] = useState('')
  var [instagram, setInstagram] = useState('')

  // Step 2
  var [descripcion, setDescripcion] = useState('')
  var [rubro, setRubro] = useState('')
  var [productosServicios, setProductosServicios] = useState('')
  var [propuestaValor, setPropuestaValor] = useState('')

  // Step 3
  var [comp1, setComp1] = useState('')
  var [comp2, setComp2] = useState('')
  var [comp3, setComp3] = useState('')

  // Step 4
  var [tono, setTono] = useState('profesional')
  var [valores, setValores] = useState('')
  var [diferenciador, setDiferenciador] = useState('')

  function validateStep(): string {
    if (step === 0) {
      if (!nombreEmpresa.trim()) return 'El nombre de la empresa es requerido'
      if (!email.trim()) return 'El email es requerido'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingresa un email válido'
    }
    if (step === 2) {
      if (!comp1.trim() && !comp2.trim() && !comp3.trim()) return 'Ingresa al menos 1 competidor'
    }
    return ''
  }

  function handleNext() {
    var err = validateStep()
    if (err) { setFormError(err); return }
    setFormError('')
    setStep(step + 1)
  }

  function handleBack() {
    setFormError('')
    setStep(step - 1)
  }

  function handleSubmit() {
    setEnviando(true)
    setFormError('')

    var competidores = [comp1, comp2, comp3].filter(function(c) { return c.trim() !== '' })

    fetch('/api/copilot/trial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        nombre_empresa: nombreEmpresa.trim(),
        descripcion: descripcion.trim(),
        web: web.trim(),
        instagram: instagram.trim(),
        competidores: competidores,
        rubro: rubro,
        productos_servicios: productosServicios.trim(),
        propuesta_valor: propuestaValor.trim(),
        tono: tono,
        valores: valores.trim(),
        diferenciador: diferenciador.trim(),
      }),
    })
      .then(function(res) { return res.json().then(function(data) { return { status: res.status, data: data } }) })
      .then(function(result) {
        setEnviando(false)
        var data = result.data
        if (result.status === 409 && data.id) {
          onSuccess({ id: data.id })
          return
        }
        if (data.error) { setFormError(data.error); return }
        if (!data.id) { setFormError('Error creando la cuenta. Intenta de nuevo.'); return }
        onSuccess({ id: data.id, password: data.password })
      })
      .catch(function() {
        setEnviando(false)
        setFormError('Error de conexión. Intenta de nuevo.')
      })
  }

  // ─── Shared styles ───
  var cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '40px 36px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
    maxWidth: 620,
    margin: '0 auto',
  }

  var labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 14, fontWeight: 600, color: '#c4b5fd',
    marginBottom: 6, letterSpacing: 0.3,
  }

  var inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px', border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: 12, fontSize: 15, fontFamily: 'Inter, sans-serif',
    background: 'rgba(255,255,255,0.05)', color: '#e2e8f0',
    outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.3s, background 0.3s',
  }

  var textareaStyle: React.CSSProperties = {
    ...inputStyle, resize: 'vertical' as const, minHeight: 80,
  }

  var selectStyle: React.CSSProperties = {
    ...inputStyle, appearance: 'none' as const, cursor: 'pointer',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%239CA3AF\' stroke-width=\'2\' fill=\'none\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center',
  }

  var helperStyle: React.CSSProperties = {
    fontSize: 12, color: '#94a3b8', marginTop: 4, marginBottom: 0,
  }

  function renderProgressBar() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 36, position: 'relative' }}>
        {STEP_LABELS.map(function(label, i) {
          var isCompleted = i < step
          var isActive = i === step
          var isPending = i > step
          var circleColor = isCompleted ? '#22c55e' : isActive ? '#7C3AED' : 'rgba(255,255,255,0.15)'
          var textColor = isCompleted ? '#86efac' : isActive ? '#c4b5fd' : '#64748b'

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: isCompleted ? '#22c55e' : isActive ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'rgba(255,255,255,0.08)',
                  border: isActive ? '2px solid rgba(139,92,246,0.5)' : isPending ? '2px solid rgba(255,255,255,0.1)' : '2px solid #22c55e',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: isCompleted || isActive ? '#fff' : '#64748b',
                  transition: 'all 0.4s ease',
                  boxShadow: isActive ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
                }}>
                  {isCompleted ? '\u2713' : (i + 1)}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, color: textColor,
                  marginTop: 6, letterSpacing: 0.3,
                  whiteSpace: 'nowrap',
                  transition: 'color 0.4s ease',
                }}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div style={{
                  width: 40, height: 2, margin: '0 4px',
                  marginBottom: 20,
                  background: i < step ? '#22c55e' : 'rgba(255,255,255,0.1)',
                  borderRadius: 1,
                  transition: 'background 0.4s ease',
                }} />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  function renderStep0() {
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Nombre de tu empresa *</label>
          <input type="text" required style={inputStyle} placeholder="Mi Empresa SpA"
            value={nombreEmpresa} onChange={function(e) { setNombreEmpresa(e.target.value) }}
            onFocus={function(e) { e.target.style.borderColor = 'rgba(139,92,246,0.5)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
            onBlur={function(e) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Email corporativo *</label>
          <input type="email" required style={inputStyle} placeholder="tu@empresa.cl"
            value={email} onChange={function(e) { setEmail(e.target.value) }}
            onFocus={function(e) { e.target.style.borderColor = 'rgba(139,92,246,0.5)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
            onBlur={function(e) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>Sitio web</label>
            <input type="text" style={inputStyle} placeholder="www.tuempresa.cl"
              value={web} onChange={function(e) { setWeb(e.target.value) }}
              onFocus={function(e) { e.target.style.borderColor = 'rgba(139,92,246,0.5)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
              onBlur={function(e) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
            />
          </div>
          <div>
            <label style={labelStyle}>Tu Instagram</label>
            <input type="text" style={inputStyle} placeholder="@tuempresa"
              value={instagram} onChange={function(e) { setInstagram(e.target.value) }}
              onFocus={function(e) { e.target.style.borderColor = 'rgba(139,92,246,0.5)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
              onBlur={function(e) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
            />
          </div>
        </div>
      </div>
    )
  }

  function renderStep1() {
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Descripción de tu empresa</label>
          <textarea style={textareaStyle} rows={3} placeholder="Vendemos soluciones de software para pymes en Chile..."
            value={descripcion} onChange={function(e) { setDescripcion(e.target.value) }}
            onFocus={function(e) { e.target.style.borderColor = 'rgba(139,92,246,0.5)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
            onBlur={function(e) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Rubro</label>
          <select style={selectStyle} value={rubro} onChange={function(e) { setRubro(e.target.value) }}>
            <option value="" style={{ background: '#1a1a2e', color: '#94a3b8' }}>Selecciona un rubro...</option>
            {RUBROS.map(function(r) {
              return <option key={r} value={r} style={{ background: '#1a1a2e', color: '#e2e8f0' }}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            })}
          </select>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Productos o servicios principales</label>
          <input type="text" style={inputStyle} placeholder="Software de gestión, consultoría, capacitaciones..."
            value={productosServicios} onChange={function(e) { setProductosServicios(e.target.value) }}
            onFocus={function(e) { e.target.style.borderColor = 'rgba(139,92,246,0.5)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
            onBlur={function(e) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Propuesta de valor</label>
          <textarea style={{ ...textareaStyle, minHeight: 60 }} rows={2} placeholder="¿Qué los hace diferentes de la competencia?"
            value={propuestaValor} onChange={function(e) { setPropuestaValor(e.target.value) }}
            onFocus={function(e) { e.target.style.borderColor = 'rgba(139,92,246,0.5)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
            onBlur={function(e) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
          />
          <p style={helperStyle}>Esto ayuda a los agentes a generar contenido que te diferencie.</p>
        </div>
      </div>
    )
  }

  function renderStep2() {
    var comps = [
      { val: comp1, set: setComp1, num: 1 },
      { val: comp2, set: setComp2, num: 2 },
      { val: comp3, set: setComp3, num: 3 },
    ]
    return (
      <div>
        <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 0, marginBottom: 24, lineHeight: 1.6 }}>
          Ingresa las cuentas de Instagram de 3 competidores que quieras monitorear. Pueden ser handles (@empresa) o URLs completas.
        </p>
        {comps.map(function(c) {
          var hasVal = c.val.trim() !== ''
          return (
            <div key={c.num} style={{
              marginBottom: 16,
              background: hasVal ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
              border: hasVal ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14, padding: '16px 20px',
              transition: 'all 0.3s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: hasVal ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: hasVal ? '#fff' : '#64748b',
                  flexShrink: 0,
                }}>
                  {c.num}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ ...labelStyle, marginBottom: 4, fontSize: 12 }}>
                    Competidor {c.num} {c.num === 1 ? '*' : ''}
                  </label>
                  <input type="text" style={{
                    ...inputStyle, padding: '10px 14px', fontSize: 14,
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  }}
                    placeholder="@competidor o instagram.com/competidor"
                    value={c.val} onChange={function(e) { c.set(e.target.value) }}
                    onFocus={function(e) { e.target.style.borderColor = 'rgba(139,92,246,0.5)' }}
                    onBlur={function(e) { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
                  />
                </div>
              </div>
              {hasVal && (
                <div style={{ marginTop: 8, marginLeft: 44 }}>
                  <span style={{
                    display: 'inline-block', background: 'rgba(99,102,241,0.15)',
                    color: '#a5b4fc', fontSize: 13, fontWeight: 600,
                    padding: '4px 12px', borderRadius: 100,
                  }}>
                    @{c.val.replace(/^@/, '').replace(/.*instagram\.com\//, '').replace(/\/.*/, '')}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  function renderStep3() {
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Tono de comunicación</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {TONOS.map(function(t) {
              var isSelected = tono === t.value
              return (
                <button key={t.value} type="button" onClick={function() { setTono(t.value) }}
                  style={{
                    padding: '12px 8px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: 'Inter, sans-serif',
                    background: isSelected ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'rgba(255,255,255,0.05)',
                    border: isSelected ? '2px solid rgba(139,92,246,0.5)' : '2px solid rgba(255,255,255,0.08)',
                    color: isSelected ? '#fff' : '#94a3b8',
                    boxShadow: isSelected ? '0 4px 15px rgba(99,102,241,0.3)' : 'none',
                  }}>
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Valores de marca</label>
          <textarea style={textareaStyle} rows={3} placeholder="Innovación, cercanía, calidad, transparencia..."
            value={valores} onChange={function(e) { setValores(e.target.value) }}
            onFocus={function(e) { e.target.style.borderColor = 'rgba(139,92,246,0.5)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
            onBlur={function(e) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
          />
          <p style={helperStyle}>Los agentes usarán estos valores para generar contenido alineado con tu marca.</p>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>¿Qué te diferencia de tu competencia?</label>
          <textarea style={textareaStyle} rows={3} placeholder="Mejor servicio, precios más competitivos, tecnología propia..."
            value={diferenciador} onChange={function(e) { setDiferenciador(e.target.value) }}
            onFocus={function(e) { e.target.style.borderColor = 'rgba(139,92,246,0.5)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
            onBlur={function(e) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
          />
        </div>
      </div>
    )
  }

  function renderStep4() {
    var competidores = [comp1, comp2, comp3].filter(function(c) { return c.trim() !== '' })
    var summaryItemStyle: React.CSSProperties = {
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
    }
    var summaryLabelStyle: React.CSSProperties = { fontSize: 13, color: '#94a3b8', fontWeight: 500, minWidth: 120 }
    var summaryValueStyle: React.CSSProperties = { fontSize: 14, color: '#e2e8f0', fontWeight: 600, textAlign: 'right' as const, flex: 1 }

    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{'\u{1F4CB}'}</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: '0 0 6px' }}>Tu brief está listo</h3>
          <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>Revisa los datos y confirma para activar tu Copilot</p>
        </div>

        <div style={{
          background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 14, padding: '20px 24px', marginBottom: 20,
        }}>
          <div style={summaryItemStyle}>
            <span style={summaryLabelStyle}>Empresa</span>
            <span style={summaryValueStyle}>{nombreEmpresa}</span>
          </div>
          <div style={summaryItemStyle}>
            <span style={summaryLabelStyle}>Email</span>
            <span style={summaryValueStyle}>{email}</span>
          </div>
          {web && (
            <div style={summaryItemStyle}>
              <span style={summaryLabelStyle}>Sitio web</span>
              <span style={summaryValueStyle}>{web}</span>
            </div>
          )}
          {instagram && (
            <div style={summaryItemStyle}>
              <span style={summaryLabelStyle}>Instagram</span>
              <span style={summaryValueStyle}>@{instagram.replace(/^@/, '')}</span>
            </div>
          )}
          {rubro && (
            <div style={summaryItemStyle}>
              <span style={summaryLabelStyle}>Rubro</span>
              <span style={summaryValueStyle}>{rubro.charAt(0).toUpperCase() + rubro.slice(1)}</span>
            </div>
          )}
          {descripcion && (
            <div style={summaryItemStyle}>
              <span style={summaryLabelStyle}>Descripción</span>
              <span style={summaryValueStyle}>{descripcion}</span>
            </div>
          )}
          {productosServicios && (
            <div style={summaryItemStyle}>
              <span style={summaryLabelStyle}>Productos</span>
              <span style={summaryValueStyle}>{productosServicios}</span>
            </div>
          )}
          {propuestaValor && (
            <div style={summaryItemStyle}>
              <span style={summaryLabelStyle}>Propuesta de valor</span>
              <span style={summaryValueStyle}>{propuestaValor}</span>
            </div>
          )}
          <div style={summaryItemStyle}>
            <span style={summaryLabelStyle}>Tono</span>
            <span style={summaryValueStyle}>{TONOS.find(function(t) { return t.value === tono })?.label || tono}</span>
          </div>
          {valores && (
            <div style={summaryItemStyle}>
              <span style={summaryLabelStyle}>Valores</span>
              <span style={summaryValueStyle}>{valores}</span>
            </div>
          )}
          {diferenciador && (
            <div style={summaryItemStyle}>
              <span style={summaryLabelStyle}>Diferenciador</span>
              <span style={summaryValueStyle}>{diferenciador}</span>
            </div>
          )}
          <div style={{ ...summaryItemStyle, borderBottom: 'none' }}>
            <span style={summaryLabelStyle}>Competidores</span>
            <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}>
              {competidores.map(function(c, i) {
                return (
                  <span key={i} style={{
                    display: 'inline-block', background: 'rgba(99,102,241,0.15)',
                    color: '#a5b4fc', fontSize: 13, fontWeight: 600,
                    padding: '4px 12px', borderRadius: 100,
                  }}>
                    @{c.replace(/^@/, '').replace(/.*instagram\.com\//, '').replace(/\/.*/, '')}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  var stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4]

  return (
    <div style={{ background: 'linear-gradient(180deg, #0F0D2E 0%, #1a1a3e 100%)', padding: '40px 24px 60px', borderRadius: 24 }}>
      {renderProgressBar()}

      <div style={cardStyle}>
        {/* Step title */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{
            fontSize: 22, fontWeight: 700, margin: '0 0 6px',
            background: 'linear-gradient(135deg, #818cf8, #c084fc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {STEP_LABELS[step]}
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
            Paso {step + 1} de {STEP_LABELS.length}
          </p>
        </div>

        {/* Step content */}
        {stepRenderers[step]()}

        {/* Error */}
        {formError && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12, padding: '14px 18px', marginBottom: 16, marginTop: 16, textAlign: 'center',
          }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#fca5a5', margin: 0 }}>{formError}</p>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 16 }}>
          {step > 0 ? (
            <button type="button" onClick={handleBack} style={{
              padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8', transition: 'all 0.3s',
            }}>
              Atrás
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button type="button" onClick={handleNext} style={{
              padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              border: 'none', color: '#fff', transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
            }}>
              Siguiente
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={enviando} style={{
              padding: '16px 36px', borderRadius: 12, fontSize: 16, fontWeight: 700,
              cursor: enviando ? 'wait' : 'pointer', fontFamily: 'Inter, sans-serif',
              background: enviando ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              border: 'none', color: '#fff', transition: 'all 0.3s',
              boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
            }}>
              {enviando ? 'Activando...' : 'Confirmar y activar'}
            </button>
          )}
        </div>
      </div>

      <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
        Sin tarjeta de crédito · 7 días gratis · Cancela cuando quieras
      </p>
    </div>
  )
}
