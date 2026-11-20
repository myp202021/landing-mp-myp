// Barra superior del área: sesión, volver al índice (superadmin) y cerrar sesión (vuelve al login de la misma área).
export function Barra({ email, volver, area }: { email: string; volver?: boolean; area?: string }) {
  return (
    <div className="rp-top">
      <span>{volver ? <a href="/admin-reportes">← Todos los clientes</a> : 'Sesión: ' + email}</span>
      <form action="/clientes/salir" method="post">
        <input type="hidden" name="area" value={area || ''} />
        <button className="rp-btn-link" type="submit">Cerrar sesión</button>
      </form>
    </div>
  )
}
