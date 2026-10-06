const fs = require('fs');
const path = 'src/views/public/ProductDetails.tsx';
let content = fs.readFileSync(path, 'utf8');

// Just re-import Minus and Plus so it runs if it missed the patch.
// Actually, it's better to just replace the old block correctly.
const regex = /<div className="flex items-center w-32 border border-gray-300 rounded-md bg-white overflow-hidden shadow-sm">[\s\S]*?<Plus size=\{16\} \/>\s*<\/button>\s*<\/div>\s*<span className="text-sm text-gray-500 font-medium">\(\{cartItem\.quantity\} item\{cartItem\.quantity !== 1 \? 's' : ''\} added\)<\/span>/;
if (content.match(regex)) {
  content = content.replace(regex, '<QuantityControl cartItemId={cartItem.id} quantity={cartItem.quantity} productName={product.name} showAddedText={true} />');
  fs.writeFileSync(path, content);
  console.log("Replaced successfully!");
} else {
  // If we can't find it, just add the import so it stops crashing!
  if (!content.includes('import { Minus')) {
    content = content.replace("import { ShoppingCart } from 'lucide-react';", "import { ShoppingCart, Minus, Plus } from 'lucide-react';");
    fs.writeFileSync(path, content);
    console.log("Added import fallback.");
  }
}
