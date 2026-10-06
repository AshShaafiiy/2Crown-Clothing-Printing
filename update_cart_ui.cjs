const fs = require('fs');

// 1. Update ProductCard.tsx
let pc = fs.readFileSync('src/components/ui/ProductCard.tsx', 'utf8');
pc = pc.replace("import { Minus, Plus } from 'lucide-react';", "import { QuantityControl } from './QuantityControl';");
const pcRegex = /<div className="flex items-center justify-between bg-gray-100 rounded-md w-full mt-auto border border-gray-200">[\s\S]*?<\/div>/;
pc = pc.replace(pcRegex, '<QuantityControl cartItemId={cartItem.id} quantity={cartItem.quantity} productName={product.name} />');
fs.writeFileSync('src/components/ui/ProductCard.tsx', pc);

// 2. Update ProductDetails.tsx
let pd = fs.readFileSync('src/views/public/ProductDetails.tsx', 'utf8');
pd = pd.replace("import { Minus, Plus } from 'lucide-react';", "import { ShoppingCart } from 'lucide-react';\nimport { QuantityControl } from '../../components/ui/QuantityControl';");
const pdRegex = /<div className="flex flex-col gap-2 mb-8">[\s\S]*?<\/div>\s*<\/div>/;
pd = pd.replace(pdRegex, '<div className="mb-8">\n                  <QuantityControl cartItemId={cartItem.id} quantity={cartItem.quantity} productName={product.name} showAddedText={true} />\n                </div>');
pd = pd.replace(
  "{!product.active ? 'Unavailable' : 'Add to Cart'}",
  "{!product.active ? 'Unavailable' : <span className=\"flex items-center justify-center gap-2\"><ShoppingCart size={20} /> Add to Cart</span>}"
);
fs.writeFileSync('src/views/public/ProductDetails.tsx', pd);

// 3. Update Cart.tsx
let cart = fs.readFileSync('src/views/public/Cart.tsx', 'utf8');
cart = cart.replace("import { Trash2, Plus, Minus, ShoppingBag, ImageOff } from 'lucide-react';", "import { Trash2, ShoppingBag, ImageOff } from 'lucide-react';\nimport { QuantityControl } from '../../components/ui/QuantityControl';");
const cartRegex = /<div className="flex items-center border border-gray-200 rounded-md">[\s\S]*?<\/div>/;
// In Cart, replace all occurrences of the old quantity control
while (cart.match(cartRegex)) {
  cart = cart.replace(cartRegex, '<QuantityControl cartItemId={item.id} quantity={item.quantity} productName={item.productName} />');
}
fs.writeFileSync('src/views/public/Cart.tsx', cart);

console.log("Updated cart UX across 3 components");
