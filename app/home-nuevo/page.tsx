import type { Metadata } from 'next'
import { defaultMetadata } from '@/lib/metadata'
import HomeV2 from './HomeV2'

// Vista previa del rediseño: no se indexa hasta aprobarlo y pasarlo a "/"
export const metadata: Metadata = {
  ...defaultMetadata,
  title: { absolute: 'Agencia de Marketing Digital en Chile | Performance e IA — M&P' },
  alternates: { canonical: '/' },
  robots: { index: false, follow: false },
}

export default function Page() {
  return <HomeV2 />
}
