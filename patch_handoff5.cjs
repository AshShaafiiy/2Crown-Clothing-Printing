const fs = require('fs');
let code = fs.readFileSync('PROJECT_HANDOFF.md', 'utf8');

// Replace the incorrect customer auth claims
code = code.replace(/Customers must be authenticated via Firebase Auth[\s\S]*?(?=### )/, 
`Customers do not have 2Crown accounts. Product-rating eligibility is verified using Order Reference + order phone number against a Delivered order containing the product. Firebase Auth remains admin-only.

- One verified rating per buyer/product.
- The buyer is identified securely server-side using a private buyer fingerprint (HMAC of normalized phone).
- The existing rating may be updated.
- Public aggregates strictly include verified ratings only.
`);

fs.writeFileSync('PROJECT_HANDOFF.md', code);
