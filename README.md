# Sharklancer

Production static site for [sharklancer.com](https://sharklancer.com): the Thunderstaff-aligned inbound front door operated by Hoyack.

## Product boundary

Sharklancer routes qualified inbound interest to a Thunderstaff pilot conversation. Thunderstaff is the managed AI automation product; Hoyack delivers the work. Sharklancer is not a talent marketplace, staffing roster, or separate pricing stack.

## Local development

```bash
npm ci
npm run serve
# open http://127.0.0.1:4173
```

## Verification

```bash
npm run validate
npx playwright install chromium
npm test
npm run lighthouse
```

## Deploy

Netlify runs `npm run build` and publishes the generated `dist/` directory. See `docs/DEPLOYMENT.md`, `docs/MONITORING.md`, and `docs/ROLLBACK.md`. No secrets are required to render the site. Optional analytics environment variable names are documented in `.env.example`.

## Ownership

© 2026 Hoyack. See `docs/ASSET-PROVENANCE.md` for asset provenance.
