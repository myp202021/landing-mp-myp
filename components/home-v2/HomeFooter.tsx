'use client'

import { trackWhatsAppClick } from '@/lib/meta-pixel'
import Link from 'next/link'
import Image from 'next/image'

/** Footer del home (idéntico al anterior: mantiene los enlaces internos). */
export default function HomeFooter() {
  return (
      <footer className="bg-slate-900 text-white py-16 px-6" role="contentinfo">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-8 mb-12">
            {/* Columna 1: Sobre M&P */}
            <div className="col-span-2 md:col-span-1">
              <Image
                src="/logo-blanco.png"
                alt="Muller y Pérez - Agencia de Marketing Digital"
                width={140}
                height={45}
                className="h-10 w-auto mb-4"
                loading="lazy"
              />
              <p className="text-blue-200 text-sm mb-5 leading-relaxed max-w-xs">
                Agencia de Performance Marketing especializada en Google Ads, Meta Ads y estrategias data-driven.
              </p>
              <a
                href="https://wa.me/56992258137?text=Hola%20M%26P%2C%20quiero%20mejorar%20mis%20resultados%20en%20marketing%20digital"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick({ page: 'footer', servicio: 'general' })}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Conversemos
              </a>
            </div>
    
            {/* Columna 2: Servicios */}
            <div>
              <h3 className="text-white font-bold text-sm mb-4">Servicios</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/servicios/google-ads-chile" className="text-blue-200 hover:text-white transition-colors">Google Ads</Link></li>
                <li><Link href="/servicios/meta-ads-chile" className="text-blue-200 hover:text-white transition-colors">Meta Ads</Link></li>
                <li><Link href="/servicios/performance-marketing" className="text-blue-200 hover:text-white transition-colors">Performance</Link></li>
                <li><Link href="/servicios/seo-chile" className="text-blue-200 hover:text-white transition-colors">SEO</Link></li>
                <li><Link href="/agencia-marketing-digital-chile" className="text-blue-200 hover:text-white transition-colors">Marketing Digital Chile</Link></li>
                <li><Link href="/mejores-agencias-marketing-digital-chile" className="text-blue-200 hover:text-white transition-colors">Mejores agencias de Chile 2026</Link></li>
                <li className="pt-1"><Link href="/servicios" className="text-blue-400 hover:text-white transition-colors font-medium">Ver todos →</Link></li>
              </ul>
            </div>
    
            {/* Columna 3: Por Industria */}
            <div>
              <h3 className="text-white font-bold text-sm mb-4">Por Industria</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/marketing-digital-ecommerce-chile" className="text-blue-200 hover:text-white transition-colors">Ecommerce</Link></li>
                <li><Link href="/marketing-digital-b2b-chile" className="text-blue-200 hover:text-white transition-colors">B2B</Link></li>
                <li><Link href="/marketing-digital-saas-chile" className="text-blue-200 hover:text-white transition-colors">SaaS</Link></li>
                <li><Link href="/marketing-digital-legal-chile" className="text-blue-200 hover:text-white transition-colors">Legal</Link></li>
                <li><Link href="/marketing-digital-seguros-chile" className="text-blue-200 hover:text-white transition-colors">Seguros</Link></li>
                <li><Link href="/marketing-digital-turismo-chile" className="text-blue-200 hover:text-white transition-colors">Turismo</Link></li>
                <li><Link href="/marketing-digital-manufactura-chile" className="text-blue-200 hover:text-white transition-colors">Manufactura</Link></li>
                <li className="pt-1"><Link href="/industrias" className="text-blue-400 hover:text-white transition-colors font-medium">Ver todas →</Link></li>
              </ul>
            </div>
    
            {/* Columna 4: Por Ciudad */}
            <div>
              <h3 className="text-white font-bold text-sm mb-4">Por Ciudad</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/agencia-marketing-digital-santiago" className="text-blue-200 hover:text-white transition-colors">Santiago</Link></li>
                <li><Link href="/agencia-marketing-digital-concepcion" className="text-blue-200 hover:text-white transition-colors">Concepción</Link></li>
                <li><Link href="/agencia-marketing-digital-valparaiso" className="text-blue-200 hover:text-white transition-colors">Valparaíso</Link></li>
                <li><Link href="/agencia-marketing-digital-antofagasta" className="text-blue-200 hover:text-white transition-colors">Antofagasta</Link></li>
                <li><Link href="/agencia-marketing-digital-puerto-montt" className="text-blue-200 hover:text-white transition-colors">Puerto Montt</Link></li>
                <li><Link href="/agencia-marketing-digital-las-condes" className="text-blue-200 hover:text-white transition-colors">Las Condes</Link></li>
                <li><Link href="/agencia-marketing-digital-vitacura" className="text-blue-200 hover:text-white transition-colors">Vitacura</Link></li>
                <li><Link href="/agencia-marketing-digital-la-dehesa" className="text-blue-200 hover:text-white transition-colors">La Dehesa</Link></li>
              </ul>
            </div>
    
            {/* Columna 5: Recursos */}
            <div>
              <h3 className="text-white font-bold text-sm mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/nosotros" className="text-blue-200 hover:text-white transition-colors">Quiénes Somos</Link></li>
                <li><Link href="/blog" className="text-blue-200 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/labs" className="text-blue-200 hover:text-white transition-colors">M&P Labs</Link></li>
                <li><Link href="/utilidades" className="text-blue-200 hover:text-white transition-colors">Utilidades</Link></li>
                <li><Link href="/indicadores" className="text-blue-200 hover:text-white transition-colors">Indicadores Marketing</Link></li>
                <li><Link href="/agentes-ia" className="text-blue-200 hover:text-white transition-colors">Agentes IA en producción</Link></li>
                <li><Link href="/boost-seo-ia" className="text-blue-200 hover:text-white transition-colors">Boost SEO + IA</Link></li>
                <li><Link href="/investigacion" className="text-blue-200 hover:text-white transition-colors">Investigación</Link></li>
                <li><Link href="/casos-de-exito" className="text-blue-200 hover:text-white transition-colors">Casos de Éxito</Link></li>
                <li><Link href="/comparativa/muller-perez-vs-agencias-chile" className="text-blue-200 hover:text-white transition-colors">M&P vs Agencias</Link></li>
                <li className="pt-1"><Link href="/recursos" className="text-blue-400 hover:text-white transition-colors font-medium">Ver todos →</Link></li>
              </ul>
            </div>
    
            {/* Columna 5: Contacto */}
            <div>
              <h3 className="text-white font-bold text-sm mb-4">Contacto</h3>
              <ul className="space-y-3 text-sm">
                <li className="text-blue-200">
                  <strong className="text-white block">Las Condes</strong>
                  Badajoz 100, Of 523
                </li>
                <li>
                  <a href="mailto:contacto@mulleryperez.cl" className="text-blue-200 hover:text-white transition-colors">
                    contacto@mulleryperez.cl
                  </a>
                </li>
                <li>
                  <a href="tel:+56992258137" className="text-blue-200 hover:text-white transition-colors">
                    +56 9 9225 8137
                  </a>
                </li>
                <li className="text-blue-200 text-xs">
                  Lun-Jue 09:00-18:00<br />
                  Vie 09:00-15:00
                </li>
              </ul>
            </div>
          </div>
    
          {/* Bottom: Redes Sociales + Copyright */}
          <div className="pt-8 border-t border-blue-900/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Redes Sociales */}
              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/company/m%C3%BCller-y-p%C3%A9rez/?viewAsMember=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                  aria-label="LinkedIn M&P"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/channel/UCgzocZZQLNnthZ82oEyblrA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                  aria-label="YouTube M&P"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/mktdigital.myp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                  aria-label="Instagram M&P"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@mulleryperez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                  aria-label="TikTok M&P"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a
                  href="https://www.google.com/maps/place/M%C3%BCller+y+P%C3%A9rez+Agencia+Digital/@-33.4082192,-70.5754085,17z/data=!3m1!4b1!4m6!3m5!1s0x9662cf8ad2cd9fbf:0xa33471793df8d335!8m2!3d-33.4082237!4d-70.5728336!16s%2Fg%2F11jvfwf3zg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                  aria-label="Google Business Profile M&P"
                  title="Ver en Google Maps"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 6.125 7.5 13.5 8.086 14.086a1 1 0 001.414 0C13.586 22 21.5 14.625 21.5 8.5 21.5 3.81 17.69 0 12 0zm0 12c-1.933 0-3.5-1.567-3.5-3.5S10.067 5 12 5s3.5 1.567 3.5 3.5S13.933 12 12 12z"/>
                  </svg>
                </a>
              </div>
    
              {/* Copyright */}
              <div className="text-center md:text-right">
                <p className="text-blue-300 text-sm">
                  © {new Date().getFullYear()} Muller y Pérez. Todos los derechos reservados.
                </p>
                <p className="text-blue-400 text-xs mt-1">
                  <Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidad</Link>
                  {' '} | {' '}
                  <Link href="/crm/login" className="hover:text-white transition-colors">Acceso Clientes</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>  )
}
