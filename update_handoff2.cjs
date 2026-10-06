const fs = require('fs');

const path = 'PROJECT_HANDOFF.md';
let content = fs.readFileSync(path, 'utf8');

const newRule = `
## Cart UX Rules
Customer-facing product quantities are controlled exclusively with decrement/increment buttons. No editable quantity input is used on ProductCard, Product Details, or Cart. All components synchronize globally with the \`cartStore\`.
`;

if (!content.includes('Cart UX Rules')) {
  content = content + '\n' + newRule;
  fs.writeFileSync(path, content);
}
