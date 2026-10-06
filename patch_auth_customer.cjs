const fs = require('fs');
let code = fs.readFileSync('src/backend/utils/next-utils.ts', 'utf8');

code = code.replace(
  /Promise<\{ uid\?: string; name\?: string; error\?: string; status\?: number \}> \{/,
  'Promise<{ uid?: string; name?: string; email?: string; phone?: string; error?: string; status?: number }> {'
);

code = code.replace(
  /return \{ uid: decoded\.uid, name: decoded\.name \|\| decoded\.email \|\| 'Customer' \};/,
  "return { uid: decoded.uid, name: decoded.name || decoded.email || 'Customer', email: decoded.email, phone: decoded.phone_number };"
);

fs.writeFileSync('src/backend/utils/next-utils.ts', code);
