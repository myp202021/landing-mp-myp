'use client';

import { useState } from 'react';
import { Download, CheckCircle, TrendingUp, Target, BarChart3, Brain } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function EbookMarketingDatos2025() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/ebook-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al procesar la solicitud');
      }

      setIsSuccess(true);

      // Descargar el PDF automáticamente
      window.open('/recursos/ebook-marketing-datos-2025.pdf', '_blank');

      // Reset form
      setFormData({ name: '', email: '', company: '' });
    } catch (err) {
      setError('Hubo un error. Por favor, intenta nuevamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¡Descarga Iniciada!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            El ebook se está descargando automáticamente. Si no comienza, haz clic en el botón de abajo.
          </p>
          <a
            href="/recursos/ebook-marketing-datos-2025.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl mb-8"
          >
            <Download className="w-5 h-5" />
            Descargar Ebook
          </a>
          <div className="border-t pt-8">
            <p className="text-gray-700 mb-4">
              <strong>¿Necesitas ayuda con tu estrategia de marketing digital?</strong>
            </p>
            <a
              href="https://wa.me/56992258137?text=Hola%2C%20descargué%20el%20ebook%20y%20me%20gustaría%20una%20consultoría"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Agenda una Consultoría Gratuita
            </a>
          </div>
          <div className="mt-8">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-myp.png"
              alt="Muller y Pérez"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Ebook Cover & Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform">
              <div className="aspect-[3/4] relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <Brain className="w-20 h-20 text-white mx-auto mb-6" />
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    La Guía Definitiva del Marketing de Datos 2025
                  </h3>
                  <p className="text-blue-100 text-lg">
                    Estrategias, métricas y automatización con IA
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Ebook 100% Gratuito
              </h4>
              <p className="text-blue-800 text-sm">
                Descarga instantánea. Sin costos ocultos. Solo ingresa tu email y recibe el ebook completo en formato PDF.
              </p>
            </div>
          </div>

          {/* Right Column - Form & Benefits */}
          <div className="space-y-8">
            <div>
              <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Descarga Gratuita
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Domina el Marketing de Datos en 2025
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Aprende cómo las empresas líderes en Chile están usando datos e IA para reducir CAC, aumentar ROI y escalar sus campañas de forma predecible.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Estrategias Probadas</h3>
                  <p className="text-gray-600">Tácticas reales de empresas B2B y B2C en Chile</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Automatización con IA</h3>
                  <p className="text-gray-600">Cómo implementar lead scoring y atribución avanzada</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Métricas que Importan</h3>
                  <p className="text-gray-600">CAC, LTV, Payback Period y más con ejemplos reales</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Descarga tu Ebook Gratis
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                    Empresa (opcional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Procesando...'
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Descargar Ebook Ahora
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Al descargar aceptas recibir emails con contenido de valor sobre marketing digital. Puedes cancelar en cualquier momento.
                </p>
              </form>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>¿Prefieres hablar directamente con nosotros?</p>
              <a
                href="https://wa.me/56992258137"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Contáctanos por WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Muller y Pérez. Agencia de Marketing Digital en Chile.
          </p>
        </div>
      </footer>
    </div>
  );
}
