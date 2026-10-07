const fs = require('fs');

function patchGrid(filePath, oldGrid, newGrid) {
  let code = fs.readFileSync(filePath, 'utf8');
  code = code.replace(oldGrid, newGrid);
  fs.writeFileSync(filePath, code);
}

patchGrid(
  'src/views/public/Home.tsx',
  'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 stagger-children',
  'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 stagger-children'
);

patchGrid(
  'src/views/public/Shop.tsx',
  'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 stagger-children',
  'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 stagger-children'
);

console.log('Grids updated');
