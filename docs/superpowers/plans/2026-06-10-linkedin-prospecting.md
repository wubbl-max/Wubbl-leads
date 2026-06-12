# LinkedIn Prospecting Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build three standalone HTML tools (search launcher, ICP scorer, pipeline tracker) that help a design studio find qualified leads on LinkedIn without any LinkedIn automation.

**Architecture:** A shared `config.js` holds all 23 Boolean strings, ICP scoring weights, and geo targets. Three self-contained HTML files each load `config.js` via a `<script>` tag — no build step, no framework, no backend. Pipeline data lives in `localStorage`.

**Tech Stack:** Vanilla HTML/CSS/JS, localStorage, no dependencies, no build tooling.

---

## File Map

| File | Responsibility |
|---|---|
| `AGENTS.md` | Constraints and context for Antigravity/Codex agents |
| `config.js` | Single source of truth: 23 strings, scoring weights, geo targets |
| `search-launcher.html` | Pre-encoded LinkedIn search links grouped by tier |
| `lead-scorer.html` | Paste post text → ICP score + breakdown |
| `pipeline-tracker.html` | Manual lead log, localStorage, CSV export, day-5 kill flags |

---

## Task 1: Project scaffold + AGENTS.md

**Files:**
- Create: `AGENTS.md`
- Create: `config.js`

- [ ] **Step 1: Create the project root**

```bash
mkdir -p /Users/jayesh/Documents/linkedin-prospecting-tool
cd /Users/jayesh/Documents/linkedin-prospecting-tool
git init
```

- [ ] **Step 2: Write AGENTS.md**

Create `AGENTS.md` with the following content:

```markdown
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
```

- [ ] **Step 3: Write config.js**

Create `config.js`:

```js
const CONFIG = {
  strings: [
    // Tier 1 — Hottest Intent
    {
      id: 1,
      tier: 1,
      label: "Hiring product designer (SaaS/fintech)",
      query: '("hiring" OR "looking for") AND ("senior product designer" OR "lead product designer") AND ("SaaS" OR "fintech")',
    },
    {
      id: 2,
      tier: 1,
      label: "Founder hiring first designer",
      query: '"we\'re hiring" AND ("product designer" OR "UX designer") AND ("founding" OR "first design hire")',
    },
    {
      id: 3,
      tier: 1,
      label: "Fresh funding announced",
      query: '("raised our seed" OR "closed our Series A" OR "announcing our seed round") AND ("SaaS" OR "fintech" OR "B2B")',
    },
    {
      id: 4,
      tier: 1,
      label: "Brand launch / rebrand revealed",
      query: '("new brand" OR "rebranding" OR "brand refresh") AND ("startup" OR "SaaS" OR "fintech") AND ("launched" OR "just dropped" OR "revealed")',
    },
    {
      id: 5,
      tier: 1,
      label: "New website just launched",
      query: '("new website" OR "website redesign" OR "site is live") AND ("startup" OR "B2B") AND ("just launched" OR "went live" OR "shipped")',
    },
    {
      id: 6,
      tier: 1,
      label: "Hiring brand/visual/web designer",
      query: '("hiring" OR "looking for") AND ("brand designer" OR "visual designer" OR "web designer") AND ("startup" OR "SaaS")',
    },

    // Tier 2 — Strong Signal
    {
      id: 7,
      tier: 2,
      label: "Activation / churn pain",
      query: '("activation" OR "onboarding drop-off" OR "churn") AND ("struggling" OR "fixing" OR "rebuilding")',
    },
    {
      id: 8,
      tier: 2,
      label: "Product redesign intent",
      query: '("redesigning our product" OR "revamping our UX" OR "product redesign") AND ("startup" OR "SaaS")',
    },
    {
      id: 9,
      tier: 2,
      label: "Asking for design agency / partner recs",
      query: '("design agency" OR "freelance designer" OR "design partner") AND ("recommendations" OR "anyone know" OR "suggestions")',
    },
    {
      id: 10,
      tier: 2,
      label: "Design system need",
      query: '("design system" OR "design tokens") AND ("building" OR "need help" OR "hiring")',
    },
    {
      id: 11,
      tier: 2,
      label: "Pre-launch / MVP design help",
      query: '("launching soon" OR "pre-launch" OR "MVP") AND ("design help" OR "designer" OR "UX")',
    },
    {
      id: 12,
      tier: 2,
      label: "Tech founders with no design",
      query: '("technical founders" OR "engineering-led") AND ("design" OR "UX") AND ("need" OR "looking")',
    },
    {
      id: 13,
      tier: 2,
      label: "Website not converting",
      query: '("website" OR "landing page") AND ("converting" OR "bounce rate" OR "not converting") AND ("help" OR "anyone" OR "advice")',
    },
    {
      id: 14,
      tier: 2,
      label: "Brand identity / logo need",
      query: '("brand identity" OR "logo" OR "visual identity") AND ("need" OR "looking for" OR "recommendations") AND ("startup" OR "founder")',
    },
    {
      id: 15,
      tier: 2,
      label: "No designer pain language",
      query: '("no designer" OR "without a designer" OR "design is a mess") AND ("startup" OR "SaaS")',
    },
    {
      id: 16,
      tier: 2,
      label: "Webflow / Framer help needed",
      query: '("Webflow" OR "Framer" OR "website builder") AND ("need help" OR "looking for" OR "hire") AND ("startup" OR "founder")',
    },

    // Tier 3 — Geo-Targeted
    {
      id: 17,
      tier: 3,
      label: "Funding in London/SG/CH/DE",
      query: '("raised" OR "funding") AND ("London" OR "Singapore" OR "Switzerland" OR "Germany") AND ("SaaS" OR "fintech")',
    },
    {
      id: 18,
      tier: 3,
      label: "Seed/Series A in key cities",
      query: '("raised" OR "seed" OR "Series A") AND ("Zurich" OR "Berlin" OR "Frankfurt" OR "Singapore") AND ("SaaS" OR "fintech")',
    },
    {
      id: 19,
      tier: 3,
      label: "Designer hire in target geos",
      query: '("hiring designer" OR "design hire") AND ("London" OR "Singapore" OR "Switzerland" OR "Germany")',
    },
    {
      id: 20,
      tier: 3,
      label: "Brand/website redesign in target geos",
      query: '("brand" OR "website") AND ("redesign" OR "refresh") AND ("London" OR "Singapore" OR "Zurich" OR "Berlin")',
    },

    // Tier 4 — Broad Intent
    {
      id: 21,
      tier: 4,
      label: "Fractional design / design partner",
      query: '("fractional design" OR "design partner" OR "design as a service") AND ("startup" OR "founder")',
    },
    {
      id: 22,
      tier: 4,
      label: "Unhappy with agency",
      query: '("website agency" OR "branding agency") AND ("recommendations" OR "avoid" OR "disappointed") AND ("startup")',
    },
    {
      id: 23,
      tier: 4,
      label: "PLG + design need",
      query: '("product-led growth" OR "PLG") AND ("design" OR "UX" OR "onboarding") AND ("need" OR "help" OR "building")',
    },
  ],

  scoring: {
    hiringDesigner: {
      weight: 25,
      keywords: ["hiring", "looking for", "we need a designer", "design hire", "first design hire"],
      label: "Hiring designer / design role",
    },
    fundingAnnounced: {
      weight: 20,
      keywords: ["raised", "seed", "series a", "series b", "funding", "closed our", "announcing our"],
      label: "Funding announced",
    },
    founderPoster: {
      weight: 15,
      keywords: ["founder", "ceo", "cto", "co-founder", "chief", "president"],
      label: "Founder / C-suite poster",
    },
    icpVertical: {
      weight: 15,
      keywords: ["saas", "fintech", "b2b", "startup", "software", "tech startup"],
      label: "SaaS / fintech / B2B vertical",
    },
    designIntent: {
      weight: 10,
      keywords: ["rebrand", "redesign", "new website", "brand refresh", "visual identity", "webflow", "framer", "logo", "brand identity"],
      label: "Branding / website / redesign intent",
    },
    geoMatch: {
      weight: 10,
      keywords: ["london", "singapore", "switzerland", "germany", "zurich", "berlin", "frankfurt", "dubai", "bangalore", "pune", "lagos", "nairobi", "cairo"],
      label: "Geo match",
    },
    painLanguage: {
      weight: 5,
      keywords: ["struggling", "no designer", "without a designer", "design is a mess", "drop-off", "not converting", "bounce rate", "churn", "need help"],
      label: "Pain language",
    },
  },

  qualifiedThreshold: 60,

  tiers: {
    1: { label: "Tier 1 — Hottest Intent", action: "Comment within 2hrs" },
    2: { label: "Tier 2 — Strong Signal", action: "Offer a teardown" },
    3: { label: "Tier 3 — Geo-Targeted", action: "Comment within 2hrs" },
    4: { label: "Tier 4 — Broad Intent", action: "Monitor weekly" },
  },

  statuses: ["hit", "scored", "commented", "DM", "call", "closed", "dead"],
};
```

- [ ] **Step 4: Commit**

```bash
cd /Users/jayesh/Documents/linkedin-prospecting-tool
git add AGENTS.md config.js
git commit -m "feat: add AGENTS.md and config.js with 23 strings and ICP scoring"
```

---

## Task 2: search-launcher.html

**Files:**
- Create: `search-launcher.html`

- [ ] **Step 1: Write search-launcher.html**

Create `search-launcher.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LinkedIn Search Launcher</title>
  <script src="config.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f5f5f5; color: #1a1a1a; padding: 24px; }
    h1 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
    .subtitle { font-size: 13px; color: #666; margin-bottom: 24px; }
    .tier { margin-bottom: 32px; }
    .tier-header { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e0e0e0; }
    .tier-action { font-size: 11px; color: #0077b5; margin-left: 8px; font-weight: 500; }
    .string-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: white; border-radius: 8px; margin-bottom: 6px; border: 1px solid #e8e8e8; transition: border-color 0.15s; }
    .string-row:hover { border-color: #0077b5; }
    .string-row.today { border-left: 3px solid #0077b5; background: #f0f7ff; }
    .string-id { font-size: 11px; color: #aaa; min-width: 20px; }
    .string-label { flex: 1; font-size: 14px; }
    .string-row.today .string-label { font-weight: 600; }
    a.open-btn { font-size: 12px; color: white; background: #0077b5; padding: 5px 12px; border-radius: 5px; text-decoration: none; white-space: nowrap; }
    a.open-btn:hover { background: #005f8e; }
    .today-badge { font-size: 10px; background: #0077b5; color: white; padding: 2px 6px; border-radius: 10px; }
    .nav { display: flex; gap: 12px; margin-bottom: 24px; }
    .nav a { font-size: 13px; color: #0077b5; text-decoration: none; }
    .nav a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>LinkedIn Search Launcher</h1>
  <p class="subtitle">Tap any link → LinkedIn opens sorted by Latest. Highlighted = run today (Tier 1).</p>
  <nav class="nav">
    <a href="lead-scorer.html">→ Lead Scorer</a>
    <a href="pipeline-tracker.html">→ Pipeline Tracker</a>
  </nav>
  <div id="app"></div>

  <script>
    function encodeLinkedInURL(query) {
      return "https://www.linkedin.com/search/results/content/?keywords=" +
        encodeURIComponent(query) + "&sortBy=date_posted";
    }

    function isTodayTier(tier) {
      // Tier 1 and Tier 3 are daily; Tier 4 is weekly
      return tier === 1 || tier === 3;
    }

    const app = document.getElementById("app");
    const tierGroups = {};

    CONFIG.strings.forEach(s => {
      if (!tierGroups[s.tier]) tierGroups[s.tier] = [];
      tierGroups[s.tier].push(s);
    });

    Object.keys(tierGroups).sort().forEach(tier => {
      const t = CONFIG.tiers[tier];
      const div = document.createElement("div");
      div.className = "tier";
      div.innerHTML = `<div class="tier-header">${t.label}<span class="tier-action">${t.action}</span></div>`;

      tierGroups[tier].forEach(s => {
        const isToday = isTodayTier(Number(tier));
        const row = document.createElement("div");
        row.className = "string-row" + (isToday ? " today" : "");
        row.innerHTML = `
          <span class="string-id">${s.id}</span>
          <span class="string-label">${s.label}${isToday ? ' <span class="today-badge">Today</span>' : ""}</span>
          <a class="open-btn" href="${encodeLinkedInURL(s.query)}" target="_blank" rel="noopener">Open ↗</a>
        `;
        div.appendChild(row);
      });

      app.appendChild(div);
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

Open `search-launcher.html` in your browser. Check:
- All 23 links appear grouped by tier
- Tier 1 and Tier 3 rows are highlighted with blue left border
- Clicking "Open ↗" opens a LinkedIn search URL in a new tab
- Nav links to other tools are present

- [ ] **Step 3: Commit**

```bash
cd /Users/jayesh/Documents/linkedin-prospecting-tool
git add search-launcher.html
git commit -m "feat: add search-launcher.html with 23 pre-encoded LinkedIn search links"
```

---

## Task 3: lead-scorer.html

**Files:**
- Create: `lead-scorer.html`

- [ ] **Step 1: Write lead-scorer.html**

Create `lead-scorer.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lead Scorer</title>
  <script src="config.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f5f5f5; color: #1a1a1a; padding: 24px; max-width: 680px; }
    h1 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
    .subtitle { font-size: 13px; color: #666; margin-bottom: 20px; }
    .nav { display: flex; gap: 12px; margin-bottom: 24px; }
    .nav a { font-size: 13px; color: #0077b5; text-decoration: none; }
    .nav a:hover { text-decoration: underline; }
    textarea { width: 100%; height: 160px; padding: 12px; font-size: 14px; border: 1px solid #ddd; border-radius: 8px; resize: vertical; font-family: inherit; }
    textarea:focus { outline: none; border-color: #0077b5; }
    .controls { display: flex; gap: 10px; margin-top: 10px; margin-bottom: 20px; }
    button { padding: 9px 20px; font-size: 14px; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; }
    #score-btn { background: #0077b5; color: white; }
    #score-btn:hover { background: #005f8e; }
    #clear-btn { background: #eee; color: #444; }
    #clear-btn:hover { background: #ddd; }
    #result { display: none; }
    .score-box { padding: 20px; border-radius: 10px; margin-bottom: 16px; text-align: center; }
    .score-box.qualified { background: #e6f4ea; border: 2px solid #34a853; }
    .score-box.skip { background: #fce8e6; border: 2px solid #ea4335; }
    .score-number { font-size: 48px; font-weight: 800; }
    .score-box.qualified .score-number { color: #1e7e34; }
    .score-box.skip .score-number { color: #c5221f; }
    .score-verdict { font-size: 16px; font-weight: 600; margin-top: 4px; }
    .score-box.qualified .score-verdict { color: #1e7e34; }
    .score-box.skip .score-verdict { color: #c5221f; }
    .breakdown { background: white; border-radius: 8px; border: 1px solid #e0e0e0; overflow: hidden; }
    .breakdown-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #888; padding: 10px 14px; border-bottom: 1px solid #e0e0e0; }
    .signal-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; border-bottom: 1px solid #f0f0f0; }
    .signal-row:last-child { border-bottom: none; }
    .signal-row.fired { background: #f0f7ff; }
    .signal-label { font-size: 14px; }
    .signal-weight { font-size: 13px; font-weight: 600; }
    .signal-row.fired .signal-weight { color: #0077b5; }
    .signal-row:not(.fired) .signal-label { color: #bbb; }
    .signal-row:not(.fired) .signal-weight { color: #ddd; }
    .log-hint { margin-top: 14px; font-size: 13px; color: #666; text-align: center; }
    .log-hint a { color: #0077b5; text-decoration: none; }
    .log-hint a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Lead Scorer</h1>
  <p class="subtitle">Paste a LinkedIn post → instant ICP score.</p>
  <nav class="nav">
    <a href="search-launcher.html">← Search Launcher</a>
    <a href="pipeline-tracker.html">→ Pipeline Tracker</a>
  </nav>

  <textarea id="post-input" placeholder="Paste the LinkedIn post text here..."></textarea>
  <div class="controls">
    <button id="score-btn">Score Post</button>
    <button id="clear-btn">Clear</button>
  </div>

  <div id="result">
    <div id="score-box" class="score-box">
      <div id="score-number" class="score-number"></div>
      <div id="score-verdict" class="score-verdict"></div>
    </div>
    <div class="breakdown">
      <div class="breakdown-title">Signal Breakdown</div>
      <div id="breakdown-rows"></div>
    </div>
    <p class="log-hint">Qualified? <a href="pipeline-tracker.html">Log it in the Pipeline Tracker →</a></p>
  </div>

  <script>
    function scorePost(text) {
      const lower = text.toLowerCase();
      let total = 0;
      const results = [];

      Object.entries(CONFIG.scoring).forEach(([key, signal]) => {
        const fired = signal.keywords.some(kw => lower.includes(kw.toLowerCase()));
        results.push({ label: signal.label, weight: signal.weight, fired });
        if (fired) total = Math.min(100, total + signal.weight);
      });

      return { score: total, breakdown: results };
    }

    document.getElementById("score-btn").addEventListener("click", () => {
      const text = document.getElementById("post-input").value.trim();
      if (!text) return;

      const { score, breakdown } = scorePost(text);
      const qualified = score >= CONFIG.qualifiedThreshold;

      const scoreBox = document.getElementById("score-box");
      scoreBox.className = "score-box " + (qualified ? "qualified" : "skip");
      document.getElementById("score-number").textContent = score + "/100";
      document.getElementById("score-verdict").textContent = qualified
        ? "✓ Qualified — log to pipeline"
        : "✗ Skip";

      const rows = document.getElementById("breakdown-rows");
      rows.innerHTML = breakdown.map(s => `
        <div class="signal-row ${s.fired ? "fired" : ""}">
          <span class="signal-label">${s.label}</span>
          <span class="signal-weight">${s.fired ? "+" + s.weight : "—"}</span>
        </div>
      `).join("");

      document.getElementById("result").style.display = "block";
    });

    document.getElementById("clear-btn").addEventListener("click", () => {
      document.getElementById("post-input").value = "";
      document.getElementById("result").style.display = "none";
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

Open `lead-scorer.html`. Check:
- Pasting text with hiring/funding keywords scores ≥60 and shows green "Qualified"
- Pasting generic text scores low and shows red "Skip"
- Breakdown rows highlight fired signals in blue
- Clear button resets the form

- [ ] **Step 3: Commit**

```bash
cd /Users/jayesh/Documents/linkedin-prospecting-tool
git add lead-scorer.html
git commit -m "feat: add lead-scorer.html with keyword ICP scoring"
```

---

## Task 4: pipeline-tracker.html

**Files:**
- Create: `pipeline-tracker.html`

- [ ] **Step 1: Write pipeline-tracker.html**

Create `pipeline-tracker.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pipeline Tracker</title>
  <script src="config.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f5f5f5; color: #1a1a1a; padding: 24px; }
    h1 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
    .subtitle { font-size: 13px; color: #666; margin-bottom: 20px; }
    .nav { display: flex; gap: 12px; margin-bottom: 20px; }
    .nav a { font-size: 13px; color: #0077b5; text-decoration: none; }
    .nav a:hover { text-decoration: underline; }
    .add-form { background: white; border: 1px solid #e0e0e0; border-radius: 10px; padding: 16px; margin-bottom: 24px; display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 10px; align-items: end; }
    .field label { display: block; font-size: 11px; font-weight: 600; color: #888; margin-bottom: 4px; text-transform: uppercase; }
    .field input, .field select { width: 100%; padding: 8px 10px; font-size: 13px; border: 1px solid #ddd; border-radius: 6px; font-family: inherit; }
    .field input:focus, .field select:focus { outline: none; border-color: #0077b5; }
    .add-btn { padding: 9px 18px; font-size: 13px; font-weight: 600; background: #0077b5; color: white; border: none; border-radius: 6px; cursor: pointer; white-space: nowrap; }
    .add-btn:hover { background: #005f8e; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .toolbar-left { display: flex; gap: 10px; align-items: center; }
    .view-toggle { display: flex; gap: 6px; }
    .view-btn { padding: 6px 14px; font-size: 12px; border: 1px solid #ddd; border-radius: 5px; background: white; cursor: pointer; }
    .view-btn.active { background: #0077b5; color: white; border-color: #0077b5; }
    .export-btn { padding: 6px 14px; font-size: 12px; border: 1px solid #ddd; border-radius: 5px; background: white; cursor: pointer; }
    .export-btn:hover { background: #f0f0f0; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden; border: 1px solid #e0e0e0; font-size: 13px; }
    th { text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #888; border-bottom: 1px solid #e0e0e0; background: #fafafa; }
    td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #f9f9f9; }
    .score-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-weight: 600; font-size: 12px; }
    .score-badge.qualified { background: #e6f4ea; color: #1e7e34; }
    .score-badge.skip { background: #fce8e6; color: #c5221f; }
    select.status-select { font-size: 12px; border: 1px solid #ddd; border-radius: 4px; padding: 3px 6px; background: white; cursor: pointer; }
    .del-btn { background: none; border: none; cursor: pointer; color: #ccc; font-size: 16px; padding: 2px 6px; }
    .del-btn:hover { color: #ea4335; }
    .url-link { color: #0077b5; text-decoration: none; font-size: 12px; }
    .url-link:hover { text-decoration: underline; }
    .empty { text-align: center; padding: 40px; color: #aaa; font-size: 14px; }

    /* Weekly review view */
    .review-table { width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden; border: 1px solid #e0e0e0; font-size: 13px; }
    .review-table th { text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #888; border-bottom: 1px solid #e0e0e0; background: #fafafa; }
    .review-table td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; }
    .review-table tr:last-child td { border-bottom: none; }
    .kill-flag { font-size: 11px; font-weight: 700; color: #c5221f; background: #fce8e6; padding: 2px 8px; border-radius: 10px; }
    .ok-flag { font-size: 11px; font-weight: 700; color: #1e7e34; background: #e6f4ea; padding: 2px 8px; border-radius: 10px; }
  </style>
</head>
<body>
  <h1>Pipeline Tracker</h1>
  <p class="subtitle">Log every hit. Track which strings are worth running.</p>
  <nav class="nav">
    <a href="search-launcher.html">← Search Launcher</a>
    <a href="lead-scorer.html">← Lead Scorer</a>
  </nav>

  <div class="add-form">
    <div class="field">
      <label>String #</label>
      <select id="new-string-id"></select>
    </div>
    <div class="field">
      <label>Post URL</label>
      <input id="new-url" type="url" placeholder="https://linkedin.com/..." />
    </div>
    <div class="field">
      <label>Poster Title</label>
      <input id="new-title" type="text" placeholder="e.g. Founder @ Acme" />
    </div>
    <div class="field">
      <label>ICP Score</label>
      <input id="new-score" type="number" min="0" max="100" placeholder="0–100" />
    </div>
    <button class="add-btn" id="add-btn">+ Add Lead</button>
  </div>

  <div class="toolbar">
    <div class="toolbar-left">
      <div class="view-toggle">
        <button class="view-btn active" id="btn-pipeline">Pipeline</button>
        <button class="view-btn" id="btn-review">Weekly Review</button>
      </div>
    </div>
    <button class="export-btn" id="export-btn">Export CSV</button>
  </div>

  <div id="pipeline-view"></div>
  <div id="review-view" style="display:none"></div>

  <script>
    const STORAGE_KEY = "linkedin_pipeline_v1";

    function loadLeads() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
      catch { return []; }
    }

    function saveLeads(leads) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    }

    function getStringLabel(id) {
      const s = CONFIG.strings.find(s => s.id === Number(id));
      return s ? `#${s.id} ${s.label}` : `#${id}`;
    }

    // Populate string dropdown
    const stringSelect = document.getElementById("new-string-id");
    CONFIG.strings.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = `#${s.id} — ${s.label}`;
      stringSelect.appendChild(opt);
    });

    function renderPipeline() {
      const leads = loadLeads();
      const view = document.getElementById("pipeline-view");

      if (leads.length === 0) {
        view.innerHTML = '<p class="empty">No leads yet. Add your first hit above.</p>';
        return;
      }

      view.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>String</th>
              <th>Post</th>
              <th>Poster Title</th>
              <th>Score</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${leads.map((lead, i) => `
              <tr>
                <td>${getStringLabel(lead.stringId)}</td>
                <td>${lead.url ? `<a class="url-link" href="${lead.url}" target="_blank" rel="noopener">View ↗</a>` : "—"}</td>
                <td>${lead.posterTitle || "—"}</td>
                <td><span class="score-badge ${Number(lead.score) >= CONFIG.qualifiedThreshold ? "qualified" : "skip"}">${lead.score}</span></td>
                <td>
                  <select class="status-select" data-index="${i}" onchange="updateStatus(${i}, this.value)">
                    ${CONFIG.statuses.map(s => `<option value="${s}" ${lead.status === s ? "selected" : ""}>${s}</option>`).join("")}
                  </select>
                </td>
                <td>${lead.date}</td>
                <td><button class="del-btn" onclick="deleteLead(${i})">×</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }

    function renderReview() {
      const leads = loadLeads();
      const view = document.getElementById("review-view");

      // Group by string
      const byString = {};
      CONFIG.strings.forEach(s => { byString[s.id] = { label: s.label, tier: s.tier, hits: 0, qualified: 0 }; });
      leads.forEach(lead => {
        if (byString[lead.stringId]) {
          byString[lead.stringId].hits++;
          if (Number(lead.score) >= CONFIG.qualifiedThreshold) byString[lead.stringId].qualified++;
        }
      });

      const rows = Object.entries(byString)
        .filter(([, d]) => d.hits > 0)
        .sort((a, b) => b[1].hits - a[1].hits);

      if (rows.length === 0) {
        view.innerHTML = '<p class="empty">No data yet. Log some leads first.</p>';
        return;
      }

      view.innerHTML = `
        <table class="review-table">
          <thead>
            <tr>
              <th>#</th>
              <th>String</th>
              <th>Tier</th>
              <th>Hits</th>
              <th>Qualified</th>
              <th>ICP %</th>
              <th>Day 5 verdict</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(([id, d]) => {
              const pct = d.hits > 0 ? Math.round((d.qualified / d.hits) * 100) : 0;
              const verdict = d.hits >= 3 && pct < 60
                ? '<span class="kill-flag">Kill / replace</span>'
                : d.hits >= 3 && pct >= 60
                ? '<span class="ok-flag">Keep</span>'
                : '<span style="color:#aaa;font-size:11px">Need more data</span>';
              return `
                <tr>
                  <td>${id}</td>
                  <td>${d.label}</td>
                  <td>T${d.tier}</td>
                  <td>${d.hits}</td>
                  <td>${d.qualified}</td>
                  <td>${pct}%</td>
                  <td>${verdict}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      `;
    }

    function updateStatus(index, value) {
      const leads = loadLeads();
      leads[index].status = value;
      saveLeads(leads);
    }

    function deleteLead(index) {
      const leads = loadLeads();
      leads.splice(index, 1);
      saveLeads(leads);
      renderPipeline();
      renderReview();
    }

    document.getElementById("add-btn").addEventListener("click", () => {
      const stringId = Number(document.getElementById("new-string-id").value);
      const url = document.getElementById("new-url").value.trim();
      const posterTitle = document.getElementById("new-title").value.trim();
      const score = document.getElementById("new-score").value.trim();

      if (!posterTitle && !url) return;

      const leads = loadLeads();
      leads.unshift({
        stringId,
        url,
        posterTitle,
        score: score || "0",
        status: "hit",
        date: new Date().toISOString().slice(0, 10),
      });
      saveLeads(leads);

      document.getElementById("new-url").value = "";
      document.getElementById("new-title").value = "";
      document.getElementById("new-score").value = "";

      renderPipeline();
      renderReview();
    });

    document.getElementById("btn-pipeline").addEventListener("click", () => {
      document.getElementById("pipeline-view").style.display = "";
      document.getElementById("review-view").style.display = "none";
      document.getElementById("btn-pipeline").classList.add("active");
      document.getElementById("btn-review").classList.remove("active");
    });

    document.getElementById("btn-review").addEventListener("click", () => {
      document.getElementById("pipeline-view").style.display = "none";
      document.getElementById("review-view").style.display = "";
      document.getElementById("btn-pipeline").classList.remove("active");
      document.getElementById("btn-review").classList.add("active");
      renderReview();
    });

    document.getElementById("export-btn").addEventListener("click", () => {
      const leads = loadLeads();
      if (leads.length === 0) { alert("No leads to export."); return; }
      const header = "String #,String Label,Post URL,Poster Title,ICP Score,Status,Date";
      const rows = leads.map(l =>
        [l.stringId, getStringLabel(l.stringId), l.url, l.posterTitle, l.score, l.status, l.date]
          .map(v => `"${(v || "").replace(/"/g, '""')}"`)
          .join(",")
      );
      const csv = [header, ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "linkedin-pipeline-" + new Date().toISOString().slice(0, 10) + ".csv";
      a.click();
    });

    renderPipeline();
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

Open `pipeline-tracker.html`. Check:
- String dropdown shows all 23 strings
- Adding a lead with score ≥60 shows green badge, <60 shows red
- Status dropdown updates without page reload
- Delete button removes the row
- Weekly Review tab shows per-string hit counts and ICP %
- Strings with ≥3 hits and <60% ICP % show red "Kill / replace" flag
- Export CSV downloads a file with correct columns
- Data persists after page refresh

- [ ] **Step 3: Commit**

```bash
cd /Users/jayesh/Documents/linkedin-prospecting-tool
git add pipeline-tracker.html
git commit -m "feat: add pipeline-tracker.html with localStorage, weekly review, and CSV export"
```

---

## Self-Review Checklist

- [x] All 23 strings in config.js match spec
- [x] All 7 scoring signals with correct weights in config.js
- [x] Qualified threshold = 60 in config.js
- [x] search-launcher.html loads config.js, renders all tiers, encodes URLs correctly
- [x] lead-scorer.html scores client-side from config.js, no API call
- [x] pipeline-tracker.html uses localStorage key `linkedin_pipeline_v1`
- [x] Status flow matches spec: hit → scored → commented → DM → call → closed / dead
- [x] Weekly review flags strings with <60% ICP at ≥3 hits
- [x] CSV export includes all 6 columns
- [x] No hardcoded strings in HTML files — all from config.js
- [x] AGENTS.md includes hard constraint: no LinkedIn automation
