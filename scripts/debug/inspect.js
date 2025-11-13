const XLSX = require('xlsx');

const filePath = process.argv[2];
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

console.log('='.repeat(80));
console.log('COLUMNAS DETECTADAS:');
console.log('='.repeat(80));

if (data.length > 0) {
  const columns = Object.keys(data[0]);
  columns.forEach((col, i) => {
    console.log(`${i + 1}. '${col}'`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('PRIMERAS 3 FILAS:');
  console.log('='.repeat(80));
  data.slice(0, 3).forEach((row, i) => {
    console.log(`\nFila ${i + 1}:`);
    Object.entries(row).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  });
}

console.log('\n' + '='.repeat(80));
console.log(`TOTAL FILAS: ${data.length}`);
console.log('='.repeat(80));
