const fs = require('fs');
const path = 'PROJECT_HANDOFF.md';
let content = fs.readFileSync(path, 'utf8');

const newRule = `
## Category Slug Synchronization
Category slugs are automatically derived from Category names and automatically update when the Category name changes. Product-category relationships rely on Category document IDs, not slugs.
`;

if (!content.includes('Category Slug Synchronization')) {
  content = content.replace('## 4. Current State', '## 4. Current State' + newRule);
  fs.writeFileSync(path, content);
}
