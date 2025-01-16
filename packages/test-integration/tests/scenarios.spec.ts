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
}); 