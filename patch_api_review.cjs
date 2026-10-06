const fs = require('fs');
const file = 'src/services/api/index.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "async getRatingSummary(productId: ID): Promise<{ average: number; count: number }> {",
  `async checkEligibility(productId: ID): Promise<{ eligible: boolean; reason: string; existingRating?: number }> {
    return apiClient<{ eligible: boolean; reason: string; existingRating?: number }>(\`/ratings/\${productId}?eligibility=true\`);
  }
  async getRatingSummary(productId: ID): Promise<{ average: number; count: number }> {`
);

fs.writeFileSync(file, code);
