# Netlify deployment runbook

## Preflight

1. PR approved by CMO/CRO/CTO; CI green.
2. Snapshot current DNS records, especially MX, TXT, SPF, DKIM, and DMARC.
3. Confirm Netlify team/site owner and rollback operator.
4. `npm ci && npm test && npm run lighthouse`.

## Deploy

1. Import `hoyack/sharklancer-com` into Netlify.
2. Production branch: `main`; build command: `npm run build`; publish directory: `dist`.
3. Attach `sharklancer.com` and `www.sharklancer.com` only after preview QA.
4. Change only web-routing records approved by CTO. Preserve all mail and verification records.
5. Wait for trusted TLS, then verify apex and www behavior, headers, canonical, sitemap, CTA redirect, and analytics decision.

## Form and analytics proof

This MVP uses Calendly as the conversion endpoint and no local collection form. Verify a test booking reaches the approved calendar and retains UTMs. If analytics is enabled, capture one consent-compliant event in the provider dashboard.

## Closure evidence

Record deploy ID, commit SHA, production URL, DNS before/after snapshot, trusted HTTPS result, CTA test, monitoring check, and rollback target on the Paperclip issue.
