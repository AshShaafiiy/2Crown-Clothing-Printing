const fs = require('fs');

// 1. Fix Page(props)
const glob = require('glob');
const pages = glob.sync('app/**/page.tsx');
pages.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace('export default function Page(props) {', 'export default function Page(props: any) {');
  fs.writeFileSync(file, content);
});

// 2. app/api/admins/route.ts
let admins = fs.readFileSync('app/api/admins/route.ts', 'utf8');
admins = admins.replace('createdAt: new Date().toISOString()', "createdAt: new Date().toISOString(), passwordHash: ''");
fs.writeFileSync('app/api/admins/route.ts', admins);

// 3. app/api/categories/[id]/route.ts & app/api/categories/route.ts
let catId = fs.readFileSync('app/api/categories/[id]/route.ts', 'utf8');
catId = catId.replace('function generateSlug(text) {', 'function generateSlug(text: string) {');
catId = catId.replace('const data = await request.json();', 'const data: any = await request.json();');
fs.writeFileSync('app/api/categories/[id]/route.ts', catId);

let cat = fs.readFileSync('app/api/categories/route.ts', 'utf8');
cat = cat.replace('function generateSlug(text) {', 'function generateSlug(text: string) {');
cat = cat.replace('const data = await request.json();', 'const data: any = await request.json();');
// also fix the type mismatch on create
cat = cat.replace('const newCategory = await categoryRepository.create({ id: uuid(), ...data, createdAt: new Date().toISOString() });',
                  'const newCategory = await categoryRepository.create({ id: uuid(), name: data.name || "", active: data.active ?? true, slug: data.slug || "", order: data.order || 0, imageUrl: data.imageUrl, description: data.description, parentId: data.parentId, createdAt: new Date().toISOString() });');
fs.writeFileSync('app/api/categories/route.ts', cat);

// 4. app/api/orders/[reference]/status/route.ts
let orderStatus = fs.readFileSync('app/api/orders/[reference]/status/route.ts', 'utf8');
orderStatus = orderStatus.replace('actorId: user?.uid,', 'actorId: user?.id,');
fs.writeFileSync('app/api/orders/[reference]/status/route.ts', orderStatus);

// 5. app/api/ratings/[productId]/route.ts
let rating = fs.readFileSync('app/api/ratings/[productId]/route.ts', 'utf8');
rating = rating.replace('const data = await request.json();', 'const data: any = await request.json();');
// remove verifiedPurchase if it's there
rating = rating.replace('verifiedPurchase: true\n      }', '}');
rating = rating.replace('verifiedPurchase: true', '');
fs.writeFileSync('app/api/ratings/[productId]/route.ts', rating);

