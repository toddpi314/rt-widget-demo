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
      return { 
        container: page.locator('#rt-widget-target'),
        expectedText: 'Testing basic implementation'
      };
    }
  },
  {
    name: 'embedded implementation',
    url: 'http://localhost:8080/embedded.html',
    setup: async ({ page }) => {
      await page.goto('http://localhost:8080/embedded.html');
      await expect(page.locator('.app-container')).toBeVisible();
      return { 
        container: page.locator('#rt-widget-target'),
        expectedText: 'Testing embedded implementation'
      };
    }
  },
  {
    name: 'cdn-style implementation',
    url: 'http://localhost:8080/cdn.html',
    setup: async ({ page }) => {
      await page.goto('http://localhost:8080/cdn.html');
      return { 
        container: page.locator('#rt-widget-target'),
        expectedText: 'Testing CDN implementation',
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
        container: page.locator('#rt-widget-target'),
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
      await expect(frame.locator('#rt-widget-target')).toBeVisible({ timeout: 10000 });
      return { 
        container: frame.locator('#rt-widget-target'),
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
      
      // Use deep selector to pierce shadow DOM
      const content = page.locator('medals-widget').locator('div[data-testid="rt-widget-mount"]');
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
        container: page.locator('#rt-widget-target'),
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

      test('handles medal sorting correctly', async ({ page }) => {
        const { container } = await scenario.setup({ page });
        await expect(container).toBeVisible({ timeout: 10000 });

        // Helper function to wait for data to stabilize
        const waitForDataToStabilize = async () => {
            await page.waitForLoadState('networkidle');
            const rows = container.locator('tbody tr');
            await expect(rows).toHaveCount(10, { timeout: 15000 });
            await expect(async () => {
                const allRows = await rows.all();
                const hasData = allRows.length === 10;
                expect(hasData).toBe(true);
            }, {
                message: 'Waiting for table to have 10 rows'
            }).toPass();
            return rows;
        };

        // Helper function to get row data
        const getRowData = async (row: any) => {
            const cells = row.locator('td');
            const countryText = await cells.nth(1).textContent();
            const goldText = await cells.nth(2).textContent();
            const silverText = await cells.nth(3).textContent();
            const bronzeText = await cells.nth(4).textContent();
            const totalText = await cells.nth(5).textContent();
            return { country: countryText, gold: goldText, silver: silverText, bronze: bronzeText, total: totalText };
        };

        // Expected data matching the unit test exactly
        const expectedData = [
            { pos: '1', country: 'RUS', gold: '13', silver: '11', bronze: '9', total: '33' },
            { pos: '2', country: 'NOR', gold: '11', silver: '5', bronze: '10', total: '26' },
            { pos: '3', country: 'CAN', gold: '10', silver: '10', bronze: '5', total: '25' },
            { pos: '4', country: 'USA', gold: '9', silver: '7', bronze: '12', total: '28' },
            { pos: '5', country: 'NED', gold: '8', silver: '7', bronze: '9', total: '24' },
            { pos: '6', country: 'GER', gold: '8', silver: '6', bronze: '5', total: '19' },
            { pos: '7', country: 'SUI', gold: '6', silver: '3', bronze: '2', total: '11' },
            { pos: '8', country: 'BLR', gold: '5', silver: '0', bronze: '1', total: '6' },
            { pos: '9', country: 'AUT', gold: '4', silver: '8', bronze: '5', total: '17' },
            { pos: '10', country: 'FRA', gold: '4', silver: '4', bronze: '7', total: '15' }
        ];

        // Wait for initial data load
        const rows = await waitForDataToStabilize();

        // Click gold header twice to ensure descending order
        const goldHeader = container.locator('thead th').nth(2);
        await goldHeader.click();
        await goldHeader.click();

        // Wait for the sort to be applied and verify the data
        await expect(async () => {
            // First check if the widget has the correct sort field and order
            const widget = container.locator('[data-testid="rt-widget"]');
            const sortField = await widget.getAttribute('data-sort');
            const sortOrder = await widget.getAttribute('data-sort-order');
            expect(sortField).toBe('gold');
            expect(sortOrder).toBe('desc');

            // Get all rows and verify the data
            const allRows = await rows.all();
            
            // First check if RUS is at the top (most gold medals)
            const firstRowData = await getRowData(allRows[0]);
            expect(firstRowData.country).toBe('RUS');
            expect(firstRowData.gold).toBe('13');

            // Then verify all rows are in the correct order
            for (let i = 0; i < expectedData.length; i++) {
                const rowData = await getRowData(allRows[i]);
                const expected = expectedData[i];
                
                expect(rowData.country).toBe(expected.country);
                expect(rowData.gold).toBe(expected.gold);
                expect(rowData.silver).toBe(expected.silver);
                expect(rowData.bronze).toBe(expected.bronze);
                expect(rowData.total).toBe(expected.total);
            }

            // Verify tiebreaker cases
            const nedIndex = await Promise.all(allRows.map(async (row, idx) => {
                const data = await getRowData(row);
                return data.country === 'NED' ? idx : -1;
            })).then(indices => indices.find(i => i !== -1));

            const gerIndex = await Promise.all(allRows.map(async (row, idx) => {
                const data = await getRowData(row);
                return data.country === 'GER' ? idx : -1;
            })).then(indices => indices.find(i => i !== -1));

            const autIndex = await Promise.all(allRows.map(async (row, idx) => {
                const data = await getRowData(row);
                return data.country === 'AUT' ? idx : -1;
            })).then(indices => indices.find(i => i !== -1));

            const fraIndex = await Promise.all(allRows.map(async (row, idx) => {
                const data = await getRowData(row);
                return data.country === 'FRA' ? idx : -1;
            })).then(indices => indices.find(i => i !== -1));

            expect(nedIndex).toBeLessThan(gerIndex!);
            expect(autIndex).toBeLessThan(fraIndex!);
        }, {
            message: 'Waiting for sort to be applied and data to be in correct order'
        }).toPass({ timeout: 15000 });

        // Take a screenshot of the final state
        await compareScreenshots(page, `${scenario.name}-gold-sort`);
      });
    });
  }
}); 