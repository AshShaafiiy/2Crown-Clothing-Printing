const fs = require('fs');
let code = fs.readFileSync('vitest.config.ts', 'utf8');
if (!code.includes('alias:')) {
  code = code.replace(
    /globals: true,/,
    "globals: true,\n    alias: { '@': '/mnt/c/Users/USER/Documents/2Crown-Clothing-Printing/src' },"
  );
  fs.writeFileSync('vitest.config.ts', code);
}
