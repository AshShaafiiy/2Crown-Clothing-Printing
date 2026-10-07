const fs = require('fs');
let content = fs.readFileSync('src/views/admin/Categories.tsx', 'utf8');

// Replace inline form error with toast
content = content.replace(/setFormError\(/g, 'toast.error(');
// Restore useState declaration
content = content.replace(/const \[formError, toast\.error\]/g, 'const [formError, setFormError]');

// Remove the inline block rendering formError
content = content.replace(/\{formError && <p[\s\S]*?<\/p>\}/g, '');

fs.writeFileSync('src/views/admin/Categories.tsx', content);
