const fs = require('fs');

// Fix "data is possibly undefined" by initializing to {} if falsy
const addFallback = (file) => {
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace('const data: any = await request.json();', 'const data: any = (await request.json()) || {};');
  fs.writeFileSync(file, text);
};
addFallback('app/api/categories/[id]/route.ts');
addFallback('app/api/categories/route.ts');
addFallback('app/api/ratings/[productId]/route.ts');

// Fix Promise params for Next.js API Routes across the entire app
const glob = require('glob');
const routeFiles = glob.sync('app/api/**/route.ts');
routeFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Match signatures like:
  // export async function GET(req: Request, { params }: { params: { productId: string } }) {
  // export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  content = content.replace(/\{ params \}: \{ params: \{ ([^}]+) \} \}/g, '{ params }: { params: Promise<{ $1 }> }');
  
  // also wait for params! If it's a promise, we must await it before using it.
  // We can just add `const { ... } = await params;` or `const resolvedParams = await params;`
  // But wait, the existing code uses `params.id` directly.
  // Actually, wait, replacing it blindly might break runtime if `params` is a promise and they access `params.id` without awaiting.
  // Since it's Next.js 15, `params` IS a promise at runtime in route handlers! 
  // Let's replace `params.id` with `(await params).id`.
  content = content.replace(/params\.(\w+)/g, '(await params).$1');
  
  fs.writeFileSync(file, content);
});

