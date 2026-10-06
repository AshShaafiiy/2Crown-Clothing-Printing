const fs = require('fs');
const file = 'src/components/ui/ProductRatingDisplay.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /\(compact \? \`\\\(\\\$\\{count\\}\\\)\` : \`\\\(\\\$\\{count\\} rating\\\$\\{count !== 1 \? 's' : ''\\}\\\)\`\)/,
  "{compact ? `(${count})` : `(${count} verified rating${count !== 1 ? 's' : ''})`}"
);

fs.writeFileSync(file, code);
console.log('ProductRatingDisplay patched');
