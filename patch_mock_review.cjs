const fs = require('fs');
const file = 'src/services/mock/index.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "async getRatingSummary(productId: ID): Promise<{ average: number; count: number }> {",
  `async checkEligibility(productId: ID): Promise<{ eligible: boolean; reason: string; existingRating?: number }> {
    return { eligible: true, reason: 'eligible' }; // mock always eligible for UI testing if not logged in? Wait, let's just make it always eligible in mock for now
  }
  async getRatingSummary(productId: ID): Promise<{ average: number; count: number }> {`
);

fs.writeFileSync(file, code);
