# How It Works — Lilo Labs Website

A quick guide to how this static marketing site is put together and how to maintain it.

## Big picture

Plain HTML5 + CSS, no build step, hosted on GitHub Pages at https://lilo.ventures.
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

## Testing changes

Open the page directly (`open apps.html`) or render headlessly to check layout:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --window-size=1300,2400 \
  --screenshot=out.png "file://$PWD/apps.html"
```

Always check the mobile view (≤ 390px wide): the app header should center and the
screenshots should collapse to one column.
