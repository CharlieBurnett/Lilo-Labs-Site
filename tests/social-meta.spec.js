// Verifies every page ships the Open Graph / Twitter Card tags that Facebook,
// LinkedIn, iMessage, Slack, etc. read to build a link preview — and that the
// preview image they are pointed at actually exists at that path.
const { test, expect } = require('@playwright/test');

const SITE = 'https://lilo-labs.com';
const OG_IMAGE = `${SITE}/images/og-image.png`;

const PAGES = [
  { path: '/', url: `${SITE}/` },
  { path: '/apps.html', url: `${SITE}/apps.html` },
  { path: '/about.html', url: `${SITE}/about.html` },
  { path: '/news.html', url: `${SITE}/news.html` },
  { path: '/contact.html', url: `${SITE}/contact.html` },
  { path: '/privacypolicy.html', url: `${SITE}/privacypolicy.html` },
];

const content = (page, selector) =>
  page.locator(`head ${selector}`).getAttribute('content');

for (const { path, url } of PAGES) {
  test(`${path} exposes a complete share preview`, async ({ page }) => {
    await page.goto(path);

    // Absolute URLs are required: scrapers fetch the image out of page context.
    expect(await content(page, 'meta[property="og:image"]')).toBe(OG_IMAGE);
    expect(await content(page, 'meta[name="twitter:image"]')).toBe(OG_IMAGE);
    expect(await content(page, 'meta[property="og:url"]')).toBe(url);

    // Large image card (not the small square "summary" card).
    expect(await content(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(await content(page, 'meta[property="og:type"]')).toBe('website');
    expect(await content(page, 'meta[property="og:site_name"]')).toBe('Lilo Labs');

    // Title/description drive the preview's text; must be present and non-empty.
    for (const sel of [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
      'meta[property="og:image:alt"]',
    ]) {
      expect((await content(page, sel) || '').trim().length, sel).toBeGreaterThan(0);
    }

    // The declared dimensions must match what LinkedIn/Facebook expect (1.91:1).
    expect(await content(page, 'meta[property="og:image:width"]')).toBe('1200');
    expect(await content(page, 'meta[property="og:image:height"]')).toBe('630');
  });
}

for (const { path } of PAGES) {
  test(`${path} links the favicon set`, async ({ page }) => {
    await page.goto(path);
    const href = (sel) => page.locator(`head ${sel}`).getAttribute('href');

    expect(await href('link[rel="icon"][sizes="any"]')).toBe('favicon.ico');
    expect(await href('link[rel="icon"][sizes="32x32"]')).toBe('images/favicon-32.png');
    expect(await href('link[rel="icon"][sizes="192x192"]')).toBe('images/favicon-192.png');
    expect(await href('link[rel="apple-touch-icon"]')).toBe('images/apple-touch-icon.png');
    expect(await href('link[rel="manifest"]')).toBe('site.webmanifest');
    expect(await content(page, 'meta[name="theme-color"]')).toBe('#6B46C1');
  });
}

test('every favicon asset is served', async ({ request }) => {
  const assets = [
    ['/favicon.ico', 'icon'],
    ['/images/favicon-32.png', 'image/png'],
    ['/images/favicon-192.png', 'image/png'],
    ['/images/favicon-512.png', 'image/png'],
    ['/images/apple-touch-icon.png', 'image/png'],
    ['/site.webmanifest', 'json'],
  ];
  for (const [url, type] of assets) {
    const response = await request.get(url);
    expect(response.status(), url).toBe(200);
    expect(response.headers()['content-type'], url).toContain(type);
  }

  // The manifest must point at icons that actually exist.
  const manifest = await (await request.get('/site.webmanifest')).json();
  for (const icon of manifest.icons) {
    expect((await request.get(icon.src)).status(), icon.src).toBe(200);
  }
});

test('the share image exists and is a 1200x630 PNG', async ({ page, request }) => {
  const response = await request.get('/images/og-image.png');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/png');

  await page.goto('/'); // gives the relative src below a same-origin base URL
  const size = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.src = '/images/og-image.png';
      }),
  );
  expect(size).toEqual({ w: 1200, h: 630 });
});
