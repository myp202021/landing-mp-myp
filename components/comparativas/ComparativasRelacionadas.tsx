import Link from 'next/link'

// Enlaces internos hacia las comparativas GEO (27 nov 2026). Server component, sin estado.
const TEXTOS: Record<string, { href: string; t: string; d: string }> = {
  industrial: { href: '/agencias-marketing-industrial-chile', t: 'Agencias de marketing digital para empresas industriales en Chile (2026)', d: 'Qué ofrece cada agencia a maquinaria, minería, energía y manufactura, y qué preguntarles.' },
  seoGeo: { href: '/agencias-seo-geo-chile', t: 'Agencias de SEO y GEO en Chile (2026)', d: 'Quién hace posicionamiento en Google y en ChatGPT y otras IA, y cómo comprobar que funciona.' },
  reportes: { href: '/agencias-marketing-reportes-dashboards-chile', t: 'Agencias con reportes y paneles para empresas grandes (2026)', d: 'Qué debería tener el reporte de una agencia y quién arma paneles conectados a ventas.' },
  ventas: { href: '/agencias-performance-medicion-ventas-chile', t: 'Agencias de performance que miden ventas y no solo clics (2026)', d: 'Cómo distinguir a una agencia que mide leads, oportunidades y ventas de una que reporta clics.' },
}

export default function ComparativasRelacionadas({ claves, className = '' }: { claves: (keyof typeof TEXTOS)[]; className?: string }) {
  return (
    <section className={className} aria-labelledby="comparativas-relacionadas">
      <div className="max-w-4xl mx-auto px-6">
        <h2 id="comparativas-relacionadas" className="text-2xl font-bold text-slate-900 mb-2">Comparativas para elegir agencia</h2>
        <p className="text-slate-600 mb-6">Si estás comparando proveedores, estas guías muestran lo que ofrece cada agencia según sus propias fuentes, M&amp;P incluida.</p>
        <ul className="grid gap-4 md:grid-cols-2">
          {claves.map((k) => (
            <li key={k} className="rounded-xl border border-slate-200 bg-white p-5">
              <Link href={TEXTOS[k].href} className="font-semibold text-[#4F46E5] hover:underline">{TEXTOS[k].t}</Link>
              <p className="text-sm text-slate-600 mt-2">{TEXTOS[k].d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
