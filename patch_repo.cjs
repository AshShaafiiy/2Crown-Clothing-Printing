const fs = require('fs');

const path = 'src/backend/repositories/OrderRepository.ts';
let code = fs.readFileSync(path, 'utf8');

const normalizeFn = `
function normalizeOrderData(data: any): Order {
  if (!data) return data;
  
  let createdAt = data.createdAt;
  if (!createdAt || isNaN(new Date(createdAt).getTime())) {
    createdAt = data.updatedAt;
    if (!createdAt || isNaN(new Date(createdAt).getTime())) {
      createdAt = new Date(0).toISOString();
    }
  }

  let updatedAt = data.updatedAt;
  if (!updatedAt || isNaN(new Date(updatedAt).getTime())) {
    updatedAt = createdAt;
  }

  const subtotal = Number(data.subtotal) || 0;
  const discount = Number(data.discount) || 0;
  
  let deliveryFee = data.deliveryFee;
  if (deliveryFee !== null && deliveryFee !== undefined) {
    deliveryFee = Number(deliveryFee);
    if (isNaN(deliveryFee)) deliveryFee = null;
  }
  
  let total = Number(data.total);
  if (isNaN(total)) {
    total = subtotal - discount + (deliveryFee || 0);
  }

  let history = data.history;
  if (!Array.isArray(history)) {
    history = [];
  } else {
    history = history.map((entry: any, index: number) => {
      if (typeof entry === 'string') {
        return {
          id: \`legacy-\${index}-\${Date.now()}\`,
          newStatus: 'Unknown',
          timestamp: '',
          actorName: 'System',
          note: entry
        };
      }
      return entry;
    });
  }

  return {
    ...data,
    createdAt,
    updatedAt,
    subtotal,
    discount,
    total,
    deliveryFee,
    history,
    items: Array.isArray(data.items) ? data.items : [],
    status: data.status || 'Unknown Status',
    customerName: data.customerName || 'Unknown',
    customerPhone: data.customerPhone || 'Unknown',
    reference: data.reference || 'Unknown-Ref'
  } as Order;
}
`;

// Replace the existing normalization block.
// We'll regex match the function.
code = code.replace(/function normalizeOrderData.*?as Order;\n}/s, normalizeFn.trim());
fs.writeFileSync(path, code);
