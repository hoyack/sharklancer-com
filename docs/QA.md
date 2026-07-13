# QA evidence

Executed July 13, 2026 against commit candidate on `feat/production-mvp`.

## Static and browser gates

- `npm run validate`: PASS — 4 HTML pages, all local references, and 6 locked product requirements.
- `npm test` local: PASS — 12/12 Playwright checks across desktop Chromium and an iPhone 13 viewport.
- `BASE_URL=https://sharklancer-com-preview.malleable-tracker.workers.dev npm test`: PASS — 12/12 preview checks with zero page or console errors.
- Preview route probe: HTTPS 200 for `/`, `/privacy/`, `/terms/`, `/disclosure/`, `/robots.txt`, and `/sitemap.xml`.
- `npm audit --audit-level=moderate`: PASS — 0 known vulnerabilities.

## Lighthouse

`npm run lighthouse` (local production artifact):

- Performance: 100
- Accessibility: 100
- Best practices: 100
- SEO: 100

Machine-readable report: `docs/lighthouse.json`.

## Visual QA

- Desktop screenshot: `docs/screenshots/home-desktop.png`
- Mobile screenshot: `docs/screenshots/home-mobile.png`
- Visual inspection: no overlap or clipping at desktop or mobile; radar asset remains visible; CTA hierarchy is prominent; legal and ownership links are legible.

## Product boundary checks

- One H1.
- Primary CTA: “Book a Thunderstaff pilot call.”
- Attribution includes `utm_source=sharklancer`; click events carry `source=sharklancer` and `offer=thunderstaff`.
- Thunderstaff is the product; Hoyack is the fulfiller.
- Marketplace/staffing/second-pricing framing appears only in explicit “not” disclosure.
- © 2026 Hoyack is present.
