import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Parsear URL de competidor → objeto {red, handle, nombre}
function parsearCompetidor(url: string): { red: string; handle: string; nombre: string } | null {
  var u = (url || '').trim().toLowerCase()
  if (!u) return null

  // Instagram
  if (u.includes('instagram.com') || u.includes('instagr.am')) {
    var match = u.match(/instagram\.com\/([a-zA-Z0-9._]+)/)
    if (match) return { red: 'instagram', handle: match[1].replace(/\/$/, ''), nombre: match[1] }
  }

  // LinkedIn company
  if (u.includes('linkedin.com/company')) {
    var match2 = u.match(/linkedin\.com\/company\/([a-zA-Z0-9-]+)/)
    if (match2) return { red: 'linkedin', handle: match2[1].replace(/\/$/, ''), nombre: match2[1] }
  }

  // LinkedIn personal
  if (u.includes('linkedin.com/in/')) {
    var match3 = u.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/)
    if (match3) return { red: 'linkedin', handle: match3[1].replace(/\/$/, ''), nombre: match3[1] }
  }

  // Si es solo un handle sin URL (ej: @empresa o empresa)
  var clean = u.replace(/^@/, '').replace(/\/$/, '')
  if (clean && !clean.includes('/') && !clean.includes('.')) {
    return { red: 'instagram', handle: clean, nombre: clean }
  }

  // Facebook
  if (u.includes('facebook.com')) {
    var match4 = u.match(/facebook\.com\/([a-zA-Z0-9.]+)/)
    if (match4) return { red: 'facebook', handle: match4[1], nombre: match4[1] }
  }

  return null
}

// Generar password temporal (12 chars para más seguridad)
function generarPassword(): string {
  return crypto.randomBytes(6).toString('hex') // 12 chars hex
}

// Hash de password con salt (formato: sha256:salt:hash)
function hashPassword(pass: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.createHash('sha256').update(salt + pass).digest('hex')
  return 'sha256:' + salt + ':' + hash
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = (body.email || '').trim().toLowerCase()
    const nombreEmpresa = body.nombre_empresa || ''
    const descripcion = body.descripcion || ''
    const webCliente = body.web || ''
    const igCliente = (body.instagram || '').replace(/^@/, '').trim()

    // Aceptar tanto "competidores" (URLs del form) como "cuentas" (objetos directos)
    var cuentas: any[] = []
    if (body.competidores && Array.isArray(body.competidores)) {
      // Parsear URLs a objetos {red, handle, nombre}
      cuentas = body.competidores
        .map(function(url: string) { return parsearCompetidor(url) })
        .filter(function(c: any) { return c !== null })
    } else if (body.cuentas && Array.isArray(body.cuentas)) {
      cuentas = body.cuentas
    }

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    // Competidores opcionales — el usuario los agrega en /configurar después

    // Verificar si ya existe
    const { data: existing } = await supabase
      .from('clipping_suscripciones')
      .select('id, estado')
      .eq('email', email)
      .in('estado', ['trial', 'activo'])
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Ya tienes un trial o suscripción activa', id: existing[0].id }, { status: 409 })
    }

    const trialEnds = new Date()
    trialEnds.setDate(trialEnds.getDate() + 7)

    // Generar password temporal
    const tempPassword = generarPassword()
    const passwordHash = hashPassword(tempPassword)

    // Crear suscripción
    const { data, error } = await supabase
      .from('clipping_suscripciones')
      .insert({
        email,
        nombre: nombreEmpresa || email.split('@')[0],
        plan: 'starter',
        periodo: 'mensual',
        estado: 'trial',
        cuentas,
        emails_destino: [email],
        trial_ends: trialEnds.toISOString(),
        perfil_empresa: {
          nombre: nombreEmpresa || email.split('@')[0],
          descripcion: descripcion || '',
          tono: 'profesional',
          web: webCliente || '',
          instagram: igCliente || '',
        },
        password_hash: passwordHash,
        debe_cambiar_password: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creando trial:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const subId = data?.id || ''
    const dashUrl = 'https://www.mulleryperez.cl/copilot/dashboard/' + subId
    const configUrl = 'https://www.mulleryperez.cl/copilot/configurar/' + subId

    // Resumen de cuentas para el email
    const cuentasResumen = cuentas.map(function(c: any) {
      return (c.red === 'instagram' ? 'IG' : c.red === 'linkedin' ? 'LI' : c.red) + ': @' + c.handle
    }).join(', ')

    const igCount = cuentas.filter(function(c: any) { return c.red === 'instagram' }).length
    const liCount = cuentas.filter(function(c: any) { return c.red === 'linkedin' }).length
    const redesStr = [igCount > 0 ? igCount + ' de Instagram' : '', liCount > 0 ? liCount + ' de LinkedIn' : ''].filter(Boolean).join(' + ')

    // Email de bienvenida con password
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'M&P Copilot <contacto@mulleryperez.cl>',
          to: [email],
          subject: 'Tu Copilot está activo — ' + (nombreEmpresa || 'Bienvenido'),
          html: '<div style="font-family:-apple-system,sans-serif;max-width:580px;margin:0 auto;">'
            + '<div style="background:linear-gradient(135deg,#4338CA,#7C3AED);color:white;padding:28px 32px;border-radius:16px 16px 0 0;">'
            + '<p style="margin:0;font-size:11px;opacity:0.6;letter-spacing:1.5px;">M&P COPILOT</p>'
            + '<h1 style="margin:8px 0;font-size:22px;font-weight:800;">Estamos preparando tu Copilot</h1>'
            + '<p style="margin:0;font-size:14px;opacity:0.9;">' + (nombreEmpresa || email.split('@')[0]) + '</p>'
            + '</div>'
            + '<div style="background:white;padding:28px 32px;">'
            + '<p style="font-size:15px;color:#374151;line-height:1.7;">Configuramos <strong>' + redesStr + '</strong> de competidores para monitorear.</p>'

            // Bloque: mañana recibes
            + '<div style="background:#fef3c7;padding:16px 20px;border-radius:10px;margin:16px 0;border-left:4px solid #F59E0B;">'
            + '<p style="margin:0;font-size:15px;color:#92400E;font-weight:700;">Mañana a las 8:00 AM recibes tu primer análisis</p>'
            + '<p style="margin:8px 0 0;font-size:13px;color:#92400E;">Esta noche 21 agentes de IA analizan tu competencia, generan contenido y preparan tu reporte.</p>'
            + '</div>'

            // Credenciales
            + '<div style="background:#f0fdf4;padding:16px 20px;border-radius:10px;margin:16px 0;border:1px solid #bbf7d0;">'
            + '<p style="margin:0 0 8px;font-size:14px;color:#166534;font-weight:700;">Tus credenciales de acceso</p>'
            + '<p style="margin:0;font-size:13px;color:#166534;">Email: <strong>' + email + '</strong></p>'
            + '<p style="margin:0;font-size:13px;color:#166534;">Password temporal: <strong>' + tempPassword + '</strong></p>'
            + '<p style="margin:8px 0 0;font-size:12px;color:#166534;">Te pediremos cambiarla en tu primer login.</p>'
            + '</div>'

            + '<div style="text-align:center;margin:24px 0;">'
            + '<a href="' + configUrl + '" style="display:inline-block;background:#4338CA;color:white;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none;">Configurar mi empresa y competencia</a>'
            + '</div>'
            + '<p style="font-size:12px;color:#6b7280;text-align:center;">Despu\u00e9s de configurar, en 24 horas tu dashboard tendr\u00e1 datos reales.</p>'

            + '<p style="font-size:13px;color:#6b7280;text-align:center;">Tu trial vence el ' + trialEnds.toISOString().split('T')[0] + '. Planes desde $34.990/mes.</p>'
            + '</div>'
            + '<div style="padding:16px 28px;background:#1e1b4b;border-radius:0 0 16px 16px;text-align:center;">'
            + '<p style="margin:0;font-size:12px;color:rgba(255,255,255,0.7);">M&P Copilot by Muller y Pérez</p>'
            + '</div></div>',
        }),
      })
    } catch (emailErr) { console.error('Email bienvenida fallo:', emailErr) }

    // Notificar a M&P internamente
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'M&P Copilot <contacto@mulleryperez.cl>',
          to: ['contacto@mulleryperez.cl'],
          subject: '[Copilot] Nuevo trial: ' + (nombreEmpresa || email) + ' (' + cuentas.length + ' cuentas)',
          html: '<div style="font-family:sans-serif;padding:20px;">'
            + '<h2 style="color:#4338CA;">Nuevo trial Copilot</h2>'
            + '<p><strong>Email:</strong> ' + email + '</p>'
            + '<p><strong>Empresa:</strong> ' + (nombreEmpresa || '(no especificado)') + '</p>'
            + '<p><strong>Descripción:</strong> ' + (descripcion || '(no)') + '</p>'
            + '<p><strong>Cuentas:</strong> ' + cuentasResumen + '</p>'
            + '<p><strong>Password temporal:</strong> ' + tempPassword + '</p>'
            + '<p><strong>Trial hasta:</strong> ' + trialEnds.toISOString().split('T')[0] + '</p>'
            + '<p><a href="https://www.mulleryperez.cl/crm/copilot" style="color:#4338CA;font-weight:bold;">Ver en CRM</a></p>'
            + '</div>',
        }),
      })
    } catch (notifErr) { console.error('Notificacion interna fallo (no critico)') }

    console.log(`Trial creado: ${email} con ${cuentas.length} cuentas (${cuentasResumen}), password temporal generado, expira ${trialEnds.toISOString().split('T')[0]}`)

    // Setear cookie de sesión para acceso inmediato al dashboard
    const sessionToken = subId + ':' + crypto.randomBytes(32).toString('hex')
    const response = NextResponse.json({ ok: true, trial_ends: trialEnds.toISOString(), id: subId })
    response.cookies.set('copilot_session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })

    return response

  } catch (err: any) {
    console.error('Error trial:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
