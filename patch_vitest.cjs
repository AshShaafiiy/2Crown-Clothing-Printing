const fs = require('fs');
let content = fs.readFileSync('vitest.config.ts', 'utf8');
content = content.replace("isolate: false,", "");
fs.writeFileSync('vitest.config.ts', content);
console.log("Removed isolate: false");
