const fs = require('fs');
let code = fs.readFileSync('src/views/public/Shop.tsx', 'utf8');

code = code.replace(
  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
  'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6'
);

// Also change the number of skeleton items to 5 to match desktop max
code = code.replace(
  '{[1, 2, 3, 4, 5, 6].map(i => (',
  '{[1, 2, 3, 4, 5].map(i => ('
);

fs.writeFileSync('src/views/public/Shop.tsx', code);
