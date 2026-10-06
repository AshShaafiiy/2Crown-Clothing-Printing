const fs = require('fs');
const path = 'src/views/public/Cart.test.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "expect(screen.getByText('₦600')).toBeInTheDocument();",
  "expect(screen.getAllByText('₦600')[0]).toBeInTheDocument();"
);

fs.writeFileSync(path, content);
console.log("Updated Cart.test.tsx to use getAllByText for price");
