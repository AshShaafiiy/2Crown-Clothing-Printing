const https = require('https');
https.get('https://2crown-clothing-printing.vercel.app/api/secret-dump', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const orders = JSON.parse(data);
    const liveOrder = orders.find(o => o.reference === '2C-133380');
    console.log("createdAt:", liveOrder.createdAt);
    console.log("updatedAt:", liveOrder.updatedAt);
  });
});
