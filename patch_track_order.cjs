const fs = require('fs');
const path = 'src/views/public/TrackOrder.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace grid grid-cols-2 with flex flex-col sm:flex-row sm:justify-between
content = content.replace(/<div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100">/g, 
  '<div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 py-3 border-b border-gray-100">');

// For Order Items, change to match
content = content.replace(
  /<div className="py-3 border-b border-gray-100">\s*<div className="text-gray-500 mb-2">Order Items<\/div>/,
  `<div className="py-3 border-b border-gray-100">\n              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 mb-2">\n                <div className="text-gray-500">Order Items</div>\n              </div>`
);

// We need to also check if getStatusLabel handles "WhatsApp Pending". 
// Wait, the status is replaced in the API to be "Awaiting Confirmation". But what if an old order has "WhatsApp Pending"? 
// The prompt says: 'If the UI currently says: WhatsApp Pending ... determine whether that is a separate WhatsApp communication state or incorrectly replacing the actual order status. Do NOT conflate: WhatsApp state with Order lifecycle status.'
// The `getStatusLabel` does not know "WhatsApp Pending" because it's not a valid status in the new system.
// We should make sure `status` is displayed correctly.

fs.writeFileSync(path, content);
console.log("Updated TrackOrder.tsx layout");
