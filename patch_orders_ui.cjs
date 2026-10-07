const fs = require('fs');

const path = 'src/views/admin/Orders.tsx';
let code = fs.readFileSync(path, 'utf8');

// Helper to safely format dates in UI
const safeDate = `
function safeFormatDate(dateStr?: string, options?: any) {
  if (!dateStr) return 'Date unavailable';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Date unavailable';
  return options ? d.toLocaleString(undefined, options) : d.toLocaleString();
}

function safeFormatDateShort(dateStr?: string) {
  if (!dateStr) return 'Date unavailable';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Date unavailable';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
`;

// Insert the helpers after the imports
code = code.replace(
  'const Orders: React.FC = () => {',
  `${safeDate}\nconst Orders: React.FC = () => {`
);

// Replace usages
code = code.replace(
  /{new Date\(order\.createdAt\)\.toLocaleDateString\(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }\)}/g,
  '{safeFormatDateShort(order.createdAt)}'
);

code = code.replace(
  /{new Date\(order\.createdAt\)\.toLocaleString\(\)}/g,
  '{safeFormatDate(order.createdAt)}'
);

fs.writeFileSync(path, code);
