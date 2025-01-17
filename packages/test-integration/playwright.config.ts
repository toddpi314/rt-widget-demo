import { PlaywrightTestConfig, devices } from '@playwright/test';
import type { Reporter } from '@playwright/test/reporter';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 10000,
    toMatchSnapshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  fullyParallel: true,
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  outputDir: 'test-output/',
  snapshotDir: '__snapshots__',
  preserveOutput: process.env.CI ? 'failures-only' : 'always',
  reporter: process.env.CI 
    ? [
        ['html', { outputFolder: 'test-results' }],
        ['json', { outputFile: 'test-output/results.json' }],
        ['junit', { outputFile: 'test-output/junit.xml' }],
        ['github']
      ]
    : 'list',
  projects: [
    // Responsive Testing Projects
    {
      name: 'responsive-mobile-portrait',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 360, height: 640 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'responsive-desktop-fhd',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
      },
    },
    {
      name: 'responsive-mobile-plus',
      use: {
        ...devices['iPhone 12 Pro Max'],
        viewport: { width: 414, height: 896 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'responsive-laptop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
      },
    },
    // Latest Stable Versions
    {
      name: 'chromium-latest',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'firefox-latest',
      use: {
        ...devices['Desktop Firefox'],
        channel: 'firefox',
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'webkit-latest',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Previous Stable Versions (n-1)
    {
      name: 'chromium-previous',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome-beta',
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'firefox-previous',
      use: {
        ...devices['Desktop Firefox'],
        channel: 'firefox-beta',
        viewport: { width: 1280, height: 720 },
      },
    },

    // Mobile Devices - Latest Versions
    {
      name: 'Mobile Chrome Latest',
      use: {
        ...devices['Pixel 7'],
        channel: 'chrome',
      },
    },
    {
      name: 'Mobile Chrome Previous',
      use: {
        ...devices['Pixel 6'],
        channel: 'chrome-beta',
      },
    },
    {
      name: 'Mobile Safari Latest',
      use: {
        ...devices['iPhone 14'],
      },
    },
    {
      name: 'Mobile Safari Previous',
      use: {
        ...devices['iPhone 13'],
      },
    },

    // Tablet Devices
    {
      name: 'iPad Latest',
      use: {
        ...devices['iPad Pro 11'],
      },
    },
    {
      name: 'iPad Previous',
      use: {
        ...devices['iPad Mini'],
      },
    },

    // Legacy Support (Minimum Supported Versions)
    {
      name: 'chromium-min',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        launchOptions: {
          args: ['--disable-gpu'],
          executablePath: process.env.CHROME_MIN_PATH,
        },
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'firefox-min',
      use: {
        browserName: 'firefox',
        launchOptions: {
          executablePath: process.env.FIREFOX_MIN_PATH,
        },
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
};

export default config; 