const fs = require('fs');
let env = fs.readFileSync('.env.production', 'utf8');
env = env.replace(/FIREBASE_PRIVATE_KEY=Hidden/g, 'FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDE...\\n-----END PRIVATE KEY-----"');
fs.writeFileSync('.env.production', env);
