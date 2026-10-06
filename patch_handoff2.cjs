const fs = require('fs');
const path = 'PROJECT_HANDOFF.md';
let content = fs.readFileSync(path, 'utf8');

const updatedRules = `
## Commerce UI & Styling Rules
- Primary commerce CTAs (Add to Cart, Proceed to Checkout) default to gold with subtle darker-gold hover.
- ProductCard quantity controls retain full CTA width.
- Product Details quantity controls are compact and visually separated (button, text, button).
- Product Details feedback stays beside control on normal mobile widths.
- Cart minus is disabled at quantity 1; Cart uses a separate Remove action.
- Cart does not duplicate current unit price underneath product name.
- 'each' appears only for quantity > 1.
- Right-side Cart price is the current line total.
- Discounted Cart lines show original line value + discount badge.
`;

if (!content.includes('Primary commerce CTAs (Add to Cart, Proceed to Checkout) default to gold')) {
  content += '\n' + updatedRules;
  fs.writeFileSync(path, content);
  console.log("Updated PROJECT_HANDOFF.md");
}
