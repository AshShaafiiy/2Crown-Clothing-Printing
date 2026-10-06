const fs = require('fs');
let code = fs.readFileSync('src/views/public/TrackOrder.tsx', 'utf8');

if (!code.includes("import { normalizeOrderHistoryDate }")) {
  code = code.replace("import { Search } from 'lucide-react';", "import { Search } from 'lucide-react';\nimport { normalizeOrderHistoryDate } from '../../utils/orderHistory';");
  fs.writeFileSync('src/views/public/TrackOrder.tsx', code);
}
