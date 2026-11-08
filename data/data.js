/* Mock data for the Sustainable Investment Circle prototype.
   All people are fictional. Organisations marked (real) are referenced as
   public directory entries only, with links to their public websites. */
window.SIC = (() => {
  const marketTypes = ["Asset Owner", "Asset Manager", "Wealth Manager", "Industry Association", "Research Provider", "Consultancy", "Corporate", "Regulator / Policy", "Academia"];
  const jobRoles = ["Head of Responsible Investment", "ESG Research Analyst", "Portfolio Manager", "Stewardship Lead", "Sustainability Manager", "Chief Investment Officer", "Research Director", "Executive Director", "Policy Adviser", "Climate Risk Analyst"];
  const tags = ["Responsible Investment", "Climate Transition", "Stewardship", "ESG Data", "Proxy Voting", "Nature & Biodiversity", "Impact Investing", "Governance", "Regulation", "Energy Transition", "Human Rights", "Sustainable Finance"];

  const firsts = ["Maya", "Victoria", "Brooke", "Lily", "Noah", "Amelia", "Jessica", "Leo", "Phoebe", "Henry", "Thomas", "Alexandra", "Hannah", "James", "Priya", "Marcus", "Sophie", "Oliver", "Samuel", "Emma", "Ruby", "Daniel", "Isla", "Ethan", "Grace", "Lucas", "Zoe", "Aarav", "Mei", "Kiara", "Benjamin", "Chloe", "Arjun", "Harper", "Mitchell", "Tara"];
  const lasts = ["Chen", "Adams", "Allen", "Anderson", "Bennett", "Brooks", "Brown", "Campbell", "Clarke", "Davies", "Reid", "Moore", "Patel", "Nair", "Lee", "Laurent", "Reed", "Wright", "McLeod", "Walsh", "Singh", "Nguyen", "Taylor", "Hughes", "Fraser", "Okafor", "Tanaka", "Kaur", "Morgan", "Russo"];
  const orgs = ["Evergreen Asset Management", "Koru Asset Management", "Laneway Capital", "Central Plains Asset Management", "HarbourView Super", "Southern Cross Funds", "Coastal Wealth Partners", "Emerald Asset Partners", "Stewardship Co", "Greenstone Capital", "Inclusion Partners", "Impact Advisory", "National Pension Partners", "Climate Transition Research", "Boab Investment Group", "Tasman Capital", "Pacific Sustainable Finance", "Kowhai Advisory", "Meridian Super", "Terra Firma Consulting"];
  const cities = [["Sydney", "NSW", "Australia"], ["Melbourne", "VIC", "Australia"], ["Brisbane", "QLD", "Australia"], ["Perth", "WA", "Australia"], ["Adelaide", "SA", "Australia"], ["Canberra", "ACT", "Australia"], ["Auckland", "", "New Zealand"], ["Wellington", "", "New Zealand"], ["Singapore", "", "Singapore"], ["Hong Kong", "", "Hong Kong SAR"], ["London", "", "United Kingdom"]];
  const palette = ["#1f5c48", "#2b7a5f", "#c9962b", "#4a5aa8", "#8c3a5c", "#8a5a16", "#2f6f8f", "#5b7a2a"];

  // Deterministic pseudo-random
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const pick = (a) => a[Math.floor(rnd() * a.length)];

  const members = [];
  const fixed = [
    { first: "Nathan", last: "Walker", org: "Sustainable Investment Circle", role: "Executive Director", market: "Industry Association", city: ["Sydney", "NSW", "Australia"], years: 14, me: true, premium: false },
    { first: "Maya", last: "Chen", org: "Evergreen Asset Management", role: "Head of Responsible Investment", market: "Asset Manager", city: ["Sydney", "NSW", "Australia"], years: 15, premium: true, headline: "Responsible investment leader | Climate strategy | Stewardship & active ownership" },
    { first: "Thomas", last: "Reid", org: "Coastal Wealth Partners", role: "Portfolio Manager", market: "Wealth Manager", city: ["Brisbane", "QLD", "Australia"], years: 9 },
    { first: "Alexandra", last: "Moore", org: "Emerald Asset Partners", role: "Stewardship Lead", market: "Asset Manager", city: ["Melbourne", "VIC", "Australia"], years: 11 },
    { first: "Hannah", last: "Clarke", org: "Coastal Wealth Partners", role: "ESG Research Analyst", market: "Wealth Manager", city: ["Sydney", "NSW", "Australia"], years: 5 },
    { first: "James", last: "Patel", org: "National Pension Partners", role: "Head of ESG Data & Reporting", market: "Asset Owner", city: ["Melbourne", "VIC", "Australia"], years: 12 },
    { first: "Priya", last: "Nair", org: "Stewardship Co", role: "Stewardship Lead", market: "Consultancy", city: ["Sydney", "NSW", "Australia"], years: 10 },
    { first: "Marcus", last: "Lee", org: "Inclusion Partners", role: "Research Director", market: "Research Provider", city: ["Melbourne", "VIC", "Australia"], years: 13 },
    { first: "Sophie", last: "Laurent", org: "Greenstone Capital", role: "Climate Risk Analyst", market: "Asset Manager", city: ["Sydney", "NSW", "Australia"], years: 6 },
    { first: "Victoria", last: "Adams", org: "Koru Asset Management", role: "Sustainable Investment Research Manager", market: "Asset Manager", city: ["Auckland", "", "New Zealand"], years: 8 },
    { first: "Brooke", last: "Allen", org: "Laneway Capital", role: "Portfolio Manager, Responsible Investment", market: "Asset Manager", city: ["Melbourne", "VIC", "Australia"], years: 7 },
    { first: "Lily", last: "Anderson", org: "Central Plains Asset Management", role: "Portfolio Manager", market: "Asset Manager", city: ["Adelaide", "SA", "Australia"], years: 9 },
    { first: "Noah", last: "Bennett", org: "HarbourView Super", role: "Responsible Investment Research Manager", market: "Asset Owner", city: ["Sydney", "NSW", "Australia"], years: 6 },
    { first: "Amelia", last: "Brooks", org: "Southern Cross Funds", role: "ESG Research Analyst", market: "Asset Manager", city: ["Brisbane", "QLD", "Australia"], years: 4 },
  ];
  fixed.forEach((f, i) => members.push(build(i + 1, f)));
  const used = new Set(members.map(m => m.name));
  while (members.length < 63) {
    const first = pick(firsts), last = pick(lasts);
    if (used.has(first + " " + last)) continue;
    used.add(first + " " + last);
    members.push(build(members.length + 1, { first, last, org: pick(orgs), role: pick(jobRoles), market: pick(marketTypes), city: pick(cities), years: 3 + Math.floor(rnd() * 18), premium: rnd() < 0.18 }));
  }

  function build(id, f) {
    const t = [...tags].sort(() => rnd() - 0.5).slice(0, 3);
    return {
      id, name: `${f.first} ${f.last}`, initials: f.first[0] + f.last[0], color: palette[id % palette.length],
      org: f.org, role: f.role, market: f.market, city: f.city[0], state: f.city[1], country: f.city[2],
      years: f.years, premium: !!f.premium, me: !!f.me, tags: t,
      headline: f.headline || `${t[0]} | ${t[1]} | ${t[2]}`,
      summary: f.me ? "Building connections across the ESG, responsible investment and sustainability community." :
        `${f.role} at ${f.org}, focused on ${t[0].toLowerCase()} and ${t[1].toLowerCase()} across listed and private markets.`,
    };
  }

  const channels = [
    ["General", "Community-wide discussion"], ["Climate Transition", "Net zero, transition plans and decarbonisation"],
    ["Responsible Investment", "ESG integration and investment process"], ["ESG Data & Reporting", "Data, ratings, disclosure and regulation"],
    ["Stewardship & Engagement", "Issuer engagement and escalation"], ["Proxy Voting", "Voting policy, resolutions and governance"],
    ["Diversity & Inclusion", "Workforce diversity, inclusion and representation"], ["Nature & Biodiversity", "Nature risk, TNFD and natural capital"],
    ["Social Impact & Human Rights", "Human rights, modern slavery and communities"], ["Governance & Board Effectiveness", "Boards, remuneration, accountability and governance"],
    ["Sustainable Finance", "Green bonds, sustainability-linked finance and taxonomy"], ["Impact Investing", "Impact measurement and intentional investment"],
    ["Regulation & Disclosure", "ISSB, CSRD, Australian disclosure and policy"], ["ESG Technology & AI", "Technology, analytics, AI and ESG workflows"],
    ["Energy Transition", "Renewables, grids, storage and transition finance"],
  ].map(([name, desc], i) => ({ id: slug(name), name, desc, members: 120 + ((i * 37) % 200) }));

  const posts = [
    { author: 2, channel: "climate-transition", when: "2h", text: "Has anyone seen a practical framework for comparing transition-plan credibility across listed companies? We are reviewing our scoring approach and would value peer input.", likes: 18, comments: 7 },
    { author: 6, channel: "esg-data-reporting", when: "5h", text: "Interesting discussion this morning on how teams are preparing for the next wave of sustainability disclosures. The biggest issue still seems to be data lineage and auditability.", likes: 24, comments: 11 },
    { author: 7, channel: "proxy-voting", when: "1d", text: "We are revisiting our approach to pre-declaring votes on high-profile resolutions. Interested in how other asset owners balance transparency with engagement strategy.", likes: 29, comments: 13 },
    { author: 8, channel: "diversity-inclusion", when: "1d", text: "Sharing a short note on workforce diversity metrics that actually move engagement conversations forward — happy to compare notes with anyone measuring beyond board composition.", likes: 15, comments: 6 },
    { author: 9, channel: "nature-biodiversity", when: "2d", text: "For those piloting TNFD-aligned assessments: how are you handling location data for diversified portfolios? Our biggest gap is asset-level geography.", likes: 21, comments: 9 },
    { author: 4, channel: "stewardship-engagement", when: "3d", text: "Escalation ladders: at what point do members move from private dialogue to public statements? Keen to hear what has worked.", likes: 12, comments: 8 },
  ];

  const events = [
    { id: 1, title: "Stewardship & Proxy Voting Roundtable", date: "2026-08-21", time: "12:30", mode: "Virtual", place: "Online", type: "Roundtable", desc: "A peer discussion for asset owners and managers on voting policy, engagement escalation, pre-declaration and the 2026 proxy season.", listedBy: 7 },
    { id: 2, title: "Climate Transition Leaders Forum", date: "2026-09-03", time: "09:00", mode: "Sydney", place: "Sydney, NSW", type: "Forum", desc: "Senior investment and sustainability professionals discuss credible transition plans, portfolio alignment and financing the transition.", listedBy: 2 },
    { id: 3, title: "Diversity, Equity & Inclusion Exchange", date: "2026-09-15", time: "17:30", mode: "Melbourne", place: "Melbourne, VIC", type: "Networking", desc: "An evening exchange focused on practical D&I measurement, workforce strategy and investor expectations.", listedBy: 8 },
    { id: 4, title: "Nature & Biodiversity Investor Workshop", date: "2026-10-08", time: "10:00", mode: "Virtual", place: "Sydney + Online", type: "Workshop", desc: "A practical workshop on TNFD, nature-related risk and portfolio-level biodiversity assessment.", listedBy: 9 },
    { id: 5, title: "ESG Data & Disclosure Webinar", date: "2026-11-19", time: "14:00", mode: "Virtual", place: "Online", type: "Webinar", desc: "A community webinar covering disclosure readiness, data lineage, auditability and evolving sustainability reporting requirements.", listedBy: 6 },
  ];

  const research = [
    { id: 1, name: "Australian Council of Superannuation Investors (ACSI)", short: "ACSI", country: "Australia", type: "Association", categories: ["Governance", "Stewardship", "Proxy Voting"], url: "https://acsi.org.au", desc: "Research and advocacy on ESG and governance issues for Australian superannuation funds. (real organisation — public listing only)" },
    { id: 2, name: "Responsible Investment Association Australasia (RIAA)", short: "RIAA", country: "Australia & New Zealand", type: "Association", categories: ["Responsible Investment", "Benchmarking", "Certification"], url: "https://responsibleinvestment.org", desc: "Benchmark research, certification and industry resources across Australia and New Zealand. (real organisation — public listing only)" },
  ];

  const partners = [
    { id: 1, name: "Harvest by Dasseti", org: "Dasseti", url: "https://www.dasseti.com", desc: "AI-powered, sustainability-focused ESG reporting software built for private markets. Harvest helps GPs and LPs streamline ESG data collection, validation, benchmarking and reporting, turning sustainability data into decision-ready investment insight." },
  ];

  const messages = [
    { with: 2, thread: [[2, "Thanks for connecting. I enjoyed your post on building the sustainable-investment community."], [1, "Thank you, Maya. It would be great to compare notes on the themes your team is following."], [2, "Absolutely. I will send through a few ideas before our next discussion."]] },
    { with: 7, thread: [[7, "Hi Nathan — are you planning to attend the stewardship roundtable in August?"], [1, "Yes, I'll be there. Happy to introduce you to a few asset-owner members."]] },
    { with: 9, thread: [[9, "Great to meet at the Melbourne session. Sending through the TNFD note I mentioned."]] },
  ];

  const alerts = [
    { when: "Today", text: "Thomas Reid and Alexandra Moore sent you connection requests.", type: "connection" },
    { when: "Yesterday", text: "Maya Chen replied in # Climate Transition.", type: "channel" },
    { when: "2 days ago", text: "New event listed: ESG Data & Disclosure Webinar (19 Nov).", type: "event" },
    { when: "Last week", text: "Your profile strength reached 50%. Add your career profile to reach 75%.", type: "profile" },
  ];

  const premiumFeatures = [
    ["Who Viewed Me + Visibility & Engagement", "See the actual people viewing you, plus separate performance analytics for searches, audience mix and Premium-content engagement."],
    ["Member Search Alerts", "Create alerts for the exact professionals that matter to you and be notified when new matching members join."],
    ["Personalised Premium Intelligence", "Bring relevant people, research, community posts and upcoming events into one private intelligence dashboard."],
    ["Build an audience with Follow My Work", "Let members follow your Premium work and automatically alert them when you publish an update."],
    ["Your own professional home page", "A polished thought-leadership page that sits beyond your normal profile and channel posts."],
    ["Feature your best thinking", "Give one key insight or piece of thought leadership prominent editorial treatment."],
  ];

  function slug(s) { return s.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

  return { marketTypes, jobRoles, tags, members, channels, posts, events, research, partners, messages, alerts, premiumFeatures, connections: [2, 7, 9], requests: [3, 4] };
})();
