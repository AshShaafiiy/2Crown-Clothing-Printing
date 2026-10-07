const fs = require('fs');
const path = 'src/views/admin/Orders.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  'const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());',
  'const sorted = [...data].sort((a, b) => (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0));'
);

fs.writeFileSync(path, code);
