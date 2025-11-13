export default function ConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Términos y Condiciones de Servicio
        </h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Última actualización: Noviembre 2025
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Aceptación de Términos
            </h2>
            <p className="text-gray-700">
              Al acceder y utilizar este servicio, aceptas estar sujeto a estos
              términos y condiciones. Si no estás de acuerdo con alguna parte de
              estos términos, no debes utilizar nuestro servicio.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Descripción del Servicio
            </h2>
            <p className="text-gray-700">
              Proporcionamos servicios de marketing digital, gestión de campañas
              publicitarias y análisis de datos. Utilizamos integraciones con
              plataformas como Facebook para mejorar la eficiencia de nuestros servicios.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Uso del Servicio
            </h2>
            <p className="text-gray-700 mb-2">
              Te comprometes a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Proporcionar información precisa y actualizada</li>
              <li>Utilizar el servicio de manera legal y ética</li>
              <li>No interferir con el funcionamiento del servicio</li>
              <li>Cumplir con todas las leyes aplicables</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Privacidad
            </h2>
            <p className="text-gray-700">
              Tu privacidad es importante para nosotros. Consulta nuestra{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Política de Privacidad
              </a>
              {' '}para entender cómo manejamos tu información personal.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Limitación de Responsabilidad
            </h2>
            <p className="text-gray-700">
              No seremos responsables por daños indirectos, incidentales, especiales
              o consecuentes que resulten del uso o la imposibilidad de usar nuestro servicio.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Modificaciones
            </h2>
            <p className="text-gray-700">
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
              Los cambios entrarán en vigor inmediatamente después de su publicación.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Contacto
            </h2>
            <p className="text-gray-700">
              Para preguntas sobre estos términos y condiciones:
            </p>
            <p className="text-gray-700 mt-2">
              Email: <a href="mailto:marcela@mulleryperez.com" className="text-blue-600 hover:underline">
                marcela@mulleryperez.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
