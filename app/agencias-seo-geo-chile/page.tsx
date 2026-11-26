import { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import ComparativaPage from '@/components/comparativas/ComparativaPage'
import { COMPARATIVAS } from '@/lib/data/comparativas'

const c = COMPARATIVAS.seoGeo

export const metadata: Metadata = createMetadata({
  title: c.metaTitle,
  description: c.description,
  keywords: c.keywords,
  path: `/${c.slug}`,
})

export default function Page() {
  return <ComparativaPage c={c} />
}
