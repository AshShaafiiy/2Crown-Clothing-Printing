import { test, expect } from '@playwright/test';

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

async function selectOrderableProduct(request: import('@playwright/test').APIRequestContext) {
  const response = await request.get('/products');
  expect(response.ok()).toBe(true);
  const products = await response.json() as Array<{slug:string;active:boolean;customizationFields?:Array<{required:boolean;type:string}>}>;
  const product = products.find(item => item.active && !item.customizationFields?.some(field => field.required && field.type !== 'file'));
  if (!product) throw new Error('RC E2E needs one active product without required text customization.');
  return product;
}

async function addProductAndCheckout(page: import('@playwright/test').Page, slug: string, method: 'pickup' | 'local') {
  await page.goto(`/product/${encodeURIComponent(slug)}`);
  await expect(page.getByRole('button',{name:'Add to Cart'})).toBeVisible();
  await page.getByRole('button',{name:'Add to Cart'}).click();
  await page.goto('/cart');
  await expect(page.getByRole('heading',{name:'Shopping Cart'})).toBeVisible();
  await page.getByRole('button',{name:'Proceed to Checkout'}).click();
  await expect(page.getByRole('heading',{name:'Checkout'})).toBeVisible();
  await page.getByLabel('Full Name *').fill('RC Customer');
  await page.getByLabel('Phone Number *').fill('08000000000');
  await expect(page.getByLabel('Email Address (Optional)')).toBeVisible();
  await page.locator(`input[name="deliveryMethod"][value="${method}"]`).check();
  if (method === 'local') {
    await page.getByLabel('Delivery Address *').fill('RC test address');
    await expect(page.getByText('TBD',{exact:true})).toBeVisible();
    await expect(page.getByText(/\+ delivery/).first()).toBeVisible();
  } else {
    await expect(page.getByText('Free',{exact:true})).toBeVisible();
    await expect(page.locator('textarea[name="address"]')).toHaveCount(0);
    const subtotal = await page.locator('text=Subtotal').last().locator('..').locator('span').last().textContent();
    const total = await page.getByText('Estimated Total').last().locator('..').locator('span').last().textContent();
    expect(total).toBe(subtotal);
  }
  await page.getByRole('button',{name:'Place Order via WhatsApp'}).click();
  await expect(page).toHaveURL(/\/order-confirmation\/2C-[A-F0-9-]+$/);
  await expect(page.getByRole('heading',{name:'Order Received!'})).toBeVisible();
  const reference = page.url().split('/').pop()!;
  expect(reference).toMatch(/^2C-[A-F0-9]{8}(?:-[A-F0-9]{8}){3}$/);
  return reference;
}

test('public storefront, responsive navigation, and accessibility basics', async ({ page, request }) => {
  const product = await selectOrderableProduct(request);
  await page.goto(`/product/${encodeURIComponent(product.slug)}`);
  await page.getByRole('button', {name:'Add to Cart'}).click();
  for (const viewport of [{width:390,height:844},{width:768,height:1024},{width:1440,height:900}]) {
    await page.setViewportSize(viewport);
    for (const [path, heading] of [
      ['/', /Featured Products/i], ['/shop', /Shop/i],
      [`/product/${encodeURIComponent(product.slug)}`, /.+/], ['/cart', /Shopping Cart/i],
      ['/checkout', /Checkout/i], ['/track-order', /Track Your Order/i]
    ] as const) {
      await page.goto(path);
      if (path.startsWith('/product/')) {
        await expect(page.getByRole('button', {name:'Add to Cart'})).toBeVisible();
      } else {
        await expect(page.getByRole('heading', {name:heading}).first()).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${path} at ${viewport.width}px`).toBe(true);
    }
  }
  await page.goto('/');
  await expect(page.locator('img[alt="2Crown Clothing & Printing"]').first()).toBeVisible();
  await page.goto('/track-order');
  await expect(page.getByLabel('Order Reference')).toBeVisible();
  await page.getByLabel('Order Reference').fill('malformed');
  await page.getByRole('button', {name:'Track Order'}).click();
  await expect(page.getByText('Order not found.')).toBeVisible();
});

test('customer order creation, tracking, and admin access on current API', async ({page,request}) => {
  if (!adminEmail || !adminPassword) throw new Error('Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD for RC E2E; no credential defaults are used.');
  const product = await selectOrderableProduct(request);
  const reference = await addProductAndCheckout(page, product.slug, 'local');
  await page.goto('/track-order');
  await page.getByLabel('Order Reference').fill(reference);
  await page.getByRole('button',{name:'Track Order'}).click();
  await expect(page.getByRole('heading',{name:'Order Details'})).toBeVisible();
  await expect(page.getByText('To be confirmed').first()).toBeVisible();
  await page.goto('/admin/login');
  await page.getByLabel('Email Address').fill(adminEmail);
  await page.getByLabel('Password').fill(adminPassword);
  await page.getByRole('button',{name:'Sign In'}).click();
  await expect(page).toHaveURL(/\/admin\/?$/);
  await page.goto('/admin/orders');
  await expect(page.getByText(reference).first()).toBeVisible();
});

test('pickup order uses zero delivery and tracks without customer details', async ({page,request}) => {
  const product = await selectOrderableProduct(request);
  const reference = await addProductAndCheckout(page, product.slug, 'pickup');
  await page.goto('/track-order');
  await page.getByLabel('Order Reference').fill(reference.toLowerCase());
  await page.getByRole('button',{name:'Track Order'}).click();
  await expect(page.getByRole('heading',{name:'Order Details'})).toBeVisible();
  await expect(page.getByText('₦0',{exact:true})).toBeVisible();
  await expect(page.getByText('RC Customer')).toHaveCount(0);
  await page.getByLabel('Order Reference').fill('not-a-reference');
  await page.getByRole('button',{name:'Track Order'}).click();
  await expect(page.getByText('Order not found.')).toBeVisible();
});

test('administrator navigation, responsive layout, and dialog smoke', async ({page}) => {
  if (!adminEmail || !adminPassword) throw new Error('Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD for RC E2E.');
  await page.goto('/admin/login');
  await page.getByLabel('Email Address').fill(adminEmail);
  await page.getByLabel('Password').fill(adminPassword);
  await page.getByRole('button',{name:'Sign In'}).click();
  await expect(page).toHaveURL(/\/admin\/?$/);
  const role = await page.evaluate(async () => {
    const token = localStorage.getItem('2crown_admin_token');
    const response = await fetch('/auth/me', {headers:{Authorization:`Bearer ${token}`}});
    if (!response.ok) throw new Error('Authenticated profile unavailable during RC smoke');
    return (await response.json() as {role:string}).role;
  });
  const manager = role === 'root_super_admin' || role === 'super_admin';
  const administratorReadStatus = await page.evaluate(async () => {
    const token = localStorage.getItem('2crown_admin_token');
    return (await fetch('/admins', {headers:{Authorization:`Bearer ${token}`}})).status;
  });
  expect(administratorReadStatus).toBe(manager ? 200 : 403);
  for (const viewport of [{width:390,height:844},{width:768,height:1024},{width:1440,height:900}]) {
    await page.setViewportSize(viewport);
    for (const [path, heading] of [
      ['/admin','Dashboard'], ['/admin/products','Products'], ['/admin/categories','Categories'],
      ['/admin/orders','Customer Orders'], ['/admin/settings','Business Settings'],
      ...(manager ? [['/admin/administrators','Administrators']] : []), ['/admin/profile','Admin Profile']
    ]) {
      await page.goto(path);
      await expect(page.getByRole('heading',{name:heading,exact:true}).last()).toBeVisible();
      if (path === '/admin/administrators') {
        await expect(page.getByRole('button',{name:'Add Administrator'})).toBeVisible();
        await expect(page.getByText(/Failed to load administrators/i)).toHaveCount(0);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    }
  }
  await page.goto('/admin/products');
  const addProduct = page.getByRole('button',{name:'Add Product'});
  await addProduct.click();
  const productDialog = page.getByRole('dialog',{name:/Add Product/i});
  await expect(productDialog).toBeVisible();
  await expect(productDialog.getByLabel('Product Name *')).toBeFocused();
  await expect(productDialog.getByLabel('Description *')).toBeVisible();
  await expect(productDialog.getByLabel('Category *')).toBeVisible();
  await expect(productDialog.getByLabel('Selling Price *')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(productDialog).toHaveCount(0);
  await expect(addProduct).toBeFocused();
  await page.setViewportSize({width:1440,height:900});
  await page.getByRole('button',{name:'Logout'}).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test('security headers, origin policy, API routing and protected files', async ({request,page}) => {
  const home = await request.get('/');
  expect(home.ok()).toBe(true);
  const csp = home.headers()['content-security-policy'];
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).not.toContain('unsafe-eval');
  expect(home.headers()['x-content-type-options']).toBe('nosniff');
  expect(home.headers()['x-powered-by']).toBeUndefined();
  const unauthorized = await request.get('/admins');
  expect(unauthorized.status()).toBe(401);
  const forbiddenOrigin = await request.get('/products', {headers:{Origin:'https://untrusted.example'}});
  expect(forbiddenOrigin.status()).toBe(403);
  const apiMissing = await request.get('/api/nonexistent');
  expect(apiMissing.status()).toBe(404);
  expect(apiMissing.headers()['content-type']).toContain('application/json');
  for (const path of ['/.env','/backend/dev.sqlite3','/backups/prod_20260927_120459.sqlite3']) {
    expect((await request.get(path)).status()).toBe(404);
  }
  await page.goto('/nonexistent-spa-route');
  expect(await page.locator('#root').count()).toBe(1);
});

test('public tracking has a dedicated rate limit', async ({request}) => {
  const unknownReference = '2C-FFFFFFFF-FFFFFFFF-FFFFFFFF-FFFFFFFF';
  let limited = false;
  for (let attempt = 0; attempt < 35; attempt++) {
    const response = await request.get(`/orders/${unknownReference}`, {
      headers: {'X-Forwarded-For': `198.51.100.${attempt + 1}`}
    });
    if (response.status() === 429) {
      expect(await response.json()).toEqual({error:'Too many tracking requests. Please try again later.'});
      limited = true;
      break;
    }
    expect(response.status()).toBe(404);
  }
  expect(limited).toBe(true);
  const adminResponse = await request.get('/admins');
  expect(adminResponse.status()).toBe(401);
});
