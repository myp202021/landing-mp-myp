import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { CheckCircle2, MessageSquare, ArrowRight, Download, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gracias por Contactarnos | Muller y Pérez',
  description: 'Hemos recibido tu mensaje. Nuestro equipo te contactará en menos de 24 horas.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function GraciasPage() {
  return (
    <>
      {/* Google Ads Conversion Tracking */}
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {
            'send_to': 'AW-17056298226/lead_form',
            'value': 1.0,
            'currency': 'CLP'
          });
        `}
      </Script>

    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header simple */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/">
            <Image
              src="/logo-color.png"
              alt="Muller y Pérez"
              width={140}
              height={45}
              className="h-10 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
          {/* Icono de éxito */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¡Gracias por contactarnos!
          </h1>

          {/* Mensaje */}
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Hemos recibido tu mensaje correctamente. Nuestro equipo de estrategas
            te contactará en <strong className="text-blue-600">menos de 24 horas hábiles</strong>.
          </p>

          {/* Qué esperar */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">¿Qué sigue ahora?</h2>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Revisamos tu caso</p>
                  <p className="text-sm text-gray-600">Analizamos tu industria y necesidades</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Te contactamos</p>
                  <p className="text-sm text-gray-600">Por email o WhatsApp</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Reunión estratégica</p>
                  <p className="text-sm text-gray-600">Sin costo ni compromiso</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/56992258137?text=Hola%20M%26P%2C%20acabo%20de%20enviar%20un%20formulario%20y%20quiero%20agendar%20una%20reuni%C3%B3n"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              Contactar por WhatsApp
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Volver al inicio
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Bonus: eBook gratis */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Download className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Mientras esperas, descarga gratis</h3>
              <p className="text-blue-100 mb-4">
                eBook: Marketing con Datos 2025 - Guía completa para tomar decisiones basadas en datos reales
              </p>
              <a
                href="/recursos/ebook-marketing-datos-2025.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all"
              >
                <Download className="w-5 h-5" />
                Descargar eBook Gratis
              </a>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="font-semibold text-gray-800 ml-2">4.9/5</span>
          </div>
          <p className="text-gray-600 text-center italic">
            &ldquo;M&P nos ayudó a reducir nuestro costo por lead en un 45%. Su enfoque basado en datos realmente funciona.&rdquo;
          </p>
          <p className="text-sm text-gray-500 text-center mt-2">
            — Cliente del sector SaaS
          </p>
        </div>

        {/* Recursos adicionales */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-4">Explora nuestras herramientas gratuitas:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/labs/predictor"
              className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:shadow-md transition-all"
            >
              Predictor Google Ads
            </Link>
            <Link
              href="/utilidades/calculadora-cac"
              className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:shadow-md transition-all"
            >
              Calculadora CAC
            </Link>
            <Link
              href="/blog"
              className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:shadow-md transition-all"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>

      {/* Footer simple */}
      <footer className="bg-slate-900 text-white py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-blue-200 text-sm">
            © {new Date().getFullYear()} Muller y Pérez. Agencia de Marketing Digital y Performance.
          </p>
        </div>
      </footer>
    </main>
    </>
  )
}
