const fs = require('fs');
let code = fs.readFileSync('src/components/ui/QuantityControl.tsx', 'utf8');

code = code.replace(/w-8 h-8 sm:w-9 sm:h-9/g, 'w-9 h-9');

fs.writeFileSync('src/components/ui/QuantityControl.tsx', code);
