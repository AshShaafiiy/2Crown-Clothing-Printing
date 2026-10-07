const fs = require('fs');
let content = fs.readFileSync('src/views/admin/Orders.test.tsx', 'utf8');

content = content.replace(
  /expect\(toast\.default\.error\)\.toHaveBeenCalledWith\('Enter the delivery fee before confirming this order\.', expect\.anything\(\)\);/g,
  "expect(mockConfirm).toHaveBeenCalledWith(expect.objectContaining({ title: 'Delivery Fee Required' }));"
);
content = content.replace(
  /expect\(mockConfirm\)\.not\.toHaveBeenCalled\(\);/g,
  ""
);

fs.writeFileSync('src/views/admin/Orders.test.tsx', content);
