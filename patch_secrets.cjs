const fs = require('fs');

const routePath = 'app/api/ratings/[productId]/route.ts';
let routeCode = fs.readFileSync(routePath, 'utf8');
routeCode = routeCode.replace(/const JWT_SECRET = process\.env\.JWT_SECRET \|\| 'dev_secret';/, 
"const TOKEN_SECRET = process.env.RATING_TOKEN_SECRET || process.env.JWT_SECRET || 'dev_token_secret';");
routeCode = routeCode.replace(/jwt\.verify\(token, JWT_SECRET\)/g, 'jwt.verify(token, TOKEN_SECRET)');
fs.writeFileSync(routePath, routeCode);

const verifyPath = 'app/api/ratings/[productId]/verify/route.ts';
let verifyCode = fs.readFileSync(verifyPath, 'utf8');
verifyCode = verifyCode.replace(/const JWT_SECRET = process\.env\.JWT_SECRET \|\| 'dev_secret';/, 
"const FINGERPRINT_SECRET = process.env.BUYER_FINGERPRINT_SECRET || process.env.JWT_SECRET || 'dev_fingerprint_secret';\nconst TOKEN_SECRET = process.env.RATING_TOKEN_SECRET || process.env.JWT_SECRET || 'dev_token_secret';");
verifyCode = verifyCode.replace(/crypto\.createHmac\('sha256', JWT_SECRET\)/g, "crypto.createHmac('sha256', FINGERPRINT_SECRET)");
verifyCode = verifyCode.replace(/jwt\.sign\(\{ buyerFingerprint, productId \}, JWT_SECRET, \{ expiresIn: '1h' \}\)/g, "jwt.sign({ buyerFingerprint, productId }, TOKEN_SECRET, { expiresIn: '1h' })");
fs.writeFileSync(verifyPath, verifyCode);
