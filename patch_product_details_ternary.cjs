const fs = require('fs');
const path = 'src/views/public/ProductDetails.tsx';
let content = fs.readFileSync(path, 'utf8');

// I need to use regex to find the old cartItem ternary and replace it.
const regex = /\{cartItem \? \([\s\S]*?<\/div>\s*<\/div>\s*\)\s*:\s*\(/m;
const newTernary = `{cartItem ? (
                <div className="mb-8">
                  <QuantityControl cartItemId={cartItem.id} quantity={cartItem.quantity} productName={product.name} showAddedText={true} />
                </div>
              ) : (`;

if (content.match(regex)) {
  content = content.replace(regex, newTernary);
  fs.writeFileSync(path, content);
  console.log("Successfully replaced old ternary with QuantityControl");
} else {
  console.log("Regex didn't match.");
}
