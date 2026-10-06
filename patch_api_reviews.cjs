const fs = require('fs');
let code = fs.readFileSync('src/services/api/index.ts', 'utf8');

const verifyMethod = `
  async verifyPurchase(productId: ID, reference: string, phone: string): Promise<{ token: string; existingRating?: number }> {
    return apiClient<{ token: string; existingRating?: number }>(\`/ratings/\${productId}/verify\`, {
      method: 'POST',
      body: JSON.stringify({ reference, phone })
    });
  }
`;

code = code.replace(/async getRatingSummary/, verifyMethod + '\n  async getRatingSummary');

// Update checkEligibility to pass the token if available
code = code.replace(
  /async checkEligibility\(productId: ID\): Promise<\{ eligible: boolean; reason: string; existingRating\?: number \}> \{[\s\S]*?\}/,
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
  }`
);

// Update addReview to pass the token
code = code.replace(
  /async addReview\(review: Omit<Review, 'id' \| 'createdAt' \| 'approved'>\): Promise<Review> \{[\s\S]*?\}/,
  `async addReview(review: Omit<Review, 'id' | 'createdAt' | 'approved'>): Promise<Review> {
    const token = localStorage.getItem(\`rating_token_\${review.productId}\`);
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(\`/api/ratings/\${review.productId}\`, {
      method: 'POST',
      headers: { 
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rating: review.rating })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to submit rating');
    }
    return res.json();
  }`
);

fs.writeFileSync('src/services/api/index.ts', code);
