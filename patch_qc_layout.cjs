const fs = require('fs');
const path = 'src/components/ui/QuantityControl.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/w-9 h-9 sm:w-10 sm:h-10/g, 'w-8 h-8 sm:w-9 sm:h-9');
content = content.replace(/flex items-center gap-3 sm:gap-4/g, 'flex items-center gap-2');
content = content.replace(/min-w-\[1\.5rem\]/g, 'min-w-[2rem]');

fs.writeFileSync(path, content);
console.log("Updated QuantityControl.tsx layout spacing");
