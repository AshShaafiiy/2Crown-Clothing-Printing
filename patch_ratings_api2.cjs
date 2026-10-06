const fs = require('fs');
const file = 'app/api/ratings/[productId]/route.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /const hasDelivered = await orderRepository\.hasDeliveredProduct\(uid, productId\);\s+if \(!hasDelivered\) \{\s+return NextResponse\.json\(\{ eligible: false, reason: 'not_purchased_or_delivered' \}\);\s+\}/,
  `const { purchased, delivered } = await orderRepository.checkPurchaseStatus(uid, productId);
    if (!purchased) {
      return NextResponse.json({ eligible: false, reason: 'not_purchased' });
    }
    if (!delivered) {
      return NextResponse.json({ eligible: false, reason: 'not_delivered' });
    }`
);

code = code.replace(
  /const hasDelivered = await orderRepository\.hasDeliveredProduct\(uid, productId\);\s+if \(!hasDelivered\) \{\s+return NextResponse\.json\(\{ error: 'Forbidden: You must have a Delivered order of this product to rate it\.' \}, \{ status: 403 \}\);\s+\}/,
  `const { purchased, delivered } = await orderRepository.checkPurchaseStatus(uid, productId);
  if (!delivered) {
    return NextResponse.json({ error: 'Forbidden: You must have a Delivered order of this product to rate it.' }, { status: 403 });
  }`
);

fs.writeFileSync(file, code);
