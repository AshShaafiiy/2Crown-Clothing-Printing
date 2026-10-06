const fs = require('fs');
const path = 'PROJECT_HANDOFF.md';
let content = fs.readFileSync(path, 'utf8');

const updatedRules = `
## Cart Item Layout
- Cart item layout uses a responsive ecommerce pattern: desktop places product information on the left, price summary upper-right, Remove lower-left, quantity lower-right; mobile compacts image/details and keeps Remove/quantity on a bottom action row.
`;

if (!content.includes('Cart item layout uses a responsive ecommerce pattern')) {
  content += '\n' + updatedRules;
  fs.writeFileSync(path, content);
  console.log("Updated PROJECT_HANDOFF.md for Cart layout");
}
