const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/product/premium-logo-design', { waitUntil: 'domcontentloaded' });
  
  // Wait for the rating count text to appear
  // The rating text is inside .text-gray-500.font-normal
  const ratingText = await page.evaluate(() => {
    const els = document.querySelectorAll('.text-gray-500.font-normal');
    // find the one that contains "rating" or "ratings"
    for (const el of els) {
      if (el.innerText.includes('rating') || el.innerText.includes('ratings') || el.innerText.includes('Be the first')) {
        return el.innerText;
      }
    }
    return 'NOT FOUND';
  });
  console.log('Desktop Rating Text:', ratingText);
  
  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/product/premium-logo-design', { waitUntil: 'domcontentloaded' });
  
  const mobileRatingText = await mobilePage.evaluate(() => {
    const els = document.querySelectorAll('.text-gray-500.font-normal');
    for (const el of els) {
      if (el.innerText.includes('rating') || el.innerText.includes('ratings') || el.innerText.includes('Be the first')) {
        return el.innerText;
      }
    }
    return 'NOT FOUND';
  });
  console.log('Mobile Rating Text:', mobileRatingText);
  
  await browser.close();
  process.exit(0);
})();
