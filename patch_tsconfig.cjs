const fs = require('fs');
let code = fs.readFileSync('tsconfig.json', 'utf8');
const data = JSON.parse(code);
data.exclude = [
  "node_modules",
  "**/*.test.ts",
  "**/*.test.tsx",
  "tests",
  "tests-examples",
  "*.js",
  "*.cjs",
  "test_*.ts",
  "verify_*.ts",
  "vitest.config.ts"
];
fs.writeFileSync('tsconfig.json', JSON.stringify(data, null, 2));
