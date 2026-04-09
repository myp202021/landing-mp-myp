'use client'

import { useState, useEffect } from 'react'

interface Listing {
  id: string
  comuna: string
  barrio: string
  title: string
  price_uf: number
  beds: string
  baths: string
  m2: string
  location: string
  link: string
  first_seen: string
  last_seen: string
  is_new: boolean
}

export default function RadarCyM() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/radar/cym')
      .then(r => r.json())
      .then(data => { setListings(data.listings || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter ? listings.filter(l => l.comuna === filter) : listings
  const newToday = listings.filter(l => l.is_new)
  const byComuna: Record<string, number> = {}
  listings.forEach(l => byComuna[l.comuna] = (byComuna[l.comuna] || 0) + 1)

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #1B2A4A, #2D4A7A)', padding: '24px 32px', color: 'white' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Radar de Propiedades — CyM Corredora</h1>
        <p style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Casas usadas &gt;15.000 UF · Lo Barnechea · Vitacura · Las Condes · La Reina</p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
        {loading ? <p>Cargando...</p> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Total activas', value: listings.length, color: '#1B2A4A' },
                { label: 'Nuevas hoy', value: newToday.length, color: '#059669' },
                { label: 'Lo Barnechea', value: byComuna['Lo Barnechea'] || 0, color: '#1E40AF' },
                { label: 'Vitacura', value: byComuna['Vitacura'] || 0, color: '#065F46' },
                { label: 'Las Condes / La Reina', value: (byComuna['Las Condes'] || 0) + (byComuna['La Reina'] || 0), color: '#92400E' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 10, padding: 16, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {['', 'Lo Barnechea', 'Vitacura', 'Las Condes', 'La Reina'].map(c => (
                <button key={c} onClick={() => setFilter(c)}
                  style={{
                    padding: '6px 16px', borderRadius: 20, border: '1px solid #d1d5db',
                    background: filter === c ? '#1B2A4A' : 'white',
                    color: filter === c ? 'white' : '#374151',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>
                  {c || 'Todas'}
                </button>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 10, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: '#1B2A4A', marginBottom: 12 }}>
                {filter || 'Todas las comunas'} — {filtered.length} propiedades
              </h2>
              <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: '#1B2A4A' }}>
                      {['', 'Comuna', 'Barrio', 'Título', 'Precio UF', 'Dorm', 'Baños', 'M²', 'Publicado', 'Link'].map(h => (
                        <th key={h} style={{ padding: '8px 10px', color: 'white', textAlign: 'left', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.sort((a, b) => b.price_uf - a.price_uf).map(l => (
                      <tr key={l.id} style={{ borderBottom: '1px solid #f0f0f0', background: l.is_new ? '#f0fdf4' : 'white' }}>
                        <td style={{ padding: '8px 6px' }}>
                          {l.is_new && <span style={{ background: '#059669', color: 'white', padding: '2px 6px', borderRadius: 10, fontSize: 8, fontWeight: 700 }}>NUEVA</span>}
                        </td>
                        <td style={{ padding: '8px 10px', fontWeight: 600 }}>{l.comuna}</td>
                        <td style={{ padding: '8px 10px', color: '#6b7280' }}>{l.barrio?.substring(0, 25)}</td>
                        <td style={{ padding: '8px 10px' }}>{l.title?.substring(0, 40)}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 800, color: '#1B2A4A' }}>{l.price_uf?.toLocaleString()}</td>
                        <td style={{ padding: '8px 10px' }}>{l.beds || '—'}</td>
                        <td style={{ padding: '8px 10px' }}>{l.baths || '—'}</td>
                        <td style={{ padding: '8px 10px' }}>{l.m2 || '—'}</td>
                        <td style={{ padding: '8px 10px', fontSize: 10, color: '#999' }}>{l.first_seen}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <a href={l.link} target="_blank" rel="noopener" style={{ color: '#2563EB', textDecoration: 'none', fontSize: 10 }}>Ver →</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
