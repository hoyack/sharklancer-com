# Architecture and security handoff

The MVP is static HTML/CSS/JS on Netlify (Path A). There is no application server, database, authentication, or secret required for rendering. Conversion redirects to Calendly; Thunderstaff and Hoyack are explicit external destinations.

Security controls in `netlify.toml`: CSP, frame denial, MIME sniffing prevention, strict referrer policy, disabled browser capabilities, and immutable asset caching. Inline scripts/styles are avoided so the CSP can remain strict. Legal pages disclose ownership and third-party routing.

CTO review points: CSP compatibility with any approved analytics provider, Netlify account least privilege, deploy-log retention, domain ownership, DNS/mail-record preservation, trusted TLS, monitoring owner, and rollback operator.
