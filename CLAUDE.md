# CLAUDE.md - Lilo Labs Website

## Project Overview

This is the marketing website for **Lilo Labs** (Lilo, LLC) — a small indie app
studio that builds a family of focused, single-purpose iOS apps. The site is the
studio's home: it introduces the company, showcases each app, and shares news.
It is **not** a single-product page — TextTutor was the first app, but the site
is built to grow as more apps ship.

**Live Site**: https://lilo-labs.com (hosted on GitHub Pages)
**Repository**: CharlieBurnett/Lilo-Labs-Site
**Company**: Lilo, LLC — "Micro apps, major impact"

### The apps (as shown on `apps.html`)
The roster changes over time; the Apps page and its `.app-card` order are the
source of truth. As of this writing:

| App        | Tagline                            | Platform | Status                |
|------------|------------------------------------|----------|-----------------------|
| CurrenSee  | Live rates, right where you look.  | iOS      | Coming Soon           |
| Slow Sipper| Drink less                         | iOS      | Live (App Store link) |
| TextTutor  | Language learning, text first.     | iOS      | Live (App Store link) |

Each app's iOS project lives in its **own separate repository** (e.g.
`~/Programs/CurrenSee`); this repo is only the website.

> **Deeper guide:** `howitworks.md` is the detailed, hands-on maintenance doc
> (component anatomy, the carousel internals, how screenshots were captured,
> etc.). Keep it updated alongside this file. This file is the high-level map and
> the conventions; `howitworks.md` is the how-to.

## Repository Structure

```
Lilo-Labs-Site/
├── index.html              # Landing page (hero + auto-rotating screenshot carousel)
├── apps.html               # Our Apps — one .app-card per app
├── about.html              # About the studio + stats
├── news.html               # News / updates feed
├── contact.html            # Contact (email)
├── privacypolicy.html      # Privacy policy
├── css/
│   ├── base.css            # Design tokens (:root variables) + global reset
│   ├── shared.css          # Header/nav/footer + cross-page elements
│   ├── main.css            # Landing page (hero, CTA buttons)
│   ├── apps.css            # Apps page (cards, badges, screenshot grid)
│   ├── about.css           # About page
│   ├── news.css            # News page
│   ├── contact.css         # Contact page
│   ├── privacypolicy.css   # Privacy page
│   └── carousel.css        # Reusable .carousel component (home hero)
├── js/
│   └── carousel.js         # Auto-advances the home-page carousel (vanilla JS)
├── images/
│   ├── Lilo Logo v2.png    # Company logo (used in nav)
│   ├── og-image.png        # 1200x630 link-preview image (Open Graph / iMessage)
│   ├── currensee/          # One folder of PNG screenshots per app
│   ├── slowsipper/
│   └── texttutor/
├── tests/
│   ├── carousel.spec.js    # Playwright tests (desktop + mobile)
│   └── social-meta.spec.js # Playwright tests for the link-preview meta tags
├── playwright.config.js    # Test config (serves the site, 2 viewports)
├── package.json            # Dev-only: @playwright/test. The SITE has no build step.
├── CNAME                   # Custom domain: lilo-labs.com
├── howitworks.md           # Detailed maintenance guide (read this too)
└── CLAUDE.md               # This file
```

## Technology Stack

### Core
- **Pure HTML5** — one `.html` file per page, no templating or framework.
- **Modular CSS** — external stylesheets in `css/`, **not** inline `<style>`.
  `base.css` (tokens) + `shared.css` (chrome) load on every page; each page then
  loads its own stylesheet.
- **Vanilla JS** — only `js/carousel.js` (no framework, no dependencies).
- **No build step** — edit HTML/CSS/JS directly; GitHub Pages serves as-is.
- **Node is dev-only** — used solely to run the Playwright test suite
  (`npm test`). It is never required to build or serve the site.

### Third-Party Services
- **Google Analytics** (`gtag.js`, ID `G-G1TWRNQ451`) — the same snippet is
  pasted at the top of every page's `<head>`. Don't modify without permission.
- **Apple App Store** — "Download Now" badges link to each live app's listing.

## Design System

Defined once as CSS custom properties in `css/base.css` (`:root`). **Always reach
for a token or existing class; never hardcode a hex value or use inline styles.**

### Color tokens
```css
--royal-purple: #6B46C1;   /* primary brand / accents, links, CTAs */
--purple-light: #8B5CF6;
--purple-dark:  #5B21B6;   /* button hover */
--gray-50 … --gray-900;    /* neutral ramp; gray-900 = footer bg, headings */
--white / --black;
--shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, … ;
```

The site is a **light** theme: white background, dark-gray text, royal-purple
accents, dark-gray (`--gray-900`) footer. (Note: an older version of this site
was a dark single-page design — that is gone.)

### Typography
- System font stack via `--font-sans` (no web fonts — intentional, for speed).
- `.hero h1`: 3.5rem / 800; `.page-header h1`: 2.5rem / 700; body 1rem, line-height 1.6.

## Reusable Components (do not re-create inline)

Per the project's coding standards, UI elements are classes reused across pages,
not one-off inline markup/styles:

- **Header / nav** (`shared.css`) — fixed, blurred white bar with `.logo-nav` and
  a `<nav><ul>` of page links. The current page's link gets `class="active"`.
  Identical on every page.
- **Footer** (`shared.css`) — `--gray-900` bar with copyright + privacy link.
- **Buttons** (`main.css`) — `.btn` base with `.btn-primary` (filled purple) and
  `.btn-secondary` (outlined) modifiers.
- **Page header** (`shared.css`) — `.page-header` title/subtitle band used by the
  interior pages.
- **Cards** — `.app-card` (apps.css) and `.news-card` (news.css), both sharing the
  `.app-card, .news-card` base in `shared.css`.
- **Badges** (`apps.css`) — `.platform-badge` (e.g. `iOS`) and `.status-badge`
  (purple CTA); `.status-badge.coming-soon` is the gray, non-linked modifier.
- **Carousel** (`carousel.css` + `carousel.js`) — the home hero's reusable
  `.carousel` / `.carousel-track` / `.carousel-slide` component. See the carousel
  section of `howitworks.md` for the 3-up / 1-up logic.

When something genuinely new is needed, add a **class**, not an inline style.

## Development Workflow

1. **Edit directly** — no build step. Change the `.html` and the relevant
   stylesheet in `css/`.
2. **Reuse first** — use an existing token/class before adding one; if you add a
   color or component, add it to `base.css`/`shared.css` so every page benefits.
3. **Test in a browser** (see Testing) and run the Playwright suite if you touched
   the carousel or layout.
4. **Update `howitworks.md`** when you add/change a feature.
5. **Commit** with a clear message and **push to `main`** — GitHub Pages
   auto-deploys `main` to lilo-labs.com.

### Common tasks
- **Add an app:** copy an existing `.app-card` in `apps.html` (icon emoji, name,
  tagline, badges, three screenshot `<img>`s); put the newest/most-promoted card
  first. Add its screenshots under `images/<app-name>/`. Optionally add it to the
  home carousel (round-robin order — see `howitworks.md`).
- **Add a news item:** prepend a `.news-card` to the `.news-grid` in `news.html`.
- **Update an app's status:** swap its `.status-badge` (coming-soon ↔ Download
  Now link) on `apps.html`.
- **Change a color/spacing globally:** edit the token in `base.css`.
- **Add a page:** copy the Open Graph / Twitter block from an existing page's
  `<head>` and update `og:url`, `og:title`, and the descriptions; add the page to
  `tests/social-meta.spec.js`. See the link-preview section of `howitworks.md`.

## Testing

Per the coding standards, verify changes in a real browser and keep tests current.

- **Manual:** serve locally (`python3 -m http.server 8123`) and open the page, or
  render headlessly (see the snippet in `howitworks.md`). The browser blocks
  `file://`, so use a local server when scripting/Playwright.
- **Automated (Playwright):** `npm test` runs `tests/carousel.spec.js` against
  `desktop` (1200px, 3-up) and `mobile` (390px, 1-up) viewports — covers image
  loading, layout, auto-advance, and wrap logic. Config auto-starts the static
  server. First-time setup: `npm install && npx playwright install chromium`.
- **Always check mobile** (≤ 390px wide): nav collapses (the `<ul>` is hidden
  under 768px), the carousel drops to one screenshot, and cards/grids stack.

## Deployment

- **Source:** `main` branch, repo root, via GitHub Pages.
- **Custom domain:** lilo-labs.com — configured by the **`CNAME`** file, which
  must contain the single line `lilo-labs.com`. **Don't delete or change it** or
  the custom domain breaks.
- **HTTPS:** enabled (GitHub Pages default).
- **Auto-deploy:** pushing to `main` redeploys within a minute or two.

## Privacy and Legal

- **Site itself collects no user data directly**; Google Analytics/Firebase may
  collect analytics. Philosophy is privacy-first / data-minimal.
- **Privacy policy:** `privacypolicy.html`. Contact email across the site is
  **hello@lilo-labs.com** (keep `contact.html` link text and `mailto:` in sync).

## Conventions for AI Assistants

### Do
- ✅ Keep it simple — plain HTML/CSS/JS, no frameworks or build pipeline.
- ✅ Reuse tokens and component classes; put shared styles in `base`/`shared`.
- ✅ Treat the studio as multi-app — don't reframe the site around one product.
- ✅ Use PNG for screenshots, stored per app in `images/<app-name>/`.
- ✅ Test on mobile width; run `npm test` after carousel/layout changes.
- ✅ Update `howitworks.md` and keep app/status facts accurate.
- ✅ Ask before deleting files; keep any secrets out of git.

### Don't
- ❌ Add React/Vue/etc., a CSS preprocessor, or a build step for the site.
- ❌ Use inline `style=""` or hardcoded hex values — use tokens/classes.
- ❌ Reintroduce the old dark single-page TextTutor design.
- ❌ Modify the Google Analytics snippet without permission.
- ❌ Delete or edit `CNAME` (custom domain).
- ❌ Switch to custom web fonts (system stack is intentional).
- ❌ Use JPEG for screenshots.

---

**Last updated**: 2026-06-30
**Maintained by**: AI assistants working with Lilo Labs
**See also**: `howitworks.md` for the detailed maintenance guide.
