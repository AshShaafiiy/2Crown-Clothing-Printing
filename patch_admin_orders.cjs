const fs = require('fs');
const path = 'src/views/admin/Orders.tsx';
let content = fs.readFileSync(path, 'utf8');

// We need to modify handleStatusChange
const oldHandleStatusChange = `const handleStatusChange = async (order: Order, newStatus: string) => {`;
const newHandleStatusChange = `const handleStatusChange = async (order: Order, newStatus: string) => {
    if (newStatus === 'Confirmed' && order.deliveryMethod !== 'pickup' && order.deliveryFee == null) {
      toast.error('Enter the delivery fee before confirming this order.', { duration: 4000 });
      setEditingFeeId(order.id);
      setTimeout(() => {
        const input = document.getElementById('delivery-fee-input');
        if (input) input.focus();
      }, 100);
      return;
    }
`;

content = content.replace(oldHandleStatusChange, newHandleStatusChange);

fs.writeFileSync(path, content);
console.log("Updated Orders.tsx");
