const xlsx = require('xlsx');
const fs = require('fs');

// Importar el directorio
const empresas = require('./directorio_manufactura_santiago.js');

console.log('🏭 Generando directorio de empresas manufactureras y logísticas...\n');

// Crear un nuevo libro de trabajo
const workbook = xlsx.utils.book_new();

// Convertir el array de empresas a hoja de cálculo con encabezados personalizados
const worksheet = xlsx.utils.json_to_sheet(empresas, {
  header: ['nombre', 'region', 'comuna', 'direccion', 'telefono', 'email', 'sitioWeb', 'tipoIndustria', 'cargoObjetivo']
});

// Reemplazar los encabezados con nombres en español
const headers = {
  A1: { v: 'Empresa', t: 's' },
  B1: { v: 'Región', t: 's' },
  C1: { v: 'Comuna', t: 's' },
  D1: { v: 'Dirección', t: 's' },
  E1: { v: 'Teléfono', t: 's' },
  F1: { v: 'Email', t: 's' },
  G1: { v: 'Sitio Web', t: 's' },
  H1: { v: 'Tipo Industria', t: 's' },
  I1: { v: 'Cargo Objetivo', t: 's' }
};

// Aplicar los encabezados
Object.keys(headers).forEach(key => {
  worksheet[key] = headers[key];
});

// Definir ancho de columnas
const columnWidths = [
  { wch: 45 }, // Empresa
  { wch: 15 }, // Región
  { wch: 18 }, // Comuna
  { wch: 55 }, // Dirección
  { wch: 18 }, // Teléfono
  { wch: 40 }, // Email
  { wch: 35 }, // Sitio Web
  { wch: 30 }, // Tipo Industria
  { wch: 45 }  // Cargo Objetivo
];
worksheet['!cols'] = columnWidths;

// Agregar la hoja al libro
xlsx.utils.book_append_sheet(workbook, worksheet, 'Directorio Empresas');

// Generar el archivo Excel con fecha
const fecha = new Date().toISOString().split('T')[0];
const nombreArchivo = `/Users/christophermuller/Downloads/Directorio_Manufactura_Logistica_Santiago_${fecha}.xlsx`;

// Escribir el archivo
xlsx.writeFile(workbook, nombreArchivo);

// Estadísticas
const totalEmpresas = empresas.length;
const comunas = [...new Set(empresas.map(e => e.comuna))].sort();
const tiposIndustria = [...new Set(empresas.map(e => e.tipoIndustria))].sort();

console.log('✅ ARCHIVO EXCEL GENERADO EXITOSAMENTE');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`📁 Archivo: ${nombreArchivo}`);
console.log(`📊 Total de empresas: ${totalEmpresas}`);
console.log(`\n🏘️  Comunas cubiertas (${comunas.length}):`);
comunas.forEach(comuna => {
  const count = empresas.filter(e => e.comuna === comuna).length;
  console.log(`   • ${comuna}: ${count} empresas`);
});
console.log(`\n🏭 Tipos de industria (${tiposIndustria.length}):`);
tiposIndustria.forEach(tipo => {
  const count = empresas.filter(e => e.tipoIndustria === tipo).length;
  console.log(`   • ${tipo}: ${count} empresas`);
});
console.log('\n💼 Cargos objetivo:');
console.log('   • Gerente de Operaciones');
console.log('   • Jefe de Logística');
console.log('   • Coordinador de Producción');
console.log('   • Gerente de Producción');
console.log('   • Encargado de Seguridad Industrial');
console.log('   • Gerente de Adquisiciones');
console.log('\n📞 FORMATO TELÉFONOS: +56XXXXXXXXX (listo para WhatsApp)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
