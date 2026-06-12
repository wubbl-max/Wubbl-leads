# LinkedIn Prospecting Tool — Design Spec
**Date:** 2026-06-10
**Status:** Approved

---

## Overview

A set of three standalone HTML tools (+ one shared config) that help a design/branding/web studio find qualified leads on LinkedIn without automating any LinkedIn interaction. The human sweeps LinkedIn manually (5 min/day); the tools handle scoring and pipeline tracking.

**Hard constraints (enforced in AGENTS.md):**
- Agent never logs into or automates actions on LinkedIn
- No Playwright, Puppeteer, or any browser automation against LinkedIn
- Browser agent may only visit a prospect's own product/company site for teardown research
- Never LinkedIn itself

---

## Project Structure

```
linkedin-prospecting-tool/
├── AGENTS.md
├── config.js
├── search-launcher.html
├── lead-scorer.html
└── pipeline-tracker.html
```

---

## config.js

Single source of truth loaded by all three HTML files. Contains:
- 23 Boolean search strings (tiered)
- ICP scoring weights
- Geo targets
- Proof points placeholder

---

## The 23 Boolean Search Strings

### Tier 1 — Hottest Intent (act within 2hrs)

1. `("hiring" OR "looking for") AND ("senior product designer" OR "lead product designer") AND ("SaaS" OR "fintech")`
2. `"we're hiring" AND ("product designer" OR "UX designer") AND ("founding" OR "first design hire")`
3. `("raised our seed" OR "closed our Series A" OR "announcing our seed round") AND ("SaaS" OR "fintech" OR "B2B")`
4. `("new brand" OR "rebranding" OR "brand refresh") AND ("startup" OR "SaaS" OR "fintech") AND ("launched" OR "just dropped" OR "revealed")`
5. `("new website" OR "website redesign" OR "site is live") AND ("startup" OR "B2B") AND ("just launched" OR "went live" OR "shipped")`
6. `("hiring" OR "looking for") AND ("brand designer" OR "visual designer" OR "web designer") AND ("startup" OR "SaaS")`

### Tier 2 — Strong Signal (offer a teardown)

7. `("activation" OR "onboarding drop-off" OR "churn") AND ("struggling" OR "fixing" OR "rebuilding")`
8. `("redesigning our product" OR "revamping our UX" OR "product redesign") AND ("startup" OR "SaaS")`
9. `("design agency" OR "freelance designer" OR "design partner") AND ("recommendations" OR "anyone know" OR "suggestions")`
10. `("design system" OR "design tokens") AND ("building" OR "need help" OR "hiring")`
11. `("launching soon" OR "pre-launch" OR "MVP") AND ("design help" OR "designer" OR "UX")`
12. `("technical founders" OR "engineering-led") AND ("design" OR "UX") AND ("need" OR "looking")`
13. `("website" OR "landing page") AND ("converting" OR "bounce rate" OR "not converting") AND ("help" OR "anyone" OR "advice")`
14. `("brand identity" OR "logo" OR "visual identity") AND ("need" OR "looking for" OR "recommendations") AND ("startup" OR "founder")`
15. `("no designer" OR "without a designer" OR "design is a mess") AND ("startup" OR "SaaS")`
16. `("Webflow" OR "Framer" OR "website builder") AND ("need help" OR "looking for" OR "hire") AND ("startup" OR "founder")`

### Tier 3 — Geo-Targeted

17. `("raised" OR "funding") AND ("London" OR "Singapore" OR "Switzerland" OR "Germany") AND ("SaaS" OR "fintech")`
18. `("raised" OR "seed" OR "Series A") AND ("Zurich" OR "Berlin" OR "Frankfurt" OR "Singapore") AND ("SaaS" OR "fintech")`
19. `("hiring designer" OR "design hire") AND ("London" OR "Singapore" OR "Switzerland" OR "Germany")`
20. `("brand" OR "website") AND ("redesign" OR "refresh") AND ("London" OR "Singapore" OR "Zurich" OR "Berlin")`

### Tier 4 — Broad Intent (monitor weekly)

21. `("fractional design" OR "design partner" OR "design as a service") AND ("startup" OR "founder")`
22. `("website agency" OR "branding agency") AND ("recommendations" OR "avoid" OR "disappointed") AND ("startup")`
23. `("product-led growth" OR "PLG") AND ("design" OR "UX" OR "onboarding") AND ("need" OR "help" OR "building")`

---

## ICP Scoring Weights

Keyword-based scoring, no API required. Max score: 100.

| Signal | Weight |
|---|---|
| Hiring designer / design role mentioned | +25 |
| Funding announced | +20 |
| Founder / C-suite is the poster | +15 |
| SaaS / fintech / B2B vertical mentioned | +15 |
| Branding / website / redesign intent | +10 |
| Geo match (London, Singapore, Switzerland, Germany, Dubai, Bangalore, Pune, Lagos, Nairobi, Cairo) | +10 |
| Pain language (struggling, no designer, mess, drop-off) | +5 |

**Qualified threshold:** ≥ 60 → log to pipeline. < 60 → skip.

---

## Mission 1 — search-launcher.html

A static HTML page with all 23 strings rendered as pre-encoded `linkedin.com/search/results/content/?keywords=...&sortBy=date_posted` links.

- Grouped by tier (Tier 1 → Tier 4)
- Daily rotation: Tier 1 strings highlighted as "run today"
- Tap any link → LinkedIn opens in new tab, sorted by Latest
- No data stored, no API, pure HTML

---

## Mission 2 — lead-scorer.html

Paste a LinkedIn post into a textarea → instant ICP score.

- Scoring is client-side keyword matching against `config.js` weights
- Output: score out of 100, breakdown of which signals fired, qualified/skip verdict
- No API call required for scoring
- Future: API call for comment/DM generation (not in scope now — placeholder only)

---

## Mission 3 — pipeline-tracker.html

Manual lead log stored in `localStorage`.

**Table columns:**
| String # | Post URL | Poster Title | ICP Score | Status | Date Added |

**Status flow:** `hit` → `scored` → `commented` → `DM` → `call` → `closed` / `dead`
- Status is a tap-through dropdown, not enforced sequence

**Weekly review view:**
- Per-string stats: hit count, % scored ≥60
- Strings with <60% ICP rate at day 5 flagged red

**Export:** single button exports table as CSV

---

## AGENTS.md — Contents Outline

1. Project overview and purpose
2. Hard constraints (no LinkedIn automation, ever)
3. All 23 Boolean strings with tier labels
4. ICP scoring weights table
5. Geo targets list
6. Verified proof points ← **PLACEHOLDER: fill in before first use**
7. PRIME→PIN→BOUND→FORCE structure (documented for future Mission 4)
8. Tech stack: vanilla HTML/CSS/JS, no frameworks, no build step, localStorage only

---

## Continuous Improvement

The 23 strings and ICP scoring weights are a starting point, not fixed. As you run sweeps:

- Track which strings yield ≥60% ICP match in the pipeline tracker
- Kill strings below threshold at day 5 review
- Replace killed strings with new variants — update `config.js` only, all three tools update automatically
- New keywords, pain phrases, or intent signals discovered in real posts should be added to `config.js` immediately
- The spec itself should be updated when string count or scoring weights change materially

**Rule:** `config.js` is the only file that needs editing to improve search quality. Never hardcode strings into the HTML files.

---

## What Is Out of Scope (Phase 1)

- Comment drafting
- DM generation
- Any LinkedIn automation
- Backend / server
- User accounts or login
