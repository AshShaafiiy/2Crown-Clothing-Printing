const fs = require('fs');
let code = fs.readFileSync('src/views/public/TrackOrder.tsx', 'utf8');

const target = `                  if (order.history) {
                    const entry = order.history.find(h => {
                      const entryStatus = h.newStatus || (h as any).status;
                      if (!entryStatus) return false;
                      // Compare the localized human-readable label to the timeline 'status' text
                      return getStatusLabel(entryStatus, true) === status;
                    });`;

const replacement = `                  if (order.history) {
                    const entry = order.history.find(h => {
                      const entryStatus = h.newStatus || (h as any).status;
                      if (!entryStatus) return false;
                      return getCustomerFacingStatus(entryStatus) === status;
                    });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/views/public/TrackOrder.tsx', code);
