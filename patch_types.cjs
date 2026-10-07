const fs = require('fs');

// 1. Fix tsconfig target
let tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
tsconfig.compilerOptions.target = 'es2022';
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));

// 2. Fix src/domain/models/index.ts
let models = fs.readFileSync('src/domain/models/index.ts', 'utf8');
models = models.replace(/previousPrice\?: number;\n  previousPrice\?: number;/g, 'previousPrice?: number;');
fs.writeFileSync('src/domain/models/index.ts', models);

// 3. Fix src/components/layout/ScrollToTop.tsx
let scroll = fs.readFileSync('src/components/layout/ScrollToTop.tsx', 'utf8');
scroll = scroll.replace('const { pathname, hash } = usePathname();', 'const pathname = usePathname();\n  const hash = typeof window !== "undefined" ? window.location.hash : "";');
fs.writeFileSync('src/components/layout/ScrollToTop.tsx', scroll);

// 4. Fix src/views/admin/Login.tsx
let login = fs.readFileSync('src/views/admin/Login.tsx', 'utf8');
login = login.replace('router.push(from, { replace: true });', 'router.replace(from);');
fs.writeFileSync('src/views/admin/Login.tsx', login);

// 5. Fix src/views/public/TrackOrder.tsx
let track = fs.readFileSync('src/views/public/TrackOrder.tsx', 'utf8');
track = track.replace('isLegacy ? phone : undefined', 'isLegacy ? phone : ""');
fs.writeFileSync('src/views/public/TrackOrder.tsx', track);

// 6. Fix src/views/public/OrderConfirmation.tsx
let conf = fs.readFileSync('src/views/public/OrderConfirmation.tsx', 'utf8');
conf = conf.replace('await services.orders.getOrderByReference(reference)', 'await services.orders.getOrderByReference(reference, "")');
fs.writeFileSync('src/views/public/OrderConfirmation.tsx', conf);

