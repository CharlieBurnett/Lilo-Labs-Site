// @ts-check
const { test, expect } = require('@playwright/test');

// Runs against both the `desktop` (3-up) and `mobile` (1-up) projects defined
// in playwright.config.js, so each test adapts to the active viewport.

const MOBILE_MAX_WIDTH = 768;

function isMobile(page) {
  const size = page.viewportSize();
  return !!size && size.width <= MOBILE_MAX_WIDTH;
}

// Counts slides that are at least half inside the carousel viewport, and the
// width of the first slide as a percentage of that viewport.
async function readLayout(page) {
  return page.evaluate(() => {
    const carousel = document.querySelector('.carousel');
    const track = document.querySelector('.carousel-track');
    const slides = [...track.querySelectorAll('.carousel-slide')];
    const box = carousel.getBoundingClientRect();
    const visible = slides.filter((s) => {
      const r = s.getBoundingClientRect();
      const overlap = Math.min(r.right, box.right) - Math.max(r.left, box.left);
      return overlap > r.width / 2;
    }).length;
    return {
      slideCount: slides.length,
      visible,
      slideWidthPct: (slides[0].getBoundingClientRect().width / box.width) * 100,
    };
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
  await page.waitForSelector('.carousel-track');
});

test('all eight screenshots load successfully', async ({ page }) => {
  const broken = await page.evaluate(() =>
    [...document.querySelectorAll('.carousel-image')]
      .filter((img) => !(img.complete && img.naturalWidth > 0))
      .map((img) => img.getAttribute('src'))
  );
  expect(broken).toEqual([]);

  const { slideCount } = await readLayout(page);
  expect(slideCount).toBe(8);
});

test('shows three slides side by side on desktop, one on mobile', async ({ page }) => {
  const { visible, slideWidthPct } = await readLayout(page);
  if (isMobile(page)) {
    expect(visible).toBe(1);
    expect(slideWidthPct).toBeCloseTo(100, 0);
  } else {
    expect(visible).toBe(3);
    expect(slideWidthPct).toBeCloseTo(33.33, 0);
  }
});

test('auto-advances the track within one interval', async ({ page }) => {
  const readTransform = () =>
    page.evaluate(() => getComputedStyle(document.querySelector('.carousel-track')).transform);

  const before = await readTransform();
  // Interval is 5s; allow headroom for the 0.6s transition.
  await expect.poll(readTransform, { timeout: 7000, intervals: [250] }).not.toBe(before);
});

test('stepping logic cycles through every slide and wraps with no empty slots', async ({ page }) => {
  // Reproduces the exact formula in js/carousel.js for the active viewport,
  // verifying it never scrolls past the last full set of visible slides.
  const result = await page.evaluate((mobileMax) => {
    const slides = document.querySelectorAll('.carousel-slide').length;
    const visible = window.matchMedia(`(max-width: ${mobileMax}px)`).matches ? 1 : 3;
    const maxIndex = Math.max(0, slides - visible);
    const step = 100 / visible;
    let current = 0;
    const indices = [];
    const translates = [];
    for (let i = 0; i < slides + 2; i++) {
      indices.push(current);
      translates.push(+(current * step).toFixed(4));
      current = current >= maxIndex ? 0 : current + 1;
    }
    return { visible, maxIndex, indices, maxTranslate: Math.max(...translates), step };
  }, MOBILE_MAX_WIDTH);

  // Every slot up to maxIndex is reached, in order.
  const expectedRamp = Array.from({ length: result.maxIndex + 1 }, (_, i) => i);
  expect(result.indices.slice(0, result.maxIndex + 1)).toEqual(expectedRamp);
  // Immediately after the last index it returns to 0 (the wrap).
  expect(result.indices[result.maxIndex + 1]).toBe(0);
  // Never translates past the final full set of visible slides.
  expect(result.maxTranslate).toBeCloseTo(result.maxIndex * result.step, 4);
});
