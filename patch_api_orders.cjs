const fs = require('fs');
let code = fs.readFileSync('app/api/orders/route.ts', 'utf8');

const replacement = `  const initialHistory = [{
    id: uuid(),
    newStatus: 'Awaiting Confirmation',
    timestamp: now,
    actorName: 'System',
    note: 'Order placed and awaiting admin confirmation.'
  }];`;

code = code.replace(/const initialHistory = \[{[\s\S]*?}\];/, replacement);
fs.writeFileSync('app/api/orders/route.ts', code);
