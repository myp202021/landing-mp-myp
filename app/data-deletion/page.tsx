export const metadata = {
  title: 'Eliminación de Datos - M&P Intelligence Tool',
  description: 'Instrucciones para solicitar la eliminación de datos personales',
}

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Eliminación de Datos de Usuario</h1>

        <div className="prose prose-lg">
          <p className="text-gray-600 mb-6">
            Última actualización: 16 de octubre de 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Instrucciones para eliminar tus datos</h2>
            <p className="text-gray-700 mb-4">
              Si deseas eliminar todos tus datos personales de M&P Intelligence Tool, sigue estos pasos:
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Opción 1: Solicitud por email</h2>
            <ol className="list-decimal pl-6 text-gray-700 space-y-3">
              <li>Envía un email a: <strong>contacto@mulleryperez.com</strong></li>
              <li>Asunto: "Solicitud de eliminación de datos - M&P Intelligence"</li>
              <li>
                En el cuerpo del mensaje, incluye:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Tu nombre completo</li>
                  <li>Email asociado a tu cuenta</li>
                  <li>Facebook User ID (si lo conoces)</li>
                </ul>
              </li>
              <li>Procesaremos tu solicitud en un plazo máximo de <strong>30 días</strong></li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Opción 2: Solicitud por WhatsApp</h2>
            <p className="text-gray-700 mb-4">
              Envía un mensaje a: <strong>+56 9 9225 8137</strong> indicando:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>"Solicito eliminar mis datos de M&P Intelligence Tool"</li>
              <li>Tu email asociado a la cuenta</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Te confirmaremos por el mismo medio cuando la eliminación esté completa.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">¿Qué datos se eliminarán?</h2>
            <p className="text-gray-700 mb-4">
              Al solicitar la eliminación, removeremos permanentemente:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Tu información de perfil (nombre, email, foto)</li>
              <li>Historial de búsquedas realizadas</li>
              <li>Preferencias y configuraciones</li>
              <li>Cualquier dato analítico asociado a tu cuenta</li>
            </ul>
          </section>

          <section className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-6">
            <h3 className="text-xl font-semibold mb-3 text-yellow-900">⚠️ Importante</h3>
            <p className="text-gray-800">
              La eliminación de datos es <strong>irreversible</strong>. Una vez procesada tu solicitud,
              no podremos recuperar tu información. Si deseas volver a usar M&P Intelligence Tool,
              deberás crear una cuenta nueva.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Datos que NO podemos eliminar</h2>
            <p className="text-gray-700 mb-4">
              Por razones legales y de seguridad, conservaremos:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Registros de transacciones financieras (si aplicable) - según legislación tributaria chilena</li>
              <li>Logs de seguridad agregados y anonimizados</li>
              <li>Datos requeridos por ley durante el período de retención legal</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Tiempo de procesamiento</h2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
              <p className="text-gray-800">
                <strong>Plazo máximo:</strong> 30 días hábiles desde la recepción de tu solicitud.
              </p>
              <p className="text-gray-800 mt-2">
                <strong>Plazo habitual:</strong> 7-10 días hábiles.
              </p>
              <p className="text-gray-800 mt-2">
                Recibirás una confirmación por email cuando tus datos hayan sido eliminados.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
            <p className="text-gray-700 mb-4">
              Si tienes preguntas sobre el proceso de eliminación de datos:
            </p>
            <ul className="list-none pl-0 text-gray-700 space-y-2">
              <li><strong>Email:</strong> contacto@mulleryperez.com</li>
              <li><strong>WhatsApp:</strong> +56 9 9225 8137</li>
              <li><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00 CLT</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Callback URL para desarrolladores</h2>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
              <p className="text-gray-700">POST https://www.mulleryperez.cl/api/data-deletion</p>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Este endpoint procesa automáticamente las solicitudes de eliminación de datos enviadas desde Facebook.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
