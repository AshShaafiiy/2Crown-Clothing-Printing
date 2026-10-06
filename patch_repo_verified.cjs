const fs = require('fs');
let code = fs.readFileSync('src/backend/repositories/ReviewRepository.ts', 'utf8');

const replacement = `
  async getRatingSummary(productId: string): Promise<{ average: number; count: number }> {
    const snap = await db.collection('reviews')
      .where('productId', '==', productId)
      .where('approved', '==', true)
      .get();
      
    if (snap.empty) return { average: 0, count: 0 };
    
    let sum = 0;
    let count = 0;
    snap.docs.forEach( (doc: any) => {
      const data = doc.data();
      if (data.verifiedPurchase === true) {
        sum += data.rating;
        count++;
      }
    });
    
    if (count === 0) return { average: 0, count: 0 };
    
    return { average: sum / count, count };
  }
`;

code = code.replace(/async getRatingSummary[\s\S]*?return \{ average[\s\S]*?\}\n\s*\}/, replacement.trim());
fs.writeFileSync('src/backend/repositories/ReviewRepository.ts', code);
