const fs = require('fs');
const path = 'src/components/ui/ProductCard.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'className="w-full text-center py-2.5 bg-secondary text-white font-bold text-sm rounded hover:bg-primary hover:text-secondary transition-colors mt-auto block"',
  'className="w-full text-center py-2.5 bg-primary text-secondary font-bold text-sm rounded hover:bg-primary-dark transition-colors mt-auto block focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"'
);

// Also Customize & Buy button
content = content.replace(
  'className="w-full text-center py-2.5 bg-secondary text-white font-bold text-sm rounded hover:bg-primary hover:text-secondary transition-colors mt-auto block"',
  'className="w-full text-center py-2.5 bg-primary text-secondary font-bold text-sm rounded hover:bg-primary-dark transition-colors mt-auto block focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"'
);

fs.writeFileSync(path, content);
console.log("Updated ProductCard.tsx Add to Cart button styles");
