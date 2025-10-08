import { Metadata } from 'next'
import FunnelsClient from './FunnelsClient'

export const metadata: Metadata = {
  title: 'Generador Funnels 2025 - Crea Embudos CRM Gratis Chile',
  description: 'Genera embudos ventas CRM en 4 pasos 2025 | B2B, B2C, e-commerce, WhatsApp | 8 modelos validados | Export CSV HubSpot/Pipedrive → Crea tu funnel gratis',
  keywords: 'generador funnels chile, embudo ventas crm, funnel b2b chile, funnel ecommerce, pipedrive hubspot, crm ventas chile, automatización ventas',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/utilidades/generador-funnels'
  },
  openGraph: {
    title: 'Generador Funnels 2025 - Crea Embudos CRM Gratis Chile',
    description: 'Genera embudos ventas CRM en 4 pasos 2025 | B2B, B2C, e-commerce, WhatsApp | 8 modelos validados | Export CSV HubSpot/Pipedrive',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-funnels.svg',
        width: 1200,
        height: 630,
        alt: 'Generador de Funnels CRM - Crea tu Embudo de Ventas | M&P'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generador Funnels 2025 - Crea Embudos CRM Gratis Chile',
    description: 'Genera embudos ventas CRM en 4 pasos 2025 | B2B, B2C, e-commerce, WhatsApp | 8 modelos validados | Export CSV HubSpot/Pipedrive',
    images: ['https://www.mulleryperez.cl/og-funnels.svg']
  }
}

export default function Page() {
  return <FunnelsClient />
}
