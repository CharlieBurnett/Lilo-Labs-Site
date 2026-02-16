---
description: 
alwaysApply: true
---

# CLAUDE.md - Lilo Labs Website

## Project Overview

This is a static marketing website for **Lilo Labs** (Lilo, LLC), showcasing the upcoming iOS app **TextTutor**. The site is a simple, elegant landing page with app screenshots and a privacy policy.

**Live Site**: https://lilo.ventures (hosted on GitHub Pages)
**Repository**: CharlieBurnett/Lilo-Labs-Site
**Company**: Lilo, LLC
**Product**: TextTutor for iOS - A language learning application

## Repository Structure

```
Lilo-Labs-Site/
├── index.html              # Main landing page
├── privacypolicy.html      # Privacy policy page
├── CNAME                   # Custom domain configuration (lilo.ventures)
├── .gitignore             # macOS-specific ignore patterns
├── images/
│   ├── Lilo Logo v2.png   # Company logo (4KB)
│   ├── Screenshot 0.png   # App screenshot (1.1MB)
│   ├── Screenshot 1.png   # App screenshot (1.3MB)
│   └── Screenshot 2.png   # App screenshot (812KB)
└── CLAUDE.md              # This file
```

## Technology Stack

### Core Technologies
- **Pure HTML5** - No templating engines or frameworks
- **Inline CSS** - All styles embedded in `<style>` tags
- **No JavaScript framework** - Only Google Analytics script
- **No build tools** - Direct HTML editing, no compilation needed
- **GitHub Pages** - Static site hosting

### Third-Party Services
- **Google Analytics** (ID: G-G1TWRNQ451) - Usage tracking
- **Firebase** - Analytics backend (mentioned in privacy policy)

### Browser Features Used
- CSS Grid (`grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`)
- Flexbox for centering
- Responsive viewport units (`vw`, `vh`)
- System font stack for performance

## Design System

### Color Palette
```css
Background:         #1f2121  /* Dark gray background */
Container:          #434349  /* Medium gray card */
Primary text:       #d5e1f4  /* Light blue-gray */
Secondary text:     #babfc5  /* Medium gray */
Body text:          #cbd0d6  /* Light gray */
Accent/Coming soon: #86798d  /* Purple-gray */
Screenshot bg:      #a592ae  /* Light purple */
```

### Typography
- **Font Family**: System fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)
- **H1 (Lilo Labs)**: 5rem, #d5e1f4
- **H2 (Become Fluent)**: 1.8rem, italic, #babfc5
- **Body Text**: 1.2rem, #cbd0d6
- **Coming Soon**: 1.2rem, italic, #86798d

### Responsive Design
- **Container**: `max-width: 80vw`, `min-width: 400px`
- **Screenshots**: CSS Grid with `auto-fit` and `minmax(200px, 1fr)`
- **Mobile-first**: Viewport meta tag with `width=device-width, initial-scale=1.0`
- **Spacing**: 2rem margins, 1.5rem grid gaps

## Development Workflow

### Making Changes

1. **Edit HTML files directly** - No build step required
2. **Test locally** - Open `index.html` in a browser
3. **Commit changes** with descriptive messages
4. **Push to designated branch** (usually `claude/` prefixed branches)
5. **GitHub Pages auto-deploys** from the main branch

### Git Conventions

**Commit Message Patterns** (from recent history):
- "PNG fix from JPEG" - Image format corrections
- "Privacy policy added, screenshots updated" - Multi-file updates
- "Update Screenshot X.png" - Asset updates
- "screenshots are centered in mobile views" - CSS/layout fixes
- "Fix logo not showing up" - Bug fixes

**Branch Strategy**:
- Claude AI assistants work on `claude/` prefixed branches
- Main branch serves the live site via GitHub Pages
- Direct pushes to designated feature branches

### Common Tasks

#### Updating Screenshots
1. Replace PNG files in `images/` directory
2. Ensure consistent naming: `Screenshot 0.png`, `Screenshot 1.png`, etc.
3. Use PNG format (not JPEG) for quality
4. Optimize file sizes when possible (currently 800KB-1.3MB each)
5. Maintain 3 screenshots for grid layout consistency

#### Modifying Styles
- Edit the `<style>` block in `index.html` (lines 18-102)
- No CSS preprocessors - direct CSS only
- Test responsive behavior at different viewport sizes
- Use existing color variables from palette above

#### Content Updates
- **Main heading**: Edit the `<img>` logo source or add text
- **Tagline**: Modify "Become Fluent" (line 108)
- **App name**: Change "TextTutor for iOS" (line 110)
- **Coming soon text**: Edit line 109

#### Privacy Policy Changes
- Edit `privacypolicy.html` directly
- Update "Last updated" date (line 10)
- Add third-party service links to the `<ul>` list (lines 21-23)

## Key Conventions for AI Assistants

### Code Style
1. **Indentation**: 4 spaces (consistent throughout)
2. **HTML**: Semantic tags where appropriate
3. **CSS**: Single-line simple properties, multi-line for complex rules
4. **Inline styles**: Use sparingly for one-off adjustments (see screenshots)
5. **Comments**: Minimal - code should be self-documenting

### File Handling
- **Always use PNG** for images (not JPEG)
- **Preserve file naming** conventions (e.g., "Screenshot 0.png" not "screenshot-0.png")
- **Keep images in `/images` directory**
- **Don't add build files** - this is intentionally a simple static site

### Content Guidelines
- **Tone**: Professional but friendly, minimalist
- **Privacy-first**: The privacy policy emphasizes data minimalism ("We do not want your data")
- **Mobile focus**: TextTutor is an iOS app, so mobile presentation is critical
- **Visual emphasis**: Screenshots are the primary content after the logo

### Google Analytics
- **Tracking ID**: G-G1TWRNQ451
- **Implementation**: Standard gtag.js script in `<head>`
- **Placement**: Before other meta tags (lines 5-13)
- **Don't modify** unless explicitly requested

### Responsive Behavior
- **Mobile breakpoint**: Grid auto-adjusts with `minmax(200px, 1fr)`
- **Container scaling**: 80vw max, 400px min, centered with flexbox
- **Screenshot layout**: 3-column grid on desktop, single column on mobile
- **Font sizes**: Already optimized (5rem h1 scales well)

## Testing Checklist

When making changes, verify:
- [ ] Page renders correctly in mobile view (< 768px width)
- [ ] Screenshots display properly in grid layout
- [ ] Logo loads correctly
- [ ] Colors match the design system
- [ ] Text is readable with sufficient contrast
- [ ] Links work (privacy policy references)
- [ ] Google Analytics script is intact
- [ ] No console errors in browser DevTools
- [ ] CNAME file unchanged (unless domain changes)
- [ ] .gitignore includes macOS artifacts

## Common Issues and Solutions

### Images Not Showing
- **Cause**: Case-sensitive file paths or incorrect extensions
- **Solution**: Verify exact filename in `images/` directory, use PNG format
- **Example**: Commit "Trying to fix images not snowing" (typo in commit) - 4bdee9f

### Layout Breaking on Mobile
- **Cause**: Fixed widths or missing viewport meta tag
- **Solution**: Use responsive units (vw, %, auto-fit), ensure viewport meta present
- **Example**: Commit "screenshots are centered in mobile views" - dbc571d

### Logo Not Displaying
- **Cause**: Incorrect path or file format issues
- **Solution**: Verify path is `images/Lilo Logo v2.png` exactly
- **Example**: Commit "Fix logo not showing up" - 64823da

## Deployment

### GitHub Pages Configuration
- **Source**: Main branch, root directory
- **Custom domain**: lilo.ventures (configured via CNAME)
- **HTTPS**: Enabled (GitHub Pages default)
- **Auto-deploy**: Pushes to main trigger automatic deployment

### Domain Setup
- **CNAME record**: Points lilo.ventures to GitHub Pages
- **File**: `CNAME` contains single line: `lilo.ventures`
- **Don't delete** this file or the custom domain will break

## Privacy and Legal

### Data Collection
- **User data**: None collected directly by the site
- **Third-party**: Google Analytics/Firebase may collect analytics data
- **Philosophy**: "We do not want your data" - privacy-first approach

### Privacy Policy
- **Location**: `/privacypolicy.html`
- **Last updated**: 2/17/2025
- **Key point**: No direct data collection, third-party services listed with links

## Future Considerations

### When the App Launches
- Update "Coming soon" text to launch announcement
- Consider adding App Store badge/link
- May need download/CTA buttons

### Potential Enhancements
- Add favicon (currently not present)
- Add Open Graph meta tags for social sharing
- Consider adding robots.txt for SEO
- Add Apple touch icon for iOS bookmarking
- Implement dark/light mode toggle (currently fixed dark theme)

### Performance
- **Current**: All assets load from repository (no CDN)
- **Images**: Could be optimized further (1.3MB max is acceptable but improvable)
- **CSS**: Could be external file if site grows (currently 84 lines inline)

## Quick Reference

### File Locations
```
Logo:              images/Lilo Logo v2.png
Screenshots:       images/Screenshot [0-2].png
Main page styles:  index.html lines 18-102
Google Analytics:  index.html lines 5-13
Privacy policy:    privacypolicy.html
Domain config:     CNAME
```

### Important Line Numbers
```
index.html:
  - Google Analytics: 5-13
  - CSS styles: 18-102
  - Logo: 106
  - Tagline: 108
  - App name: 110
  - Screenshots: 112-116

privacypolicy.html:
  - Last updated: 10
  - Third-party links: 21-23
```

### Colors Quick Reference
```
Dark bg:    #1f2121
Container:  #434349
Heading:    #d5e1f4
Subhead:    #babfc5
Body:       #cbd0d6
Accent:     #86798d
Photos bg:  #a592ae
```

## AI Assistant Guidelines

### When Working on This Project
1. **Read before modifying** - Always check current HTML before making changes
2. **Preserve simplicity** - Don't add frameworks, build tools, or over-engineer
3. **Match existing style** - Use the established color palette and spacing
4. **Test responsiveness** - Mobile view is critical for iOS app landing page
5. **Commit clearly** - Use descriptive messages like existing history
6. **PNG only** - Image format matters for this project
7. **Respect the vision** - This is intentionally minimal and elegant

### What NOT to Do
- ❌ Add React, Vue, or other frameworks
- ❌ Create separate CSS files without good reason
- ❌ Use JPEG for images
- ❌ Modify Google Analytics without permission
- ❌ Delete or modify CNAME file
- ❌ Add complex build pipelines
- ❌ Over-comment the HTML
- ❌ Change font to custom web fonts (system fonts intentional)

### Recommended Approach
- ✅ Keep it simple and maintainable
- ✅ Focus on visual polish and responsiveness
- ✅ Optimize images without changing format
- ✅ Use semantic HTML where beneficial
- ✅ Test on mobile viewport
- ✅ Follow existing naming conventions
- ✅ Commit frequently with clear messages
- ✅ Ask before major structural changes

---

**Last updated**: 2026-01-18
**Maintained by**: AI assistants working with Lilo Labs
**Questions**: Refer to recent commit history and existing code patterns
