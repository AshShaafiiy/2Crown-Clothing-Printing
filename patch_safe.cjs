const fs = require('fs');

function patchProducts() {
  let content = fs.readFileSync('src/views/admin/Products.tsx', 'utf8');
  content = content.replace(/price: 0,/g, 'price: "" as string | number,');
  content = content.replace(/previousPrice: 0,/g, 'previousPrice: "" as string | number,');
  content = content.replace(/price: parseFloat\(e.target.value\) \|\| 0/g, 'price: e.target.value');
  content = content.replace(/previousPrice: parseFloat\(e.target.value\) \|\| 0/g, 'previousPrice: e.target.value');
  content = content.replace(/price: formData.price,/g, 'price: parseFloat(formData.price as string) || 0,');
  content = content.replace(/previousPrice: formData.previousPrice > 0 \? formData.previousPrice : undefined,/g, 'previousPrice: (parseFloat(formData.previousPrice as string) || 0) > 0 ? parseFloat(formData.previousPrice as string) : undefined,');
  content = content.replace(/if \(formData.price <= 0\)/g, 'if ((parseFloat(formData.price as string) || 0) <= 0)');
  content = content.replace(/return setFormError\(/g, 'return toast.error(');
  content = content.replace(/\{formError && \([\s\S]*?\{formError\}\s*<\/div>\s*\)\}/, '');
  content = content.replace(/const \[formError, toast.error\]/g, 'const [formError, setFormError]');
  content = content.replace(/toast.error\(null\)/g, 'setFormError(null)');
  fs.writeFileSync('src/views/admin/Products.tsx', content);
}

function patchCategories() {
  let content = fs.readFileSync('src/views/admin/Categories.tsx', 'utf8');
  content = content.replace(/return setFormError\(/g, 'return toast.error(');
  content = content.replace(/setFormError\(/g, 'toast.error(');
  content = content.replace(/const \[formError, toast.error\]/g, 'const [formError, setFormError]');
  content = content.replace(/toast.error\(null\)/g, 'setFormError(null)');
  content = content.replace(/\{formError && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">\{formError\}<\/p>\}/, '');
  fs.writeFileSync('src/views/admin/Categories.tsx', content);
}

function patchAdmins() {
  let content = fs.readFileSync('src/views/admin/Administrators.tsx', 'utf8');
  content = content.replace(/return setFormError\(/g, 'return toast.error(');
  content = content.replace(/setFormError\(err.message/g, 'toast.error(err.message');
  content = content.replace(/const \[formError, toast.error\]/g, 'const [formError, setFormError]');
  content = content.replace(/toast.error\(null\)/g, 'setFormError(null)');
  content = content.replace(/\{formError && <div className="bg-red-50 text-red-600 p-3 mb-4 rounded-md text-sm border border-red-100">\{formError\}<\/div>\}/, '');
  fs.writeFileSync('src/views/admin/Administrators.tsx', content);
}

patchProducts();
patchCategories();
patchAdmins();
