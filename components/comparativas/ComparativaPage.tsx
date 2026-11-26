/**
 * Plantilla de comparativas por necesidad (GEO, 26 nov 2026).
 * Cada comparativa responde una pregunta que la gente le hace a ChatGPT/Gemini
 * («¿qué agencia me recomiendas para…?») con agencias reales, datos con fuente,
 * metodología pública y aviso de transparencia (la publica una agencia).
 * Datos: lib/data/comparativas.ts
 */
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import { createArticleSchema, createBreadcrumbSchema, createFAQPageSchema } from '@/lib/metadata'
import type { Comparativa } from '@/lib/data/comparativas'

const BASE = 'https://www.mulleryperez.cl'

function fechaLarga(iso: string) {
  const m = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  const [a, mm, d] = iso.split('-').map(Number)
  return `${d} de ${m[mm - 1]} de ${a}`
}

export default function ComparativaPage({ c }: { c: Comparativa }) {
  const url = `${BASE}/${c.slug}`
  const schemas = [
    createArticleSchema({
      title: c.h1,
      description: c.description,
      url,
      publishedTime: c.publicado,
      modifiedTime: c.actualizado,
      section: 'Comparativas de agencias',
      keywords: c.keywords,
    }),
    createBreadcrumbSchema([
      { name: 'Inicio', url: BASE },
      { name: 'Comparativas de agencias', url: `${BASE}/mejores-agencias-marketing-digital-chile` },
      { name: c.migas, url },
    ]),
    createFAQPageSchema(c.faqs.map((f) => ({ question: f.q, answer: f.a }))),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: c.h1,
      description: c.description,
      itemListOrder: 'https://schema.org/ItemListUnordered',
      numberOfItems: c.agencias.length,
      itemListElement: c.agencias.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Organization',
          name: a.nombre,
          url: a.sitio,
          description: a.resumen,
          ...(a.ubicacion ? { address: { '@type': 'PostalAddress', addressLocality: a.ubicacion, addressCountry: 'CL' } } : {}),
        },
      })),
    },
  ]

  const p = 'text-gray-700 leading-relaxed mb-4'
  const h2 = 'text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-5'

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <SiteHeader />
      <main className="bg-white">
        <section className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white pt-28 pb-14">
          <div className="max-w-5xl mx-auto px-5">
            <nav className="text-sm text-indigo-200 mb-6">
              <Link href="/" className="hover:text-white">Inicio</Link>
              <span className="mx-2">/</span>
              <Link href="/mejores-agencias-marketing-digital-chile" className="hover:text-white">Comparativas de agencias</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{c.migas}</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">{c.h1}</h1>
            <p className="text-indigo-100 text-sm mb-6">
              Por{' '}
              <Link href="/equipo/christopher-muller" className="underline">Christopher Müller</Link>{' '}
              (Ingeniero Civil Industrial y MBA, Universidad de Chile) · Publicado el {fechaLarga(c.publicado)} · Datos revisados el {fechaLarga(c.actualizado)}
            </p>
            <div className="bg-white/10 rounded-2xl p-6 border border-white/15">
              <p className="text-lg leading-relaxed">
                <strong>Respuesta corta:</strong> {c.respuestaCorta}
              </p>
            </div>
          </div>
        </section>

        <article className="max-w-5xl mx-auto px-5 py-10">
          <div className="border-l-4 border-amber-500 bg-amber-50 p-5 rounded-r-lg mb-8 text-sm text-amber-900">
            <strong>Transparencia:</strong> esta comparativa la publica Muller y Pérez, que también es una agencia y aparece en
            la lista. Por eso no ponemos puntajes ni nos declaramos ganadores: las agencias van en orden alfabético, cada dato
            tiene su fuente enlazada y solo usamos lo que cada agencia publica en su sitio o en directorios abiertos. Si
            trabajas en una de estas agencias y algún dato cambió, escríbenos a contacto@mulleryperez.cl y lo corregimos.
          </div>

          {c.intro.map((t, i) => (
            <p key={i} className={p + ' text-lg'}>{t}</p>
          ))}

          <h2 className={h2}>Cómo hicimos esta comparativa</h2>
          {c.metodo.map((t, i) => (
            <p key={i} className={p}>{t}</p>
          ))}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Lo que revisamos en cada agencia</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {c.criterios.map((k) => (
                <li key={k.nombre}><strong>{k.nombre}:</strong> {k.detalle}</li>
              ))}
            </ul>
          </div>

          <h2 className={h2}>Resumen en una tabla</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="text-left p-3">Agencia</th>
                  <th className="text-left p-3">Foco que declara</th>
                  <th className="text-left p-3">Conviene si…</th>
                </tr>
              </thead>
              <tbody>
                {c.agencias.map((a, i) => (
                  <tr key={a.nombre} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="p-3 font-semibold text-gray-900 align-top">{a.nombre}</td>
                    <td className="p-3 text-gray-700 align-top">{a.foco}</td>
                    <td className="p-3 text-gray-700 align-top">{a.convieneCorto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className={h2}>Las agencias, una por una</h2>
          <ol className="space-y-6">
            {c.agencias.map((a) => (
              <li key={a.nombre} className="border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{a.nombre}</h3>
                {a.ubicacion && <p className="text-sm text-gray-500 mb-3">{a.ubicacion}</p>}
                <p className={p}>{a.resumen}</p>
                <p className={p}><strong>Lo que se puede comprobar:</strong> {a.comprobable.join('; ')}.</p>
                <p className={p}><strong>Para quién conviene:</strong> {a.conviene}</p>
                <p className={p}><strong>Qué conviene preguntar antes de contratar:</strong> {a.preguntar}</p>
                <p className="text-sm text-gray-600">
                  Fuentes:{' '}
                  {a.fuentes.map((f, i) => (
                    <span key={f.url}>
                      <a href={f.url} target="_blank" rel="noopener" className="text-indigo-700 underline">{f.t}</a>
                      {i < a.fuentes.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ol>

          {c.secciones.map((s) => (
            <section key={s.titulo}>
              <h2 className={h2}>{s.titulo}</h2>
              {s.parrafos.map((t, i) => (
                <p key={i} className={p}>{t}</p>
              ))}
              {s.lista && (
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  {s.lista.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <h2 className={h2}>Preguntas frecuentes</h2>
          <div className="space-y-4">
            {c.faqs.map((f) => (
              <div key={f.q} className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-2">{f.q}</h3>
                <p className="text-gray-700 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>

          <h2 className={h2}>Fuentes generales</h2>
          <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
            {c.fuentesGenerales.map((f) => (
              <li key={f.url}>
                <a href={f.url} target="_blank" rel="noopener" className="text-indigo-700 underline">{f.t}</a>
              </li>
            ))}
          </ul>

          <div className="mt-12 bg-slate-900 text-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-3">Sigue leyendo</h2>
            <ul className="space-y-2">
              {c.relacionadas.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="underline text-indigo-200 hover:text-white">{r.t}</Link>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </main>
    </>
  )
}
