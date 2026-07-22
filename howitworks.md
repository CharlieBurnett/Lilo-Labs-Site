# How It Works — Lilo Labs Website

A quick guide to how this static marketing site is put together and how to maintain it.

## Big picture

Plain HTML5 + CSS, no build step, hosted on GitHub Pages at https://lilo-labs.com.
Each top-level page is its own `.html` file. Shared look-and-feel lives in `css/`,
so a change to a color, button, or badge updates every page that uses it.

```
index.html        Landing page
apps.html         Our Apps — one card per app
about.html        About
news.html         News
contact.html      Contact
privacypolicy.html Privacy policy
css/
  base.css        Design tokens (:root color variables) + global/layout styles
  shared.css      Header/nav/footer + elements reused across pages
  apps.css        Styles specific to the Apps page (app cards, badges, screenshots)
  main.css        Styles specific to the landing page (hero, CTA buttons)
  carousel.css    The home-page screenshot carousel (reusable .carousel component)
js/
  carousel.js     Auto-advances the home-page carousel
images/
  <app-name>/     One folder of screenshots per app
```

## Design system (reuse, don't inline)

All colors are CSS custom properties defined once in `css/base.css` under `:root`
(`--royal-purple`, `--gray-500`, `--white`, etc.). Never hardcode a hex value or
use inline `style=""`. Reach for an existing variable or class first; only add a
new class when nothing fits.

## The Apps page (`apps.html`)

The page is a list of `.app-card` blocks. Each card has two parts:

1. `.app-header` — the app icon, name, one-line tagline, and badges.
2. `.app-screenshots` — a responsive CSS grid of phone screenshots
   (`repeat(auto-fit, minmax(250px, 1fr))`), so it shows 3 across on desktop and
   stacks to a single column under 768px.

### Badges (reusable component)

Two badge classes in `css/apps.css`, both built on the shared `.platform-badge,
.status-badge` rule:

- `.platform-badge` — dark pill for the platform, e.g. `iOS`.
- `.status-badge` — purple call-to-action. Wrap an `<a>` for a link
  (e.g. "Download Now").
- `.status-badge.coming-soon` — gray modifier of `.status-badge` for apps that
  aren't out yet. It is intentionally **not** a link, so visitors can tell at a
  glance what they can and can't tap.

To add a new app, copy an existing `.app-card`, swap the icon emoji, name,
tagline, badges, and the three `<img>` sources. Card order on the page is the
display order — put the newest/most-promoted app first.

## The home page carousel (`index.html`)

The hero ("Building Apps That Matter") includes an auto-rotating screenshot
carousel that shows **three screenshots side by side** (one on phones) and
pulls images round-robin from each app on the Apps page.

- **Markup** lives in the `.hero` of `index.html` between the paragraph and the
  CTA buttons: a `.carousel` viewport wrapping a `.carousel-track` flex row of
  `.carousel-slide` items, each holding one `.carousel-image`.
- **Styles** are in `css/carousel.css` as a reusable `.carousel` component — no
  inline styles. Each `.carousel-slide` is `flex: 0 0 33.3333%` so three fit in
  the viewport, dropping to `flex: 0 0 100%` (one-up) under the 768px mobile
  breakpoint. Spacing between the three comes from horizontal **padding inside
  each slide**, not a flex `gap`, so every slide stays exactly one-third wide and
  the JS transform math stays exact. Images use `max-height` (440px desktop /
  360px mobile) with `width: auto`, so each screenshot is height-reduced while
  keeping its aspect ratio; this also lets the landscape Apple Watch shot sit
  alongside portrait phone shots without distortion.
- **Behavior** is in `js/carousel.js`: every 5 seconds it shifts the track one
  slide to the left via `translateX(-current * (100 / visibleCount)%)`. It reads
  the same 768px breakpoint through `matchMedia` to know whether 1 or 3 slides
  are visible, and re-syncs on viewport change. `current` cycles `0` →
  `slides.length - visibleCount` (5 for 8 slides at 3-up) and then wraps back to
  `0`, so the last visible trio is always full — no empty slots ever show. The
  0.6s CSS transition does the sliding. Pure vanilla JS, no dependencies.
- **Slide order** is round-robin by screenshot index: each app's first
  screenshot, then each app's second, then each app's third — currently
  CurrenSee → Slow Sipper → TextTutor across indexes 1, 2, 3 (8 slides). Slow
  Sipper only contributes 2 rounds since its settings-screen shot was dropped
  from the rotation (settings pages aren't shown in marketing screenshots).

To add an app to the rotation, add three new `.carousel-slide` `<img>`s in the
right interleaved positions. If you ever change `.carousel`'s `max-width`, the JS
needs no change — it shifts by percentage, not pixels. If you change the 768px
breakpoint or the 3-up count, keep `css/carousel.css` and the `visibleCount()` /
`MOBILE_QUERY` values in `js/carousel.js` in sync.

## Screenshots: size and format

Phone screenshots are PNG at **1290 × 2796** (iPhone Pro Max portrait). They're
displayed at `width: 100%` in the grid, so the exact pixel size isn't critical,
but keeping them all the same dimensions and aspect ratio keeps the grid tidy.
Store each app's screenshots in `images/<app-name>/`.

### How the CurrenSee screenshots were captured

CurrenSee is an iOS app in a separate repo (`~/Programs/CurrenSee`). Tagline on
the site: **"Live rates, right where you look."** — the three screenshots are
chosen to sell that "glanceable" promise: the converter, home-screen widgets,
and the Apple Watch app.

Shots were taken from the simulators with XcodeBuildMCP:

1. `build_run_sim` of the `CurrenSee` scheme onto an iPhone 16 Pro Max simulator
   (native 1320 × 2868), and the `CurrenSee watchOS Watch App` scheme onto an
   Apple Watch Ultra 2 simulator (native 410 × 502).
2. `xcrun simctl io <udid> screenshot --type=png` for full-resolution captures
   (the MCP `screenshot` tool returns a small optimized JPEG — not what we want
   for the site).
3. **Widgets and watch faces can't be placed via script** — adding a home-screen
   widget or a watch complication is manual drag-and-drop, and simulator
   UI-automation/accessibility wasn't available in this environment. So the user
   placed the home-screen widgets by hand, then we captured. (We use the watch
   *app* screen rather than a face complication for the same reason.)
4. The watch screen is small and a different shape than a phone. To keep all
   three tiles the same size, the watch capture is composited onto a 1290 × 2796
   canvas (iOS light-gray `#F2F2F7`, matching the converter shot) with rounded
   corners + a soft shadow, so it reads as a clean Apple Watch product tile. The
   compositor is a throwaway CoreGraphics/AppKit Swift script (`swift
   compose_watch.swift in.png out.png`).
5. `sips -z 2796 1290` normalizes the phone PNGs to the site's standard size.

Tip for varying the converter's displayed pair without tapping: change the app's
persisted currency by editing its App Group prefs **while the sim is shut down**,
then reboot — `PlistBuddy` set `baseCode`/`targetCode` in
`.../AppGroup/<id>/Library/Preferences/group.com.lilolabs.CurrenSee.plist`. A
running `cfprefsd` caches and would overwrite a direct file edit, and `simctl
spawn defaults write` writes to a different store than the app's sandboxed
container — so neither works unless the sim is shut down first.

Resulting files: `images/currensee/01_convert.png` (converter, USD→EUR),
`02_home_widget.png` (home-screen widgets), `03_watch.png` (Apple Watch app).

## Link previews when the site is shared

Pasting a lilo-labs.com link into Facebook, LinkedIn, iMessage, Slack, X, etc.
makes that service fetch the page and read `<meta>` tags out of the `<head>` to
build a preview card. Without them you get a bare URL. Every page now carries the
same block, right under its `<title>`:

- `description` + `<link rel="canonical">` — plain SEO, also used as fallback text.
- `og:type`, `og:site_name`, `og:url`, `og:title`, `og:description` — Open Graph,
  the format Facebook/LinkedIn/iMessage/Slack all read.
- `og:image` (+ `og:image:secure_url`, `:type`, `:width`, `:height`, `:alt`) —
  the picture. **It must be an absolute `https://lilo-labs.com/...` URL**; a
  relative path silently produces no image, since scrapers fetch it out of page
  context. Declaring width/height lets LinkedIn render the card without waiting
  to download and measure the file.
- `twitter:card = summary_large_image` (+ title/description/image) — asks for the
  big banner card instead of the small square thumbnail.

The `og:url`/`og:title`/`description` values are **per page** (so sharing
`apps.html` says "Our Apps"); everything else is identical across pages.

### The share image (`images/og-image.png`)

1200 × 630 PNG — the 1.91:1 ratio Facebook/LinkedIn expect and the size iMessage
renders as a full-width banner. It's the company logo centered on a white
background with the "Micro apps, major impact." tagline and a royal-purple
(`#6B46C1`) bar along the bottom edge.

**Opaque white background is deliberate**: `images/Lilo Logo v2.png` is a
transparent PNG, and several platforms flatten transparency onto black, which
would turn the dark tagline text invisible.

It was generated by rendering a throwaway 1200 × 630 HTML page in headless
Chromium (Playwright is already installed as a dev dep) and screenshotting it —
no image editor or Python imaging library needed. To regenerate/restyle it,
rebuild that scratch page and re-screenshot at the same size. The source logo is
only 296 px wide, so don't scale it much past ~450 px in the layout or it goes
soft.

If you change the image after it has been shared, the platforms cache
aggressively — re-scrape via Facebook's Sharing Debugger / LinkedIn's Post
Inspector, or ship it under a new filename.

## Favicons

The tab/bookmark/home-screen icon is the **final "o" of the Lilo wordmark**,
cropped out of `images/Lilo Logo v2.png` and centered so the mark fills ~86-88%
of the square. The full wordmark is unreadable at 16px; the "o" is a distinctive
target ring that survives the shrink.

The crop is measured, not eyeballed: the logo is 296 × 210 and the last glyph's
alpha bounding box is **x 175-274, y 75-174** (a 100 × 100 square). Same approach
as the share image — a scratch HTML page scales/offsets the logo inside a square
viewport and headless Chromium screenshots it at each size (with
`omitBackground` for the transparent ones). If the logo file is ever replaced,
re-measure that bounding box before regenerating.

| File | Purpose |
|------|---------|
| `favicon.ico` (root) | 16/32/48 multi-size ICO (PNG payloads). Browsers and scrapers request `/favicon.ico` by default, so it stays at the repo root. |
| `images/favicon-32.png` | Standard tab icon. |
| `images/favicon-192.png` | Android / high-DPI. |
| `images/favicon-512.png` | Manifest / install prompt. |
| `images/apple-touch-icon.png` | 180 × 180 iOS home screen. |
| `site.webmanifest` (root) | Name, theme color, and the 192/512 icons. |

Two deliberate differences: the PNG favicons keep a **transparent** background
(the purple mark reads on both light and dark browser chrome), while the
**apple-touch-icon is opaque white** with more padding — iOS composites it onto
the home screen and would otherwise fill the transparency with black.

Every page's `<head>` carries the same `<link rel="icon">` set plus
`<meta name="theme-color" content="#6B46C1">`. Browsers cache favicons hard; a
hard reload (or a fresh profile) may be needed to see a change locally.

## Testing changes

Open the page directly (`open apps.html`) or render headlessly to check layout:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --window-size=1300,2400 \
  --screenshot=out.png "file://$PWD/apps.html"
```

Always check the mobile view (≤ 390px wide): the app header should center and the
screenshots should collapse to one column.

`npm test` runs the Playwright suite: `tests/carousel.spec.js` (carousel layout
and auto-advance) and `tests/social-meta.spec.js` (every page has the full
Open Graph / Twitter card block, and `images/og-image.png` really is a 1200 × 630
PNG at the URL those tags point to).
