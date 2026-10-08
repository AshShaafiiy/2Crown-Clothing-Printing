const fs = require('fs');
let content = fs.readFileSync('app/api/orders/[reference]/status/route.ts', 'utf8');

const validationStr = `
  const newStatus = data!.status;
  if (newStatus === 'Confirmed' && existing.deliveryMethod === 'local' && existing.deliveryFee == null) {
    return NextResponse.json({ error: 'Cannot confirm order without a delivery fee. Please add delivery fee first.' }, { status: 400 });
  }
`;

content = content.replace(/const newStatus = data!\.status;/, validationStr);

fs.writeFileSync('app/api/orders/[reference]/status/route.ts', content);
