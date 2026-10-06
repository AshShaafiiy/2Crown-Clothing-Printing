const fs = require('fs');

const path = 'src/views/public/ProductDetails.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /<div className="pt-6">[\s\S]*?<\/button>\s*<\/div>\s*<button[\s\S]*?<\/button>\s*<\/div>/;

if (content.match(regex)) {
  console.log("Found double button");
}

// Just match the old button specifically and remove it
content = content.replace(/<button\s+onClick=\{handleAddToCart\}\s+disabled=\{\!product\.active\}[\s\S]*?\{!product\.active \? 'Unavailable' : 'Add to Cart'\}\s+<\/button>\s+<\/div>/, '');

fs.writeFileSync(path, content);
