const fs = require('fs');
let code = fs.readFileSync('app/(public)/page.tsx', 'utf8');
code = `export const dynamic = 'force-dynamic';\n` + code;
fs.writeFileSync('app/(public)/page.tsx', code);
