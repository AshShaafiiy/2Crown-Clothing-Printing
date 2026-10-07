const fs = require('fs');
let code = fs.readFileSync('src/components/ui/ProductCard.tsx', 'utf8');
code = code.replace(
  `    e.preventDefault();\n    addItem(toCartItem(product, 1));`,
  `    e.preventDefault();\n    e.stopPropagation();\n    addItem(toCartItem(product, 1));`
);
fs.writeFileSync('src/components/ui/ProductCard.tsx', code);
