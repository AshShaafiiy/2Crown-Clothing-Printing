const fs = require('fs');
const path = 'src/views/public/Cart.tsx';
let content = fs.readFileSync(path, 'utf8');

// The block to replace:
const oldLeftBlock = /<div className="flex flex-wrap items-center gap-2 mt-1">[\s\S]*?\{item\.quantity > 1 && \(\s*<div className="text-sm text-gray-500 mt-0\.5">₦\{item\.price\.toLocaleString\(\)\} each<\/div>\s*\)\}\s*<\/div>/;

const newLeftBlock = `{item.quantity > 1 && (
                            <div className="text-sm text-gray-500 mt-1">₦{item.price.toLocaleString()} each</div>
                          )}
                        </div>`;

content = content.replace(oldLeftBlock, newLeftBlock);

const oldDesktopRight = /<div className="hidden sm:block text-right flex-shrink-0">\s*<div className="font-bold text-lg text-secondary">\s*₦\{\(item\.price \* item\.quantity\)\.toLocaleString\(\)\}\s*<\/div>\s*<\/div>/;

const newDesktopRight = `<div className="hidden sm:flex flex-col items-end flex-shrink-0">
                          <div className="font-bold text-lg text-secondary">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </div>
                          {item.previousPrice && item.previousPrice > item.price && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-400 line-through">
                                ₦{(item.previousPrice * item.quantity).toLocaleString()}
                              </span>
                              <span className="text-xs font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                -{Math.round(((item.previousPrice - item.price) / item.previousPrice) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>`;

content = content.replace(oldDesktopRight, newDesktopRight);

const oldMobileRight = /<div className="sm:hidden font-bold text-base text-secondary">\s*₦\{\(item\.price \* item\.quantity\)\.toLocaleString\(\)\}\s*<\/div>/;

const newMobileRight = `<div className="sm:hidden flex flex-col items-end">
                          <div className="font-bold text-base text-secondary">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </div>
                          {item.previousPrice && item.previousPrice > item.price && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-gray-400 line-through">
                                ₦{(item.previousPrice * item.quantity).toLocaleString()}
                              </span>
                              <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1 py-0.5 rounded">
                                -{Math.round(((item.previousPrice - item.price) / item.previousPrice) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>`;

content = content.replace(oldMobileRight, newMobileRight);

fs.writeFileSync(path, content);
console.log("Updated Cart.tsx pricing hierarchy");
