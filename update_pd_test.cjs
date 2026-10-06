const fs = require('fs');
const path = 'src/views/public/ProductDetails.test.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/\(1 item added\)/g, "1 item added");
content = content.replace(/\(2 items added\)/g, "2 items added");

fs.writeFileSync(path, content);
console.log("Updated ProductDetails.test.tsx");
