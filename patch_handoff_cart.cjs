const fs = require('fs');
const path = 'PROJECT_HANDOFF.md';
let content = fs.readFileSync(path, 'utf8');

const updatedCartRules = `
## Cart & Quantity UI Rules
- Cart quantity behavior differs intentionally from ProductCard/Product Details: Cart decrement is disabled at quantity 1 because Cart has a dedicated Remove action. ProductCard/Product Details decrement-at-1 removes the item.
- Discounted Cart items show current price, previous price and discount %.
- Per-unit 'each' label appears only when quantity > 1.
- Home and Shop ProductCard quantity controls retain the same full-width CTA footprint as the Add to Cart button. Product Details and Cart use compact quantity controls.
`;

if (!content.includes('Cart quantity behavior differs intentionally')) {
  content += '\n' + updatedCartRules;
  fs.writeFileSync(path, content);
  console.log("Updated PROJECT_HANDOFF.md");
}
