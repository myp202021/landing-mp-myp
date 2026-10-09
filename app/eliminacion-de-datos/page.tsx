export const metadata = {
  title: 'Eliminación de datos | Muller y Pérez',
  description: 'Cómo solicitar la eliminación de tus datos personales tratados por Muller y Pérez.',
}

export default function EliminacionDatosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Eliminación de datos</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">Última actualización: Octubre 2026</p>
          <p className="text-gray-700 mb-4">
            Si nos escribiste por un formulario, por Instagram o por Messenger a una empresa que trabaja con
            Muller y Pérez, o si dejaste tus datos en un anuncio de Facebook o Instagram, puedes pedir que
            eliminemos tu información en cualquier momento.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Cómo solicitarlo</h2>
          <ol className="list-decimal pl-6 text-gray-700 space-y-1 mb-4">
            <li>Escribe a <a href="mailto:contacto@mulleryperez.cl" className="text-blue-600 hover:underline">contacto@mulleryperez.cl</a> con el asunto &quot;Eliminación de datos&quot;.</li>
            <li>Indica tu nombre y el dato con que nos contactaste (correo, teléfono o usuario de Instagram o Facebook) y, si lo sabes, la empresa a la que escribiste.</li>
            <li>Eliminamos tus datos de nuestros sistemas en un plazo máximo de 30 días y te confirmamos por correo.</li>
          </ol>
          <p className="text-gray-700">
            También puedes quitar el acceso de nuestra aplicación desde la configuración de tu cuenta de Facebook,
            en Configuración y privacidad, Integraciones comerciales. Más detalles en nuestra{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">Política de Privacidad</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
