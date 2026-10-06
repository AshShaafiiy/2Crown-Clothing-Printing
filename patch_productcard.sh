#!/bin/bash
cat << 'INNER_EOF' > modify.js
const fs = require('fs');

function updateBadges(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the badge styling block
  content = content.replace(/let badgeClass = "bg-primary text-secondary";[\s\S]*?return \([\s\S]*?<span key=\{idx\} className=\{`\$\{badgeClass\}.*?`\}>/m, 
    `let badgeClass = "bg-red-100 text-red-800"; // default for discount
            if (badge.type === 'status' && badge.label === 'NEW') {
               badgeClass = "bg-blue-500 text-white";
            } else if (badge.label === 'FEATURED') {
               badgeClass = "bg-secondary text-white";
            }

            return (
              <span key={idx} className={\`\$\{badgeClass\} text-xs font-bold px-2 py-1 rounded shadow-sm\`}>`);
              
  fs.writeFileSync(filePath, content);
}

updateBadges('src/components/ui/ProductCard.tsx');
updateBadges('src/views/public/ProductDetails.tsx');
INNER_EOF
node modify.js
