export function Barra({ email, volver }: { email: string; volver?: boolean }) {
  return (
    <div className="rp-top">
      <span>{volver ? <a href="/clientes">← Todos los clientes</a> : 'Sesión: ' + email}</span>
      <form action="/clientes/salir" method="post"><button className="rp-btn-link" type="submit">Cerrar sesión</button></form>
    </div>
  )
}
