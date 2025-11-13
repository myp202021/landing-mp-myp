-- CREAR LEADS DE PRUEBA PARA VERIFICAR ELIMINACIÓN

-- Insertar 2 leads de prueba para el cliente M&P
INSERT INTO leads (cliente_id, nombre, email, telefono, mensaje, origen, fecha_ingreso)
VALUES
  (
    'b1f839a4-db36-4341-b1b3-7d1ec290ca02',
    'Lead de Prueba 1',
    'prueba1@test.com',
    '+56912345678',
    'Este es un lead de prueba para verificar eliminación',
    'manual',
    NOW()
  ),
  (
    'b1f839a4-db36-4341-b1b3-7d1ec290ca02',
    'Lead de Prueba 2',
    'prueba2@test.com',
    '+56987654321',
    'Segundo lead de prueba',
    'manual',
    NOW()
  );

-- Verificar que se crearon
SELECT id, nombre, email, fecha_ingreso
FROM leads
WHERE cliente_id = 'b1f839a4-db36-4341-b1b3-7d1ec290ca02'
ORDER BY fecha_ingreso DESC;
