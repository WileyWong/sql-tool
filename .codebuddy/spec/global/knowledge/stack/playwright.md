# Playwright Context Documentation

## Introduction

Playwright is a comprehensive framework for web testing and automation that enables cross-browser testing across Chrome for Testing (Chromium on Arm64 Linux), Firefox, and WebKit with a unified API. Built by Microsoft, it provides robust tools for end-to-end testing, browser automation, and web scraping with features like auto-waiting, network interception, mobile emulation, and visual regression testing. The framework is designed to eliminate flaky tests through intelligent auto-waiting mechanisms and provides powerful debugging tools including trace viewer, codegen, and inspector. Advanced features include Clock API for time manipulation, ARIA snapshots for accessibility testing, WebSocket routing and mocking, AI-powered Test Agents for automated test generation and healing, and comprehensive network mocking capabilities with support for HTTP and WebSocket protocols.

Playwright Test bundles a complete test runner with built-in parallelization, fixtures, assertions, and isolation capabilities. It supports multiple programming languages (JavaScript/TypeScript, Python, .NET, Java) and runs tests in isolated browser contexts that simulate independent browser profiles. The framework excels at testing modern web applications with its ability to handle multiple tabs, frames, shadow DOM, and cross-origin scenarios while providing trusted user events indistinguishable from real user interactions. Time-dependent testing is simplified through clock control that allows setting fixed times, fast-forwarding, and pausing, while accessibility validation is streamlined through snapshot-based testing of the accessibility tree.

## Browser Launching and Page Creation

Launch a browser and create pages

```javascript
const { chromium, firefox, webkit } = require('playwright');

(async () => {
  // Launch browser with specific options
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
    args: ['--start-maximized']
  });

  // Create a new browser context (isolated session)
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Custom User Agent',
    locale: 'en-US',
    permissions: ['geolocation', 'notifications']
  });

  // Create a new page
  const page = await context.newPage();
  await page.goto('https://example.com');

  // Perform actions
  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  // Cleanup
  await context.close();
  await browser.close();
})();
```

## Test Runner Installation and Basic Tests

Initialize Playwright Test and write your first test

```bash
# Install Playwright Test
npm init playwright@latest

# Run tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run specific test file
npx playwright test tests/example.spec.ts

# Run tests in UI mode
npx playwright test --ui
```

```javascript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('basic navigation and assertion', async ({ page }) => {
  // Navigate to URL
  await page.goto('https://playwright.dev/');

  // Assert page title
  await expect(page).toHaveTitle(/Playwright/);

  // Click link and wait for navigation
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/.*intro/);

  // Take screenshot
  await page.screenshot({ path: 'test-result.png' });
});

test('form interaction', async ({ page }) => {
  await page.goto('https://example.com/form');

  // Fill input fields
  await page.getByLabel('Username').fill('testuser');
  await page.getByLabel('Password').fill('password123');

  // Check checkbox
  await page.getByRole('checkbox', { name: 'Remember me' }).check();

  // Select dropdown option
  await page.selectOption('#country', 'USA');

  // Submit form
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Assert success message appears
  await expect(page.getByText('Welcome back!')).toBeVisible();
});
```

## Locators and Element Interaction

Find and interact with elements using robust locators

```javascript
import { test, expect } from '@playwright/test';

test('locator strategies', async ({ page }) => {
  await page.goto('https://example.com');

  // Role-based locator (recommended)
  await page.getByRole('button', { name: 'Submit' }).click();

  // Text locator
  await page.getByText('Welcome').click();
  await page.getByText(/welcome/i).click(); // Case insensitive

  // Test ID locator (best for testing)
  await page.getByTestId('submit-button').click();

  // Label locator for form fields
  await page.getByLabel('Email address').fill('test@example.com');

  // Placeholder locator
  await page.getByPlaceholder('Enter your name').fill('John Doe');

  // CSS selector
  await page.locator('.btn-primary').click();

  // XPath selector
  await page.locator('//button[contains(text(), "Submit")]').click();

  // Chaining and filtering
  const product = page
    .getByRole('listitem')
    .filter({ hasText: 'Product 1' })
    .getByRole('button', { name: 'Add to cart' });
  await product.click();

  // Filter only visible elements
  const visibleItems = page.getByTestId('todo-item').filter({ visible: true });
  await expect(visibleItems).toHaveCount(3);

  // Working with multiple elements
  const items = page.getByRole('listitem');
  await expect(items).toHaveCount(5);

  // Iterate through elements
  for (const item of await items.all()) {
    console.log(await item.textContent());
  }

  // Add description to locator for better trace viewer and reports
  const subscribeButton = page.getByTestId('btn-sub').describe('Subscribe button');
  await subscribeButton.click();
});
```

## Assertions and Auto-Waiting

Use web-first assertions that automatically wait for conditions

```javascript
import { test, expect } from '@playwright/test';

test('assertions with auto-waiting', async ({ page }) => {
  await page.goto('https://example.com');

  // Element visibility assertions
  await expect(page.getByText('Welcome')).toBeVisible();
  await expect(page.getByText('Hidden')).toBeHidden();

  // Text content assertions
  await expect(page.getByTestId('status')).toHaveText('Success');
  await expect(page.getByTestId('message')).toContainText('completed');

  // Element state assertions
  await expect(page.getByRole('button')).toBeEnabled();
  await expect(page.getByRole('checkbox')).toBeChecked();
  await expect(page.getByRole('textbox')).toBeEditable();
  await expect(page.getByRole('textbox')).toBeFocused();

  // Attribute assertions
  await expect(page.locator('#link')).toHaveAttribute('href', '/about');
  await expect(page.locator('.btn')).toHaveClass(/btn-primary/);
  await expect(page.locator('.btn')).toContainClass('btn-primary'); // Check individual class name
  await expect(page.locator('input')).toHaveValue('test value');

  // Count assertions
  await expect(page.getByRole('listitem')).toHaveCount(10);

  // URL and title assertions
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page).toHaveTitle('Dashboard');

  // Soft assertions (don't stop test execution)
  await expect.soft(page.getByTestId('status')).toHaveText('Success');
  await expect.soft(page.getByTestId('eta')).toHaveText('1 day');

  // Custom expect message
  await expect(page.getByText('Login'), 'User should be logged in').toBeVisible();

  // Non-retrying assertions for synchronous checks
  expect(2 + 2).toBe(4);
  expect('hello').toContain('ell');
  expect([1, 2, 3]).toHaveLength(3);
});
```

## Configuration File

Configure test execution, browsers, and options

```javascript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',

  // Run tests in parallel across files
  fullyParallel: true,

  // Fail build on CI if test.only is present
  forbidOnly: !!process.env.CI,

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Number of parallel workers
  workers: process.env.CI ? 2 : undefined,

  // Reporter configuration
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'junit.xml' }]
  ],

  // Global timeout for each test
  timeout: 30000,

  // Expect timeout for assertions
  expect: {
    timeout: 5000
  },

  // Shared settings for all tests
  use: {
    // Base URL for navigation
    baseURL: 'http://localhost:3000',

    // Browser options
    headless: true,
    viewport: { width: 1280, height: 720 },

    // Collect trace on first retry
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Context options
    locale: 'en-US',
    timezoneId: 'America/New_York',
    permissions: ['geolocation'],
    geolocation: { longitude: -122.4194, latitude: 37.7749 },
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
    // Setup project for authentication
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium-logged-in',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],

  // Start local dev server before tests
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    // Wait for specific output before considering server ready
    wait: {
      stdout: '/Listening on port (?<my_server_port>\\d+)/'
    },
  },
});
```

## Authentication and State Management

Save and reuse authentication state across tests

```javascript
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://github.com/login');

  // Perform login
  await page.getByLabel('Username or email address').fill('username');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait for authentication to complete
  await page.waitForURL('https://github.com/');
  await expect(page.getByRole('button', { name: 'View profile' })).toBeVisible();

  // Save authentication state (including cookies, localStorage, sessionStorage)
  await page.context().storageState({ path: authFile });

  // Save authentication state with IndexedDB (useful for Firebase Auth, etc.)
  await page.context().storageState({ path: authFile, indexedDB: true });
});

// tests/authenticated.spec.ts
import { test, expect } from '@playwright/test';

// This test will start with saved authentication state
test('access protected page', async ({ page }) => {
  await page.goto('https://github.com/settings');

  // User is already authenticated
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
});
```

## Network Interception and API Mocking

Intercept, modify, and mock network requests

```javascript
import { test, expect } from '@playwright/test';

test('intercept and modify requests', async ({ page }) => {
  // Block CSS files
  await page.route('**/*.css', route => route.abort());

  // Block images
  await page.route(/\.(png|jpg|jpeg)$/, route => route.abort());

  // Mock API response
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' }
      ])
    });
  });

  // Modify API response
  await page.route('**/api/products', async route => {
    const response = await route.fetch();
    const json = await response.json();

    // Modify the response
    json.products.push({ id: 999, name: 'New Product' });

    await route.fulfill({
      response,
      json
    });
  });

  await page.goto('https://example.com');

  // Listen to requests
  page.on('request', request => {
    console.log('Request:', request.url());
  });

  // Listen to responses
  page.on('response', response => {
    console.log('Response:', response.url(), response.status());
  });

  // Wait for specific request
  const responsePromise = page.waitForResponse('**/api/data');
  await page.getByRole('button', { name: 'Load' }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);
});

test('retrieve recent requests and console messages', async ({ page }) => {
  await page.goto('https://example.com');
  await page.getByRole('button', { name: 'Load Data' }).click();

  // Get most recent network requests (up to 100)
  const requests = await page.requests();
  console.log('Recent requests:', requests.map(r => r.url()));

  // Get console messages from the page (up to 200)
  const messages = await page.consoleMessages();
  console.log('Console messages:', messages.map(m => m.text()));

  // Get page errors (up to 200)
  const errors = await page.pageErrors();
  if (errors.length > 0) {
    console.error('Page errors:', errors.map(e => e.message));
  }
});
```

## WebSocket Routing and Mocking

Intercept and mock WebSocket connections

```javascript
import { test, expect } from '@playwright/test';

test('mock websocket communication', async ({ page }) => {
  // Mock WebSocket server entirely
  await page.routeWebSocket('wss://example.com/ws', ws => {
    ws.onMessage(message => {
      console.log('Received from client:', message);

      // Respond to specific messages
      if (message === 'ping') {
        ws.send('pong');
      } else if (message === 'request-data') {
        ws.send(JSON.stringify({
          data: 'mocked data',
          timestamp: Date.now()
        }));
      }
    });
  });

  await page.goto('https://example.com');

  // Interact with page that uses WebSocket
  await page.getByRole('button', { name: 'Connect' }).click();
  await expect(page.getByTestId('status')).toHaveText('Connected');
});

test('intercept and modify websocket messages', async ({ page }) => {
  // Connect to real WebSocket but intercept messages
  await page.routeWebSocket('wss://example.com/ws', ws => {
    // Connect to the actual server
    ws.connectToServer();

    // Intercept messages from client to server
    ws.onMessage(message => {
      console.log('Client → Server:', message);
      ws.send(message); // Forward to server
    });

    // Intercept messages from server to client
    ws.onMessageFromServer(message => {
      console.log('Server → Client:', message);

      // Modify message before sending to client
      if (typeof message === 'string' && message.includes('error')) {
        ws.send('{"status": "success"}'); // Replace error with success
      } else {
        ws.send(message); // Forward original message
      }
    });

    // Handle connection close
    ws.onClose(() => {
      console.log('WebSocket connection closed');
    });
  });

  await page.goto('https://example.com');
});
```

## API Testing

Test REST APIs without browser interaction

```javascript
import { test, expect } from '@playwright/test';

test('API request context', async ({ request }) => {
  // GET request
  const getResponse = await request.get('https://api.github.com/users/microsoft');
  expect(getResponse.ok()).toBeTruthy();
  expect(getResponse.status()).toBe(200);
  const userData = await getResponse.json();
  expect(userData.name).toBe('Microsoft');

  // POST request
  const postResponse = await request.post('https://api.example.com/users', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token123'
    },
    data: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  });
  expect(postResponse.ok()).toBeTruthy();
  const newUser = await postResponse.json();

  // PUT request
  await request.put(`https://api.example.com/users/${newUser.id}`, {
    data: { name: 'John Updated' }
  });

  // DELETE request
  const deleteResponse = await request.delete(`https://api.example.com/users/${newUser.id}`);
  expect(deleteResponse.status()).toBe(204);

  // API assertions
  await expect(getResponse).toBeOK();
});

test('API context with browser context', async ({ page }) => {
  // Shares cookies with browser context
  await page.goto('https://example.com/login');
  await page.getByLabel('Username').fill('user');
  await page.getByLabel('Password').fill('pass');
  await page.getByRole('button', { name: 'Login' }).click();

  // API request will use the same cookies
  const response = await page.request.get('https://example.com/api/profile');
  const profile = await response.json();
  expect(profile.username).toBe('user');
});
```

## Mobile Emulation and Device Testing

Test on mobile devices and custom viewport configurations

```javascript
import { test, expect, devices } from '@playwright/test';

test('mobile emulation', async ({ browser }) => {
  // Emulate iPhone 13
  const iphone13 = devices['iPhone 13'];
  const context = await browser.newContext({
    ...iphone13,
    locale: 'en-US',
    geolocation: { longitude: -122.4194, latitude: 37.7749 },
    permissions: ['geolocation'],
  });

  const page = await context.newPage();
  await page.goto('https://maps.google.com');

  // Click location button
  await page.getByText('Your location').click();

  // Wait for map to load
  await page.waitForLoadState('networkidle');

  // Take mobile screenshot
  await page.screenshot({ path: 'mobile-view.png' });

  await context.close();
});

test('custom viewport', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
  });

  const page = await context.newPage();
  await page.goto('https://example.com');

  // Touch interactions
  await page.locator('.menu-button').tap();

  await context.close();
});
```

## Fixtures and Test Isolation

Create reusable test fixtures for shared setup

```javascript
// fixtures.ts
import { test as base, expect } from '@playwright/test';

class TodoPage {
  constructor(private page) {}

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc/');
  }

  async addTodo(text: string) {
    await this.page.locator('.new-todo').fill(text);
    await this.page.locator('.new-todo').press('Enter');
  }

  async removeTodo(text: string) {
    const todo = this.page.getByText(text);
    await todo.hover();
    await this.page.getByLabel('Delete', { exact: true }).click();
  }
}

// Extend base test with custom fixture
export const test = base.extend<{ todoPage: TodoPage }>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  }
});

export { expect };

// test.spec.ts
import { test, expect } from './fixtures';

test('use todo page fixture', async ({ todoPage }) => {
  // todoPage is already initialized
  await todoPage.addTodo('Buy groceries');
  await todoPage.addTodo('Walk the dog');

  await expect(page.getByTestId('todo-item')).toHaveCount(2);
});

// Worker-scoped fixture (shared across tests)
export const testWithDB = base.extend<{}, { db: Database }>({
  db: [async ({}, use) => {
    const db = await connectDatabase();
    await use(db);
    await db.close();
  }, { scope: 'worker' }]
});
```

## Test Annotations and Parallelization

Control test execution with annotations and parallel modes

```javascript
import { test, expect } from '@playwright/test';

// Skip test
test.skip('skip this test', async ({ page }) => {
  // This test will not run
});

// Conditional skip
test('conditional skip', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'Not supported in Firefox');
  await page.goto('https://example.com');
});

// Only run this test
test.only('focus on this test', async ({ page }) => {
  await page.goto('https://example.com');
});

// Fail test
test.fail('expected to fail', async ({ page }) => {
  // Test is expected to fail
  await expect(page.getByText('Not Exists')).toBeVisible();
});

// Mark as slow (3x timeout)
test('slow test', async ({ page }) => {
  test.slow();
  await page.goto('https://example.com/slow-page');
});

// Set custom timeout
test('custom timeout', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  await page.goto('https://example.com');
});

// Parallel execution in a single file
test.describe.configure({ mode: 'parallel' });

test.describe('parallel tests', () => {
  test('test 1', async ({ page }) => {
    await page.goto('https://example.com/1');
  });

  test('test 2', async ({ page }) => {
    await page.goto('https://example.com/2');
  });
});

// Serial execution (run tests in order)
test.describe.configure({ mode: 'serial' });

test.describe('serial tests', () => {
  test('step 1: login', async ({ page }) => {
    await page.goto('https://example.com/login');
  });

  test('step 2: perform action', async ({ page }) => {
    await page.goto('https://example.com/dashboard');
  });
});
```

## Visual Regression Testing

Compare screenshots and detect visual changes

```javascript
import { test, expect } from '@playwright/test';

test('visual regression with screenshots', async ({ page }) => {
  await page.goto('https://example.com');

  // Compare full page screenshot
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixels: 100
  });

  // Compare element screenshot
  const header = page.locator('header');
  await expect(header).toHaveScreenshot('header.png', {
    maxDiffPixelRatio: 0.1
  });

  // Mask dynamic content before comparison
  await expect(page).toHaveScreenshot('page-with-mask.png', {
    mask: [
      page.locator('.timestamp'),
      page.locator('.ad-banner')
    ],
    animations: 'disabled'
  });
});

test('custom screenshot comparison', async ({ page }) => {
  await page.goto('https://example.com');

  // Take screenshot
  await page.screenshot({
    path: 'screenshots/landing.png',
    fullPage: true,
    clip: { x: 0, y: 0, width: 800, height: 600 }
  });

  // Screenshot specific element
  const card = page.locator('.product-card').first();
  await card.screenshot({ path: 'screenshots/product-card.png' });
});
```

## Trace Viewer and Debugging

Record and analyze test execution traces

```javascript
// playwright.config.ts - Enable tracing
export default defineConfig({
  use: {
    trace: 'on-first-retry', // or 'on', 'off', 'retain-on-failure'
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  }
});
```

```bash
# Run tests with tracing enabled
npx playwright test --trace on

# Open HTML report with traces
npx playwright show-report

# Open specific trace file
npx playwright show-trace trace.zip
```

```javascript
import { test } from '@playwright/test';

test('debugging with trace', async ({ page }) => {
  // Pause execution for debugging
  await page.pause();

  // Add custom trace metadata
  await test.info().attach('test-data', {
    body: JSON.stringify({ userId: 123 }),
    contentType: 'application/json'
  });

  await page.goto('https://example.com');
  await page.getByRole('button', { name: 'Submit' }).click();

  // Step through with UI Mode: npx playwright test --ui
});
```

## Playwright Test Agents

Generate tests using AI-powered agents for test planning, generation, and healing

```bash
# Initialize Playwright Test Agents for your editor/IDE
# Visual Studio Code
npx playwright init-agents --loop=vscode

# Claude Code
npx playwright init-agents --loop=claude

# opencode
npx playwright init-agents --loop=opencode
```

Playwright Test Agents provide three specialized agents to streamline test creation:

- **planner**: Explores your application and produces a Markdown test plan
- **generator**: Transforms the Markdown plan into Playwright Test files
- **healer**: Executes the test suite and automatically repairs failing tests

After initialization, you can use these agents within your editor to guide AI assistants through the process of building comprehensive Playwright tests. The agents understand your application structure, generate appropriate locators, and help maintain test stability.

## Code Generation

Generate test code automatically using Codegen

```bash
# Launch codegen with URL
npx playwright codegen https://example.com

# Codegen with specific browser
npx playwright codegen --browser=webkit https://example.com

# Codegen with device emulation
npx playwright codegen --device="iPhone 13" https://example.com

# Codegen with custom viewport
npx playwright codegen --viewport-size=1280,720 https://example.com

# Save generated test to file
npx playwright codegen --target=javascript -o tests/generated.spec.js https://example.com

# Codegen with authentication
npx playwright codegen --save-storage=auth.json https://example.com
npx playwright codegen --load-storage=auth.json https://example.com/dashboard
```

## Clock API and Time Manipulation

Control and manipulate time within tests for time-dependent behavior

```javascript
import { test, expect } from '@playwright/test';

test('set fixed time', async ({ page }) => {
  // Set fixed time for Date.now() and new Date()
  await page.clock.setFixedTime(new Date('2024-02-02T10:00:00'));
  await page.goto('https://example.com');

  // Time stays fixed at 10:00:00 AM
  await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');

  // Update fixed time
  await page.clock.setFixedTime(new Date('2024-02-02T10:30:00'));
  await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:30:00 AM');
});

test('control timers with clock', async ({ page }) => {
  // Initialize clock and let timers run naturally
  await page.clock.install({ time: new Date('2024-02-02T08:00:00') });
  await page.goto('https://example.com');

  // Pause time at specific moment
  await page.clock.pauseAt(new Date('2024-02-02T10:00:00'));
  await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');

  // Fast forward time by 30 minutes
  await page.clock.fastForward('30:00');
  await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:30:00 AM');

  // Run time for specific duration (milliseconds)
  await page.clock.runFor(2000);
  await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:02 AM');

  // Resume normal time flow
  await page.clock.resume();
});

test('test inactivity timeout', async ({ page }) => {
  // Test features that depend on time without waiting
  await page.clock.install();
  await page.goto('https://example.com/dashboard');

  // Interact with page
  await page.getByRole('button', { name: 'Start' }).click();

  // Fast forward 5 minutes to trigger inactivity timeout
  await page.clock.fastForward('05:00');

  // Verify timeout behavior occurred
  await expect(page.getByText('Session expired due to inactivity')).toBeVisible();
});
```

## ARIA Snapshots and Accessibility Testing

Test accessibility tree structure with snapshot assertions

```javascript
import { test, expect } from '@playwright/test';

test('match aria snapshot', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Assert accessibility tree structure
  await expect(page.getByRole('banner')).toMatchAriaSnapshot(`
    - banner:
      - heading /Playwright enables reliable end-to-end/ [level=1]
      - link "Get started"
      - link "Star microsoft/playwright on GitHub"
  `);
});

test('accessibility structure validation', async ({ page }) => {
  await page.goto('https://example.com');

  // Validate navigation structure
  await expect(page.locator('nav')).toMatchAriaSnapshot(`
    - navigation:
      - link "Home"
      - link "Products"
      - link "About"
      - link "Contact"
  `);

  // Validate form structure with attributes
  await expect(page.locator('form')).toMatchAriaSnapshot(`
    - form:
      - textbox "Username"
      - textbox "Password"
      - checkbox "Remember me"
      - button "Sign in"
  `);
});

test('partial matching with aria snapshots', async ({ page }) => {
  await page.goto('https://example.com');

  // Partial match - only check specific elements
  await expect(page.locator('main')).toMatchAriaSnapshot(`
    - main:
      - heading "Welcome" [level=1]
      - button "Get Started"
  `);
});

test('generate aria snapshot programmatically', async ({ page }) => {
  await page.goto('https://example.com');

  // Generate snapshot for inspection
  const snapshot = await page.locator('header').ariaSnapshot();
  console.log(snapshot);

  // Use in assertions
  await expect(page.locator('header')).toMatchAriaSnapshot(snapshot);
});

test('regex patterns in aria snapshots', async ({ page }) => {
  await page.goto('https://example.com');

  // Match dynamic content with regex
  await expect(page.locator('main')).toMatchAriaSnapshot(`
    - main:
      - heading /Issues \\d+/ [level=1]
      - text /Last updated: .*/
      - button /\\d+ items in cart/
  `);
});
```

## Summary

Playwright provides a comprehensive solution for modern web testing with its unified API across multiple browsers and programming languages. The framework's core strengths include intelligent auto-waiting that eliminates flaky tests, built-in parallelization for fast test execution, and powerful debugging tools like trace viewer, codegen, and the HTML reporter's Speedboard for identifying slow tests. Starting with version 1.57, Playwright uses Chrome for Testing builds instead of Chromium for better stability and consistency. Playwright Test integrates seamlessly with CI/CD pipelines and offers flexible configuration options for timeouts, retries, reporters, webServer wait patterns for custom readiness checks, and multiple browser projects. The fixture system enables clean test organization with proper isolation, while the authentication state management (including IndexedDB support) allows efficient testing of protected routes without repeated login operations. Advanced capabilities like the Clock API enable precise testing of time-dependent features without delays, while ARIA snapshots provide a structured approach to accessibility testing. The new AI-powered Test Agents (planner, generator, and healer) streamline the entire test creation lifecycle from exploration to automated maintenance.

The framework excels at handling complex scenarios including mobile device emulation, network interception, WebSocket routing and mocking, API testing without browser overhead, and visual regression testing with screenshot comparison. Playwright's locator strategies prioritize accessibility and maintainability through role-based and test-id selectors, supported by web-first assertions that automatically retry until conditions are met. Recent enhancements include the ability to filter visible elements, describe locators for better debugging, assert individual class names with toContainClass, and retrieve recent console messages, page errors, and network requests directly from the page object. Time manipulation through setFixedTime, fastForward, and pauseAt methods allows testing of inactivity timeouts, scheduled tasks, and time-sensitive features efficiently. WebSocket communication can be fully mocked or intercepted for real-time application testing. Accessibility validation with toMatchAriaSnapshot ensures consistent structure of accessible elements across your application. Whether automating end-to-end tests, performing API validation, testing real-time WebSocket applications, scraping dynamic content, validating cross-browser compatibility, or testing time-dependent behavior, Playwright provides the tools and patterns needed for reliable, maintainable test automation at scale.
