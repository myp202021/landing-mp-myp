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
  published_tag: string | null
}

function ListingRow({ l }: { l: Listing }) {
  const tagColor = l.published_tag === 'PUBLICADO HOY'
    ? { bg: '#059669', text: 'HOY' }
    : l.published_tag === 'PUBLICADO ESTA SEMANA'
    ? { bg: '#D97706', text: 'ESTA SEMANA' }
    : null

  return (
    <tr style={{ borderBottom: '1px solid #f0f0f0', background: l.published_tag === 'PUBLICADO HOY' ? '#f0fdf4' : l.published_tag === 'PUBLICADO ESTA SEMANA' ? '#fffbeb' : 'white' }}>
      <td style={{ padding: '8px 6px' }}>
        {tagColor && (
          <span style={{ background: tagColor.bg, color: 'white', padding: '2px 6px', borderRadius: 10, fontSize: 8, fontWeight: 700, whiteSpace: 'nowrap' }}>
            {tagColor.text}
          </span>
        )}
        {!tagColor && l.is_new && (
          <span style={{ background: '#6366F1', color: 'white', padding: '2px 6px', borderRadius: 10, fontSize: 8, fontWeight: 700 }}>NUEVA</span>
        )}
      </td>
      <td style={{ padding: '8px 10px', fontWeight: 600, fontSize: 11 }}>{l.comuna}</td>
      <td style={{ padding: '8px 10px', color: '#6b7280', fontSize: 11 }}>{l.barrio?.substring(0, 25)}</td>
      <td style={{ padding: '8px 10px', fontSize: 11 }}>{l.title?.substring(0, 40)}</td>
      <td style={{ padding: '8px 10px', fontWeight: 800, color: '#1B2A4A', fontSize: 12 }}>{l.price_uf?.toLocaleString()}</td>
      <td style={{ padding: '8px 10px', fontSize: 11 }}>{l.beds || '—'}</td>
      <td style={{ padding: '8px 10px', fontSize: 11 }}>{l.baths || '—'}</td>
      <td style={{ padding: '8px 10px', fontSize: 11 }}>{l.m2 || '—'}</td>
      <td style={{ padding: '8px 10px', fontSize: 10, color: '#999' }}>{l.first_seen}</td>
      <td style={{ padding: '8px 10px' }}>
        <a href={l.link} target="_blank" rel="noopener" style={{ color: '#2563EB', textDecoration: 'none', fontSize: 10 }}>Ver →</a>
      </td>
      <td style={{ padding: '8px 10px' }}>
        <a href={l.link + '#contact'} target="_blank" rel="noopener" style={{ background: '#059669', color: 'white', padding: '3px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, textDecoration: 'none' }}>Contactar</a>
      </td>
    </tr>
  )
}

const TH_STYLE: React.CSSProperties = { padding: '8px 10px', color: 'white', textAlign: 'left', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 }
const HEADERS = ['', 'Comuna', 'Barrio', 'Título', 'Precio UF', 'Dorm', 'Baños', 'M²', 'Detectada', 'Link', 'Contacto']

export default function RadarCyM() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/propiedades')
      .then(r => r.json())
      .then(data => { setListings(data.listings || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter ? listings.filter(l => l.comuna === filter) : listings
  const pubHoy = filtered.filter(l => l.published_tag === 'PUBLICADO HOY')
  const pubSemana = filtered.filter(l => l.published_tag === 'PUBLICADO ESTA SEMANA')
  const resto = filtered.filter(l => !l.published_tag || (l.published_tag !== 'PUBLICADO HOY' && l.published_tag !== 'PUBLICADO ESTA SEMANA'))
  const recientes = [...pubHoy, ...pubSemana].sort((a, b) => b.price_uf - a.price_uf)

  const byComuna: Record<string, number> = {}
  listings.forEach(l => byComuna[l.comuna] = (byComuna[l.comuna] || 0) + 1)

  const totalPubHoy = listings.filter(l => l.published_tag === 'PUBLICADO HOY').length
  const totalPubSemana = listings.filter(l => l.published_tag === 'PUBLICADO ESTA SEMANA').length

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #1B2A4A, #2D4A7A)', padding: '24px 32px', color: 'white' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Propiedades Disponibles</h1>
        <p style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Casas usadas ≥15.000 UF · Lo Barnechea · Vitacura · Las Condes · La Reina · Actualización diaria</p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
        {loading ? <p>Cargando...</p> : (
          <>
            {/* Métricas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Total activas', value: listings.length, color: '#1B2A4A' },
                { label: 'Publicadas hoy', value: totalPubHoy, color: '#059669' },
                { label: 'Esta semana', value: totalPubSemana, color: '#D97706' },
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

            {/* Filtros */}
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

            {/* Publicaciones recientes (hoy + esta semana) */}
            {recientes.length > 0 && (
              <div style={{ background: 'white', borderRadius: 10, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 20, border: '2px solid #059669' }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#059669', marginBottom: 12 }}>
                  Publicaciones recientes — {recientes.length} propiedades
                  <span style={{ fontSize: 11, fontWeight: 400, color: '#6b7280', marginLeft: 8 }}>
                    ({pubHoy.length} hoy · {pubSemana.length} esta semana)
                  </span>
                </h2>
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: '#059669' }}>
                        {HEADERS.map(h => <th key={h} style={TH_STYLE}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {recientes.map(l => <ListingRow key={l.id} l={l} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Todas las demás propiedades */}
            <div style={{ background: 'white', borderRadius: 10, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: '#1B2A4A', marginBottom: 12 }}>
                {filter || 'Todas las comunas'} — {resto.length} propiedades anteriores
              </h2>
              <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: '#1B2A4A' }}>
                      {HEADERS.map(h => <th key={h} style={TH_STYLE}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {resto.sort((a, b) => b.price_uf - a.price_uf).map(l => <ListingRow key={l.id} l={l} />)}
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
