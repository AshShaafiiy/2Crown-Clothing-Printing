const jwt = require('jsonwebtoken');
const token = jwt.sign({ buyerFingerprint: 'mockFingerprint', productId: 'prod_other' }, process.env.JWT_SECRET || 'dev_token_secret', { expiresIn: '1h' });
console.log(token);
