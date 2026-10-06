const fs = require('fs');
let code = fs.readFileSync('src/views/public/TrackOrder.tsx', 'utf8');

if (!code.includes("import { normalizeOrderHistoryDate }")) {
  code = code.replace("import { Package, Truck, CheckCircle, Clock } from 'lucide-react';", "import { Package, Truck, CheckCircle, Clock } from 'lucide-react';\nimport { normalizeOrderHistoryDate } from '../../utils/orderHistory';");
}

const target = `                  // Find timestamp from history if available
                  let timestamp = '';
                  if (order.history) {
                    const entry = order.history.find(h => getCustomerFacingStatus(h.newStatus) === status);
                    if (entry) timestamp = new Date(entry.timestamp).toLocaleString();
                  }
                  if (index === 0 && !timestamp) timestamp = new Date(order.createdAt).toLocaleString();`;

const replacement = `                  // Find timestamp from history if available
                  let timestamp = '';
                  if (order.history) {
                    const entry = order.history.find(h => {
                      const entryStatus = h.newStatus || (h as any).status;
                      if (!entryStatus) return false;
                      return getCustomerFacingStatus(entryStatus) === status;
                    });
                    if (entry) {
                      const normalized = normalizeOrderHistoryDate(entry.timestamp);
                      if (normalized) timestamp = new Date(normalized).toLocaleString();
                    }
                  }
                  if (index === 0 && !timestamp) {
                    const normCreatedAt = normalizeOrderHistoryDate(order.createdAt);
                    if (normCreatedAt) timestamp = new Date(normCreatedAt).toLocaleString();
                  }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/views/public/TrackOrder.tsx', code);
