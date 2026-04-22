import ContratarClient from './ContratarClient'

export const metadata = {
  title: 'Elige tu plan — M&P Copilot | Muller y Perez',
  robots: 'noindex',
}

export default function ContratarPage({ params }: { params: { id: string } }) {
  return <ContratarClient suscripcionId={params.id} />
}
