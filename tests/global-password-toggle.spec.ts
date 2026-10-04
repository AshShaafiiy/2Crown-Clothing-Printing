import { test, expect } from '@playwright/test';

const viewports = [
  { width: 320, height: 480 },
  { width: 360, height: 640 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 480, height: 800 },
  { width: 600, height: 960 },
  { width: 768, height: 1024 },
  { width: 834, height: 1112 },
  { width: 912, height: 1368 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 }
];

test.describe('Global Password Visibility Toggle', () => {

  const testPasswordField = async (page, inputLocator) => {
    const wrapper = inputLocator.locator('xpath=..');
    const showButton = wrapper.locator('button[aria-label="Show password"]');
    const hideButton = wrapper.locator('button[aria-label="Hide password"]');

    // 1. Empty -> no eye
    await expect(inputLocator).toBeVisible();
    await expect(showButton).not.toBeVisible();

    // 2. Type one character -> eye appears
    await inputLocator.fill('a');
    await expect(showButton).toBeVisible();

    // 3. Click eye -> password visible (type="text")
    await showButton.click();
    await expect(inputLocator).toHaveAttribute('type', 'text');
    await expect(inputLocator).toHaveValue('a');
    await expect(hideButton).toBeVisible();

    // 4. Click eye-off -> password hidden (type="password")
    await hideButton.click();
    await expect(inputLocator).toHaveAttribute('type', 'password');
    await expect(inputLocator).toHaveValue('a');

    // 5. Clear entire password -> eye disappears
    await inputLocator.fill('');
    await expect(showButton).not.toBeVisible();
    await expect(hideButton).not.toBeVisible();

    // 6. After clearing, typing again starts hidden
    await inputLocator.fill('b');
    await expect(showButton).toBeVisible();
    await expect(inputLocator).toHaveAttribute('type', 'password');
    
    // Clear for clean state
    await inputLocator.fill('');
  };

  test('Login page - basic requirements', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    const passwordInput = page.locator('input[id="password"]');
    
    await testPasswordField(page, passwordInput);

    // 7. Form doesn't submit on toggle
    await passwordInput.fill('secret');
    await page.getByRole('button', { name: 'Show password' }).click();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

    // 8. Keyboard accessible
    await passwordInput.focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Hide password' })).toBeFocused();
    await page.keyboard.press('Enter'); // Toggle to Show password
    await expect(page.getByRole('button', { name: 'Show password' })).toBeFocused();
  });

  test('Responsive behavior and Layout Shifts', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    const passwordInput = page.locator('input[id="password"]');
    
    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await passwordInput.fill('secret123');
      
      const toggleButton = page.getByRole('button', { name: 'Show password' });
      await expect(toggleButton).toBeVisible();
      
      const inputBox = await passwordInput.boundingBox();
      const buttonBox = await toggleButton.boundingBox();
      
      if (inputBox && buttonBox) {
        expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(inputBox.x + inputBox.width);
        expect(buttonBox.y).toBeGreaterThanOrEqual(inputBox.y);
        expect(buttonBox.y + buttonBox.height).toBeLessThanOrEqual(inputBox.y + inputBox.height);
      }

      await toggleButton.click();
      
      const newBox = await passwordInput.boundingBox();
      if (inputBox && newBox) {
        expect(newBox.x).toEqual(inputBox.x);
        expect(newBox.y).toEqual(inputBox.y);
        expect(newBox.width).toEqual(inputBox.width);
        expect(newBox.height).toEqual(inputBox.height);
      }

      await page.getByRole('button', { name: 'Hide password' }).click();
      await passwordInput.fill(''); // Reset for next loop
    }
  });

  test('Profile page - Multiple fields independent toggles', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/admin/login');
    await page.fill('input[type="email"]', 'admin@2crown.com.ng');
    await page.fill('input[id="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3000/admin');

    await page.goto('http://localhost:3000/admin/profile');
    
    // There are 3 password fields: Current, New, Confirm
    const passwordInputs = page.locator('input[type="password"]');
    await expect(passwordInputs).toHaveCount(3);

    // Test first field (Current)
    const currentPwd = passwordInputs.nth(0);
    await testPasswordField(page, currentPwd);

    // Test Independence
    // We should locate the inputs based on a stable attribute, like their position in the form or an ID/name.
    // The PasswordInput component renders <div class="relative"><input>...</div>
    const pwdWrappers = page.locator('.relative').filter({ has: page.locator('button[aria-label*="password"]') });
    await expect(pwdWrappers).toHaveCount(3);

    const input1 = pwdWrappers.nth(0).locator('input');
    const input2 = pwdWrappers.nth(1).locator('input');
    const input3 = pwdWrappers.nth(2).locator('input');

    await input1.fill('pwd1');
    await input2.fill('pwd2');
    await input3.fill('pwd3');

    // Toggle second one
    await pwdWrappers.nth(1).locator('button').click();
    
    // Check states: 1st hidden, 2nd text, 3rd hidden
    await expect(input1).toHaveAttribute('type', 'password');
    await expect(input2).toHaveAttribute('type', 'text');
    await expect(input3).toHaveAttribute('type', 'password');
  });

  test('Administrators page - Modal password fields', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/admin/login');
    await page.fill('input[type="email"]', 'admin@2crown.com.ng');
    await page.fill('input[id="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3000/admin');

    await page.goto('http://localhost:3000/admin/administrators');
    
    // Open "Add Administrator" modal
    await page.getByRole('button', { name: /Add Administrator/i }).click();

    // Inside the modal, there are 2 password fields: Password, Confirm Password
    // Check that we find them
    const pwdInputs = page.locator('input[type="password"]');
    await expect(pwdInputs).toHaveCount(2);

    await testPasswordField(page, pwdInputs.nth(0));
  });
});
