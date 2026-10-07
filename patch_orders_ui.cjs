const fs = require('fs');
let content = fs.readFileSync('src/views/admin/Orders.tsx', 'utf8');

const replacement = `
  const handleStatusChange = async (order: Order, newStatus: string) => {
    if (newStatus === 'Confirmed' && order.deliveryMethod !== 'pickup' && order.deliveryFee == null) {
      await confirm({
        title: 'Delivery Fee Required',
        message: 'Please enter the delivery fee before confirming this order.',
        confirmLabel: 'OK',
        isDestructive: false
      });
      setEditingFeeId(order.id);
      setTimeout(() => {
        const input = document.getElementById('delivery-fee-input');
        if (input) input.focus();
      }, 100);
      return;
    }
`;

content = content.replace(/const handleStatusChange = async \(order: Order, newStatus: string\) => \{[\s\S]*?return;\n    \}/, replacement.trim());

fs.writeFileSync('src/views/admin/Orders.tsx', content);
