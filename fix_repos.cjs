const fs = require('fs');

function fixClass(file, methodName) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Find where the method was added outside the class
  const match = code.match(new RegExp(`async ${methodName}\\([\\s\\S]*?}\\n`));
  if (match) {
    const methodStr = match[0];
    // Remove the bad method string
    code = code.replace(methodStr, '');
    // Insert it before the last closing brace of the class
    // Wait, the class usually ends right before export const
    code = code.replace(/^}$/m, methodStr + '\n}');
    fs.writeFileSync(file, code);
  }
}

let orderCode = fs.readFileSync('src/backend/repositories/OrderRepository.ts', 'utf8');
const orderMethod = orderCode.match(/async checkPurchaseStatus\([\s\S]*?\} \n\s*\}/m);
if (orderMethod) {
  orderCode = orderCode.replace(orderMethod[0], '');
  orderCode = orderCode.replace(/^}$/m, orderMethod[0] + '\n}');
} else {
  const method2 = orderCode.match(/async hasDeliveredProduct\([\s\S]*?return false;\n\s*\}/m);
  if (method2) {
      orderCode = orderCode.replace(method2[0], '');
      orderCode = orderCode.replace(/^}$/m, method2[0] + '\n}');
  }
}
fs.writeFileSync('src/backend/repositories/OrderRepository.ts', orderCode);

let reviewCode = fs.readFileSync('src/backend/repositories/ReviewRepository.ts', 'utf8');
const reviewMethod1 = reviewCode.match(/async findById\([\s\S]*?\}\n/m);
const reviewMethod2 = reviewCode.match(/async update\([\s\S]*?\}\n/m);
if (reviewMethod1 && reviewMethod2) {
  reviewCode = reviewCode.replace(reviewMethod1[0], '');
  reviewCode = reviewCode.replace(reviewMethod2[0], '');
  reviewCode = reviewCode.replace(/^}$/m, reviewMethod1[0] + '\n' + reviewMethod2[0] + '\n}');
}
fs.writeFileSync('src/backend/repositories/ReviewRepository.ts', reviewCode);

