const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
export const nombreMes = (ym?: string) => { if (!ym) return '—'; const [a, m] = ym.split('-'); return MESES[+m - 1] + ' ' + a }
export const mesCorto = (ym: string) => { const [a, m] = ym.split('-'); return MESES[+m - 1].slice(0, 3) + ' ' + a.slice(2) }
export const fechaLarga = (ymd: string) => { const [, m, d] = ymd.split('-'); return +d + ' de ' + MESES[+m - 1] }
export const num = (n: number | null | undefined, dec = 0) => n == null ? '—' : n.toLocaleString('es-CL', { minimumFractionDigits: dec, maximumFractionDigits: dec })
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
// Variación porcentual (con menorEsMejor para la posición)
export function variacion(act: number | null | undefined, ant: number | null | undefined, menorEsMejor = false) {
  if (act == null || ant == null || ant === 0) return null
  if (menorEsMejor) { const d = Math.round((ant - act) * 10) / 10; return { txt: (d >= 0 ? '+' : '') + num(d, 1) + ' lugares', tipo: d > 0 ? 'up' : d < 0 ? 'down' : 'eq' } }
  const p = Math.round((act - ant) / ant * 100)
  return { txt: (p >= 0 ? '+' : '') + p + ' % vs mes anterior', tipo: p > 0 ? 'up' : p < 0 ? 'down' : 'eq' }
}
