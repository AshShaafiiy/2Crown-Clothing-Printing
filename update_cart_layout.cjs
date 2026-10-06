const fs = require('fs');
const path = 'src/views/public/Cart.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /<li key=\{item\.id\} className="p-4 sm:p-6">[\s\S]*?<\/li>/g;

const newLi = `<li key={item.id} className="p-4 sm:p-6">
                  <div className="flex gap-3 sm:gap-6">
                    {/* Product Image */}
                    <Link
                      href={\`/product/\${item.productSlug || item.productId}\`}
                      className="flex-shrink-0 block transform transition-transform duration-300 hover:scale-105 hover:opacity-90 hover:shadow-md rounded-lg"
                    >
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageOff size={24} />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info & Controls */}
                    <div className="flex flex-col flex-1 min-w-0 justify-between">
                      
                      {/* Top row: Info + Price */}
                      <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-1 sm:gap-4 mb-3 sm:mb-4">
                        
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-lg text-secondary line-clamp-2 sm:line-clamp-none">{item.productName}</h3>
                          {item.variantName && <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{item.variantName}</p>}
                          
                          {item.quantity > 1 && (
                            <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">₦{item.price.toLocaleString()} each</div>
                          )}
                        </div>
                        
                        {/* Price Block (Desktop: right-aligned, Mobile: left-aligned under title) */}
                        <div className="flex flex-col items-start sm:items-end flex-shrink-0 mt-1 sm:mt-0">
                          <div className="font-bold text-sm sm:text-lg text-secondary">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </div>
                          {item.previousPrice && item.previousPrice > item.price && (
                            <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                              <span className="text-xs sm:text-sm text-gray-400 line-through">
                                ₦{(item.previousPrice * item.quantity).toLocaleString()}
                              </span>
                              <span className="text-[10px] sm:text-xs font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                -{Math.round(((item.previousPrice - item.price) / item.previousPrice) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                        
                      </div>

                      {/* Bottom action row: Remove + Quantity */}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 sm:border-0 sm:pt-0">
                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                          title="Remove item"
                          aria-label={\`Remove \${item.productName} from cart\`}
                        >
                          <Trash2 size={16} />
                          <span>Remove</span>
                        </button>

                        {/* Quantity controls */}
                        <QuantityControl cartItemId={item.id} quantity={item.quantity} productName={item.productName} minQuantity={1} variant="cart" />
                      </div>

                    </div>
                  </div>
                </li>`;

content = content.replace(regex, newLi);
fs.writeFileSync(path, content);
console.log("Updated Cart.tsx layout");
