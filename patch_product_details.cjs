const fs = require('fs');
let code = fs.readFileSync('src/views/public/ProductDetails.tsx', 'utf8');

if (!code.includes("import { toCartItem }")) {
  code = code.replace("import { services }", "import { toCartItem } from '../../utils/cartUtils';\nimport { services }");
}

const replacement = `    const finalPreviousPrice = selectedVariant ? selectedVariant.previousPrice : product.previousPrice;
    
    addItem(toCartItem(
      product,
      1,
      selectedVariantId || undefined,
      variantName,
      Object.keys(finalCustomization).length > 0 ? finalCustomization : undefined,
      finalPrice,
      finalPreviousPrice
    ));`;

code = code.replace(/addItem\(\{\s*id: `cart-item-\$\{Date\.now\(\)\}`,\s*productId: product\.id,[\s\S]*?\}\);/, replacement);

fs.writeFileSync('src/views/public/ProductDetails.tsx', code);
