// Gráficos del Reporte SEO y GEO: SVG generado en el servidor (sin JS en el navegador), colores de la marca M&P.
import { num } from './formato'

const GRIS = '#E2E8F0', TXT = '#64748B'

// Barras por mes + línea opcional (segundo eje). null = sin datos (barra vacía con rótulo).
export function BarrasLinea({ meses, barras, linea, nombreBarras, nombreLinea, sel }: {
  meses: string[]; barras: (number | null)[]; linea?: (number | null)[]; nombreBarras: string; nombreLinea?: string; sel?: number
}) {
  const W = 560, H = 230, pl = 40, pr = linea ? 40 : 14, pt = 18, pb = 34
  const iw = W - pl - pr, ih = H - pt - pb
  const maxB = Math.max(1, ...barras.map(b => b ?? 0)) * 1.15
  const maxL = linea ? Math.max(1, ...linea.map(b => b ?? 0)) * 1.15 : 1
  const paso = iw / meses.length, bw = Math.min(56, paso * 0.5)
  const x = (i: number) => pl + paso * i + paso / 2
  const yB = (v: number) => pt + ih - (v / maxB) * ih
  const yL = (v: number) => pt + ih - (v / maxL) * ih
  const pts = linea ? linea.map((v, i) => v == null ? null : [x(i), yL(v)] as const) : []
  const tramo = pts.filter(Boolean) as (readonly [number, number])[]
  return (
    <figure className="rp-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={nombreBarras}>
        <defs>
          <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6366F1" /><stop offset="1" stopColor="#2563EB" /></linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map(f => <g key={f}><line x1={pl} x2={W - pr} y1={pt + ih * (1 - f)} y2={pt + ih * (1 - f)} stroke={GRIS} strokeDasharray={f ? '3 4' : ''} /><text x={pl - 6} y={pt + ih * (1 - f) + 4} textAnchor="end" fontSize="10" fill={TXT}>{num(Math.round(maxB / 1.15 * f * 1.15))}</text></g>)}
        {barras.map((v, i) => v == null
          ? <text key={i} x={x(i)} y={pt + ih - 6} textAnchor="middle" fontSize="10" fill="#94A3B8">sin datos</text>
          : <g key={i}><rect x={x(i) - bw / 2} y={yB(v)} width={bw} height={pt + ih - yB(v)} rx="6" fill="url(#gb)" opacity={sel == null || sel === i ? 1 : 0.45} />
              {pt + ih - yB(v) > 26 ? <text x={x(i)} y={yB(v) + 17} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#fff">{num(v)}</text> : <text x={x(i)} y={yB(v) - 6} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#0F172A">{num(v)}</text>}</g>)}
        {tramo.length > 1 && <polyline points={tramo.map(p => p.join(',')).join(' ')} fill="none" stroke="#9333EA" strokeWidth="2.5" strokeLinejoin="round" />}
        {pts.map((p, i) => p && <g key={i}><circle cx={p[0]} cy={p[1]} r="4.5" fill="#fff" stroke="#9333EA" strokeWidth="2.5" /><text x={p[0] + bw / 2 + 6} y={p[1] + 4} fontSize="11" fontWeight="800" fill="#7E22CE">{num(linea![i]!)}</text></g>)}
        {meses.map((m, i) => <text key={m} x={x(i)} y={H - 12} textAnchor="middle" fontSize="11.5" fontWeight={sel === i ? 800 : 500} fill={sel === i ? '#0F172A' : TXT}>{m}</text>)}
      </svg>
      <figcaption><span className="lg b" />{nombreBarras}{nombreLinea && <><span className="lg l" />{nombreLinea}</>}</figcaption>
    </figure>
  )
}

// Área diaria (clics por día del mes)
export function AreaDiaria({ dias, nombre }: { dias: { fecha: string; v: number }[]; nombre: string }) {
  if (dias.length < 2) return <p className="rp-empty">Sin datos diarios.</p>
  const W = 560, H = 200, pl = 34, pr = 10, pt = 14, pb = 28, iw = W - pl - pr, ih = H - pt - pb
  const max = Math.max(1, ...dias.map(d => d.v)) * 1.15
  const x = (i: number) => pl + (iw * i) / (dias.length - 1), y = (v: number) => pt + ih - (v / max) * ih
  const linea = dias.map((d, i) => `${x(i)},${y(d.v)}`).join(' ')
  const prom = dias.reduce((s, d) => s + d.v, 0) / dias.length
  return (
    <figure className="rp-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={nombre}>
        <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6366F1" stopOpacity=".35" /><stop offset="1" stopColor="#6366F1" stopOpacity="0" /></linearGradient></defs>
        {[0, 0.5, 1].map(f => <g key={f}><line x1={pl} x2={W - pr} y1={pt + ih * (1 - f)} y2={pt + ih * (1 - f)} stroke={GRIS} strokeDasharray={f ? '3 4' : ''} /><text x={pl - 5} y={pt + ih * (1 - f) + 4} textAnchor="end" fontSize="10" fill={TXT}>{Math.round(max / 1.15 * f * 1.15)}</text></g>)}
        <polygon points={`${x(0)},${pt + ih} ${linea} ${x(dias.length - 1)},${pt + ih}`} fill="url(#ga)" />
        <polyline points={linea} fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinejoin="round" />
        <line x1={pl} x2={W - pr} y1={y(prom)} y2={y(prom)} stroke="#9333EA" strokeDasharray="5 4" />
        <text x={W - pr} y={y(prom) - 5} textAnchor="end" fontSize="10.5" fontWeight="700" fill="#7E22CE">promedio {num(prom, 1)}/día</text>
        {dias.map((d, i) => (i === 0 || i === dias.length - 1 || i % 7 === 0) && <text key={d.fecha} x={x(i)} y={H - 9} textAnchor="middle" fontSize="10.5" fill={TXT}>{+d.fecha.slice(8)}</text>)}
      </svg>
      <figcaption><span className="lg b" />{nombre}</figcaption>
    </figure>
  )
}

// Anillo 0–100 (nota SEO)
export function Anillo({ valor, tam = 150, claro = false }: { valor: number | null; tam?: number; claro?: boolean }) {
  const r = 52, c = 2 * Math.PI * r
  const color = valor == null ? '#94A3B8' : valor >= 80 ? '#10B981' : valor >= 60 ? '#6366F1' : valor >= 40 ? '#F59E0B' : '#EF4444'
  return (
    <svg width={tam} height={tam} viewBox="0 0 120 120" role="img" aria-label={valor == null ? 'Sin auditoría' : `Nota ${valor} de 100`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke={claro ? 'rgba(255,255,255,.15)' : '#EEF2FF'} strokeWidth="11" />
      {valor != null && <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" strokeDasharray={`${(c * valor) / 100} ${c}`} transform="rotate(-90 60 60)" />}
      <text x="60" y={valor == null ? 58 : 66} textAnchor="middle" fontSize={valor == null ? 13 : 34} fontWeight="800" fill={claro ? '#fff' : '#0F172A'}>{valor == null ? 'sin' : valor}</text>
      <text x="60" y={valor == null ? 74 : 84} textAnchor="middle" fontSize="11" fill={claro ? 'rgba(255,255,255,.7)' : TXT}>{valor == null ? 'auditoría' : 'de 100'}</text>
    </svg>
  )
}

// Barras horizontales (fuentes de IA, categorías)
export function Horizontales({ filas, max, sufijo = '' }: { filas: { nombre: string; v: number | null; max?: number }[]; max?: number; sufijo?: string }) {
  const m = max ?? Math.max(1, ...filas.map(f => f.v ?? 0))
  return (
    <div className="rp-hbars">
      {filas.map(f => (
        <div key={f.nombre} className="rp-hbar">
          <div className="t"><span>{f.nombre}</span><b>{f.v == null ? 'sin medir' : num(f.v, f.v % 1 ? 1 : 0) + sufijo}</b></div>
          <div className="track"><div className="fill" style={{ width: f.v == null ? 0 : `${Math.max(2, (f.v / (f.max ?? m)) * 100)}%` }} /></div>
        </div>
      ))}
    </div>
  )
}
