const fs = require('fs');
let code = fs.readFileSync('src/components/ui/ProductCard.tsx', 'utf8');

if (!code.includes("import { toCartItem }")) {
  code = code.replace("import { services }", "import { toCartItem } from '../../utils/cartUtils';\nimport { services }");
}

code = code.replace(/addItem\(\{[\s\S]*?imageUrl: product\.imageUrl,\s*\}\);/, "addItem(toCartItem(product, 1));");

fs.writeFileSync('src/components/ui/ProductCard.tsx', code);
