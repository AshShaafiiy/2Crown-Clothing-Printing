const fs = require('fs');
let content = fs.readFileSync('PROJECT_HANDOFF.md', 'utf8');

const additionalRules = `
- **Delivery Fee Architecture**: There is NO "Delivery Option" CRUD or standalone collection in the admin backend. "Delivery Fee" strictly refers to the per-order local delivery charge manually entered by the Admin on the Orders dashboard.
- **Delivery Constraints**: 
  - Store Pickup delivery fee is strictly \`₦0\`. 
  - Unset Local Delivery fee displays as \`To be confirmed\` on the customer tracker and avoids forcefully rewriting missing fees to 0.
  - An order with Local Delivery CANNOT transition to \`Confirmed\` until the admin inputs a valid numeric fee.
  - The customer total recalculates immediately after confirmation (\`subtotal - discount + deliveryFee\`).
`;

content = content.replace(/- \*\*Delivery:\*\* Pickup fee is exactly/, additionalRules.trim() + '\n- **Delivery:** Pickup fee is exactly');

fs.writeFileSync('PROJECT_HANDOFF.md', content);
