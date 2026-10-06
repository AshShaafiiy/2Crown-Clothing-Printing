const fs = require('fs');
const file = 'src/backend/schemas/index.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /export const SubmitRatingSchema = z\.object\(\{[\s\S]*?\}\);/,
  `export const SubmitRatingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  customerId: z.string().optional(),
  customerName: z.string().optional()
});`
);

code = code.replace(
  /export const ReviewSchema = z\.object\(\{[\s\S]*?\}\);/,
  `export const ReviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  customerId: z.string(),
  customerName: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  approved: z.boolean()
});`
);

fs.writeFileSync(file, code);
console.log('Schemas patched');
