import { test, expect, Locator, Page } from '@playwright/test';

interface ScenarioSetupResult {
  container: Locator;
  expectedText?: string;
  textLocator?: Locator;
  additionalChecks?: () => Promise<void>;
}

interface Scenario {
  name: string;
  url: string;
  setup: ({ page }: { page: Page }) => Promise<ScenarioSetupResult>;
}

// Store console messages for failure reporting
let consoleMessages: string[] = [];
let pageErrors: string[] = [];

// Helper function for visual comparison
async function compareScreenshots(page: Page, scenario: string, viewport: string = 'desktop') {
  // ... existing code ...
}

// Define the scenarios and their specific setup
const scenarios: Scenario[] = [
  {
    name: 'basic implementation',
    url: 'http://localhost:8080/basic.html',
    setup: async ({ page }) => {
      await page.goto('http://localhost:8080/basic.html');
      return { container: page.locator('#widget-container') };
    }
  },
  {
    name: 'embedded implementation',
    url: 'http://localhost:8080/embedded.html',
    setup: async ({ page }) => {
      await page.goto('http://localhost:8080/embedded.html');
      await expect(page.locator('.app-container')).toBeVisible();
      return { container: page.locator('#widget-container') };
    }
  },
  {
    name: 'cdn-style implementation',
    url: 'http://localhost:8080/cdn.html',
    setup: async ({ page }) => {
      await page.goto('http://localhost:8080/cdn.html');
      return { 
        container: page.locator('#widget-container'),
        additionalChecks: async () => {
          const hasGlobalObject = await page.evaluate(() => {
            return typeof (window as any).RTWidgetMedals !== 'undefined';
          });
          expect(hasGlobalObject).toBe(true);
        }
      };
    }
  },
  {
    name: 'script embed implementation',
    url: 'http://localhost:8080/script-embed.html',
    setup: async ({ page }) => {
      // Only collect console messages, don't log them
      page.on('console', msg => consoleMessages.push(msg.text()));
      page.on('pageerror', err => pageErrors.push(err.message));
      await page.goto('http://localhost:8080/script-embed.html');
      await expect(page.locator('script[src*="loader.js"]')).toBeAttached({ timeout: 10000 });
      return { 
        container: page.locator('#widget-container'),
        expectedText: 'Testing script-based embedding'
      };
    }
  },
  {
    name: 'iframe embed implementation',
    url: 'http://localhost:8080/iframe-embed.html',
    setup: async ({ page }) => {
      // Only collect console messages, don't log them
      page.on('console', msg => consoleMessages.push(msg.text()));
      page.on('pageerror', err => pageErrors.push(err.message));
      await page.goto('http://localhost:8080/iframe-embed.html');
      await expect(page.locator('#widget-frame')).toBeAttached({ timeout: 10000 });
      const frame = page.frameLocator('#widget-frame');
      await expect(frame.locator('#widget-container')).toBeVisible({ timeout: 10000 });
      return { 
        container: frame.locator('#widget-container'),
        expectedText: 'IFrame embedded content',
        textLocator: frame.locator('text=IFrame embedded content')
      };
    }
  },
  {
    name: 'web component implementation',
    url: 'http://localhost:8080/web-component.html',
    setup: async ({ page }) => {
      // Only collect console messages, don't log them
      page.on('console', msg => consoleMessages.push(msg.text()));
      page.on('pageerror', err => pageErrors.push(err.message));
      await page.goto('http://localhost:8080/web-component.html');
      await expect(page.locator('script[src*="web-components/index.js"]')).toBeAttached({ timeout: 10000 });
      await expect(page.locator('medals-widget')).toBeVisible({ timeout: 10000 });
      
      // Use >> to pierce shadow DOM
      const content = page.locator('medals-widget >> [data-testid="rt-widget-content"]');
      return { 
        container: content,
        expectedText: 'Testing Web Component integration',
        textLocator: content.locator('text=Testing Web Component integration').first()
      };
    }
  },
  {
    name: 'federation implementation',
    url: 'http://localhost:8080/federation.html',
    setup: async ({ page }) => {
      // Only collect console messages, don't log them
      page.on('console', msg => consoleMessages.push(msg.text()));
      page.on('pageerror', err => pageErrors.push(err.message));
      await page.goto('http://localhost:8080/federation.html');
      await expect(page.locator('script[src*="remoteEntry.js"]')).toBeAttached({ timeout: 10000 });
      return { 
        container: page.locator('#widget-container'),
        expectedText: 'Testing Module Federation'
      };
    }
  }
];

test.describe('Widget Scenarios', () => {
  // Clear console messages before each test
  test.beforeEach(() => {
    consoleMessages = [];
    pageErrors = [];
  });

  // Log console messages only on test failure
  test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && (consoleMessages.length > 0 || pageErrors.length > 0)) {
      console.log('\nConsole messages from failed test:');
      consoleMessages.forEach(msg => console.log(msg));
      if (pageErrors.length > 0) {
        console.log('\nPage errors from failed test:');
        pageErrors.forEach(err => console.log(err));
      }
    }
  });

  for (const scenario of scenarios) {
    test.describe(scenario.name, () => {
      test('loads and displays correctly', async ({ page }) => {
        const { container, expectedText, textLocator, additionalChecks } = await scenario.setup({ page });
        
        // Basic visibility checks
        await expect(container).toBeVisible({ timeout: 10000 });
        
        // Visual regression test
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000); // Wait for any animations to complete
        await compareScreenshots(page, `${scenario.name}-initial`);
        
        // Check specific text if provided
        if (expectedText) {
          if (textLocator) {
            await expect(textLocator).toBeVisible({ timeout: 10000 });
          } else {
            await expect(page.locator(`text=${expectedText}`)).toBeVisible({ timeout: 10000 });
          }
        }

        // Run any additional scenario-specific checks
        if (additionalChecks) {
          await additionalChecks();
        }
      });

      test('handles resize correctly', async ({ page }) => {
        const { container } = await scenario.setup({ page });
        
        // Test different viewport sizes
        for (const viewport of [
          { width: 375, height: 667 },  // Mobile
          { width: 768, height: 1024 }, // Tablet
          { width: 1440, height: 900 }  // Desktop
        ]) {
          await page.setViewportSize(viewport);
          await expect(container).toBeVisible({ timeout: 10000 });
        }
      });

      test('maintains visibility after DOM updates', async ({ page }) => {
        const { container } = await scenario.setup({ page });
        
        // Add and remove elements around the widget
        await page.evaluate(() => {
          const div = document.createElement('div');
          div.style.height = '100px';
          div.textContent = 'Dynamic content';
          document.body.insertBefore(div, document.body.firstChild);
          setTimeout(() => div.remove(), 100);
        });

        await expect(container).toBeVisible({ timeout: 10000 });
      });
    });
  }
}); 