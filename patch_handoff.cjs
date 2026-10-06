const fs = require('fs');
let code = fs.readFileSync('PROJECT_HANDOFF.md', 'utf8');

const newRule = `
### Product Ratings Policy
Product ratings are restricted to authenticated customers with a Delivered order containing that product. Each customer may have only one rating per product and may update that rating later.

### Public Rating Label Rule
Because ratings are restricted to verified purchasers, public rating-count text must strictly use "verified rating" or "verified ratings" (e.g. \`(1 verified rating)\`, \`(15 verified ratings)\`).
`;

code = code.replace(/## 1\. Existing Functionality/, newRule + '\n## 1. Existing Functionality');
fs.writeFileSync('PROJECT_HANDOFF.md', code);
