                                                                  
  ┌──────────────────────────┬───────────────────────────────────────────────┐  
  │          Campo           │                     Valor                     │  
  ├──────────────────────────┼───────────────────────────────────────────────┤  
  │ Identificador del plan   │ RADAR-STARTER-MENSUAL                         │  
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ Nombre del plan          │ Radar Starter                                 │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ Moneda                   │ CLP                                           │
  ├──────────────────────────┼───────────────────────────────────────────────┤  
  │ Monto a cobrar           │ 34990                                         │  
  ├──────────────────────────┼───────────────────────────────────────────────┤  
  │ Días de prueba gratis    │ 7                                             │  
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ URL de confirmación      │ https://www.mulleryperez.cl/api/webhooks/flow │  
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ N° de reintento de       │ 3                                             │  
  │ cargos                   │                                               │
  ├──────────────────────────┼───────────────────────────────────────────────┤  
  │ Conversión de moneda     │ Pago                                          │
  ├──────────────────────────┼───────────────────────────────────────────────┤  
  │ Día antes de vencimiento │ 3                                             │
  ├──────────────────────────┼───────────────────────────────────────────────┤  
  │ Frecuencia de cobro      │ Mensual                                       │  
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ Duración del plan        │ Indefinido                                    │  
  └──────────────────────────┴───────────────────────────────────



Click Crear y después repite para los otros 5:
                                                                                
  ┌─────┬────────────────────────┬────────────┬─────────┬────────────┬───────┐
  │  #  │     Identificador      │   Nombre   │  Monto  │ Frecuencia │ Trial │  
  ├─────┼────────────────────────┼────────────┼─────────┼────────────┼───────┤
  │     │                        │ Radar      │         │            │       │  
  │ 2   │ RADAR-STARTER-ANUAL    │ Starter    │ 335880  │ Anual      │ 7     │
  │     │                        │ Anual      │         │            │       │  
  ├─────┼────────────────────────┼────────────┼─────────┼────────────┼───────┤
  │ 3   │ RADAR-PRO-MENSUAL      │ Radar Pro  │ 69990   │ Mensual    │ 7     │
  ├─────┼────────────────────────┼────────────┼─────────┼────────────┼───────┤  
  │ 4   │ RADAR-PRO-ANUAL        │ Radar Pro  │ 659880  │ Anual      │ 7     │
  │     │                        │ Anual      │         │            │       │  
  ├─────┼────────────────────────┼────────────┼─────────┼────────────┼───────┤
  │ 5   │ RADAR-BUSINESS-MENSUAL │ Radar      │ 119990  │ Mensual    │ 7     │  
  │     │                        │ Business   │         │            │       │
  ├─────┼────────────────────────┼────────────┼─────────┼────────────┼───────┤  
  │     │                        │ Radar      │         │            │       │  
  │ 6   │ RADAR-BUSINESS-ANUAL   │ Business   │ 1139880 │ Anual      │ 7     │
  │     │                        │ Anual      │         │            │       │  
  └─────┴────────────────────────┴────────────┴─────────┴────────────┴───────┘
                                                                                
  Todos con la misma URL de confirmación:     
  https://www.mulleryperez.cl/api/webhooks/flow                                 
                                                            
  Cuando termines los 6, ve a Integraciones y pásame el apiKey y secretKey. Con 
  eso conecto todo.                       
                                                                                
※ recap: Estamos armando el producto Radar (clipping de RRSS como servicio con  
  cobro automático). Estabas creando los 6 planes en Flow.cl — te falta terminar
   de crearlos y pasarme las API keys de Integraciones para conectar con el     
  sitio.                                                                        
   
● How is Claude doing this session? (optional)                                  
