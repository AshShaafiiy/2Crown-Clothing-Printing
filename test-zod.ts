import { z } from 'zod';
const CategoryInputSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  parentId: z.string().optional(),
  active: z.boolean(),
  order: z.number()
});
const res = CategoryInputSchema.safeParse({ name: "test", slug: "test", active: true, order: 1 });
console.log(JSON.stringify(res, null, 2));
