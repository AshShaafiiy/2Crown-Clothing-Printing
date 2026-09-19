const fs = require('fs');
let dashContent = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf-8');
dashContent = dashContent.replace('const [recentOrders, setRecentOrders] = useState<Order[]>([]);', 'const [recentOrders, setRecentOrders] = useState<Order[]>([]);\n  const [error, setError] = useState<string | null>(null);');
dashContent = dashContent.replace("console.error('Dashboard fetch error:', err);", "console.error('Dashboard fetch error:', err);\n        setError(err.message || 'An error occurred');");
dashContent = dashContent.replace('<div className="space-y-6">', '<div className="space-y-6">\n      {error && <div className="bg-red-50 p-4 text-red-500 rounded">{error}</div>}');
fs.writeFileSync('src/pages/admin/Dashboard.tsx', dashContent, 'utf-8');
