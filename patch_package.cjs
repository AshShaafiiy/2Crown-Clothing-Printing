const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
pkg.scripts.dev = "npm run dev:frontend & npm run dev:backend";
pkg.scripts["dev:frontend"] = "vite";
pkg.scripts["dev:backend"] = "npm run start --prefix backend";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf-8');
