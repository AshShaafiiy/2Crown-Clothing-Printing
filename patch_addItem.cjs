const fs = require('fs');
let p1 = 'src/components/ui/ProductCard.tsx';
let c1 = fs.readFileSync(p1, 'utf8');
c1 = c1.replace(
  "price: product.price,",
  "price: product.price,\n      previousPrice: product.previousPrice,"
);
fs.writeFileSync(p1, c1);

let p2 = 'src/views/public/ProductDetails.tsx';
let c2 = fs.readFileSync(p2, 'utf8');
c2 = c2.replace(
  "price: selectedVariant ? selectedVariant.price : product.price,",
  "price: selectedVariant ? selectedVariant.price : product.price,\n      previousPrice: product.previousPrice,"
);
fs.writeFileSync(p2, c2);

console.log("Updated addItem calls");
