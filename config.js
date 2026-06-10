const CONFIG = {
  strings: [
    // Tier 1 — Hottest Intent
    // Job post exclusions: -"OpenToWork" -"open to work" -"seeking a role" -"new role" -"view job"
    //                      -hiring -"job opening" -"apply now" -"we are hiring" -"job description"
    // Geo exclusions: -India -Mumbai -Delhi -Bangalore -Hyderabad -Chennai -Pune
    {
      id: 1,
      tier: 1,
      label: "Looking for product designer",
      query: '("looking for a product designer" OR "need a product designer" OR "recommend a product designer") -"OpenToWork" -"open to work" -"seeking a role" -"new role" -"view job" -hiring -"job opening" -"apply now" -"we are hiring" -"job description" -India -Mumbai -Delhi -Bangalore -Hyderabad -Chennai -Pune',
    },
    {
      id: 2,
      tier: 1,
      label: "Looking for UX/UI designer",
      query: '("looking for a UX designer" OR "need a UX designer" OR "looking for a UI designer" OR "recommend a UX designer") -"OpenToWork" -"open to work" -"seeking a role" -"new role" -"view job" -hiring -"job opening" -"apply now" -"we are hiring" -"job description" -India -Mumbai -Delhi -Bangalore -Hyderabad -Chennai -Pune',
    },
    {
      id: 3,
      tier: 1,
      label: "Looking for design agency",
      query: '("looking for a design agency" OR "recommend a design agency" OR "anyone know a good design agency" OR "looking for a branding agency") -"OpenToWork" -"open to work" -"view job" -hiring -"job opening" -"apply now" -India -Mumbai -Delhi -Bangalore -Hyderabad -Chennai -Pune',
    },
    {
      id: 4,
      tier: 1,
      label: "Looking for branding help",
      query: '("need help with branding" OR "looking for branding" OR "need a brand identity" OR "looking for logo design") -"OpenToWork" -"open to work" -"seeking a role" -"view job" -hiring -"job opening" -"apply now" -"we are hiring" -India -Mumbai -Delhi -Bangalore -Hyderabad -Chennai -Pune',
    },
    {
      id: 5,
      tier: 1,
      label: "Looking for website design/dev",
      query: '("looking for website design" OR "need a website redesign" OR "looking for a Webflow designer" OR "need a web designer") -"OpenToWork" -"open to work" -"seeking a role" -"view job" -hiring -"job opening" -"apply now" -"we are hiring" -India -Mumbai -Delhi -Bangalore -Hyderabad -Chennai -Pune',
    },
    {
      id: 6,
      tier: 1,
      label: "Fresh funding (ex-India)",
      query: '("raised our seed" OR "closed our Series A" OR "announcing our seed round") AND ("SaaS" OR "fintech" OR "B2B") -India -Mumbai -Delhi -Bangalore -Hyderabad -Chennai -Pune',
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
      label: "Asking for design agency / partner recs (ex-India)",
      query: '("recommend a design agency" OR "anyone know a good designer" OR "looking for a design partner" OR "freelance designer recommendations") -India -Mumbai -Delhi -Bangalore -Hyderabad -Chennai -Pune',
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
