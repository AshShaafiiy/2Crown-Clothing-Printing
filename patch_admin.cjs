const fs = require('fs');

const fixFile = (path, replaceMap) => {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf-8');
  
  // Replace undefined endpoints with actual ones
  for (const [from, to] of Object.entries(replaceMap)) {
    content = content.replace(from, to);
  }

  // Add basic error handling for useEffect promises
  // This is a rough regex to add .catch to .then chains in useEffect if they don't exist
  if (!content.includes('catch(') && !content.includes('setError(')) {
    content = content.replace(/const \[loading, setLoading\] = useState\(true\);/g, 'const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);');
    
    // Find .then(data => { ... setLoading(false); }) and append .catch
    content = content.replace(/setLoading\(false\);\n\s*\}\);/g, 'setLoading(false);\n    }).catch(err => {\n      console.error(err);\n      setError(err.message || "An error occurred");\n      setLoading(false);\n    });');

    // Also render the error
    content = content.replace(/\{loading \? \(\n\s*<p>Loading...<\/p>\n\s*\) : \(/g, '{loading ? (\n        <p>Loading...</p>\n      ) : error ? (\n        <p className="text-red-500">{error}</p>\n      ) : (');
  }

  fs.writeFileSync(path, content, 'utf-8');
}

fixFile('src/pages/admin/Customers.tsx', {
  'services.customers.getCustomers()': 'services.rbac.getUsers()',
  '// @ts-ignore': ''
});

fixFile('src/pages/admin/Settings.tsx', {
  'services.settings.getSettings()': 'services.settings.getBusinessSettings()',
  '// @ts-ignore': ''
});

fixFile('src/pages/admin/Orders.tsx', {});
fixFile('src/pages/admin/Products.tsx', {});
fixFile('src/pages/admin/Categories.tsx', {});
fixFile('src/pages/admin/Gallery.tsx', {});

console.log('Patched');
