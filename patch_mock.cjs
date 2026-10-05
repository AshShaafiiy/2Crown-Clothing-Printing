const fs = require('fs');
const file = 'src/services/mock/index.ts';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  /async getOrderByReference\(reference: string, phone\?: string\) \{.*?\}/g,
  `async getOrderByReference(reference: string, phone: string) {
    const canonical = reference.trim().toUpperCase();
    if (!/^2C-\\d{6}$/.test(canonical)) return null;
    const order = orders.find(o => o.reference === canonical);
    if (!order) return null;
    if (order.customerPhone.replace(/[^\\d+]/g, '') !== phone.replace(/[^\\d+]/g, '')) return null;
    return toPublicOrder(order);
  }`
);

data = data.replace(
  /reference: \`2C-\$\{Array\.from[\s\S]*?\}\`,/,
  `reference: \`2C-\${Math.floor(100000 + Math.random() * 900000)}\`,`
);

fs.writeFileSync(file, data);
