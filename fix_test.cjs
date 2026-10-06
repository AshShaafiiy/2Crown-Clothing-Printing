const fs = require('fs');
let code = fs.readFileSync('tests/backend/ratings.test.ts', 'utf8');
code = code.replace('../../src/app/api/', '../../app/api/');
fs.writeFileSync('tests/backend/ratings.test.ts', code);
