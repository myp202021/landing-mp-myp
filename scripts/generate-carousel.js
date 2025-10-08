// Script para generar el carrusel completo con todos los clientes

const clientes = [
  "Dezar", "Antarctic", "Harriot", "Imestre", "Animac", "O'Higgins", "Woo", "qiiip",
  "Bombas Braun", "Elock", "Bioclaro", "Rioclaro", "Qualis", "Safetech", "Genera",
  "Granardio", "Pinacuba", "Dekasa", "Elitsoft", "VIP", "Holdo", "Carabineros",
  "Phersu", "Grupo BTL", "Check It", "Invas", "Rocca", "Klapp", "First Pack",
  "Bestón", "Power Energy", "PlusRRHH", "Zero", "Huelpen", "InfoBite", "LimChile",
  "Seteminoze", "Evalc", "Rees Furniture", "Medical Care", "Cousino", "Idesami"
];

const generateClientCard = (nombre) => `                  <div className="bg-white px-6 py-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 h-20 flex items-center justify-center min-w-[140px]">
                    <span className="text-gray-400 font-bold text-base">${nombre}</span>
                  </div>`;

console.log(`          {/* Clientes - Carrusel con TODOS los logos */}
          <div className="mb-20">
            <h3 className="text-center text-sm font-bold text-gray-500 uppercase tracking-wider mb-8">
              Confían en nosotros
            </h3>
            <div className="relative overflow-hidden">
              <div className="flex gap-6 animate-scroll">
                {/* Primera ronda - TODOS los clientes (${clientes.length}) */}
                <div className="flex gap-6 items-center shrink-0">
${clientes.map(generateClientCard).join('\n')}
                </div>
                {/* Segunda ronda (duplicada para loop infinito seamless) */}
                <div className="flex gap-6 items-center shrink-0">
${clientes.map(generateClientCard).join('\n')}
                </div>
              </div>
            </div>
            <style jsx>{\`
              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .animate-scroll {
                animation: scroll 60s linear infinite;
              }
              .animate-scroll:hover {
                animation-play-state: paused;
              }
            \`}</style>
          </div>`);
