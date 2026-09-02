# Security Policy

Please report vulnerabilities privately through GitHub Security Advisories instead of opening a public issue.

The template treats browser input, API payloads and AI output as untrusted. Markdown is rendered without raw HTML and sanitized with DOMPurify; external redirects are rejected; production Mock and PWA API caching are disabled by default. Never expose provider keys through `VITE_*` variables.

Applications generated from this template remain responsible for backend authorization, CSP, CSRF protection, rate limiting, secure cookies, dependency review and platform-specific WebView controls.
