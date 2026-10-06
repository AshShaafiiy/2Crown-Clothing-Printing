const fs = require('fs');
const path = 'src/views/public/Cart.tsx';
let content = fs.readFileSync(path, 'utf8');

const regexPricing = /<div className="min-w-0">\s*<h3 className="font-semibold text-base sm:text-lg text-secondary truncate">\{item\.productName\}<\/h3>\s*\{item\.variantName && <p className="text-sm text-gray-500 mt-0\.5">\{item\.variantName\}<\/p>\}\s*<div className="text-sm text-gray-500 mt-1">₦\{item\.price\.toLocaleString\(\)\} each<\/div>\s*<\/div>/;

const newPricing = `<div className="min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg text-secondary truncate">{item.productName}</h3>
                          {item.variantName && <p className="text-sm text-gray-500 mt-0.5">{item.variantName}</p>}
                          
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="font-bold text-lg text-secondary">₦{item.price.toLocaleString()}</span>
                            {item.previousPrice && item.previousPrice > item.price && (
                              <>
                                <span className="text-sm text-gray-400 line-through">₦{item.previousPrice.toLocaleString()}</span>
                                <span className="text-xs font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                  -{Math.round(((item.previousPrice - item.price) / item.previousPrice) * 100)}%
                                </span>
                              </>
                            )}
                          </div>
                          
                          {item.quantity > 1 && (
                            <div className="text-sm text-gray-500 mt-0.5">₦{item.price.toLocaleString()} each</div>
                          )}
                        </div>`;

content = content.replace(regexPricing, newPricing);

// Also need to update the QuantityControl usage
const qcRegex = /<QuantityControl cartItemId=\{item\.id\} quantity=\{item\.quantity\} productName=\{item\.productName\} \/>/;
content = content.replace(qcRegex, '<QuantityControl cartItemId={item.id} quantity={item.quantity} productName={item.productName} minQuantity={1} variant="cart" />');

fs.writeFileSync(path, content);
console.log("Updated Cart.tsx UX");
