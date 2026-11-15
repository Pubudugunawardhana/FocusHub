# Security Policy

## Supported versions

Security fixes are made on the latest code in the `main` branch. Older releases are not patched separately.

| Version | Supported |
|---|:---:|
| Latest `main` | ✅ |
| Older releases | ❌ |

## Reporting a vulnerability

**Please do not report security problems in public GitHub issues, discussions or pull requests.** A public report lets others misuse the problem before it is fixed.

Report it privately instead:

1. Go to the **[Security tab](https://github.com/Pubudugunawardhana/FocusHub/security)** of this repository.
2. Click **Report a vulnerability**.
3. Fill in the form and submit it. Only the maintainer can see the report.

Please include:

- What the problem is and what an attacker could do with it
- Steps to reproduce it (URLs, requests, screenshots or a short proof of concept)
- Which part of the app is affected (for example login, password reset, bundle passwords, share links or the metadata fetcher)
- Any idea you have for a fix

## What to expect

- You will get a reply within **7 days** confirming the report was received.
- The problem will be investigated, and you will be kept updated on progress.
- After a fix is released, you will be credited in the release notes if you want to be.

Please give reasonable time for a fix before sharing details publicly.

## Scope

In scope:

- Authentication and sessions (login, registration, password reset codes)
- Access to another user's collections, videos, notes or bundles
- Bypassing a bundle password or self-destruct timer
- Server-side request forgery through link metadata fetching
- Injection or cross-site scripting

Out of scope:

- Problems in third-party services (Neon, Vercel, YouTube) — report those to the vendor
- Denial of service through high request volume
- Findings that need a compromised device or browser
- Missing security headers with no demonstrated impact

Thank you for helping keep FocusHub and its users safe.
