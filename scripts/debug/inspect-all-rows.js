const XLSX = require('xlsx');

const filePath = process.argv[2];
const workbook = XLSX.readFile(filePath);

console.log('='.repeat(80));
console.log('INFORMACIÓN DEL ARCHIVO:');
console.log('='.repeat(80));
console.log('Hojas encontradas:', workbook.SheetNames);
console.log('');

const sheetName = workbook.SheetNames[0];
console.log(`Procesando hoja: "${sheetName}"`);
console.log('='.repeat(80));

const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

console.log(`Total de filas: ${data.length}`);
console.log('');

// Contar cuántas tienen empresa
let conEmpresa = 0;
let sinEmpresa = 0;

data.forEach(row => {
  if (row['nombre_de_la_empresa'] && row['nombre_de_la_empresa'].trim() !== '') {
    conEmpresa++;
  } else {
    sinEmpresa++;
  }
});

console.log('='.repeat(80));
console.log('ANÁLISIS DE CAMPO "nombre_de_la_empresa":');
console.log('='.repeat(80));
console.log(`✅ Filas CON empresa: ${conEmpresa}`);
console.log(`❌ Filas SIN empresa: ${sinEmpresa}`);
console.log('');

// Mostrar algunas filas sin empresa
if (sinEmpresa > 0) {
  console.log('='.repeat(80));
  console.log('PRIMERAS 5 FILAS SIN EMPRESA:');
  console.log('='.repeat(80));

  let count = 0;
  for (let i = 0; i < data.length && count < 5; i++) {
    const row = data[i];
    if (!row['nombre_de_la_empresa'] || row['nombre_de_la_empresa'].trim() === '') {
      count++;
      console.log(`\nFila ${i + 1}:`);
      console.log(`  Email: ${row['email'] || 'N/A'}`);
      console.log(`  Teléfono: ${row['número_de_teléfono'] || 'N/A'}`);
      console.log(`  Nombre: ${row['full_name'] || 'N/A'}`);
      console.log(`  Empresa: "${row['nombre_de_la_empresa'] || ''}"`);
    }
  }
}
