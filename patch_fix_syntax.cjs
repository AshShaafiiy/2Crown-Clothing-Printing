const fs = require('fs');
let code = fs.readFileSync('src/services/api/index.ts', 'utf8');

code = code.replace(/async checkEligibility[\s\S]*?async verifyPurchase/,
`async checkEligibility(productId: ID): Promise<{ eligible: boolean; reason: string; existingRating?: number }> {
    const token = localStorage.getItem(\`rating_token_\${productId}\`);
    if (!token) return { eligible: false, reason: 'not_authenticated' };
    try {
      const res = await fetch(\`/api/ratings/\${productId}?eligibility=true\`, {
        headers: { 'Authorization': \`Bearer \${token}\` }
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
           localStorage.removeItem(\`rating_token_\${productId}\`);
        }
        return { eligible: false, reason: 'not_authenticated' };
      }
      return await res.json();
    } catch {
      return { eligible: false, reason: 'not_authenticated' };
    }
  }

  async verifyPurchase`);

fs.writeFileSync('src/services/api/index.ts', code);
