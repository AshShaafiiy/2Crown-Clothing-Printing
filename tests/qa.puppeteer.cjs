const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    console.log('Puppeteer success, title:', await page.title());
    await browser.close();
  } catch (e) {
    console.error('Puppeteer error:', e.message);
  }
})();
