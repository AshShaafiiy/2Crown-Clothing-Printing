const fs = require('fs');
const path = 'PROJECT_HANDOFF.md';
let content = fs.readFileSync(path, 'utf8');

const updatedRules = `
## Cart Item Layout & UX Polishes
- Final cart presentation: Image hover artifacts (ghost boxes) are eliminated.
- Unit Price Logic: \`qty=1\` hides the "₦X each" unit-price line; \`qty>1\` shows it.
- Remove Action: Styled as a compact text action \`[trash icon] Remove\` in Gold/Primary color on the lower-left.
- Quantity Controls: Refined to a compact \`[-]\` \`qty\` \`[+]\` structure resembling Jumia logic. Black borders after clicking are fully eliminated in favor of clean subtle \`focus-visible:ring-primary\` outlines.
- Cart minus button at \`qty=1\` remains securely disabled.
- Mobile Layout: Stacked into a highly compact ecommerce card format with image/details side-by-side, ending in a bottom action row holding Remove (left) and Quantity (right).
- 'Proceed to Checkout' button utilizes standard Gold primary styling.
`;

if (!content.includes('Image hover artifacts')) {
  content += '\n' + updatedRules;
  fs.writeFileSync(path, content);
  console.log("Updated PROJECT_HANDOFF.md for final Cart polish");
}
