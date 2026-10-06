const fs = require('fs');
const path = 'src/views/public/Cart.test.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "expect(screen.getByText('₦1,000')).toBeInTheDocument(); // original price",
  "expect(screen.getAllByText('₦1,000')[0]).toBeInTheDocument(); // original price"
);
content = content.replace(
  "expect(screen.getByText('-40%')).toBeInTheDocument(); // discount badge",
  "expect(screen.getAllByText('-40%')[0]).toBeInTheDocument(); // discount badge"
);

fs.writeFileSync(path, content);
console.log("Updated Cart.test.tsx to use getAllByText for duplicates");
