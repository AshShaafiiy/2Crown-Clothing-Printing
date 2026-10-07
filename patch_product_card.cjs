const fs = require('fs');
let code = fs.readFileSync('src/components/ui/ProductCard.tsx', 'utf8');

code = code.replace(
  'className="flex flex-col flex-grow p-4"',
  'className="flex flex-col flex-grow p-3 sm:p-4"'
);

code = code.replace(
  'className="text-sm font-semibold text-secondary mb-1 line-clamp-2 leading-tight hover:text-primary transition-colors"',
  'className="text-xs sm:text-sm font-semibold text-secondary mb-1 line-clamp-2 leading-tight hover:text-primary transition-colors"'
);

code = code.replace(
  'className="text-xs text-gray-500 mb-3 truncate"',
  'className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3 truncate"'
);

code = code.replace(
  'className="flex items-center gap-2 mb-4"',
  'className="flex flex-wrap items-center gap-x-1 sm:gap-x-2 gap-y-0.5 mb-3 sm:mb-4"'
);

code = code.replace(
  'className="text-lg font-bold text-secondary"',
  'className="text-sm sm:text-lg font-bold text-secondary"'
);

code = code.replace(
  'className="text-sm text-gray-400 line-through"',
  'className="text-[10px] sm:text-sm text-gray-400 line-through"'
);

code = code.replace(
  'className="w-full text-center py-2.5 bg-primary text-secondary font-bold text-sm rounded hover:bg-primary-dark transition-colors mt-auto block focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-opacity-50"',
  'className="w-full text-center py-2 sm:py-2.5 bg-primary text-secondary font-bold text-xs sm:text-sm rounded hover:bg-primary-dark transition-colors mt-auto block focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-opacity-50"'
);

code = code.replace(
  'className="w-full text-center py-2.5 bg-primary text-secondary font-bold text-sm rounded hover:bg-primary-dark transition-colors mt-auto block focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-opacity-50"',
  'className="w-full text-center py-2 sm:py-2.5 bg-primary text-secondary font-bold text-xs sm:text-sm rounded hover:bg-primary-dark transition-colors mt-auto block focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-opacity-50"'
);

fs.writeFileSync('src/components/ui/ProductCard.tsx', code);
