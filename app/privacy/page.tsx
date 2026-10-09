export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Política de Privacidad
        </h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Última actualización: Octubre 2026
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
              4. Mensajes de Instagram y Messenger de nuestros clientes
            </h2>
            <p className="text-gray-700 mb-2">
              Cuando una empresa cliente nos autoriza expresamente, nuestra aplicación lee los mensajes
              directos que las personas envían a la cuenta de Instagram o a la página de Facebook de esa
              empresa, a través de las APIs oficiales de Meta. Usamos esa información solo para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Registrar cada consulta como un contacto (lead) en el sistema de seguimiento del cliente</li>
              <li>Medir si la empresa respondió cada consulta y en cuánto tiempo</li>
              <li>Identificar la propiedad, producto o servicio consultado, para reportes agregados</li>
            </ul>
            <p className="text-gray-700 mt-2">
              No vendemos ni compartimos esta información con terceros, no la usamos para publicidad propia
              y solo la ven la empresa cliente y el equipo de Muller y Pérez que atiende su cuenta. Los datos
              se conservan mientras dure el servicio con el cliente y se eliminan al terminarlo o cuando la
              persona lo solicite.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Eliminación de datos
            </h2>
            <p className="text-gray-700">
              Puedes pedir que eliminemos tus datos en cualquier momento. Las instrucciones están en{' '}
              <a href="/eliminacion-de-datos" className="text-blue-600 hover:underline">mulleryperez.cl/eliminacion-de-datos</a>.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Contacto
            </h2>
            <p className="text-gray-700">
              Para preguntas sobre esta política de privacidad, contáctanos en:
            </p>
            <p className="text-gray-700 mt-2">
              Email: <a href="mailto:contacto@mulleryperez.cl" className="text-blue-600 hover:underline">
                contacto@mulleryperez.cl
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
