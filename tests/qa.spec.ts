import { test, expect } from '@playwright/test';

test.describe('2Crown Clothing QA', () => {
  test.describe.configure({ mode: 'serial' });
  
  test('Responsive UI check', async ({ page }) => {
    // Mobile View
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/');
    await expect(page.locator('text=2Crown').first()).toBeVisible();
    
    // Tablet View
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('text=2Crown').first()).toBeVisible();
    
    // Desktop View
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('text=2Crown').first()).toBeVisible();
  });

  test('Cart Persistence on Refresh', async ({ page }) => {
    await page.goto('http://localhost:3000/shop');
    await page.goto('http://localhost:3000/product/custom-polo-shirt');
    await page.click('button:has-text("Add to Cart")');
    await page.goto('http://localhost:3000/cart');
    await expect(page.locator('text=Custom Polo Shirt').first()).toBeVisible();
    await page.reload();
    await expect(page.locator('text=Custom Polo Shirt').first()).toBeVisible();
  });
  
  test('Local Delivery Lifecycle & Delivery Fee', async ({ page }) => {
    // 1. Create order
    await page.goto('http://localhost:3000/cart');
    await page.click('text=Proceed to Checkout');
    await page.fill('input[name="firstName"]', 'QA');
    await page.fill('input[name="lastName"]', 'Tester');
    await page.fill('input[name="email"]', 'qa@test.com');
    await page.fill('input[name="phone"]', '08012345678');
    await page.fill('input[name="address"]', '123 QA Street');
    await page.fill('input[name="city"]', 'Lagos');
    await page.fill('input[name="state"]', 'Lagos');
    await page.click('label:has-text("Local Delivery")');
    await expect(page.locator('text=To be confirmed').first()).toBeVisible();
    await page.click('button:has-text("Place Order")');

    // Wait for confirmation page and get order ID
    await page.waitForURL(/\/order-confirmation\/.*/);
    const url = page.url();
    const orderId = url.split('/').pop() || '';
    
    // 2. Track Order - Initial State
    await page.goto('http://localhost:3000/track-order');
    await page.fill('input[placeholder="e.g. 2C-123456"]', orderId);
    await page.click('button:has-text("Track Order")');
    
    await expect(page.locator('text=Awaiting Confirmation')).toBeVisible();
    await expect(page.locator('text=WhatsApp Pending')).not.toBeVisible();
    
    // 3. Admin updates to Confirmed and sets fee
    await page.goto('http://localhost:3000/admin/login');
    await page.fill('input[type="email"]', 'admin@2crown.com.ng');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.goto('http://localhost:3000/admin/orders');
    await page.click(`text=${orderId}`);
    
    // Set fee
    await page.click('button:has-text("Edit")'); // Or however the fee is set
    await page.fill('input[name="deliveryFee"]', '1500');
    await page.click('button:has-text("Save")');
    
    // Status transitions
    await page.click('button:has-text("Mark as Confirmed")');
    await page.click('button:has-text("Mark as Processing")');
    await page.click('button:has-text("Mark as Ready for Delivery")');
    await page.click('button:has-text("Mark as Out for Delivery")');
    await page.click('button:has-text("Mark as Delivered")');

    // 4. Track Order - Final State
    await page.goto('http://localhost:3000/track-order');
    await page.fill('input[placeholder="e.g. 2C-123456"]', orderId);
    await page.click('button:has-text("Track Order")');
    await expect(page.locator('text=Delivered')).toBeVisible();
    await expect(page.locator('text=₦1,500')).toBeVisible(); // Delivery fee
  });
});
