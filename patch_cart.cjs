const fs = require('fs');

const path = 'src/views/public/Cart.tsx';
let content = fs.readFileSync(path, 'utf8');

// Change updateQuantity to conditionally call removeItem if quantity is 1
content = content.replace(
  /onClick=\{\(\) => updateQuantity\(item\.id, Math\.max\(1, item\.quantity - 1\)\)\}/,
  'onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}'
);

fs.writeFileSync(path, content);
