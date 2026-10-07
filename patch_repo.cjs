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
      createdAt = ''; // Explicit missing, no synthetic epoch
    }
  }

  let updatedAt = data.updatedAt;
  if (!updatedAt || isNaN(new Date(updatedAt).getTime())) {
    updatedAt = createdAt;
  }

  let subtotal = Number(data.subtotal);
  if (isNaN(subtotal) || !data.subtotal) {
    // Dynamically derive from factual item data if missing
    subtotal = (data.items || []).reduce((acc: number, item: any) => acc + (Number(item.price) * Number(item.quantity) || 0), 0);
  }

  const discount = Number(data.discount) || 0;
  
  let deliveryFee = data.deliveryFee;
  if (data.deliveryMethod === 'pickup') {
    deliveryFee = 0; // Business Rule: Store pickup is exactly 0
  } else if (deliveryFee !== null && deliveryFee !== undefined) {
    deliveryFee = Number(deliveryFee);
    if (isNaN(deliveryFee)) deliveryFee = null;
  } else {
    deliveryFee = null; // Unset local/nationwide delivery remains null
  }
  
  let total = Number(data.total);
  if (isNaN(total) || !data.total) {
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
          timestamp: '', // Explicit missing, no synthetic date
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

// Replace existing normalizeFn
code = code.replace(/function normalizeOrderData.*?as Order;\n}/s, normalizeFn.trim());
fs.writeFileSync(path, code);
