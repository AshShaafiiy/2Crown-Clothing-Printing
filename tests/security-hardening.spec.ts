import { test, expect } from '@playwright/test';

// Viewports for responsive testing
const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 360, height: 640 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 480, height: 853 },
  { width: 600, height: 1024 },
  { width: 768, height: 1024 },
  { width: 834, height: 1112 },
  { width: 912, height: 1368 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 }
];

test.describe('Admin Login - Password Visibility & Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
  });

  test('Password visibility toggle behavior', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const toggleButton = page.getByRole('button', { name: /toggle password visibility/i });

    // 1. Empty password = no icon
    await expect(passwordInput).toHaveValue('');
    await expect(toggleButton).not.toBeVisible();

    // 2. Type one character = icon appears
    await passwordInput.fill('a');
    await expect(toggleButton).toBeVisible();

    // 3. Click eye = password visible
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // 4. Click eye-off = password hidden
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // 5. Clear entire password = icon disappears
    await passwordInput.fill('');
    await expect(toggleButton).not.toBeVisible();

    // 6. After clearing, showPassword is reset and typing again starts hidden
    await passwordInput.fill('b');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(toggleButton).toBeVisible();
    
    // 8. Keyboard accessibility
    await passwordInput.focus();
    await page.keyboard.press('Tab');
    await expect(toggleButton).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  for (const viewport of VIEWPORTS) {
    test(`Responsive behavior and no layout shift/overflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000/admin/login');
      
      // 9. No layout shift, 10. No clipping/overflow
      const boundingBox = await page.locator('form').boundingBox();
      expect(boundingBox?.width).toBeLessThanOrEqual(viewport.width);
      
      // Form should remain usable
      const passwordInput = page.locator('input[name="password"]');
      await passwordInput.fill('testpassword');
      const toggleButton = page.getByRole('button', { name: /toggle password visibility/i });
      await expect(toggleButton).toBeVisible();
    });
  }

  test('Sign In still behaves normally', async ({ page }) => {
    await page.locator('input[name="email"]').fill('admin@2crown.com');
    await page.locator('input[name="password"]').fill('admin123');
    await page.getByRole('button', { name: /sign in/i }).click();
    // Assuming successful login redirects to /admin/dashboard
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
  });
});

test.describe('Security Hardening - Password Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin first
    await page.goto('http://localhost:3000/admin/login');
    await page.locator('input[name="email"]').fill('admin@2crown.com');
    await page.locator('input[name="password"]').fill('admin123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
    
    // Navigate to admin profile
    await page.goto('http://localhost:3000/admin/profile');
  });

  test('Admin Profile password change - incorrect current password', async ({ page }) => {
    await page.locator('input[name="currentPassword"]').fill('wrongpassword');
    await page.locator('input[name="newPassword"]').fill('StrongP@ssw0rd');
    await page.locator('input[name="confirmPassword"]').fill('StrongP@ssw0rd');
    await page.getByRole('button', { name: /change password/i }).click();
    
    await expect(page.locator('text=Incorrect current password')).toBeVisible();
  });

  test('Admin Profile password change - weak password rejection', async ({ page }) => {
    await page.locator('input[name="currentPassword"]').fill('admin123');
    await page.locator('input[name="newPassword"]').fill('weak');
    await page.locator('input[name="confirmPassword"]').fill('weak');
    await page.getByRole('button', { name: /change password/i }).click();
    
    await expect(page.locator('text=Password is too weak')).toBeVisible();
  });

  test('Admin Profile password change - mismatch rejection', async ({ page }) => {
    await page.locator('input[name="currentPassword"]').fill('admin123');
    await page.locator('input[name="newPassword"]').fill('StrongP@ssw0rd');
    await page.locator('input[name="confirmPassword"]').fill('DifferentP@ssw0rd');
    
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
    await expect(page.getByRole('button', { name: /change password/i })).toBeDisabled();
  });

  test('Admin Profile password change - correct progression & strong password acceptance', async ({ page }) => {
    await page.locator('input[name="currentPassword"]').fill('admin123');
    await page.locator('input[name="newPassword"]').fill('StrongP@ssw0rd!');
    await page.locator('input[name="confirmPassword"]').fill('StrongP@ssw0rd!');
    
    // Check password strength indicator
    await expect(page.locator('text=Strong')).toBeVisible();
    
    await page.getByRole('button', { name: /change password/i }).click();
    await expect(page.locator('text=Password updated successfully')).toBeVisible();
  });

  test('Password visibility preservation in profile page', async ({ page }) => {
    const newPasswordInput = page.locator('input[name="newPassword"]');
    const toggleButton = newPasswordInput.locator('..').getByRole('button', { name: /toggle password visibility/i });
    
    await newPasswordInput.fill('StrongP@ss');
    await toggleButton.click();
    await expect(newPasswordInput).toHaveAttribute('type', 'text');
    
    // Add more text, should remain visible
    await newPasswordInput.fill('StrongP@ssw0rd!');
    await expect(newPasswordInput).toHaveAttribute('type', 'text');
  });
});

test.describe('Security Hardening - Administrator Management & RBAC', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Super Admin
    await page.goto('http://localhost:3000/admin/login');
    await page.locator('input[name="email"]').fill('superadmin@2crown.com');
    await page.locator('input[name="password"]').fill('SuperAdmin123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.goto('http://localhost:3000/admin/administrators');
  });

  test('Administrator creation rules & strong password requirement', async ({ page }) => {
    await page.getByRole('button', { name: /add administrator/i }).click();
    
    await page.locator('input[name="name"]').fill('New Admin');
    await page.locator('input[name="email"]').fill('newadmin@2crown.com');
    await page.locator('select[name="role"]').selectOption('admin');
    
    // Try weak password
    await page.locator('input[name="password"]').fill('weak');
    await page.getByRole('button', { name: /create/i }).click();
    await expect(page.locator('text=Password must meet complexity requirements')).toBeVisible();
    
    // Valid password
    await page.locator('input[name="password"]').fill('C0mpl3xP@ss!');
    await page.getByRole('button', { name: /create/i }).click();
    
    await expect(page.locator('text=Administrator created successfully')).toBeVisible();
  });

  test('RBAC restrictions - Regular admin cannot access certain features', async ({ page }) => {
    // Logout super admin
    await page.getByRole('button', { name: /logout/i }).click();
    
    // Login as regular admin
    await page.locator('input[name="email"]').fill('admin@2crown.com');
    await page.locator('input[name="password"]').fill('admin123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Try to access administrators page
    await page.goto('http://localhost:3000/admin/administrators');
    
    // Should be redirected or show access denied
    await expect(page.locator('text=Access Denied').or(page.locator('text=Unauthorized'))).toBeVisible();
  });
});
