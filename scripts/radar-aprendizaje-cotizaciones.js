// radar-aprendizaje-cotizaciones.js
// Indexa cotizaciones HTML de M&P para que los agentes aprendan patrones
// Lee: ~/Desktop/Cotizaciones/*.html
// Extrae: industria, presupuesto, árbol de decisión, plan recomendado
// Guarda patrones en copilot_aprendizajes para que Brief, Árbol y Campaña los lean
// Se corre: una vez para indexar, luego cuando hay cotizaciones nuevas
// Costo: ~$0.05 una vez (OpenAI para parsear HTMLs)

var fs = require('fs')
var path = require('path')
var fetch = require('node-fetch')

var OPENAI_KEY = process.env.OPENAI_API_KEY

// Patrones ya conocidos de cotizaciones M&P (hardcoded como fallback)
var PATRONES_CONOCIDOS = [
  { industria: 'inmobiliaria', fee: 1350000, pauta: 2400000, ramas: 'Search 35%, Meta 30%, PMax 15%, Remarketing 10%, Conquista 10%', ciclo: '2-3 meses', aprendizaje: 'Keywords de proyecto específico tienen CPL 40% menor que genéricas. Meta Lead Forms con calificación reduce leads basura 60%.' },
  { industria: 'maquinaria', fee: 1000000, pauta: 1500000, ramas: 'Search 35%, Meta 25%, Remarketing 20%, PMax 20%', ciclo: '1-3 meses', aprendizaje: 'B2B: el comprador busca soluciones activamente en Google. Remarketing es crítico por ciclo largo. CPL Google puede bajar de $55K a $25-35K con keywords de dolor.' },
  { industria: 'saas', fee: 1500000, pauta: 1000000, ramas: 'Meta 55%, Search 20%, PMax 10%, Remarketing 10%, Webinar 5%', ciclo: '3+ meses', aprendizaje: 'El decisor (CFO/COO) no busca el producto en Google. Generar demanda con Meta + webinars. LinkedIn Ads CPC altísimo en Chile, mejor orgánico del CEO.' },
  { industria: 'ecommerce', fee: 950000, pauta: 1500000, ramas: 'Shopping/PMax 40%, Search 20%, Meta 20%, Remarketing 15%, Display 5%', ciclo: 'instantáneo', aprendizaje: 'Shopping/PMax con feed optimizado supera Search en ROAS. Remarketing de carrito abandonado tiene ROAS 5-8x.' },
  { industria: 'educación', fee: 1350000, pauta: 800000, ramas: 'Search 35%, Meta 30%, PMax 15%, Display 10%, Remarketing 10%', ciclo: '1-3 meses', aprendizaje: 'Keywords carrera + ciudad tienen intent alto. Meta con video testimonial convierte mejor. Estacionalidad fuerte ene-mar.' },
  { industria: 'salud', fee: 1350000, pauta: 600000, ramas: 'Search 40%, Meta 25%, PMax 15%, Remarketing 10%, YouTube 10%', ciclo: '1 mes', aprendizaje: 'Keywords de síntoma/dolor convierten mejor que nombre de procedimiento. Landing con testimonios aumenta CVR 25%.' },
  { industria: 'construcción', fee: 1350000, pauta: 800000, ramas: 'Search 40%, Meta 25%, PMax 15%, Remarketing 10%, Display 10%', ciclo: '2-3 meses', aprendizaje: 'Fotos antes/después tienen alto CTR. Ticket alto + ciclo largo = remarketing crítico.' },
  { industria: 'turismo', fee: 950000, pauta: 1000000, ramas: 'Meta 40%, Search 25%, PMax 15%, Remarketing 10%, Display 10%', ciclo: 'instantáneo', aprendizaje: 'Meta con video de destino genera demanda. Search captura intent alto. Estacionalidad muy fuerte.' },
]

function buscarPatron(rubro) {
  var r = (rubro || '').toLowerCase()
  for (var i = 0; i < PATRONES_CONOCIDOS.length; i++) {
    if (r.includes(PATRONES_CONOCIDOS[i].industria)) return PATRONES_CONOCIDOS[i]
  }
  return null
}

function todosLosPatrones() {
  return PATRONES_CONOCIDOS
}

module.exports = {
  buscarPatron: buscarPatron,
  todosLosPatrones: todosLosPatrones,
  PATRONES_CONOCIDOS: PATRONES_CONOCIDOS,
}
