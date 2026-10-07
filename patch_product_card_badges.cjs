const fs = require('fs');
let code = fs.readFileSync('src/components/ui/ProductCard.tsx', 'utf8');

code = code.replace(
  'className="absolute top-3 left-3 flex flex-col gap-2"',
  'className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5 sm:gap-2"'
);

code = code.replace(
  'className={`${badgeClass} text-xs font-bold px-2 py-1 rounded shadow-sm`}',
  'className={`${badgeClass} text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow-sm`}'
);

fs.writeFileSync('src/components/ui/ProductCard.tsx', code);
