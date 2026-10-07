const fs = require('fs');
let code = fs.readFileSync('src/components/ui/ProductCard.tsx', 'utf8');

if (!code.includes("import { toCartItem }")) {
  code = code.replace(
    "import { ProductRatingDisplay } from './ProductRatingDisplay';",
    "import { ProductRatingDisplay } from './ProductRatingDisplay';\nimport { toCartItem } from '../../utils/cartUtils';"
  );
  fs.writeFileSync('src/components/ui/ProductCard.tsx', code);
}
