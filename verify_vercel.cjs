const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  
  console.log('Navigating to https://2crown-clothing-printing.vercel.app/shop ...');
  await page.goto('https://2crown-clothing-printing.vercel.app/shop');
  
  await page.waitForLoadState('networkidle');
  
  const productLinks = await page.$$('a[href^="/product/"]');
  if (productLinks.length === 0) {
    console.log('No products found on shop page.');
    await browser.close();
    return;
  }
  
  const productUrl = await productLinks[0].getAttribute('href');
  console.log(`Navigating to product page: ${productUrl} ...`);
  
  await page.goto(`https://2crown-clothing-printing.vercel.app${productUrl}`);
  await page.waitForLoadState('networkidle');
  
  console.log('Product page loaded.');
  
  // 1. Check for NEW, FEATURED badges
  const badges = await page.$$eval('.bg-blue-500, .bg-secondary, .bg-red-100', els => els.map(e => e.textContent.trim()));
  console.log('Badges found:', badges);
  
  // 2. Price area
  const priceArea = await page.$eval('.flex.items-center.mb-6', el => el.innerText.trim());
  console.log('Price Area Text:\n', priceArea);
  
  // 4. Description
  const descriptionHtml = await page.$eval('.border-b.border-gray-200', el => el.outerHTML);
  console.log('Description block HTML:\n', descriptionHtml);
  
  // 6. Quantity Controls and added text
  const addBtn = await page.$('text="Add to Cart"');
  if (addBtn) {
    console.log('Clicking Add to Cart...');
    await addBtn.click();
    await page.waitForTimeout(500); // wait for state update
  }
  
  const qtyText = await page.evaluate(() => {
    const el = document.querySelector('.text-sm.text-gray-500.font-medium');
    return el ? el.innerText : 'NOT FOUND';
  });
  console.log('Quantity Added Text:', qtyText);
  
  // Check Cart rules
  console.log('Navigating to Cart...');
  await page.goto('https://2crown-clothing-printing.vercel.app/cart');
  await page.waitForLoadState('networkidle');
  
  // check unit price visibility on desktop
  const unitPriceDesktop = await page.evaluate(() => {
    const el = document.querySelector('.hidden.sm\\:block');
    return el ? el.innerText : 'NOT FOUND';
  });
  console.log('Cart Desktop Unit Price:', unitPriceDesktop);
  
  // simulate mobile
  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`https://2crown-clothing-printing.vercel.app${productUrl}`);
  await mobilePage.waitForLoadState('networkidle');
  
  const mobilePriceArea = await mobilePage.$eval('.flex.items-center.mb-6', el => el.innerText.trim());
  console.log('Mobile Price Area:\n', mobilePriceArea);
  
  await browser.close();
})();
