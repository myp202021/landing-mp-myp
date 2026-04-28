'use client'

import { useState, useEffect } from 'react'

var SUPABASE_URL = 'https://faitwrutauavjwnsnlzq.supabase.co'
var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaXR3cnV0YXVhdmp3bnNubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzQ3MTcsImV4cCI6MjA3NzI1MDcxN30.ZfGDfQv2UzWQR6AJz0o0Prir5IJfJppkiNwWiF24pkQ'

export default function PropiedadesPage() {
  var [listings, setListings] = useState([] as any[])
  var [loading, setLoading] = useState(true)
  var [filtro, setFiltro] = useState('nuevas')

  useEffect(function() {
    fetch(SUPABASE_URL + '/rest/v1/pi_listings?select=*&order=first_seen.desc,price_uf.desc&limit=500', {
      headers: { 'apikey': SUPABASE_ANON, 'Authorization': 'Bearer ' + SUPABASE_ANON }
    }).then(function(r) { return r.json() }).then(function(data) {
      setListings(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  var nuevas = listings.filter(function(l: any) { return l.is_new })
  var hoy = listings.filter(function(l: any) { return l.published_tag === 'PUBLICADO HOY' })
  var semana = listings.filter(function(l: any) { return l.published_tag === 'PUBLICADO ESTA SEMANA' })
  var directos = listings.filter(function(l: any) { return l.vendedor_tipo === 'particular' && l.vendedor_nombre })
  var mostrar = filtro === 'nuevas' ? nuevas : filtro === 'hoy' ? hoy : filtro === 'semana' ? semana : filtro === 'directos' ? directos : listings

  if (loading) return <div style={{ fontFamily: 'Arial', textAlign: 'center', padding: 60, color: '#666' }}>Cargando propiedades...</div>

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>

        <div style={{ background: 'linear-gradient(135deg, #1B2A4A, #2D4A7A)', padding: '18px 24px', borderRadius: 10, color: '#fff', marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Radar de Propiedades</h1>
          <p style={{ margin: '3px 0 0', fontSize: 11, opacity: 0.7 }}>
            Casas usadas {'\u2265'}15.000 UF · Lo Barnechea · Vitacura · Las Condes · La Reina
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
          <button onClick={function() { setFiltro('nuevas') }} style={{ background: filtro === 'nuevas' ? '#065F46' : '#D1FAE5', color: filtro === 'nuevas' ? '#fff' : '#065F46', padding: 12, borderRadius: 8, textAlign: 'center', border: 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: 26, fontWeight: 900 }}>{nuevas.length}</div>
            <div style={{ fontSize: 9, textTransform: 'uppercase' as any }}>Nuevas</div>
          </button>
          <button onClick={function() { setFiltro('hoy') }} style={{ background: filtro === 'hoy' ? '#92400E' : '#FEF3C7', color: filtro === 'hoy' ? '#fff' : '#92400E', padding: 12, borderRadius: 8, textAlign: 'center', border: 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: 26, fontWeight: 900 }}>{hoy.length}</div>
            <div style={{ fontSize: 9, textTransform: 'uppercase' as any }}>Hoy</div>
          </button>
          <button onClick={function() { setFiltro('semana') }} style={{ background: filtro === 'semana' ? '#5B21B6' : '#EDE9FE', color: filtro === 'semana' ? '#fff' : '#5B21B6', padding: 12, borderRadius: 8, textAlign: 'center', border: 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: 26, fontWeight: 900 }}>{semana.length}</div>
            <div style={{ fontSize: 9, textTransform: 'uppercase' as any }}>Esta semana</div>
          </button>
          <button onClick={function() { setFiltro('directos') }} style={{ background: filtro === 'directos' ? '#92400E' : '#FEF3C7', color: filtro === 'directos' ? '#fff' : '#92400E', padding: 12, borderRadius: 8, textAlign: 'center', border: 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: 26, fontWeight: 900 }}>{directos.length}</div>
            <div style={{ fontSize: 9, textTransform: 'uppercase' as any }}>{'\u2B50'} Directos</div>
          </button>
          <button onClick={function() { setFiltro('todas') }} style={{ background: filtro === 'todas' ? '#1E40AF' : '#DBEAFE', color: filtro === 'todas' ? '#fff' : '#1E40AF', padding: 12, borderRadius: 8, textAlign: 'center', border: 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: 26, fontWeight: 900 }}>{listings.length}</div>
            <div style={{ fontSize: 9, textTransform: 'uppercase' as any }}>Total</div>
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ overflowX: 'auto' as any }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' as any, fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#1B2A4A', color: '#fff' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left' as any }}>#</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' as any }}>Comuna</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' as any }}>Barrio</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' as any }}>Precio UF</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center' as any }}>D</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center' as any }}>B</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center' as any }}>m²</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center' as any }}>Pub.</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' as any }}>Contacto</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' as any }}>Detectada</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center' as any }}>Ver</th>
                </tr>
              </thead>
              <tbody>
                {mostrar.map(function(l: any, i: number) {
                  var esDirecto = l.vendedor_tipo === 'particular'
                  return <tr key={l.id} style={{ borderBottom: '1px solid #f0f0f0', background: esDirecto && l.vendedor_nombre ? '#FFFBEB' : 'transparent' }}>
                    <td style={{ padding: '4px 8px', color: '#999', fontSize: 10 }}>{i + 1}</td>
                    <td style={{ padding: '4px 8px', fontWeight: 600 }}>{l.comuna}</td>
                    <td style={{ padding: '4px 8px', color: '#666', fontSize: 10 }}>{l.barrio || '-'}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'right' as any, fontWeight: 800, color: '#1B2A4A' }}>
                      {l.price_uf ? l.price_uf.toLocaleString() : '?'}
                    </td>
                    <td style={{ padding: '4px 8px', textAlign: 'center' as any }}>{l.beds || '-'}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'center' as any }}>{l.baths || '-'}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'center' as any }}>{l.m2 || '-'}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'center' as any }}>
                      {l.published_tag === 'PUBLICADO HOY' && <span style={{ background: '#D1FAE5', color: '#065F46', padding: '2px 5px', borderRadius: 4, fontSize: 8, fontWeight: 700 }}>HOY</span>}
                      {l.published_tag === 'PUBLICADO ESTA SEMANA' && <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 5px', borderRadius: 4, fontSize: 8, fontWeight: 700 }}>SEMANA</span>}
                    </td>
                    <td style={{ padding: '4px 8px', fontSize: 10 }}>
                      {l.vendedor_nombre ? (
                        <span style={{ color: esDirecto ? '#92400E' : '#666', fontWeight: esDirecto ? 700 : 400 }}>
                          {esDirecto ? '\u2B50 ' : ''}{l.vendedor_nombre}
                        </span>
                      ) : <span style={{ color: '#ccc' }}>-</span>}
                    </td>
                    <td style={{ padding: '4px 8px', fontSize: 10, color: '#999' }}>{(l.first_seen || '').substring(0, 10)}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'center' as any }}>
                      <a href={l.link} target="_blank" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600, fontSize: 10 }}>Ver {'\u2192'}</a>
                    </td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p style={{ textAlign: 'center' as any, fontSize: 9, color: '#999', marginTop: 16 }}>
          Muller y P{'é'}rez · Radar de Propiedades · mulleryperez.cl
        </p>
      </div>
    </div>
  )
}
