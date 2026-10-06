const fs = require('fs');
let code = fs.readFileSync('src/services/mock/index.ts', 'utf8');

const verifyMethod = `
  async verifyPurchase(productId: ID, reference: string, phone: string): Promise<{ token: string; existingRating?: number }> {
    if (reference === '2C-123456') {
      return { token: 'mock-token', existingRating: undefined };
    }
    throw new Error('We couldn\\'t verify this purchase.');
  }
`;

code = code.replace(/async getRatingSummary/, verifyMethod + '\n  async getRatingSummary');

fs.writeFileSync('src/services/mock/index.ts', code);
