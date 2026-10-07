const https = require('https');

function poll() {
  https.get('https://2crown-clothing-printing.vercel.app/api/secret-dump', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const orders = JSON.parse(data);
          const liveOrder = orders.find(o => o.status === 'Processing');
          if (liveOrder) {
            console.log("LIVE ORDER REFERENCE:", liveOrder.reference);
            console.log(JSON.stringify(liveOrder.history, null, 2));
          } else {
            console.log("No Processing order found yet.");
          }
        } catch (e) {
          console.log("Parse error:", e.message);
          setTimeout(poll, 5000);
        }
      } else {
        console.log("Status:", res.statusCode);
        setTimeout(poll, 5000);
      }
    });
  }).on('error', e => {
    console.log("Error:", e.message);
    setTimeout(poll, 5000);
  });
}
poll();
