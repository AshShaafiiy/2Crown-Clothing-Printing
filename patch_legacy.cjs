const fs = require('fs');

// 1. Remove express imports and requireRoles from authorization.ts
let auth = fs.readFileSync('src/backend/utils/authorization.ts', 'utf8');
auth = auth.replace(/import \{ RequestHandler \} from 'express';/g, '');
auth = auth.replace(/export const requireRoles = \(\.\.\.roles: Role\[\]\): RequestHandler => \(req, res, next\) => \{[\s\S]*?\};/g, '');
fs.writeFileSync('src/backend/utils/authorization.ts', auth);

// 2. Delete completely dead legacy Express files
if (fs.existsSync('src/backend/utils/httpSecurity.ts')) {
  fs.unlinkSync('src/backend/utils/httpSecurity.ts');
}
if (fs.existsSync('src/backend/utils/jwtConfig.ts')) {
  fs.unlinkSync('src/backend/utils/jwtConfig.ts');
}

// 3. Fix rateLimit iteration error manually to avoid tsconfig fighting Next.js
let rateLimit = fs.readFileSync('src/utils/rateLimit.ts', 'utf8');
rateLimit = rateLimit.replace('for (const [key, value] of store.entries()) {', 'for (const [key, value] of Array.from(store.entries())) {');
fs.writeFileSync('src/utils/rateLimit.ts', rateLimit);
