const fs = require('fs');
const path = 'src/domain/models/index.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "price: number;",
  "price: number;\n  previousPrice?: number;"
);

fs.writeFileSync(path, content);
console.log("Updated OrderItem in models");
