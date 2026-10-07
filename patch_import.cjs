const fs = require('fs');
const path = 'src/views/admin/Orders.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  "import { getValidNextStatuses, getStatusLabel } from '../../utils/orderTransitions';",
  "import { getValidNextStatuses, getStatusLabel } from '../../utils/orderTransitions';\nimport { normalizeOrderHistoryDate } from '../../utils/orderHistory';"
);

fs.writeFileSync(path, code);
