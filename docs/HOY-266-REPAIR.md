# HOY-266 repair handoff

Sharklancer
- Base: feat/production-mvp at 4a3df59. Does not merge the separate imagery branch; keep that integration decision separate from this route repair.
- Replaced redirect-only /book with deployable /book/index.html; homepage CTAs point to /book/. Legacy /book resolves via directory routing. Included route in build and removed broken-link validator exemption.
- Booking page exposes existing attributed Calendly destination and email fallback; booking is not represented as confirmed. Calendly destination returned HTTP 200 during a read-only check; no appointment created.
- npm test -- --workers=2 passed: 14 desktop/mobile cases, five HTML pages validated in source and dist. New click-through regression failed on 404 before repair and passes after. Axe checks on home/book at 1440/390: no A/AA violations, overflow, or failed local resources.

## Release status
Branch implementation only. No merge, production deploy, DNS change, or hosted form submission was performed. Local tests cannot prove Netlify detection, acceptance, notification, newsletter enrollment, or checklist fulfillment. Native forms MUST NOT be deployed to the existing plain static K3s host.

CTO owns the unblock: arrange authorized Netlify preview access with automatic form detection, deploy these reviewed SHAs to non-production previews, submit uniquely tagged synthetic requests, and record form IDs/submission IDs plus dashboard/API readback and success-route evidence. Growth/Revenue Operations owns downstream notification and fulfillment proof.

The runtime exposes no usable Netlify credential; Paperclip connection search returned HTTP 401 (missing runtime-tools token). No credentials were requested in comments or exposed.

## Evidence
Screenshots: docs/screenshots/hoy-266/ (desktop 1440 and mobile 390). Raw browser/a11y results and cross-property native-form audit: /home/hoyack/paperclip-work/HOY-266/qa/.

Other sites were audited, not modified: Montgomery Hoyack, TX Pentest and ScrapeToken native markup passes static detection requirements. TX Pentest publishes the repo root and has a desktop nav CTA contrast failure; ScrapeToken has an eyebrow contrast failure at both widths. Netlify-hosted acceptance is unproven for every audited form.
