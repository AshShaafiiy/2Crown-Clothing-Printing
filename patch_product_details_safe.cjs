const fs = require('fs');
const path = 'src/views/public/ProductDetails.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("import { Minus, Plus } from 'lucide-react';", "import { ShoppingCart } from 'lucide-react';\nimport { QuantityControl } from '../../components/ui/QuantityControl';");

const oldTernary = `<div className="flex flex-col gap-2 mb-8">
                  <div className="flex items-center w-32 border border-gray-300 rounded-md bg-white overflow-hidden shadow-sm">
                    <button 
                      type="button"
                      onClick={() => cartItem.quantity === 1 ? removeItem(cartItem.id) : updateQuantity(cartItem.id, cartItem.quantity - 1)}
                      className="flex-1 p-3 text-gray-600 hover:bg-gray-100 transition-colors flex justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-gray-800 select-none">
                      {cartItem.quantity}
                    </span>
                    <button 
                      type="button"
                      onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                      className="flex-1 p-3 text-gray-600 hover:bg-gray-100 transition-colors flex justify-center"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>`;

const newTernary = `<div className="mb-8">
                  <QuantityControl cartItemId={cartItem.id} quantity={cartItem.quantity} productName={product.name} showAddedText={true} />
                </div>`;

content = content.replace(oldTernary, newTernary);

content = content.replace(
  "{!product.active ? 'Unavailable' : 'Add to Cart'}",
  "{!product.active ? 'Unavailable' : <span className=\"flex items-center justify-center gap-2\"><ShoppingCart size={20} /> Add to Cart</span>}"
);

fs.writeFileSync(path, content);
console.log("Patched ProductDetails safely");
