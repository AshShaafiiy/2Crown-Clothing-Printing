const fs = require('fs');
let code = fs.readFileSync('app/api/ratings/[productId]/route.ts', 'utf8');

code = code.replace(
  /approved: true/,
  'approved: true,\n      verifiedPurchase: true'
);

code = code.replace(
  /rating: data\.rating,\n\s*updatedAt: new Date\(\)\.toISOString\(\)/,
  'rating: data.rating,\n      updatedAt: new Date().toISOString(),\n      verifiedPurchase: true'
);

fs.writeFileSync('app/api/ratings/[productId]/route.ts', code);
