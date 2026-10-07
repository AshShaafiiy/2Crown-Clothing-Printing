const fs = require('fs');
let content = fs.readFileSync('src/views/admin/Products.tsx', 'utf8');

// Fix initial state and input binding
content = content.replace(/price: 0,/g, 'price: "" as string | number,');
content = content.replace(/previousPrice: 0,/g, 'previousPrice: "" as string | number,');
content = content.replace(/price: parseFloat\(e.target.value\) \|\| 0/g, 'price: e.target.value');
content = content.replace(/previousPrice: parseFloat\(e.target.value\) \|\| 0/g, 'previousPrice: e.target.value');
content = content.replace(/price: formData.price,/g, 'price: parseFloat(formData.price as string) || 0,');
content = content.replace(/previousPrice: formData.previousPrice > 0 \? formData.previousPrice : undefined,/g, 'previousPrice: (parseFloat(formData.previousPrice as string) || 0) > 0 ? parseFloat(formData.previousPrice as string) : undefined,');
content = content.replace(/if \(formData.price <= 0\)/g, 'if ((parseFloat(formData.price as string) || 0) <= 0)');

// Replace inline form error with toast
content = content.replace(/setFormError\(/g, 'toast.error(');
// We need to keep `const [formError, setFormError] = useState` but not use it.
content = content.replace(/const \[formError, toast\.error\]/g, 'const [formError, setFormError]');

// Remove the inline block rendering formError
content = content.replace(/\{formError && \([\s\S]*?\}\)/g, '');

fs.writeFileSync('src/views/admin/Products.tsx', content);
