const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('/Users/christophermuller/Downloads/ODEPA_Directorio_Agroindustria.xlsx');
const sheet = workbook.Sheets['Base_datos'];
const data = xlsx.utils.sheet_to_json(sheet, { defval: '' });

// Crear directorio único de empresas (sin duplicados por especie/proceso)
const empresasMap = new Map();

data.forEach(row => {
  const nombre = row.Empresa;
  if (!empresasMap.has(nombre)) {
    // Formatear teléfono para WhatsApp
    let telefono = String(row.Teléfono || '').replace(/\s/g, '');

    // Si el teléfono no empieza con +56, agregarlo
    if (telefono && !telefono.startsWith('+56') && !telefono.startsWith('56')) {
      // Si empieza con 9 (celular), agregar +569
      if (telefono.startsWith('9')) {
        telefono = '+569' + telefono.substring(1);
      }
      // Si empieza con 2 (fijo), agregar +562
      else if (telefono.startsWith('2')) {
        telefono = '+562' + telefono.substring(1);
      }
      // Si empieza con 3 (fijo regional), agregar +563
      else if (telefono.startsWith('3')) {
        telefono = '+563' + telefono.substring(1);
      }
      // Si empieza con otro, agregar +56
      else {
        telefono = '+56' + telefono;
      }
    }

    // Limpiar web (quitar espacios)
    const web = String(row.Web || '').trim();

    empresasMap.set(nombre, {
      Empresa: nombre,
      Región: row.Región,
      Comuna: row.Comuna,
      Dirección: (row.Dirección || '').trim(),
      Teléfono: telefono,
      Email: '', // No hay emails en ODEPA, dejar vacío
      Web: web === 'Sin pagina web' ? '' : web,
      Tipo: row.Proceso,
      Productos: row.Especie
    });
  } else {
    // Si la empresa ya existe, agregar más productos
    const empresa = empresasMap.get(nombre);
    if (empresa.Productos && !empresa.Productos.includes(row.Especie)) {
      empresa.Productos += ', ' + row.Especie;
    }
  }
});

// Convertir Map a array
const empresasUnicas = Array.from(empresasMap.values());

console.log(`✅ Total empresas únicas: ${empresasUnicas.length}`);
console.log(`   (De 472 filas originales con duplicados por especie/proceso)\n`);

// Mostrar primeras 5 empresas
console.log('🔍 Primeras 5 empresas:');
empresasUnicas.slice(0, 5).forEach((emp, i) => {
  console.log(`\n${i + 1}. ${emp.Empresa}`);
  console.log(`   Región: ${emp.Región} | Comuna: ${emp.Comuna}`);
  console.log(`   Teléfono: ${emp.Teléfono}`);
  console.log(`   Web: ${emp.Web}`);
});

// Exportar CSV final
const worksheet = xlsx.utils.json_to_sheet(empresasUnicas);
const csvString = xlsx.utils.sheet_to_csv(worksheet);
fs.writeFileSync('/Users/christophermuller/Downloads/Directorio_Agroindustria_JP_Procesos.csv', csvString);

console.log(`\n💾 Directorio final generado: Directorio_Agroindustria_JP_Procesos.csv`);
console.log(`   Total empresas: ${empresasUnicas.length}`);
console.log(`   Columnas: Empresa, Región, Comuna, Dirección, Teléfono, Email, Web, Tipo, Productos`);
