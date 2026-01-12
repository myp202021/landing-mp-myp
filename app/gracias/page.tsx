import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, Calendar, MessageSquare, ArrowRight } from 'lucide-react'

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

        {/* Recursos adicionales */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Mientras tanto, explora nuestras herramientas gratuitas:</p>
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
  )
}
