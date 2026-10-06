const fs = require('fs');
const path = 'src/views/public/ProductDetails.tsx';
let content = fs.readFileSync(path, 'utf8');

// I will match `<div className="pt-6">` up to `ProductRatingInput`
const regex = /<div className="pt-6">[\s\S]*?<ProductRatingInput/;
const replacement = `<div className="pt-6">
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

            <div className="border-t border-gray-200 pt-8 mt-4">
              <ProductRatingInput`;

content = content.replace(regex, replacement);
fs.writeFileSync(path, content);
