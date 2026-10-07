const fs = require('fs');
let code = fs.readFileSync('src/components/ui/ProductCard.tsx', 'utf8');

code = code.replace(
  /py-2 sm:py-2\.5/g,
  'py-2.5'
);

fs.writeFileSync('src/components/ui/ProductCard.tsx', code);
