const fs = require('fs');
let code = fs.readFileSync('README.md', 'utf8');

code = code.replace(/- \`NEXT_PUBLIC_FIREBASE_APP_ID\`/, 
`- \`NEXT_PUBLIC_FIREBASE_APP_ID\`

**Application Security (server-only):**
- \`BUYER_FINGERPRINT_SECRET\` (HMAC buyer fingerprinting)
- \`RATING_TOKEN_SECRET\` (JWT rating verification token)`);

fs.writeFileSync('README.md', code);
