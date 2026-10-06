const fs = require('fs');
const path = 'src/views/public/Cart.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'className="w-full bg-secondary text-white px-6 py-4 rounded-md font-bold hover:bg-secondary-light transition-all duration-250 hover:shadow-lg"',
  'className="w-full bg-primary text-secondary px-6 py-4 rounded-md font-bold hover:bg-primary-dark transition-all duration-250 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"'
);

fs.writeFileSync(path, content);
console.log("Updated Cart Proceed to Checkout styling");
