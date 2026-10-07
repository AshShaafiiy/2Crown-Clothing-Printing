const fs = require('fs');
let code = fs.readFileSync('src/components/ui/ProductRatingDisplay.tsx', 'utf8');

code = code.replace(
  'className={`flex items-center gap-1.5 ${compact ? \'text-xs\' : \'text-sm\'} font-medium text-gray-700`}',
  'className={`flex flex-wrap items-center gap-1 sm:gap-1.5 ${compact ? \'text-[10px] sm:text-xs\' : \'text-sm\'} font-medium text-gray-700`}'
);

fs.writeFileSync('src/components/ui/ProductRatingDisplay.tsx', code);
