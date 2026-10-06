const fs = require('fs');
let code = fs.readFileSync('app/api/ratings/[productId]/route.ts', 'utf8');

code = code.replace(
  /const \{ purchased, delivered \} = await orderRepository\.checkPurchaseStatus\(uid, productId\);/g,
  'const { purchased, delivered } = await orderRepository.checkPurchaseStatus(uid, productId, authRes.email, authRes.phone);'
);

fs.writeFileSync('app/api/ratings/[productId]/route.ts', code);
