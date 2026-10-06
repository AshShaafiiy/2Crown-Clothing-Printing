const fs = require('fs');
const path = 'src/views/public/ProductDetails.test.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/getByLabelText\(\/Increase quantity\/i\)/g, "getByRole('button', { name: /Increase quantity/i })");
content = content.replace(/getByLabelText\(\/Decrease quantity\/i\)/g, "getByRole('button', { name: /Decrease quantity/i })");
content = content.replace(/getByLabelText\('Increase quantity'\)/g, "getByRole('button', { name: /Increase quantity/i })");
content = content.replace(/getByLabelText\('Decrease quantity'\)/g, "getByRole('button', { name: /Decrease quantity/i })");

fs.writeFileSync(path, content);
console.log("Updated ProductDetails.test.tsx to use getByRole");
