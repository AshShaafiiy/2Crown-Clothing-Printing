const fs = require('fs');
const path = 'src/components/ui/ProductCard.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "<QuantityControl cartItemId={cartItem.id} quantity={cartItem.quantity} productName={product.name} />",
  "<QuantityControl cartItemId={cartItem.id} quantity={cartItem.quantity} productName={product.name} variant=\"card\" />"
);

fs.writeFileSync(path, content);
console.log("Updated ProductCard");
