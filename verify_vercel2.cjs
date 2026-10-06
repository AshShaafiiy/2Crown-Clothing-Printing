const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  
  await page.goto('https://2crown-clothing-printing.vercel.app/product/premium-logo-design', { waitUntil: 'domcontentloaded' });
  
  const addBtn = await page.waitForSelector('text="Add to Cart"');
  if (addBtn) {
    await addBtn.click();
    await page.waitForTimeout(500);
  }
  
  await page.goto('https://2crown-clothing-printing.vercel.app/cart', { waitUntil: 'domcontentloaded' });
  
  // Increment quantity in cart
  const plusBtn = await page.waitForSelector('button[aria-label^="Increase quantity"]');
  if (plusBtn) {
    await plusBtn.click();
    await page.waitForTimeout(500);
  }
  
  const unitPriceDesktop = await page.evaluate(() => {
    const el = document.querySelector('.hidden.sm\\:block');
    return el ? el.innerText : 'NOT FOUND';
  });
  console.log('Cart Desktop Unit Price (Qty > 1):', unitPriceDesktop);
  
  await browser.close();
  process.exit(0);
})();
