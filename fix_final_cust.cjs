const fs = require('fs');

const path = 'src/views/public/ProductDetails.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /const cartItem = items\.find/g;
const addition = `const finalCustomization = Object.fromEntries(
    Object.entries(customization).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
  );
  
  const cartItem = items.find`;

content = content.replace(regex, addition);
fs.writeFileSync(path, content);
