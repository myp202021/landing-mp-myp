export const metadata = {
  title: 'Política de Privacidad - M&P Intelligence Tool',
  description: 'Política de privacidad de M&P Intelligence Tool',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>

        <div className="prose prose-lg">
          <p className="text-gray-600 mb-6">
            Última actualización: 16 de octubre de 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Información que recopilamos</h2>
            <p className="text-gray-700 mb-4">
              M&P Intelligence Tool ("nosotros", "nuestro") recopila la siguiente información:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Información de perfil público de Facebook (nombre, foto de perfil)</li>
              <li>Dirección de email para comunicación</li>
              <li>Historial de búsquedas realizadas en la herramienta</li>
              <li>Datos de uso de la aplicación (análitica web)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Cómo usamos tu información</h2>
            <p className="text-gray-700 mb-4">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Proporcionar y mejorar nuestros servicios de análisis competitivo</li>
              <li>Autenticar tu identidad al acceder a la herramienta</li>
              <li>Enviar notificaciones sobre el estado de tus búsquedas</li>
              <li>Analizar el uso de la herramienta para mejoras</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Compartir información</h2>
            <p className="text-gray-700 mb-4">
              NO vendemos ni compartimos tu información personal con terceros, excepto:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Cuando sea requerido por ley</li>
              <li>Con proveedores de servicios que nos ayudan a operar (ej: hosting, analytics)</li>
              <li>Con tu consentimiento explícito</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Datos de Facebook</h2>
            <p className="text-gray-700 mb-4">
              Nuestra aplicación accede a datos públicos de la Biblioteca de Anuncios de Meta (Facebook Ad Library).
              Solo accedemos a anuncios que son públicamente visibles y no recopilamos datos privados de usuarios.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Seguridad</h2>
            <p className="text-gray-700 mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra
              acceso no autorizado, alteración, divulgación o destrucción.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Tus derechos</h2>
            <p className="text-gray-700 mb-4">
              Tienes derecho a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Acceder a tu información personal</li>
              <li>Corregir información inexacta</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Retirar tu consentimiento en cualquier momento</li>
              <li>Exportar tus datos en formato legible</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contacto</h2>
            <p className="text-gray-700 mb-4">
              Para ejercer tus derechos o consultas sobre privacidad, contáctanos:
            </p>
            <ul className="list-none pl-0 text-gray-700 space-y-2">
              <li><strong>Email:</strong> contacto@mulleryperez.com</li>
              <li><strong>Teléfono:</strong> +56 9 9225 8137</li>
              <li><strong>Dirección:</strong> Av. Apoquindo 3000, Piso 10, Las Condes, Santiago, Chile</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Cambios a esta política</h2>
            <p className="text-gray-700 mb-4">
              Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos
              por email o mediante un aviso destacado en nuestra aplicación.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Cookies y tecnologías similares</h2>
            <p className="text-gray-700 mb-4">
              Utilizamos cookies y tecnologías similares para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Mantener tu sesión activa</li>
              <li>Recordar tus preferencias</li>
              <li>Analizar el tráfico y uso de la aplicación (Google Analytics)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
