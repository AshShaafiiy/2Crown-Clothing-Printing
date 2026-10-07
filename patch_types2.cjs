const fs = require('fs');

// Fix tsconfig target downlevelIteration
let tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
tsconfig.compilerOptions.downlevelIteration = true;
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));

// Fix src/domain/models/index.ts completely
let models = fs.readFileSync('src/domain/models/index.ts', 'utf8');
models = models.replace(/previousPrice\?: number; \/\/ in NGN ₦\n  previousPrice\?: number;/g, 'previousPrice?: number; // in NGN ₦');
fs.writeFileSync('src/domain/models/index.ts', models);

// Remove httpSecurity and middleware from being checked if they are legacy, but it's safer to just let next build handle it
