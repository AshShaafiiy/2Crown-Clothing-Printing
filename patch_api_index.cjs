const fs = require('fs');
const file = 'src/services/api/index.ts';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  /async getOrderByReference\(reference: string, phone\?: string\): Promise<PublicOrder \| null> \{[\s\S]*?\n  \}/g,
  `async getOrderByReference(reference: string, phone: string): Promise<PublicOrder | null> {
    try {
      if (!/^2C-\\d{6}$/i.test(reference.trim())) return null;
      return await apiClient<PublicOrder>('/orders/track', { method: 'POST', body: JSON.stringify({ reference, phone }) });
    }
    catch (err: any) { if (err.status === 404) return null; throw err; }
  }`
);

fs.writeFileSync(file, data);
