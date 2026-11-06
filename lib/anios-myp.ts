/** Años de M&P en el mercado, contados desde su fundación (enero 2020). Se recalcula en cada build. */
const FUNDACION = new Date('2020-01-01T00:00:00-03:00')

export function aniosMyP(hoy: Date = new Date()): number {
  let n = hoy.getFullYear() - FUNDACION.getFullYear()
  if (hoy < new Date(hoy.getFullYear(), FUNDACION.getMonth(), FUNDACION.getDate())) n -= 1
  return n
}
