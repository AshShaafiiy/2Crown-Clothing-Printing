const fs = require('fs');
let code = fs.readFileSync('app/api/orders/track/route.ts', 'utf8');

code = code.replace(
  /import \{ rateLimit \} from '@\/utils\/rateLimit';/,
  "import { rateLimit } from '@/utils/rateLimit';\nimport { normalizePhone } from '@/backend/utils/phone';"
);

code = code.replace(
  /const normalizedPhone = phone\.replace\(\/\[\^\\d\+\]\/g, ''\);/,
  "const normalizedPhone = normalizePhone(phone);"
);

code = code.replace(
  /const orderPhone = order\.customerPhone\.replace\(\/\[\^\\d\+\]\/g, ''\);/,
  "const orderPhone = normalizePhone(order.customerPhone);"
);

fs.writeFileSync('app/api/orders/track/route.ts', code);
