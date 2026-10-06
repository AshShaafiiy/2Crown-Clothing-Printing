const https = require('https');

function check() {
  https.get('https://2crown-clothing-printing.vercel.app/api/ratings/audit', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const json = JSON.parse(data);
          if (json.total !== undefined) {
            console.log("Deployed! Data:");
            console.log(json);
            process.exit(0);
          }
        } catch (e) {}
      }
      console.log(`Status: ${res.statusCode}, waiting 10s...`);
      setTimeout(check, 10000);
    });
  }).on('error', (e) => {
    console.error(e);
    setTimeout(check, 10000);
  });
}

check();
