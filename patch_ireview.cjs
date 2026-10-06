const fs = require('fs');
const file = 'src/services/interfaces/index.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "getRatingSummary(productId: ID): Promise<{ average: number; count: number }>;",
  `checkEligibility?(productId: ID): Promise<{ eligible: boolean; reason: string; existingRating?: number }>;
  getRatingSummary(productId: ID): Promise<{ average: number; count: number }>;`
);

fs.writeFileSync(file, code);
