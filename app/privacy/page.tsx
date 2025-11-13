export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Política de Privacidad
        </h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Última actualización: Noviembre 2025
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Información que Recopilamos
            </h2>
            <p className="text-gray-700 mb-2">
              Recopilamos información que nos proporcionas directamente, incluyendo:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Nombre y apellido</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Información de empresa</li>
              <li>Información proporcionada a través de formularios de Lead Ads de Facebook</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Cómo Usamos tu Información
            </h2>
            <p className="text-gray-700 mb-2">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Responder a tus consultas y solicitudes</li>
              <li>Proporcionar servicios de marketing y publicidad</li>
              <li>Enviar comunicaciones relacionadas con nuestros servicios</li>
              <li>Mejorar nuestros servicios</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Integración con Facebook
            </h2>
            <p className="text-gray-700">
              Utilizamos la API de Facebook para recopilar información de leads generados
              a través de Facebook Lead Ads. Esta integración nos permite recibir la información
              que proporcionas voluntariamente al completar formularios en Facebook.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Contacto
            </h2>
            <p className="text-gray-700">
              Para preguntas sobre esta política de privacidad, contáctanos en:
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
