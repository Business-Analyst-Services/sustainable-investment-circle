# Sustainable Investment Circle — prototype & decision map

> **This is a plan-only repository.** It holds a clickable mockup and the Wayfinder decision map for the
> Sustainable Investment Circle community platform. It is **not** the production codebase, and nothing here is
> meant to be wired to real accounts, payments or data.

**Live prototype:** https://business-analyst-services.github.io/sustainable-investment-circle/
(enable GitHub Pages → *Deploy from branch* → `main` / root if it isn't live yet)

## What's here

| Path | What it is |
|---|---|
| `index.html`, `assets/`, `data/` | Static clickable prototype — the 12 screens from the 19 Aug 2026 member walkthrough, with working directory filters, channel switching, feed posting, connection requests and messaging, all against fictional sample data (`data/data.js`). No backend. Nothing is stored or sent. |
| `docs/wayfinder-map.md` | The Wayfinder map: destination, decisions so far, tickets, fog of war, out of scope, handoff. Mirrored as GitHub Issues. |
| `docs/wayfinder-one-pager.pdf` | One-page A3 visual of the plan. |
| `docs/candidate-architecture.png` / `.pdf` | Candidate infrastructure architecture (GitHub → Vercel/Next.js · Clerk · Neon · Resend · Airwallex), each element tagged with the Wayfinder ticket that decides it. Candidate only until `#3 build-vs-platform` and `#8 tech-stack-hosting` close. |
| **Issues** | The live map. The issue labelled `wayfinder:map` is the index; each `wayfinder:*` issue is one decision ticket. Open, unblocked, unassigned tickets are the **frontier**. |

## How to work the map

The map follows Matt Pocock's [`/wayfinder`](https://www.aihero.dev/skills-wayfinder) skill
([source](https://github.com/mattpocock/skills)):

1. Install: `npx skills@latest add mattpocock/skills`, run `setup-matt-pocock-skills`, then `/wayfinder`.
2. **One ticket per session.** Claim it (assign yourself), settle the decision, post a resolution comment, close it,
   and add one line to *Decisions so far* on the map issue. Then stop.
3. `research` tickets are the only ones that run in parallel (on `research/<name>` branches).
4. Resolving a ticket clears nearby fog — graduate anything now specifiable from *Not yet specified* into a new ticket.
5. When nothing is left open: `/to-spec` → `/to-tickets` → `/implement`.

**Plan only.** The prototype exists so decisions can be made against something concrete. Do not add auth, payments,
persistence or a backend here — that is the plan-only violation the skill warns about. Use the prototype to resolve
`prototype`-type tickets (`premium-page-scope`, `profile-pdf-qr`, `responsive-accessibility`) by iterating a screen and
linking the commit from the ticket.

## Running the prototype locally

Any static server works:

```
python3 -m http.server 8000
# open http://localhost:8000
```

Deep links work: `#home`, `#members`, `#member/2`, `#messages`, `#channels/climate-transition`, `#research`,
`#events`, `#partners`, `#profile`, `#premium`. "Start the 12-step tour" in the banner replays the walkthrough.

## Data notice

All people in the prototype are fictional. ACSI, RIAA and Harvest by Dasseti appear as public directory / partner
listings only, exactly as in the walkthrough, with links to their public websites.
