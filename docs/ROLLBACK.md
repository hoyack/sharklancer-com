# Rollback

1. In Netlify, open Deploys and select the last known-good production deploy.
2. Publish that deploy atomically; do not change DNS for an application regression.
3. Re-run homepage, legal-route, CTA, canonical, TLS, and header checks.
4. If the failure is DNS/TLS-related, CTO restores only the recorded web-routing values from the pre-change snapshot; never overwrite MX/TXT/DKIM/DMARC.
5. Document incident time, bad deploy ID, restored deploy ID, checks, owner, and follow-up.
