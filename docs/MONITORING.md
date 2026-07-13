# Monitoring

## Checks

- Every 5 minutes: HTTPS 200 on `/`; trusted certificate; body contains `Book a Thunderstaff pilot call`.
- Daily: `/privacy/`, `/terms/`, `/disclosure/`, `/robots.txt`, and `/sitemap.xml` return 200.
- Weekly: Calendly `/book` redirect resolves; Thunderstaff and Hoyack links respond; console remains clean at desktop/mobile.

## Alerts

Alert the site owner for two consecutive failures, certificate expiry under 21 days, unexpected canonical/redirect changes, or missing CTA. Escalate immediately if the domain serves unrelated content.
