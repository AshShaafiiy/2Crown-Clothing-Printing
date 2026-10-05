const fs = require('fs');
const file = 'src/backend/utils/orderTracking.ts';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  /export const generateOrderReference = \(\) => \`2C-\$\{randomBytes.*?join\(\'-\'\)\}\`;/,
  `export const generateOrderReference = () => \`2C-\${Math.floor(100000 + Math.random() * 900000)}\`;`
);

data = data.replace(
  /export const REFERENCE_PATTERN = \/\^2C-\[A-F0-9\]\{8\}\(\?:-\[A-F0-9\]\{8\}\)\{3\}\$\/;/g,
  `export const REFERENCE_PATTERN = /^2C-\\d{6}$/i;`
);

fs.writeFileSync(file, data);
