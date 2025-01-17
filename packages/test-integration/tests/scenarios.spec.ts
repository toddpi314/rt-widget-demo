import { test, expect } from '@playwright/test';

test.describe('Widget Scenarios', () => {
  test('basic implementation', async ({ page }) => {
    await page.goto('http://localhost:8080/basic.html');
    
    // Take screenshot
    await page.screenshot({
      path: './test-results/basic-scenario.png',
      fullPage: true
    });

    // Run assertions
    await expect(page.locator('#widget-container')).toBeVisible();
  });

  test('embedded implementation', async ({ page }) => {
    await page.goto('http://localhost:8080/embedded.html');
    
    await page.screenshot({
      path: './test-results/embedded-scenario.png',
      fullPage: true
    });

    // Test embedded-specific behavior
    await expect(page.locator('.app-container')).toBeVisible();
    await expect(page.locator('#widget-container')).toBeVisible();
  });

  test('cdn-style implementation', async ({ page }) => {
    await page.goto('http://localhost:8080/cdn.html');
    
    await page.screenshot({
      path: './test-results/cdn-scenario.png',
      fullPage: true
    });

    // Verify the widget loads and renders via script tags
    await expect(page.locator('#widget-container')).toBeVisible();
    await expect(page.locator('text=Testing CDN-style loading')).toBeVisible();
    
    // Verify the global object is available
    const hasGlobalObject = await page.evaluate(() => {
      return typeof (window as any).RTWidgetMedals !== 'undefined';
    });
    expect(hasGlobalObject).toBe(true);
  });
}); 