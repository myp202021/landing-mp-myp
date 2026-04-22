import ConfigClient from './ConfigClient'

export const metadata = {
  title: 'Configurar Radar | Muller y Perez',
  robots: 'noindex',
}

export default function ConfigPage({ params }: { params: { id: string } }) {
  return <ConfigClient suscripcionId={params.id} />
}
