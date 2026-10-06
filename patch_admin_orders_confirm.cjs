const fs = require('fs');
const path = 'src/views/admin/Orders.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldConfirm = `    const isConfirmed = await confirm({
      title: 'Update Order Status',
      message: \`Are you sure you want to change the status to \${newStatus}?\`,
      confirmLabel: 'Update Status',
      isDestructive: newStatus === 'Cancelled'
    });`;

const newConfirm = `    const isConfirmed = await confirm({
      title: newStatus === 'Confirmed' ? 'Confirm Order' : 'Update Order Status',
      message: newStatus === 'Confirmed' 
        ? (order.deliveryMethod === 'pickup' ? 'Confirm this order for Store Pickup?' : \`Confirm this order with a delivery fee of ₦\${order.deliveryFee?.toLocaleString()}?\`)
        : \`Are you sure you want to change the status to \${newStatus}?\`,
      confirmLabel: newStatus === 'Confirmed' ? 'Confirm Order' : 'Update Status',
      isDestructive: newStatus === 'Cancelled'
    });`;

content = content.replace(oldConfirm, newConfirm);

fs.writeFileSync(path, content);
console.log("Updated Orders.tsx confirm message");
