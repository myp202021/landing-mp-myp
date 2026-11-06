'use client'

import { usePathname } from 'next/navigation'
import HomeFooter from '@/components/home-v2/HomeFooter'
import { sinCromo } from './nav-links'

/** Pie único del sitio. Se monta una vez en app/layout.tsx. */
export default function SiteFooter() {
  const pathname = usePathname()
  if (sinCromo(pathname)) return null
  return <HomeFooter />
}
