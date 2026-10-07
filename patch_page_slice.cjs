const fs = require('fs');
let code = fs.readFileSync('app/(public)/page.tsx', 'utf8');

code = code.replace(
  'const products = allProds.filter(p => p.featured && p.active).slice(0, 4);',
  'const products = allProds.filter(p => p.featured && p.active).slice(0, 5);'
);

fs.writeFileSync('app/(public)/page.tsx', code);
