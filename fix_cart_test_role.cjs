const fs = require('fs');
const path = 'src/views/public/Cart.test.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/getByLabelText\(\/Increase quantity\/i\)/g, "getByRole('button', { name: /Increase quantity/i })");
content = content.replace(/getByLabelText\(\/Decrease quantity\/i\)/g, "getByRole('button', { name: /Decrease quantity/i })");

fs.writeFileSync(path, content);
console.log("Updated Cart.test.tsx to use getByRole");
