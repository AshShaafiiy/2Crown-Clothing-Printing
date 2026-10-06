const fs = require('fs');
const path = 'src/views/public/ProductDetails.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'className="w-full bg-primary hover:bg-primary-dark text-secondary font-bold py-4 px-8 rounded-md shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-8"',
  'className="w-full bg-primary hover:bg-primary-dark text-secondary font-bold py-4 px-8 rounded-md shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-8 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"'
);

fs.writeFileSync(path, content);
console.log("Updated ProductDetails Add to Cart focus ring");
