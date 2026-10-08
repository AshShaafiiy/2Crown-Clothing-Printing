const fs = require('fs');
let content = fs.readFileSync('app/api/orders/[reference]/status/route.ts', 'utf8');

const validationStr = `
  if (newStatus === 'Confirmed' && existing.deliveryMethod === 'pickup' && existing.deliveryFee == null) {
    await orderRepository.updateDeliveryFee(id, 0);
  }
`;

content = content.replace(/const historyEntry = \{/, validationStr + '\n  const historyEntry = {');

fs.writeFileSync('app/api/orders/[reference]/status/route.ts', content);
