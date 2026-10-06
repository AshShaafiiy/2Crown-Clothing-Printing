const fs = require('fs');
const path = 'src/components/ui/QuantityControl.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace focus:ring-secondary with focus-visible:ring-primary
content = content.replace(/focus:ring-2 focus:ring-secondary focus:ring-opacity-50/g, 'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1');

fs.writeFileSync(path, content);
console.log("Updated QuantityControl.tsx focus styles");
