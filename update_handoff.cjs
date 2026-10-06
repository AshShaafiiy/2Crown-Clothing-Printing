const fs = require('fs');
const path = 'PROJECT_HANDOFF.md';
let content = fs.readFileSync(path, 'utf8');

const orderRules = `
## Order Lifecycle & Tracking Rules
- Orders automatically start at Awaiting Confirmation.
- Admin does not manually set Awaiting Confirmation.
- Admin first action is Order Confirmed.
- Local Delivery requires delivery fee before confirmation.
- Pickup fee = ₦0.
- Customer timeline retains complete chronological history.
- Confirmed delivery fee appears on customer tracking.
- Total includes persisted delivery fee.
`;

const cartRuleUpdate = `Cart quantity controls use gold decrement/increment buttons with a display-only center quantity. Product Details shows added-item feedback beside the control on desktop and uses an Add to Cart button with cart icon before insertion.`;

content = content.replace(
  'Customer-facing product quantities are controlled exclusively with decrement/increment buttons.',
  cartRuleUpdate
);

if (!content.includes('Order Lifecycle & Tracking Rules')) {
  content += '\n' + orderRules;
}

fs.writeFileSync(path, content);
console.log("Updated PROJECT_HANDOFF.md");
