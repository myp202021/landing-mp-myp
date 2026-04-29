'use client'

import { useState, useEffect } from 'react'

var SUPABASE_URL = 'https://faitwrutauavjwnsnlzq.supabase.co'
var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaXR3cnV0YXVhdmp3bnNubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzQ3MTcsImV4cCI6MjA3NzI1MDcxN30.ZfGDfQv2UzWQR6AJz0o0Prir5IJfJppkiNwWiF24pkQ'

function hdrs() {
  return { 'apikey': SUPABASE_ANON, 'Authorization': 'Bearer ' + SUPABASE_ANON }
}

export default function CopilotAdmin() {
  var [subs, setSubs] = useState([] as any[])
  var [stats, setStats] = useState({} as any)
  var [loading, setLoading] = useState(true)
  var [filtro, setFiltro] = useState('todos')

  useEffect(function() {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    var r = await fetch(SUPABASE_URL + '/rest/v1/clipping_suscripciones?select=*&order=created_at.desc', { headers: hdrs() })
    var data = await r.json()
    var subsData = Array.isArray(data) ? data : []
    setSubs(subsData)

    // Stats por suscriptor: posts, contenido, auditorias
    var st: any = {}
    for (var i = 0; i < subsData.length; i++) {
      var s = subsData[i]
      try {
        var rp = await fetch(SUPABASE_URL + '/rest/v1/radar_posts?suscripcion_id=eq.' + s.id + '&select=id&limit=1000', { headers: hdrs() })
        var posts = await rp.json()
        var rc = await fetch(SUPABASE_URL + '/rest/v1/radar_contenido?suscripcion_id=eq.' + s.id + '&select=id&limit=100', { headers: hdrs() })
        var cont = await rc.json()
        st[s.id] = {
          posts: Array.isArray(posts) ? posts.length : 0,
          contenido: Array.isArray(cont) ? cont.length : 0,
        }
      } catch (e) {
        st[s.id] = { posts: 0, contenido: 0 }
      }
    }
    setStats(st)
    setLoading(false)
  }

  var subsFiltered = subs.filter(function(s: any) {
    if (filtro === 'todos') return true
    if (filtro === 'con_datos') return (stats[s.id] || {}).posts > 0
    if (filtro === 'sin_datos') return (stats[s.id] || {}).posts === 0
    return s.plan === filtro
  })

  var totalPosts = Object.values(stats).reduce(function(a: number, s: any) { return a + (s.posts || 0) }, 0)
  var conDatos = Object.values(stats).filter(function(s: any) { return s.posts > 0 }).length

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#0F0D2E', minHeight: '100vh', color: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>M&P Copilot Admin</h1>
            <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>{subs.length} suscriptores | {totalPosts} posts | {conDatos} con datos</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['todos', 'con_datos', 'sin_datos', 'business', 'pro', 'test'].map(function(f) {
              return <button key={f} onClick={function() { setFiltro(f) }}
                style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  background: filtro === f ? '#6366f1' : '#1a1745', color: filtro === f ? '#fff' : '#94a3b8' }}>
                {f === 'con_datos' ? 'Con datos' : f === 'sin_datos' ? 'Sin datos' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            })}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Cargando suscriptores...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
            {subsFiltered.map(function(s: any) {
              var p = s.perfil_empresa || {}
              var nombre = p.nombre || s.email.split('@')[0]
              var rubro = p.rubro || '-'
              var st2 = stats[s.id] || {}
              var hasPosts = st2.posts > 0
              var hasBrief = !!(p.brief)
              var cuentas = (s.cuentas || []).length

              var planColors: any = { business: '#6366f1', pro: '#10b981', test: '#f59e0b', starter: '#64748b' }

              return (
                <a key={s.id} href={'/copilot/dashboard/' + s.id}
                  style={{ background: '#1a1745', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', color: '#fff', display: 'block', transition: 'border-color 0.2s' }}
                  onMouseEnter={function(e) { (e.target as any).style.borderColor = '#6366f1' }}
                  onMouseLeave={function(e) { (e.target as any).style.borderColor = 'rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{nombre}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{rubro}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: (planColors[s.plan] || '#64748b') + '22', color: planColors[s.plan] || '#64748b' }}>
                      {(s.plan || 'free').toUpperCase()}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: hasPosts ? '#10b981' : '#334155' }}>{st2.posts || 0}</div>
                      <div style={{ fontSize: 9, color: '#475569' }}>Posts</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: st2.contenido > 0 ? '#6366f1' : '#334155' }}>{st2.contenido || 0}</div>
                      <div style={{ fontSize: 9, color: '#475569' }}>Contenido</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: cuentas > 0 ? '#f59e0b' : '#334155' }}>{cuentas}</div>
                      <div style={{ fontSize: 9, color: '#475569' }}>Cuentas</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: hasBrief ? '#10b981' : '#334155' }}>{hasBrief ? 'Si' : 'No'}</div>
                      <div style={{ fontSize: 9, color: '#475569' }}>Brief</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: 10, color: '#475569' }}>{s.email}</span>
                    <span style={{ fontSize: 10, color: '#475569' }}>{(s.created_at || '').substring(0, 10)}</span>
                  </div>
                </a>
              )
            })}
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 10, color: '#334155', marginTop: 24 }}>M&P Copilot Admin · mulleryperez.cl</p>
      </div>
    </div>
  )
}
