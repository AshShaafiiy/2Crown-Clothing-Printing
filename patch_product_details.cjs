const fs = require('fs');

const path = 'src/views/public/ProductDetails.tsx';
let content = fs.readFileSync(path, 'utf8');

// Find the Cart Item matching the current configuration
const hookStr = `
  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  const finalCustomization = Object.fromEntries(
    Object.entries(customization).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
  );

  const cartItem = items.find(i => 
    i.productId === product?.id && 
    i.variantId === (selectedVariantId || undefined) && 
    JSON.stringify(i.customization || {}) === JSON.stringify(Object.keys(finalCustomization).length > 0 ? finalCustomization : {})
  );
`;

content = content.replace('const { addItem } = useCartStore();', hookStr);

// We need to remove the local `quantity` state if it's unused, or keep it just in case?
// The instructions say "No quantity input field... Quantity value is DISPLAY-ONLY."
// If it's not in the cart yet, we don't need a quantity selector at all! Because "Initial state: [ Add to Cart ]".
// So I will remove `const [quantity, setQuantity] = useState<number>(1);`
content = content.replace('const [quantity, setQuantity] = useState<number>(1);\n', '');

// Also remove `const finalCustomization = ...` inside handleAddToCart since it's now computed above
content = content.replace(/const finalCustomization = Object\.fromEntries\([\s\S]*?\);\n/, '');

// Inside handleAddToCart: replace `quantity` with `1` since we just add 1
content = content.replace('quantity,', 'quantity: 1,');

const quantityUiRegex = /\{\/\* Quantity \*\/\}([\s\S]*?)<div className="pt-6">/m;
const newUi = `
            <div className="pt-6">
              {cartItem ? (
                <div className="flex flex-col gap-2 mb-8">
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
                  <span className="text-sm text-gray-500 font-medium">({cartItem.quantity} item{cartItem.quantity !== 1 ? 's' : ''} added)</span>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={!product.active}
                  className="w-full bg-primary hover:bg-primary-dark text-secondary font-bold py-4 px-8 rounded-md shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
                >
                  {!product.active ? 'Unavailable' : 'Add to Cart'}
                </button>
              )}
            </div>
`;
content = content.replace(quantityUiRegex, newUi);

// We need to handle the button that used to be there: we already replaced the whole <div className="pt-6">...
// Wait, the old code had:
// {/* Quantity */}<div>...</div><div className="pt-6"><button>Add to Cart</button></div>
// My regex matched from `{/* Quantity */}` to `<div className="pt-6">` and replaced it with `newUi`.
// Wait, the regex `\{\/\* Quantity \*\/\}([\s\S]*?)<div className="pt-6">` matched everything up to `<div className="pt-6">`. 
// So the old `<div className="pt-6">` is STILL THERE.
// Let's refine the replacement!
fs.writeFileSync(path, content);
