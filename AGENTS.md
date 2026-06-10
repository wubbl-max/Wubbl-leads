# AGENTS.md — LinkedIn Prospecting Tool

## Project Purpose
Three standalone HTML tools that help a design/branding/web studio find qualified leads on LinkedIn. The human sweeps LinkedIn manually; the tools score and track.

## HARD CONSTRAINTS — Never violate these

- NEVER log into LinkedIn
- NEVER automate any action on LinkedIn (no Playwright, Puppeteer, fetch, or any browser automation)
- NEVER scrape LinkedIn posts programmatically
- The browser agent MAY visit a prospect's own product/company website for teardown research ONLY
- All three HTML tools are purely local — no server, no external API calls except future opt-in comment generation

## Tech Stack
- Vanilla HTML/CSS/JS only
- No frameworks (no React, Vue, etc.)
- No build step
- localStorage for persistence
- `config.js` is the single source of truth — all strings and weights live there

## The 23 Boolean Search Strings

Paste into LinkedIn → Posts tab → sort by Latest.

### Tier 1 — Hottest Intent (act within 2hrs)
1. ("hiring" OR "looking for") AND ("senior product designer" OR "lead product designer") AND ("SaaS" OR "fintech")
2. "we're hiring" AND ("product designer" OR "UX designer") AND ("founding" OR "first design hire")
3. ("raised our seed" OR "closed our Series A" OR "announcing our seed round") AND ("SaaS" OR "fintech" OR "B2B")
4. ("new brand" OR "rebranding" OR "brand refresh") AND ("startup" OR "SaaS" OR "fintech") AND ("launched" OR "just dropped" OR "revealed")
5. ("new website" OR "website redesign" OR "site is live") AND ("startup" OR "B2B") AND ("just launched" OR "went live" OR "shipped")
6. ("hiring" OR "looking for") AND ("brand designer" OR "visual designer" OR "web designer") AND ("startup" OR "SaaS")

### Tier 2 — Strong Signal (offer a teardown)
7. ("activation" OR "onboarding drop-off" OR "churn") AND ("struggling" OR "fixing" OR "rebuilding")
8. ("redesigning our product" OR "revamping our UX" OR "product redesign") AND ("startup" OR "SaaS")
9. ("design agency" OR "freelance designer" OR "design partner") AND ("recommendations" OR "anyone know" OR "suggestions")
10. ("design system" OR "design tokens") AND ("building" OR "need help" OR "hiring")
11. ("launching soon" OR "pre-launch" OR "MVP") AND ("design help" OR "designer" OR "UX")
12. ("technical founders" OR "engineering-led") AND ("design" OR "UX") AND ("need" OR "looking")
13. ("website" OR "landing page") AND ("converting" OR "bounce rate" OR "not converting") AND ("help" OR "anyone" OR "advice")
14. ("brand identity" OR "logo" OR "visual identity") AND ("need" OR "looking for" OR "recommendations") AND ("startup" OR "founder")
15. ("no designer" OR "without a designer" OR "design is a mess") AND ("startup" OR "SaaS")
16. ("Webflow" OR "Framer" OR "website builder") AND ("need help" OR "looking for" OR "hire") AND ("startup" OR "founder")

### Tier 3 — Geo-Targeted
17. ("raised" OR "funding") AND ("London" OR "Singapore" OR "Switzerland" OR "Germany") AND ("SaaS" OR "fintech")
18. ("raised" OR "seed" OR "Series A") AND ("Zurich" OR "Berlin" OR "Frankfurt" OR "Singapore") AND ("SaaS" OR "fintech")
19. ("hiring designer" OR "design hire") AND ("London" OR "Singapore" OR "Switzerland" OR "Germany")
20. ("brand" OR "website") AND ("redesign" OR "refresh") AND ("London" OR "Singapore" OR "Zurich" OR "Berlin")

### Tier 4 — Broad Intent (monitor weekly)
21. ("fractional design" OR "design partner" OR "design as a service") AND ("startup" OR "founder")
22. ("website agency" OR "branding agency") AND ("recommendations" OR "avoid" OR "disappointed") AND ("startup")
23. ("product-led growth" OR "PLG") AND ("design" OR "UX" OR "onboarding") AND ("need" OR "help" OR "building")

## ICP Scoring Weights

| Signal | Weight |
|---|---|
| Hiring designer / design role mentioned | +25 |
| Funding announced | +20 |
| Founder / C-suite is the poster | +15 |
| SaaS / fintech / B2B vertical mentioned | +15 |
| Branding / website / redesign intent | +10 |
| Geo match (London, Singapore, Switzerland, Germany, Dubai, Bangalore, Pune, Lagos, Nairobi, Cairo) | +10 |
| Pain language (struggling, no designer, mess, drop-off) | +5 |

Qualified threshold: ≥ 60

## Geo Targets
London, Singapore, Switzerland, Germany, Zurich, Berlin, Frankfurt, Dubai, Bangalore, Pune, Lagos, Nairobi, Cairo

## Verified Proof Points
<!-- FILL IN BEFORE FIRST USE: add 3-5 specific client results, e.g. "helped X raise $Xm with rebrand" -->

## PRIME→PIN→BOUND→FORCE (Future Mission 4 — comment drafting)
- PRIME: open with the prospect's exact pain language
- PIN: name the specific thing you noticed in their post
- BOUND: one relevant proof point only
- FORCE: a single low-friction CTA

## Continuous Improvement
- config.js is the ONLY file to edit when adding/changing/killing strings
- Kill strings with <60% ICP match rate at day 5
- Add new keywords discovered in real posts to config.js immediately
