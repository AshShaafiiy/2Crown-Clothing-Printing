const fs = require('fs');

let content = fs.readFileSync('PROJECT_HANDOFF.md', 'utf8');

const newRules = `
## Final Accepted Badge Rules
- **% OFF** = light red/pink background + darker red text (\`bg-red-100 text-red-800\`)
- **NEW** = blue background + white text (\`bg-blue-500 text-white\`)
- **FEATURED** = black background + white text (\`bg-secondary text-white\`)
- **SALE** = completely removed
- **NEW Expiry** = expires automatically after 24 hours
`;

if (!content.includes('Final Accepted Badge Rules')) {
  content = content.replace('## 4. Current State', '## 4. Current State' + newRules);
  fs.writeFileSync('PROJECT_HANDOFF.md', content);
}
