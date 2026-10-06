const fs = require('fs');
const file = 'src/backend/utils/next-utils.ts';
let code = fs.readFileSync(file, 'utf8');

const newFunc = `
export async function authenticateCustomerNext(req: Request): Promise<{ uid?: string; name?: string; error?: string; status?: number }> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized: Missing or invalid token', status: 401 };
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = await auth.verifyIdToken(token);
    return { uid: decoded.uid, name: decoded.name || decoded.email || 'Customer' };
  } catch (err) {
    return { error: 'Unauthorized: Invalid token', status: 401 };
  }
}
`;

if (!code.includes('authenticateCustomerNext')) {
  code += newFunc;
  fs.writeFileSync(file, code);
  console.log('Next utils patched');
} else {
  console.log('Already patched');
}
