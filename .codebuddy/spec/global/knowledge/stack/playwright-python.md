# Playwright Python

Playwright is a Python library for automating Chromium, Firefox, and WebKit browsers with a single unified API. It provides reliable, fast, and ever-green browser automation capabilities for web testing, scraping, and automation workflows. The library is maintained by Microsoft and delivers cross-browser automation that works consistently across all major browser engines.

The library offers both synchronous and asynchronous APIs with identical functionality, built-in auto-waiting and retry logic, powerful locator strategies, network interception, mobile device emulation, clock control for testing time-based features, and comprehensive assertion utilities. It supports modern web features including web components, shadow DOM, WebSockets, and service workers. With features like video recording, tracing, screenshots, PDF generation, and controllable time progression through the Clock API, Playwright provides a complete automation solution for testing and browser automation tasks.

## Installation and Setup

```bash
# Install the library
pip install playwright

# Install browser binaries (Chromium, Firefox, WebKit)
playwright install

# Install specific browsers only
playwright install chromium
playwright install firefox webkit

# Install with OS dependencies (for Linux)
playwright install --with-deps
```

## Basic Browser Automation

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # Launch browser (supports chromium, firefox, webkit)
    browser = p.chromium.launch(
        headless=False,          # Set to True for headless mode
        slow_mo=100,             # Slow down by 100ms for debugging
        timeout=30000            # Navigation timeout in ms
    )

    # Create page and navigate
    page = browser.new_page()
    page.goto('https://example.com')

    # Take screenshot
    page.screenshot(path='screenshot.png', full_page=True)

    # Close browser
    browser.close()
```

## Async API Usage

```python
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        await page.goto('https://playwright.dev')
        await page.screenshot(path='example.png')

        await browser.close()

asyncio.run(main())
```

## Page Navigation and Waiting

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()

    # Navigate with different wait conditions
    page.goto('https://example.com', wait_until='networkidle')
    page.goto('https://example.com', wait_until='domcontentloaded')
    page.goto('https://example.com', wait_until='load')

    # Navigation with timeout
    try:
        page.goto('https://slow-site.com', timeout=5000)
    except TimeoutError:
        print("Navigation timed out")

    # Wait for specific URL pattern
    page.wait_for_url('**/dashboard')
    page.wait_for_url('https://example.com/success')

    # Wait for load state
    page.wait_for_load_state('networkidle')

    # Back and forward navigation
    page.go_back()
    page.go_forward()
    page.reload()

    # Wait for navigation triggered by action
    with page.expect_navigation():
        page.click('a[href="/next-page"]')

    browser.close()
```

## Element Interaction and Form Filling

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('https://example.com/form')

    # Click elements
    page.click('button#submit')
    page.click('text=Sign In')
    page.dblclick('.item')
    page.click('button', modifiers=['Shift'])
    page.click('button', button='right')  # Right click

    # Fill inputs (clears and types)
    page.fill('input[name="email"]', 'user@example.com')
    page.fill('#password', 'secret123')

    # Type with delay (simulates human typing)
    page.type('textarea', 'Hello World', delay=100)

    # Press keys
    page.press('input', 'Enter')
    page.press('input', 'Control+A')
    page.keyboard.press('Tab')

    # Checkboxes and radio buttons
    page.check('input[type="checkbox"]')
    page.uncheck('input[type="checkbox"]')

    # Select dropdowns
    page.select_option('select#country', 'US')
    page.select_option('select', label='United States')
    page.select_option('select', value='us')
    page.select_option('select', index=2)

    # Multiple selection
    page.select_option('select[multiple]', ['red', 'blue', 'green'])

    # File upload
    page.set_input_files('input[type="file"]', '/path/to/file.pdf')
    page.set_input_files('input[type="file"]', ['/file1.pdf', '/file2.pdf'])

    # Hover and drag
    page.hover('.menu-item')
    page.drag_and_drop('#source', '#target')

    # Focus element
    page.focus('input')

    browser.close()
```

## Locators - Recommended Way to Find Elements

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('https://example.com')

    # CSS selector locators
    button = page.locator('button#submit')
    button.click()

    # Text-based locators
    page.locator('text=Click here').click()
    page.locator('text="Exact match"').click()

    # Role-based selectors (accessible)
    page.get_by_role('button', name='Submit').click()
    page.get_by_role('textbox', name='Email').fill('test@example.com')
    page.get_by_role('checkbox', name='Accept terms').check()

    # Test ID selector (recommended for stable tests)
    page.get_by_test_id('username').fill('john')

    # Label selector
    page.get_by_label('Email address').fill('user@example.com')
    page.get_by_label('Password').fill('secret')

    # Placeholder selector
    page.get_by_placeholder('Enter your name').fill('John Doe')

    # Text content selector
    page.get_by_text('Welcome back').click()

    # Alt text for images
    page.get_by_alt_text('Company logo').click()

    # Title attribute
    page.get_by_title('More information').click()

    # Filter locators
    rows = page.locator('tr')
    row_with_text = rows.filter(has_text='John')
    row_with_badge = rows.filter(has=page.locator('.badge'))

    # Chain locators
    product = page.locator('.product')
    price = product.locator('.price')
    print(price.text_content())

    # Get nth element
    page.locator('li').first.click()
    page.locator('li').last.click()
    page.locator('li').nth(2).click()

    # Count elements
    count = page.locator('.item').count()
    print(f"Found {count} items")

    # Iterate over all matching elements
    for item in page.locator('.item').all():
        print(item.text_content())

    browser.close()
```

## Assertions with Auto-Waiting

```python
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('https://example.com')

    # Page assertions
    expect(page).to_have_title('My Page Title')
    expect(page).to_have_title('My Page', timeout=10000)
    expect(page).to_have_url('https://example.com/dashboard')
    expect(page).to_have_url('**/dashboard')

    # Visibility assertions
    expect(page.locator('button')).to_be_visible()
    expect(page.locator('.loading')).to_be_hidden()
    expect(page.locator('.modal')).not_to_be_visible()

    # State assertions
    expect(page.locator('button')).to_be_enabled()
    expect(page.locator('button.disabled')).to_be_disabled()
    expect(page.locator('input')).to_be_focused()
    expect(page.locator('input[readonly]')).to_be_editable()
    expect(page.locator('input[type="checkbox"]')).to_be_checked()
    expect(page.locator('input[type="checkbox"]')).not_to_be_checked()

    # Text assertions
    expect(page.locator('h1')).to_have_text('Welcome')
    expect(page.locator('.message')).to_contain_text('Success')
    expect(page.locator('h1')).to_have_text(['Item 1', 'Item 2', 'Item 3'])

    # Value assertions
    expect(page.locator('input')).to_have_value('test@example.com')
    expect(page.locator('input')).to_have_value('test', timeout=5000)

    # Count assertions
    expect(page.locator('.items')).to_have_count(5)

    # Attribute assertions
    expect(page.locator('img')).to_have_attribute('src', '/logo.png')
    expect(page.locator('a')).to_have_attribute('href', 'https://example.com')

    # CSS assertions
    expect(page.locator('.price')).to_have_css('color', 'rgb(255, 0, 0)')
    expect(page.locator('h1')).to_have_css('font-size', '24px')

    # Negations
    expect(page.locator('.error')).not_to_be_visible()
    expect(page.locator('button')).not_to_be_disabled()

    browser.close()
```

## Element Queries and Properties

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('https://example.com')

    # Get text content
    text = page.text_content('.title')
    inner_text = page.inner_text('.container')
    all_text = page.all_text_contents('.items')

    # Get HTML
    html = page.inner_html('.container')
    outer_html = page.locator('.box').evaluate('el => el.outerHTML')

    # Get input values
    value = page.input_value('input[name="email"]')

    # Get attributes
    href = page.get_attribute('a', 'href')
    src = page.get_attribute('img', 'src')
    data_id = page.get_attribute('div', 'data-id')

    # Check element states
    is_visible = page.is_visible('.modal')
    is_hidden = page.is_hidden('.loading')
    is_enabled = page.is_enabled('button')
    is_disabled = page.is_disabled('button.disabled')
    is_checked = page.is_checked('input[type="checkbox"]')
    is_editable = page.is_editable('input')

    # Bounding box
    box = page.locator('.element').bounding_box()
    if box:
        print(f"x: {box['x']}, y: {box['y']}, width: {box['width']}, height: {box['height']}")

    browser.close()
```

## Screenshots and PDF Generation

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('https://example.com')

    # Full page screenshot
    page.screenshot(path='screenshot.png', full_page=True)

    # Viewport screenshot
    page.screenshot(path='viewport.png')

    # Element screenshot
    page.locator('.chart').screenshot(path='chart.png')

    # Screenshot with options
    page.screenshot(
        path='screenshot.jpg',
        type='jpeg',
        quality=80,
        full_page=True,
        clip={'x': 0, 'y': 0, 'width': 800, 'height': 600}
    )

    # Screenshot to bytes
    screenshot_bytes = page.screenshot()

    # Generate PDF (Chromium only)
    page.pdf(
        path='page.pdf',
        format='A4',
        landscape=False,
        margin={'top': '1cm', 'right': '1cm', 'bottom': '1cm', 'left': '1cm'},
        print_background=True
    )

    browser.close()
```

## JavaScript Execution

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('https://example.com')

    # Evaluate JavaScript
    title = page.evaluate('() => document.title')
    url = page.evaluate('() => window.location.href')

    # Evaluate with arguments
    result = page.evaluate('(x, y) => x + y', 5, 3)  # Returns 8
    doubled = page.evaluate('x => x * 2', 10)  # Returns 20

    # Evaluate on element
    text = page.locator('.title').evaluate('el => el.textContent')
    styles = page.locator('.box').evaluate('el => window.getComputedStyle(el).color')

    # Evaluate all matching elements
    texts = page.locator('.item').evaluate_all('elements => elements.map(el => el.textContent)')

    # Evaluate with JSHandle
    js_handle = page.evaluate_handle('() => document.body')
    html = js_handle.evaluate('body => body.innerHTML')

    # Expose Python function to page
    def add(a, b):
        return a + b

    page.expose_function('add', add)
    # Now callable from page: await window.add(5, 3)

    # Add initialization script (runs on every page load)
    page.add_init_script('localStorage.setItem("key", "value")')
    page.add_init_script('window.customProperty = "test"')

    # Add script from file
    with open('init.js', 'r') as f:
        page.add_init_script(f.read())

    browser.close()
```

## Network Interception and Mocking

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()

    # Intercept and modify requests
    def handle_route(route, request):
        # Add custom headers
        headers = {**request.headers, 'Authorization': 'Bearer token123'}
        route.continue_(headers=headers)

    page.route('**/api/**', handle_route)

    # Mock API responses
    def mock_api(route, request):
        if request.method == 'GET':
            route.fulfill(
                status=200,
                content_type='application/json',
                body='{"data": "mocked response"}'
            )
        else:
            route.continue_()

    page.route('**/api/users', mock_api)

    # Abort requests (e.g., images)
    page.route('**/*.{png,jpg,jpeg}', lambda route: route.abort())

    # Redirect requests
    page.route('**/old-api/**',
        lambda route: route.continue_(url='https://new-api.com/api'))

    # Fetch and modify response
    def modify_response(route, request):
        response = route.fetch()
        body = response.text()
        modified = body.replace('old', 'new')
        route.fulfill(response=response, body=modified)

    page.route('**/data.json', modify_response)

    # Route from HAR file
    page.route_from_har('./recordings/api.har', url='**/api/**')

    page.goto('https://example.com')

    # Wait for specific request
    with page.expect_request('**/api/users') as request_info:
        page.click('button#load-users')
    request = request_info.value

    print(f"Request URL: {request.url}")
    print(f"Method: {request.method}")
    print(f"Headers: {request.headers}")
    print(f"Post data: {request.post_data}")

    # Wait for response
    with page.expect_response('**/api/users') as response_info:
        page.click('button#load-users')
    response = response_info.value

    print(f"Status: {response.status}")
    print(f"Headers: {response.headers}")
    print(f"Body: {response.text()}")
    print(f"JSON: {response.json()}")

    # Listen to all requests
    page.on('request', lambda request: print(f'Request: {request.url}'))
    page.on('response', lambda response: print(f'Response: {response.status} {response.url}'))

    browser.close()
```

## Browser Context - Isolated Sessions

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Create context with custom options
    context = browser.new_context(
        viewport={'width': 1280, 'height': 720},
        user_agent='Custom User Agent',
        locale='en-US',
        timezone_id='America/New_York',
        color_scheme='dark',
        geolocation={'latitude': 48.858455, 'longitude': 2.294474},
        permissions=['geolocation', 'notifications'],
        http_credentials={'username': 'user', 'password': 'pass'},
        ignore_https_errors=True
    )

    # Create page in context
    page = context.new_page()
    page.goto('https://example.com')

    # Cookie management
    cookies = context.cookies()
    context.add_cookies([
        {'name': 'session', 'value': 'abc123', 'url': 'https://example.com'},
        {'name': 'token', 'value': 'xyz789', 'domain': '.example.com', 'path': '/'}
    ])
    context.clear_cookies()

    # Set extra HTTP headers
    context.set_extra_http_headers({'X-Custom-Header': 'value'})

    # Grant permissions
    context.grant_permissions(['clipboard-read', 'clipboard-write'])

    # Set geolocation
    context.set_geolocation({'latitude': 51.5074, 'longitude': -0.1278})

    # Save authentication state
    context.storage_state(path='auth.json')

    context.close()

    # Load authentication state in new context
    context2 = browser.new_context(storage_state='auth.json')
    page2 = context2.new_page()
    page2.goto('https://example.com/dashboard')  # Already authenticated

    context2.close()
    browser.close()
```

## Mobile Device Emulation

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Use predefined device
    iphone = p.devices['iPhone 12']
    context = browser.new_context(**iphone)

    page = context.new_page()
    page.goto('https://example.com')

    # Custom mobile viewport
    context2 = browser.new_context(
        viewport={'width': 375, 'height': 667},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
        user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
    )

    # Available devices
    print(list(p.devices.keys()))
    # ['Blackberry PlayBook', 'BlackBerry Z30', 'Galaxy Note 3', 'Galaxy Note II',
    #  'Galaxy S III', 'Galaxy S5', 'Galaxy S8', 'Galaxy S9+', 'Galaxy Tab S4',
    #  'iPad (gen 6)', 'iPad (gen 7)', 'iPad Mini', 'iPad Pro 11', 'iPhone 11',
    #  'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone 12', 'iPhone 12 Pro',
    #  'iPhone 13', 'iPhone 8', 'iPhone SE', 'iPhone XR', 'Pixel 2', 'Pixel 5', ...]

    context.close()
    context2.close()
    browser.close()
```

## Event Handling

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()

    # Page events
    page.on('load', lambda: print('Page loaded'))
    page.on('domcontentloaded', lambda: print('DOM ready'))
    page.on('console', lambda msg: print(f'Console [{msg.type}]: {msg.text}'))
    page.on('dialog', lambda dialog: dialog.accept())
    page.on('pageerror', lambda error: print(f'Page error: {error}'))
    page.on('requestfailed', lambda request: print(f'Request failed: {request.url}'))

    # Request/Response events
    def log_request(request):
        print(f'→ {request.method} {request.url}')

    def log_response(response):
        print(f'← {response.status} {response.url}')

    page.on('request', log_request)
    page.on('response', log_response)

    # Download event
    with page.expect_download() as download_info:
        page.click('a#download-link')
    download = download_info.value
    download.save_as('/path/to/save/file.pdf')
    print(f'Downloaded: {download.suggested_filename}')

    # Popup event (new window/tab)
    with page.expect_popup() as popup_info:
        page.click('a[target="_blank"]')
    popup = popup_info.value
    print(f'Popup URL: {popup.url}')
    popup.close()

    # File chooser event
    with page.expect_file_chooser() as fc_info:
        page.click('input[type="file"]')
    file_chooser = fc_info.value
    file_chooser.set_files('/path/to/file.txt')

    # Worker event (web workers, service workers)
    page.on('worker', lambda worker: print(f'Worker created: {worker.url}'))

    page.goto('https://example.com')

    browser.close()
```

## Frame Handling

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('https://example.com/page-with-iframes')

    # Access main frame
    main_frame = page.main_frame

    # Get all frames
    all_frames = page.frames
    print(f"Total frames: {len(all_frames)}")

    # Find frame by name
    frame = page.frame(name='iframe-name')
    if frame:
        frame.click('button')

    # Find frame by URL
    frame = page.frame(url='https://example.com/iframe-content')
    if frame:
        text = frame.text_content('.title')

    # Frame locator (recommended)
    frame_locator = page.frame_locator('iframe#myframe')
    frame_locator.locator('button').click()
    frame_locator.locator('input').fill('text')

    # Nested frames
    nested = page.frame_locator('iframe#outer').frame_locator('iframe#inner')
    nested.locator('.content').click()

    # Frame has same API as page
    for frame in page.frames:
        print(f"Frame URL: {frame.url}")
        title = frame.evaluate('() => document.title')
        print(f"Frame title: {title}")

    browser.close()
```

## Video Recording

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Enable video recording for context
    context = browser.new_context(
        record_video_dir='videos/',
        record_video_size={'width': 1280, 'height': 720}
    )

    page = context.new_page()
    page.goto('https://example.com')
    page.click('button')
    page.fill('input', 'test')

    # Video is saved when page is closed
    page.close()

    # Get video path
    video = page.video
    if video:
        video_path = video.path()
        print(f"Video saved to: {video_path}")

    context.close()
    browser.close()
```

## Tracing for Debugging

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()

    # Start tracing
    context.tracing.start(
        screenshots=True,
        snapshots=True,
        sources=True
    )

    page = context.new_page()
    page.goto('https://example.com')
    page.click('button#submit')
    page.fill('input', 'test')

    # Stop tracing and save
    context.tracing.stop(path='trace.zip')

    context.close()
    browser.close()

# View trace with: playwright show-trace trace.zip
```

## API Testing

```python
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    # Create API request context
    request_context = p.request.new_context(
        base_url='https://api.example.com',
        extra_http_headers={'Authorization': 'Bearer token123'}
    )

    # GET request
    response = request_context.get('/users')
    assert response.ok
    users = response.json()
    print(f"Users: {users}")

    # POST request
    response = request_context.post(
        '/users',
        data={'name': 'John Doe', 'email': 'john@example.com'}
    )
    expect(response).to_be_ok()
    created_user = response.json()

    # PUT request
    response = request_context.put(
        f'/users/{created_user["id"]}',
        data={'name': 'Jane Doe'}
    )

    # DELETE request
    response = request_context.delete(f'/users/{created_user["id"]}')

    # Custom headers per request
    response = request_context.get(
        '/protected',
        headers={'X-Custom-Header': 'value'}
    )

    # Query parameters
    response = request_context.get('/search', params={'q': 'playwright', 'limit': '10'})

    # Response assertions
    expect(response).to_be_ok()
    print(f"Status: {response.status}")
    print(f"Headers: {response.headers}")
    print(f"Body: {response.text()}")

    request_context.dispose()
```

## API Testing with Browser Context

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()
    page = context.new_page()

    # Login to get cookies/tokens
    page.goto('https://example.com/login')
    page.fill('input[name="username"]', 'user')
    page.fill('input[name="password"]', 'pass')
    page.click('button[type="submit"]')
    page.wait_for_url('**/dashboard')

    # Make API requests with same context (shares cookies)
    response = context.request.get('https://api.example.com/user/profile')
    assert response.ok
    profile = response.json()
    print(f"Profile: {profile}")

    # POST with authentication from browser context
    response = context.request.post(
        'https://api.example.com/data',
        data={'key': 'value'}
    )

    context.close()
    browser.close()
```

## WebSocket Routing

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()

    # Intercept WebSocket connections
    def handle_websocket(ws):
        print(f"WebSocket opened: {ws.url}")

        # Listen to messages from page
        ws.on('framereceived', lambda payload:
            print(f"Page → Server: {payload}"))

        # Listen to messages from server
        ws.on('framesent', lambda payload:
            print(f"Server → Page: {payload}"))

        # Connect to actual server
        server = ws.connect_to_server()

        # Modify messages
        def on_message(message):
            modified = message.replace('old', 'new')
            server.send(modified)

        ws.on('message', on_message)

    page.route_web_socket('wss://example.com/ws', handle_websocket)
    page.goto('https://example.com')

    browser.close()
```

## Clock API - Control Time in Tests

```python
import asyncio
from datetime import datetime
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()

        # Install clock and set initial time
        await context.clock.install(time=datetime(2024, 1, 1, 12, 0, 0))
        # Or use timestamp: await context.clock.install(time=1704110400000)
        # Or use string: await context.clock.install(time='2024-01-01')

        await page.goto('https://example.com')

        # Fast forward time by 1 hour (3600000ms)
        await context.clock.fast_forward(3600000)
        await context.clock.fast_forward('01:00:00')  # String format

        # Run for specific duration (triggers timers)
        await context.clock.run_for(5000)  # Run for 5 seconds
        await context.clock.run_for('00:05:00')  # String format

        # Pause at specific time
        await context.clock.pause_at(datetime(2024, 1, 1, 15, 30, 0))
        await context.clock.pause_at(1704121800000)  # Timestamp
        await context.clock.pause_at('2024-01-01T15:30:00')  # ISO string

        # Resume clock
        await context.clock.resume()

        # Set fixed time (clock won't advance automatically)
        await context.clock.set_fixed_time(datetime(2024, 6, 15, 10, 0, 0))

        # Set system time (clock advances normally from this point)
        await context.clock.set_system_time(datetime(2024, 12, 25, 0, 0, 0))

        await browser.close()

asyncio.run(main())
```

## Clock API - Synchronous Usage

```python
from datetime import datetime
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()
    page = context.new_page()

    # Install clock at specific time
    context.clock.install(time=datetime(2024, 1, 1, 9, 0, 0))

    page.goto('https://example.com/timer')

    # Test time-based functionality
    context.clock.fast_forward(10000)  # Skip 10 seconds

    # Verify timer updated
    timer_value = page.locator('#timer').text_content()
    print(f"Timer shows: {timer_value}")

    # Test countdown functionality
    context.clock.run_for('00:01:00')  # Run for 1 minute

    # Freeze time for stable screenshots
    context.clock.set_fixed_time('2024-01-01T12:00:00')
    page.screenshot(path='frozen-time.png')

    browser.close()
```

## Command Line Interface

```bash
# Install browsers
python -m playwright install
python -m playwright install chromium firefox webkit
python -m playwright install --with-deps

# Code generation (record browser actions)
python -m playwright codegen https://example.com
python -m playwright codegen --target python-async https://example.com

# Take screenshot
python -m playwright screenshot https://example.com screenshot.png
python -m playwright screenshot --full-page https://example.com full.png

# Generate PDF
python -m playwright pdf https://example.com page.pdf

# Show trace viewer
python -m playwright show-trace trace.zip

# Open browser
python -m playwright open https://example.com
```

## Multi-Browser Testing

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # Test across all browsers
    for browser_type in [p.chromium, p.firefox, p.webkit]:
        browser = browser_type.launch()
        page = browser.new_page()

        page.goto('https://example.com')
        title = page.title()
        print(f"{browser_type.name}: {title}")

        page.screenshot(path=f'screenshot-{browser_type.name}.png')
        browser.close()
```

## Error Handling and Timeouts

```python
from playwright.sync_api import sync_playwright, TimeoutError, Error

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()

    # Set default timeout for all operations
    page.set_default_timeout(10000)  # 10 seconds
    page.set_default_navigation_timeout(30000)  # 30 seconds for navigation

    # Handle navigation timeout
    try:
        page.goto('https://slow-site.com', timeout=5000)
    except TimeoutError:
        print("Navigation timed out")

    # Handle selector not found
    try:
        page.click('button#missing', timeout=2000)
    except TimeoutError:
        print("Button not found")

    # Wait for selector with timeout
    try:
        page.wait_for_selector('.modal', timeout=5000)
    except TimeoutError:
        print("Modal did not appear")

    # Handle errors
    try:
        page.goto('https://invalid-url')
    except Error as e:
        print(f"Error: {e}")

    # Graceful degradation
    if page.locator('.optional-element').count() > 0:
        page.locator('.optional-element').click()

    browser.close()
```

## Playwright Python is a comprehensive browser automation library that provides reliable, cross-browser testing and automation capabilities for web applications. The library supports Chromium, Firefox, and WebKit browsers with a single unified API, available in both synchronous and asynchronous flavors. Its key strengths include auto-waiting and retry logic built into locators and assertions, powerful element selection strategies including accessible role-based selectors, comprehensive network interception and mocking capabilities, time control through the Clock API for testing time-based functionality, and built-in tools for debugging through tracing and video recording.

Common use cases include end-to-end testing of web applications, web scraping and data extraction, automated UI testing with visual regression testing, API testing with authentication context sharing, mobile device emulation for responsive design testing, testing time-based features with controllable time progression, WebSocket communication testing and mocking, and cross-browser compatibility testing. Integration patterns typically involve using pytest for test framework integration, implementing the page object pattern for maintainable test code, combining browser automation with API testing through shared contexts, using fixtures for browser and context lifecycle management, controlling time for deterministic testing of timers and animations, and leveraging CI/CD pipelines with Docker containers. The library excels at providing reliable automation through features like smart waiting, retry logic, built-in assertions with timeouts, isolated browser contexts for parallel testing, clock manipulation for time-dependent tests, and comprehensive debugging capabilities through traces, screenshots, and video recordings.
