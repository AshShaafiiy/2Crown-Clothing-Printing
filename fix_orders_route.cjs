const fs = require('fs');
const path = 'app/api/orders/route.ts';
let content = fs.readFileSync(path, 'utf8');

// We replace WhatsApp Pending with Awaiting Confirmation
content = content.replace(/'WhatsApp Pending'/g, "'Awaiting Confirmation'");
content = content.replace(/'Order placed, awaiting WhatsApp confirmation.'/g, "'Order placed and awaiting admin confirmation.'");

fs.writeFileSync(path, content);
console.log("Updated app/api/orders/route.ts");
