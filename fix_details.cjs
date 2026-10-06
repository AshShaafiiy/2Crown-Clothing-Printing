const fs = require('fs');

const path = 'src/views/public/ProductDetails.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix 'quantity is not defined' in handleAddToCart
content = content.replace(/toast\.success\(\`Added \$\{quantity\}x \$\{product\.name\} to cart!\`\);/, "toast.success(`Added 1x ${product.name} to cart!`);");

// 2. Move cartItem logic BELOW useState
const hookStrRegex = /  const \{ items, addItem, updateQuantity, removeItem \} = useCartStore\(\);[\s\S]*?\);\n/m;
const hookStrMatch = content.match(hookStrRegex);

if (hookStrMatch) {
  content = content.replace(hookStrRegex, '');
  const insertTarget = "const [customization, setCustomization] = useState<Record<string, any>>({});\n";
  content = content.replace(insertTarget, insertTarget + "\n" + hookStrMatch[0]);
}

fs.writeFileSync(path, content);
