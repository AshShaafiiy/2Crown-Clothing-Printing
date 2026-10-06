const fs = require('fs');
const path = 'src/views/public/Cart.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/focus:ring-2 focus:ring-secondary focus:ring-opacity-50/g, 'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1');

// While we are editing Cart.tsx, let's fix the image hover box:
content = content.replace(/className="flex-shrink-0 block transform transition-transform duration-300 hover:scale-105 hover:opacity-90 hover:shadow-md rounded-lg"/g, 'className="flex-shrink-0 block rounded-md group"');
content = content.replace(/className="w-full h-full object-cover"/g, 'className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"');

// And remove the ghost box shadow entirely from the image container if it exists:
content = content.replace(/className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-50 border border-gray-100"/g, 'className="w-16 h-16 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-gray-50 border border-gray-100"');

fs.writeFileSync(path, content);
console.log("Updated Cart.tsx focus and hover styles");
