export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Eliminación de Datos
        </h1>

        <div className="prose prose-gray max-w-none">
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Solicitar Eliminación de Datos
            </h2>
            <p className="text-gray-700 mb-4">
              Si deseas que eliminemos tu información personal de nuestros sistemas,
              puedes solicitar la eliminación de tus datos siguiendo estos pasos:
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Proceso de Eliminación
            </h2>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>
                Envía un correo electrónico a:{' '}
                <a href="mailto:marcela@mulleryperez.com" className="text-blue-600 hover:underline">
                  marcela@mulleryperez.com
                </a>
              </li>
              <li>
                En el asunto del correo, escribe: "Solicitud de eliminación de datos"
              </li>
              <li>
                En el cuerpo del mensaje, incluye:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Tu nombre completo</li>
                  <li>Dirección de correo electrónico asociada a tus datos</li>
                  <li>Número de teléfono (si lo proporcionaste)</li>
                  <li>Cualquier otra información que nos ayude a identificar tus datos</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Tiempo de Procesamiento
            </h2>
            <p className="text-gray-700">
              Procesaremos tu solicitud en un plazo de 30 días hábiles desde la recepción.
              Te enviaremos una confirmación una vez que tus datos hayan sido eliminados.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Qué Información se Eliminará
            </h2>
            <p className="text-gray-700 mb-2">
              Al procesar tu solicitud, eliminaremos:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Tu nombre y apellido</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Información de empresa</li>
              <li>Cualquier otra información personal que hayas proporcionado</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Excepciones
            </h2>
            <p className="text-gray-700">
              Podemos retener cierta información si es necesario para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Cumplir con obligaciones legales</li>
              <li>Resolver disputas</li>
              <li>Hacer cumplir nuestros acuerdos</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Contacto
            </h2>
            <p className="text-gray-700">
              Si tienes preguntas sobre el proceso de eliminación de datos:
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
