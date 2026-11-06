/**
 * El menú del sitio ahora es único y vive en app/layout.tsx (components/site/SiteNav).
 * Este componente solo marca que la página ya reserva espacio arriba para el menú fijo,
 * así el layout no agrega el espaciador.
 */
export default function SiteHeader() {
  return <span data-nav-overlay hidden />
}
