import { test, expect } from '@playwright/test';

test.describe('Admin Login Page - Password Visibility Toggle', () => {

  test('Functional requirements (1-8)', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');

    const emailInput = page.getByLabel('Email Address');
    const passwordInput = page.getByLabel('Password');
    
    // Ensure inputs are visible
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // 1. Empty password = no icon
    let toggleBtn = page.getByRole('button', { name: /show password|hide password/i });
    await expect(toggleBtn).toBeHidden();

    // 2. Type one character = icon appears
    await passwordInput.fill('a');
    await expect(toggleBtn).toBeVisible();

    // 3. Click eye = password visible
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // 4. Click eye-off = password hidden
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // 5. Clear entire password = icon disappears
    await passwordInput.fill('');
    await expect(toggleBtn).toBeHidden();

    // 6. After clearing, showPassword is reset and typing again starts hidden
    await passwordInput.fill('b');
    await expect(toggleBtn).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // 7. Sign In still behaves normally
    await emailInput.fill('admin@example.com');
    await passwordInput.fill('testpassword');
    
    // We mock the network request or just verify the button goes into loading state
    const submitBtn = page.getByRole('button', { name: /sign in/i });
    await submitBtn.click();
    // Verify the button shows "Signing In..." 
    await expect(page.getByRole('button', { name: /signing in/i })).toBeVisible();
  });

  test('Keyboard accessibility (8)', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    const passwordInput = page.getByLabel('Password');
    
    // Type password
    await passwordInput.focus();
    await page.keyboard.type('test');
    
    // Tab to the toggle button
    await page.keyboard.press('Tab');
    const toggleBtn = page.getByRole('button', { name: /show password/i });
    await expect(toggleBtn).toBeFocused();

    // Space to toggle
    await page.keyboard.press('Space');
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(page.getByRole('button', { name: /hide password/i })).toBeFocused();

    // Enter to toggle back
    await page.keyboard.press('Enter');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('Responsive behavior, no layout shift, no overflow (9-11)', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },
      { width: 360, height: 640 },
      { width: 375, height: 667 },
      { width: 390, height: 844 },
      { width: 430, height: 932 },
      { width: 480, height: 853 },
      { width: 600, height: 1024 },
      { width: 768, height: 1024 },
      { width: 834, height: 1194 },
      { width: 912, height: 1368 },
      { width: 1024, height: 768 },
      { width: 1280, height: 800 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto('http://localhost:3000/admin/login');
      
      const passwordInput = page.getByLabel('Password');
      await passwordInput.fill('responsive_test');
      
      const toggleBtn = page.getByRole('button', { name: /show password/i });
      await expect(toggleBtn).toBeVisible();

      // 9. No layout shift on toggle
      const inputBoxBefore = await passwordInput.boundingBox();
      expect(inputBoxBefore).not.toBeNull();
      
      await toggleBtn.click();
      
      const inputBoxAfter = await passwordInput.boundingBox();
      expect(inputBoxAfter).not.toBeNull();
      
      // Width and position should remain virtually identical
      expect(Math.abs(inputBoxBefore!.width - inputBoxAfter!.width)).toBeLessThan(2);
      expect(Math.abs(inputBoxBefore!.x - inputBoxAfter!.x)).toBeLessThan(2);

      // 10. No clipping/overflow (check for horizontal scroll)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
      
      // Check toggle button is fully inside the screen bounds
      const btnBox = await toggleBtn.boundingBox();
      expect(btnBox).not.toBeNull();
      expect(btnBox!.x).toBeGreaterThanOrEqual(0);
      expect(btnBox!.x + btnBox!.width).toBeLessThanOrEqual(vp.width);
      
      // Cleanup for next loop
      await toggleBtn.click(); 
    }
  });

});
