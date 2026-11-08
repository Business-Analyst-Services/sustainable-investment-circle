# Sustainable Investment Circle — Wayfinder Map (v1 build)

*Source: member walkthrough video, 19 Aug 2026 (137 s, 12 captioned steps). Narration was not transcribed, so the map is built from the screens and on-screen captions. Method: Matt Pocock's `/wayfinder` skill — plan only, one decision ticket per session, hand off to `/to-spec` → `/to-tickets` → `/implement` when the map clears. The live map is the GitHub Issue labelled `wayfinder:map`; this file is the readable mirror.*

---

## 0. Before you start (prerequisites)

| Item | Decision / action |
|---|---|
| Tracker | This GitHub repo. GitHub has native blocking links so the frontier is visible in the Issues UI. Mirror the final tickets into Jira only *after* `/to-tickets` if the delivery team lives there. |
| Install | `npx skills@latest add mattpocock/skills` then run `setup-matt-pocock-skills` (writes the "Wayfinding operations" section), then `/wayfinder`. |
| Rule to enforce | Wayfinder plans, it doesn't build. The prototype already exists — do not let any session "just wire up" a screen inside the map. |
| Cadence | One ticket per session (research tickets may run in parallel). 26 tickets ≈ 20–25 sessions; the first six unblock everything else. |

---

## 1. Destination

> A live, production Sustainable Investment Circle v1 that a real ESG / sustainable-investment professional can join, complete a profile, find and connect with members, message, post in specialist channels, browse the research directory, events and partners, and request Premium membership — matching the 19 Aug 2026 walkthrough — with enough admin tooling for a small team to run the community day to day.

The destination is the **whole** v1, not the first session.

---

## 2. Decisions so far (inferred from the walkthrough — confirm in ticket `confirm-baseline`)

| Area | What the prototype has already decided |
|---|---|
| Brand & positioning | Name, logo, tagline *"Connect. Share. Accelerate impact."*, strapline *"The professional community for ESG and sustainable investment"*, deep-green/gold visual system, three member verbs: Connect · Discover · Contribute. |
| Information architecture | Left nav: Community Home · Premium Membership · Members · My Connections · Connection Requests · Messages · Channels · Research Directory · Events · Partners · Alerts · My Profile · Privacy Policy, plus **Advertise** and **Contact Support** CTAs. |
| Onboarding (step 1) | Create account: full name, organisation, market type (select), job role (select), email, password (min 6). Log in / Create account toggle. |
| Community Home (steps 2–3) | Pending connection requests banner; stat tiles; profile-completeness nudge; **Invite colleagues** by Name+Email or Excel/CSV upload; **Community feed** with channel filter and composer (text + up to 5 files, 25 MB each); Popular channels; right rail: People to connect with, Upcoming events, Community Partners, Featured video. |
| Members directory (step 4) | Search by name/company/skills/expertise; filters: Country, City, Market type, Job role; sort; card grid; "View professional profile". |
| Profile modal (step 5) | Role, org, headline, tags, Premium Page button, **Download profile PDF**, location, years of experience, summary, **Connect in person via QR code**. |
| Messages (step 6) | Direct messages + "Create message group" (private groups visible only to members added); member search to start a DM. |
| Channels (step 7) | 15 seeded channels: General, Climate Transition, Responsible Investment, ESG Data & Reporting, Stewardship & Engagement, Proxy Voting, Diversity & Inclusion, Nature & Biodiversity, Social Impact & Human Rights, Governance & Board Effectiveness, Sustainable Finance, Impact Investing, Regulation & Disclosure, ESG Technology & AI, Energy Transition. |
| Research Directory (step 8) | Curated external providers (seeded: ACSI, RIAA), filters, "Visit website", **"Add research provider"** (member-contributed, admin-reviewed). |
| Events (step 9) | Upcoming ESG events (Virtual / Sydney / Melbourne tags, "Listed by" member), filters, **"List an ESG event"**, add to calendar. |
| Partners (step 10) | Partner cards (seeded: Harvest by Dasseti); all partner profiles visible to all members. |
| My Profile (step 11) | Profile-strength meter, View public profile, Show connection QR, Download profile PDF, editable identity, headline, years of experience, career profile, summary, photo. |
| Premium (step 12) | **US$99 Founding Premium Member** (locked while continuously active) vs US$149 standard, annual. **"Request Premium access"** → **external Airwallex credit-card link** (no in-app card capture). Features: Who Viewed Me + analytics · Member Search Alerts · Personalised Premium Intelligence · Follow My Work · own professional home page · Featured Insight · publications · speaking & media · professional presence. |
| Demo persona & seed data | Nathan Walker, Executive Director, Sydney; ~63 members, Sydney/Melbourne-centred events — an Australian-first launch cohort. |

---

## 3. Tickets

Legend — **Type**: grilling (HITL) · prototype (HITL) · research (AFK) · task (either). **Blocked by** uses ticket names.

### Frontier (open, unblocked — start here)

| Ticket | Type | Question to settle | Blocks |
|---|---|---|---|
| `confirm-baseline` | grilling | Which walkthrough screens are firm v1 scope, which are aspirational (e.g. Premium intelligence analytics), and which prototype details are placeholders (counts, copy, pricing)? | everything |
| `build-vs-platform` | research → grilling | Custom build vs. community platform (Circle, Mighty Networks, Hivebrite, Bettermode, Discourse) vs. headless hybrid. Research first: can any platform deliver the directory filters, profile PDF, QR connect, research directory and Premium set without heavy customisation? | `tech-stack-hosting`, `identity-auth`, `domain-model`, `search-approach` |
| `commercial-model` | grilling | Revenue lines and who pays: Premium (US$99/149), Advertise, Partners, paid event / provider listings? Founding window length. Member targets at 6/12 months. US$ pricing vs AU cohort. | `premium-entitlement`, `partners-advertising`, `cold-start-seeding`, `analytics-success-metrics`, `legal-docs` |
| `member-eligibility` | grilling | Open signup vs. vetted? Corporate-email verification? Final Market type / Job role taxonomy. Can students or vendors join? | `identity-auth`, `domain-model`, `invite-import`, `cold-start-seeding` |
| `privacy-and-residency` | research → grilling | Privacy Act 1988 / APP obligations for "Who viewed me", downloadable PDFs of other members' profiles, QR data exchange, uploaded documents, hosting location, breach notification. | `who-viewed-me-rules`, `profile-pdf-qr`, `tech-stack-hosting`, `legal-docs` |
| `operating-model` | grilling | Who runs it day to day: admin roles, moderation, approving providers / events / Premium requests, support inbox, content policy, hours per week. | `moderation-admin`, `research-curation`, `events-workflow`, `premium-entitlement`, `feed-and-channels-rules` |

### Second wave (unlock as the frontier clears)

| Ticket | Type | Question to settle | Blocked by |
|---|---|---|---|
| `tech-stack-hosting` | grilling | Stack, hosting region, environments, CI/CD, backups, cost ceiling. | `build-vs-platform`, `privacy-and-residency` |
| `identity-auth` | grilling | Email+password (as prototyped) vs. magic link; MFA; password policy (min 6 is too weak); recovery; org changes. | `member-eligibility`, `tech-stack-hosting` |
| `domain-model` | grilling | Member, Organisation, Connection, ConnectionRequest, Message, MessageGroup, Channel, Post, Attachment, Event, ResearchProvider, Partner, PremiumSubscription, Alert, ProfileView — ownership and visibility per entity. | `confirm-baseline`, `member-eligibility` |
| `connection-model` | grilling | Request/accept/decline, QR in-person flow, what is connections-only (messaging? PDF?), limits, blocking. | `domain-model` |
| `messaging-scope` | grilling | Real-time vs. polling, group rules, attachments, read receipts, retention, export. | `domain-model`, `connection-model` |
| `feed-and-channels-rules` | grilling | Post types, attachment limits, who creates channels, pinning, featured video source, reaction semantics, moderation hooks. | `domain-model`, `operating-model` |
| `search-approach` | research | Primary DB vs. search service for the Members / Research / Events filter sets at expected scale. | `build-vs-platform` |
| `premium-entitlement` | grilling | Airwallex link → manual activation vs. webhook; renewal, lapse, grace; founding-rate lock; refunds; invoices/GST. | `commercial-model`, `operating-model` |
| `who-viewed-me-rules` | grilling | Consent for profile-view tracking (opt-in? anonymised for free members?), retention, what each side sees. | `privacy-and-residency`, `premium-entitlement` |
| `premium-page-scope` | prototype | What a Premium member home page contains and how it is edited — the walkthrough shows only the preview. | `premium-entitlement` |
| `profile-pdf-qr` | research → prototype | PDF generation and template; fields; consent to download another member's PDF; QR payload (URL vs vCard) and expiry. | `privacy-and-residency`, `connection-model` |
| `research-curation` | grilling | Who may add providers, approval, categories, seed list beyond ACSI & RIAA, de-listing, any commercial tier. | `operating-model` |
| `events-workflow` | grilling | Who may list, approval, required fields, calendar export (ICS vs. links), tags, past events, paid listing? | `operating-model` |
| `partners-advertising` | grilling | Partner tiers and entitlements, ad inventory and placements, pricing, approval, disclosure rules. | `commercial-model` |
| `invite-import` | grilling | Invite email template, CSV/Excel schema, limits, consent/anti-spam, who-invited-whom. | `member-eligibility` |
| `notifications-alerts` | grilling | Alert types incl. Premium search alerts; in-app vs. email; digest cadence; email provider. | `domain-model`, `premium-entitlement` |
| `moderation-admin` | grilling | Admin console: member approval, reports, provider/event/Premium approvals, partner management, announcements. | `operating-model` |
| `responsive-accessibility` | grilling → prototype | Walkthrough is desktop-only: mobile-web scope for v1, WCAG target, which screens go mobile first. | `confirm-baseline` |
| `analytics-success-metrics` | grilling | What "working" means at 30/90/180 days and the tooling to measure it. | `commercial-model` |
| `cold-start-seeding` | grilling → task | Launch cohort, founding-member outreach, seed content, fate of demo data. | `commercial-model`, `member-eligibility` |
| `legal-docs` | task | Privacy Policy, Terms, Community Guidelines, Partner/Advertising T&Cs, Premium terms — legal review checklist. | `privacy-and-residency`, `commercial-model` |
| `accounts-setup` | task | Airwallex account + payment link, production domain/DNS, transactional email domain, video hosting, analytics account. | `tech-stack-hosting`, `premium-entitlement` |

---

## 4. Not yet specified (fog of war)

- Organisation as a first-class entity (pages, multiple members, verification) or just a text field?
- "People to connect with" — rules-based (same market type / city) or smarter?
- Content lifecycle: archiving stale channels, expired events, lapsed Premium pages.
- Geography beyond Australia; US$ pricing vs an AU cohort.
- Member data export and account deletion.
- Rate limits and anti-spam for invites, messaging, posting.
- Research providers vs Partners — same entity at different tiers?

Resolve a ticket → check this list → graduate anything now specifiable into a ticket.

---

## 5. Out of scope (for this destination)

- Native iOS/Android apps.
- In-app card capture or any payment route other than the external Airwallex link.
- Marketplace / paid download of research.
- Enterprise SSO, team/org-level subscriptions.
- AI recommendations, summaries or matchmaking beyond simple rules.
- Multi-language. Public job board.

---

## 6. Suggested session order

1. `confirm-baseline` — with the walkthrough and prototype open
2. `build-vs-platform` — spin the research subagent first, grill when it returns
3. `commercial-model`
4. `member-eligibility`
5. `privacy-and-residency` — research in parallel with 3–4
6. `operating-model`
7. Follow the frontier: `domain-model` → `connection-model` → `premium-entitlement` → the rest as they unblock.

---

## 7. Handoff

When no ticket is open and the fog list is empty: `/to-spec` (attach the walkthrough and this prototype as the UI reference) → `/to-tickets` (mirror to Jira here if needed) → `/implement`.

Watch-outs: scope tightly (consider splitting Premium into a second map if `confirm-baseline` marks it aspirational); prototype early where discussion stalls; keep grilling questions short; don't let an agent pick a prototype variant for you.
