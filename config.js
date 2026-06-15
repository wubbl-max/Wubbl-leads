const CONFIG = {
  strings: [

    // ── Tier 1 — Direct buyer asks ────────────────────────────────────────────
    // LinkedIn Posts search uses `-` for exclusions, NOT uppercase NOT.
    // No AND chains — pure OR lists only (AND chains return 0 results in Posts search).
    {
      id: 1,
      tier: 1,
      label: "Looking for product designer",
      query: '"looking for a product designer" OR "need a product designer" OR "recommend a product designer" OR "hire a product designer" -"open to work" -"actively looking" -"is available" -India -Pakistan -Bangladesh -Africa -Philippines -Indonesia',
    },
    {
      id: 2,
      tier: 1,
      label: "Looking for UX / UI designer",
      query: '"looking for a UX designer" OR "need a UX designer" OR "looking for a UI designer" OR "recommend a UX designer" -"open to work" -"actively looking" -"is available" -India -Pakistan -Bangladesh -Africa -Philippines -Indonesia',
    },
    {
      id: 3,
      tier: 1,
      label: "Looking for design agency",
      query: '"looking for a design agency" OR "recommend a design agency" OR "need a design agency" OR "looking for a branding agency" OR "need a branding agency" -"open to work" -India -Pakistan -Bangladesh -Africa -Philippines -Indonesia',
    },
    {
      id: 4,
      tier: 1,
      label: "Looking for branding / logo help",
      query: '"need help with branding" OR "looking for branding help" OR "need a brand identity" OR "need a logo" OR "looking for logo design" -"open to work" -"actively looking" -"is available" -India -Pakistan -Bangladesh -Africa -Philippines -Indonesia',
    },
    {
      id: 5,
      tier: 1,
      label: "Looking for website / Webflow designer",
      query: '"need a website redesign" OR "looking for a Webflow designer" OR "need a web designer" OR "looking for website design" OR "need someone to redesign our website" -"open to work" -"actively looking" -"is available" -India -Pakistan -Bangladesh -Africa -Philippines -Indonesia',
    },
    {
      id: 6,
      tier: 1,
      label: "Looking for freelance designer",
      query: '"looking for a freelance designer" OR "recommend a freelance designer" OR "need a freelance UX designer" OR "need a freelance product designer" -"open to work" -"actively looking" -"is available" -India -Pakistan -Bangladesh -Africa -Philippines -Indonesia',
    },

    // ── Tier 2 — Pain + intent signals ───────────────────────────────────────
    {
      id: 7,
      tier: 2,
      label: "Product redesign intent",
      query: '"redesigning our product" OR "revamping our UX" OR "product redesign" OR "rebuilding our UI" OR "overhauling our design" -"open to work" -portfolio -India -Pakistan -Bangladesh -Africa',
    },
    {
      id: 8,
      tier: 2,
      label: "Website not converting",
      query: '"website not converting" OR "landing page not converting" OR "high bounce rate" OR "visitors not converting" -"open to work" -India -Pakistan -Bangladesh -Africa',
    },
    {
      id: 9,
      tier: 2,
      label: "No designer pain",
      query: '"no designer" OR "without a designer" OR "building without a designer" OR "doing design myself" OR "we have no designer" -"open to work" -India -Pakistan -Bangladesh -Africa',
    },
    {
      id: 10,
      tier: 2,
      label: "Pre-launch needs design",
      query: '"need a designer" OR "launching soon" OR "going live soon" OR "pre-launch" -"open to work" -"actively looking" -"is available" -India -Pakistan -Bangladesh -Africa',
    },
    {
      id: 11,
      tier: 2,
      label: "Fresh funding",
      query: '"just raised" OR "raised our seed" OR "closed our Series A" OR "announcing our seed round" OR "closed our funding" -India -Pakistan -Bangladesh -Africa -Philippines -Indonesia',
    },
    {
      id: 12,
      tier: 2,
      label: "Unhappy with agency",
      query: '"design agency" OR "disappointed with" OR "looking for a new agency" OR "switching agencies" OR "terrible experience with" -"open to work" -India -Pakistan -Bangladesh -Africa',
    },
    {
      id: 13,
      tier: 2,
      label: "Churn / UX pain",
      query: '"onboarding drop-off" OR "users churning" OR "activation rate" OR "UX is hurting" OR "design is hurting" -"open to work" -India -Pakistan -Bangladesh -Africa',
    },

    // ── Tier 3 — Country-specific ─────────────────────────────────────────────
    {
      id: 14,
      tier: 3,
      label: "Singapore",
      query: '"looking for a designer" OR "need a designer" OR "recommend a designer" OR "design agency" OR "branding agency" Singapore -"open to work" -"actively looking" -India -Pakistan -Bangladesh -Africa',
    },
    {
      id: 15,
      tier: 3,
      label: "UAE / Dubai",
      query: '"looking for a designer" OR "need a designer" OR "recommend a designer" OR "design agency" OR "branding agency" Dubai OR UAE -"open to work" -"actively looking" -India -Pakistan -Bangladesh -Africa',
    },
    {
      id: 16,
      tier: 3,
      label: "UK / London",
      query: '"looking for a designer" OR "need a designer" OR "recommend a designer" OR "design agency" OR "branding agency" London OR "United Kingdom" -"open to work" -"actively looking" -India -Pakistan -Bangladesh -Africa',
    },
    {
      id: 17,
      tier: 3,
      label: "Ireland / Dublin",
      query: '"looking for a designer" OR "need a designer" OR "recommend a designer" OR "design agency" OR "branding agency" Dublin OR Ireland -"open to work" -"actively looking" -India -Pakistan -Bangladesh -Africa',
    },
    {
      id: 18,
      tier: 3,
      label: "Australia",
      query: '"looking for a designer" OR "need a designer" OR "recommend a designer" OR "design agency" OR "branding agency" Sydney OR Melbourne OR Australia -"open to work" -"actively looking" -India -Pakistan -Bangladesh -Africa',
    },
    {
      id: 19,
      tier: 3,
      label: "Switzerland",
      query: '"looking for a designer" OR "need a designer" OR "recommend a designer" OR "design agency" OR "branding agency" Zurich OR Geneva OR Switzerland -"open to work" -"actively looking" -India -Pakistan -Bangladesh -Africa',
    },
    {
      id: 20,
      tier: 3,
      label: "USA",
      query: '"looking for a designer" OR "need a designer" OR "recommend a designer" OR "design agency" OR "branding agency" "New York" OR "San Francisco" OR Austin OR "United States" -"open to work" -"actively looking" -India -Pakistan -Bangladesh -Africa',
    },
    {
      id: 21,
      tier: 3,
      label: "Canada",
      query: '"looking for a designer" OR "need a designer" OR "recommend a designer" OR "design agency" OR "branding agency" Toronto OR Vancouver OR Canada -"open to work" -"actively looking" -India -Pakistan -Bangladesh -Africa',
    },

    // ── Tier 4 — Weekly broad ─────────────────────────────────────────────────
    {
      id: 22,
      tier: 4,
      label: "Fractional / embedded design",
      query: '"fractional design" OR "design partner" OR "design as a service" OR "embedded designer" OR "fractional designer" -"open to work" -"actively looking" -"is available" -India -Pakistan -Bangladesh -Africa',
    },
    {
      id: 23,
      tier: 4,
      label: "Funding in target geos",
      query: '"just raised" OR "seed round" OR "Series A" London OR Singapore OR Dubai OR Sydney OR Toronto OR Zurich OR Dublin -India -Pakistan -Bangladesh -Africa',
    },
  ],

  scoring: {
    hiringDesigner: {
      weight: 25,
      keywords: ["looking for", "need a designer", "hiring", "design hire", "first design hire", "ux designer", "ui designer", "product designer", "ux/ui", "ui/ux", "design agency", "branding agency", "creative agency", "website design", "web design"],
      label: "Looking for designer / agency / design help",
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
      keywords: ["london", "singapore", "switzerland", "zurich", "berlin", "dubai", "uae", "sydney", "toronto", "vancouver", "dublin", "ireland"],
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
    1: { label: "Tier 1 — Direct Buyer Asks", action: "Comment within 2hrs" },
    2: { label: "Tier 2 — Pain + Intent", action: "Offer a teardown" },
    3: { label: "Tier 3 — Geo-Targeted", action: "Comment within 2hrs" },
    4: { label: "Tier 4 — Weekly Broad", action: "Monitor weekly" },
  },

  statuses: ["hit", "scored", "commented", "DM", "call", "closed", "dead"],
};
