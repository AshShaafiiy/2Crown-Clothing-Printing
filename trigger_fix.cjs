const https = require('https');

function poll() {
  https.get('https://2crown-clothing-printing.vercel.app/api/secret-fix', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log("Status:", res.statusCode, "Data:", data);
      if (res.statusCode === 200) {
        console.log("Fixed!");
      } else {
        setTimeout(poll, 5000);
      }
    });
  }).on('error', e => {
    console.log("Error:", e.message);
    setTimeout(poll, 5000);
  });
}
poll();
