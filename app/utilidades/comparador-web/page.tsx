import { Metadata } from 'next'
import ComparadorClient from './ComparadorClient'

export const metadata: Metadata = {
  title: 'Comparador Web 2025 - PageSpeed + Core Web Vitals Gratis Chile',
  description: 'Compara tu web vs 3 competidores 2025 | PageSpeed API real | Core Web Vitals: LCP, FCP, CLS, TBT | SEO performance mobile/desktop → Analiza gratis ahora',
  keywords: 'comparador velocidad web chile, pagespeed insights chile, core web vitals, lcp fcp cls, velocidad web competencia, seo performance chile, optimizar velocidad web',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/utilidades/comparador-web'
  },
  openGraph: {
    title: 'Comparador Web 2025 - PageSpeed + Core Web Vitals Gratis Chile',
    description: 'Compara tu web vs 3 competidores 2025 | PageSpeed API real | Core Web Vitals: LCP, FCP, CLS, TBT | SEO performance mobile/desktop',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-comparador.svg',
        width: 1200,
        height: 630,
        alt: 'Comparador Velocidad Web - PageSpeed Insights Gratis | M&P'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comparador Web 2025 - PageSpeed + Core Web Vitals Gratis Chile',
    description: 'Compara tu web vs 3 competidores 2025 | PageSpeed API real | Core Web Vitals: LCP, FCP, CLS, TBT | SEO performance mobile/desktop',
    images: ['https://www.mulleryperez.cl/og-comparador.svg']
  }
}

export default function Page() {
  return <ComparadorClient />
}
