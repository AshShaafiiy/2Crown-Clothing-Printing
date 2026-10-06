const fs = require('fs');
let code = fs.readFileSync('PROJECT_HANDOFF.md', 'utf8');

const auditResult = `
### Legacy Rating Audit
An audit was performed against the production database, revealing 19 legacy ratings that lacked verified purchase markers. To preserve accuracy without destroying historical data, the \`getRatingSummary\` aggregation method was rewritten to filter strictly in-memory for \`verifiedPurchase: true\`.
**Result:** The public aggregate (average and count) displays strictly verified purchases. The label "(X verified ratings)" is factually accurate.
`;

code = code.replace(/### Public Rating Label Rule[\s\S]*?(?=## 1\. Existing Functionality)/, (match) => match + '\n' + auditResult + '\n');
fs.writeFileSync('PROJECT_HANDOFF.md', code);
