/* Sustainable Investment Circle — clickable prototype.
   Static, no backend. State lives in memory (and sessionStorage for the tour step). */
(() => {
  const D = window.SIC;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const me = D.members.find(m => m.me);
  const byId = (id) => D.members.find(m => m.id === id);
  const state = { connections: [...D.connections], requests: [...D.requests], posts: [...D.posts], loggedIn: false, tour: 0, thread: D.messages[0].with };

  const ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>',
    members: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    conn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 12h10M7 12l3-3M7 12l3 3M17 12l-3-3M17 12l-3 3"/></svg>',
    req: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="8" r="4"/><path d="M2 21c0-4 3.5-6 8-6M19 8v6M16 11h6"/></svg>',
    msg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5h16v11H8l-4 4z"/></svg>',
    chan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9h14M5 15h14M10 3L8 21M16 3l-2 18"/></svg>',
    res: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
    ev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    part: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l9 9-9 9-9-9z"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/></svg>',
    prof: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6 19c1.5-3 4-4 6-4s4.5 1 6 4"/></svg>',
    priv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7 7 .6-5.3 4.6L18.5 22 12 18l-6.5 4 1.8-7.8L2 9.6 9 9z"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  };

  const NAV = [
    ["home", "Community Home", ICONS.home], ["premium", "", ICONS.star], ["members", "Members", ICONS.members],
    ["connections", "My Connections", ICONS.conn], ["requests", "Connection Requests", ICONS.req], ["messages", "Messages", ICONS.msg],
    ["channels", "Channels", ICONS.chan], ["research", "Research Directory", ICONS.res], ["events", "Events", ICONS.ev],
    ["partners", "Partners", ICONS.part], ["alerts", "Alerts", ICONS.bell], ["profile", "My Profile", ICONS.prof], ["privacy", "Privacy Policy", ICONS.priv],
  ];

  const TOUR = [
    ["login", "Create your account", "Add your name, organisation, market type and role, then complete your profile after joining."],
    ["home", "Start with your Community Home Page", "See connection requests, recommended people, events and the latest community activity."],
    ["home", "Watch and contribute", "Browse member posts and specialist channels, then watch the featured community video."],
    ["members", "Find the right people", "Search by name, company, location, role and specialist expertise."],
    ["member/2", "Review before connecting", "Explore a member's experience and expertise, then connect or view their Premium page."],
    ["messages", "Continue the conversation", "Message connections directly or create a private discussion group."],
    ["channels", "Join specialist conversations", "Follow important topics, share insights and join practical ESG discussions."],
    ["research", "Trusted research in one place", "Explore ACSI and RIAA, filter the directory and open each provider's website."],
    ["events", "Discover all ESG related events", "In your industry and add relevant dates to your calendar."],
    ["partners", "Meet community partners", "Explore supporting organisations and visit their websites directly."],
    ["profile", "Make your expertise discoverable", "Add your experience, specialist skills and achievements so the right members can find you."],
    ["premium", "Grow your professional visibility", "Upgrade for profile intelligence, search alerts and a richer public professional page."],
  ];

  /* ---------- helpers ---------- */
  const avatar = (m, cls = "") => `<span class="avatar ${cls}" style="background:${m.color}" aria-hidden="true">${m.initials}</span>`;
  const loc = (m) => [m.city, m.state, m.country].filter(Boolean).join(", ");
  const fmtDate = (iso) => { const d = new Date(iso + "T00:00:00"); return { mon: d.toLocaleString("en-AU", { month: "short" }), day: d.getDate(), year: d.getFullYear() }; };
  const pillClass = (mode) => mode.toLowerCase();
  const toast = (t) => { const el = document.createElement("div"); el.className = "toast"; el.textContent = t; document.body.appendChild(el); setTimeout(() => el.remove(), 2700); };
  const qrSvg = () => { let s = '<svg viewBox="0 0 21 21" role="img" aria-label="Connection QR code (placeholder)">'; let seed = 11; for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; const corner = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13); const on = corner ? ((x % 6 === 0 || y % 6 === 0 || x % 6 === 6 || (x > 1 && x < 5 && y > 1 && y < 5) || (x > 15 && x < 19 && y > 1 && y < 5) || (x > 1 && x < 5 && y > 15 && y < 19)) && !((x === 1 || x === 5 || y === 1 || y === 5) && x < 7 && y < 7 && !(x === 0 || x === 6 || y === 0 || y === 6))) : (seed % 3 === 0); if (on) s += `<rect x="${x}" y="${y}" width="1" height="1" fill="#0f3b2e"/>`; } return s + "</svg>"; };

  /* ---------- shell ---------- */
  function shell(route, content, rail) {
    const links = NAV.map(([r, label, ic]) => {
      if (r === "premium") return `<a href="#premium" class="prem ${route === "premium" ? "on" : ""}"><span class="row" style="gap:8px"><span class="ic" style="color:var(--gold)">${ICONS.star}</span><b>Premium Membership</b></span><small>Intelligence, access & visibility</small></a>`;
      const badge = r === "connections" ? state.connections.length : r === "requests" && state.requests.length ? state.requests.length : "";
      return `<a href="#${r}" class="${route === r ? "on" : ""}"><span class="ic">${ic}</span>${label}${badge ? `<span class="badge">${badge}</span>` : ""}</a>`;
    }).join("");
    return `<div class="shell ${rail ? "" : "narrow"}">
      <aside class="nav">
        <a href="#home" class="brand" style="padding:4px 8px 14px"><span class="mark"><i></i></span><span><b>Sustainable<br>Investment<br>Circle</b><small>The professional community for ESG and sustainable investment.</small></span></a>
        ${links}
        <div class="spacer"></div>
        <a href="#advertise" class="cta-ad">★ ADVERTISE on Sustainable Investment Circle</a>
        <a href="#support" class="cta-sup">✦ Contact Sustainable Investment Circle Support</a>
        <a href="#profile" class="me" style="text-decoration:none">${avatar(me, "sm")}<span><b>${me.name}</b><small>${me.role}</small></span></a>
      </aside>
      <main>${content}</main>
      ${rail ? `<aside class="rail">${rail}</aside>` : ""}
    </div>`;
  }

  const topbar = (placeholder = "Search members by name, company or expertise...") => `<div class="topbar">
    <label class="search">${ICONS.search}<input id="globalSearch" placeholder="${placeholder}" aria-label="Search"></label>
    <a class="chip" href="#requests"><span class="avatar sm" style="background:var(--g7);width:22px;height:22px;font-size:10px">${state.requests.length}</span> Connection request${state.requests.length === 1 ? "" : "s"}</a>
    <a class="btn gold" href="#premium">★ Activate Premium</a>
  </div>`;

  const railPeople = () => {
    const suggestions = D.members.filter(m => !m.me && !state.connections.includes(m.id) && !state.requests.includes(m.id)).slice(0, 3);
    return `<div class="card"><h3>People to connect with</h3><div class="small muted">Fresh suggestions each time you log in.</div>
      ${suggestions.map(m => `<a href="#member/${m.id}" class="person" style="text-decoration:none;color:inherit">${avatar(m)}<span><b>${esc(m.name)}</b><small>${esc(m.org)}</small><small style="color:var(--g7)">Shared interest: ${esc(m.tags[0])}</small></span></a>`).join("")}</div>`;
  };
  const railEvents = () => `<div class="card"><h3>Upcoming community events</h3>
    ${D.events.slice(0, 3).map(e => { const d = fmtDate(e.date); return `<div class="ev"><div class="date"><small>${d.mon}</small><b>${d.day}</b><small style="color:var(--mute)">${d.year}</small></div><div><b class="t">${esc(e.title)}</b><span class="pill ${pillClass(e.mode)}">${e.mode}</span><div class="small muted">${e.time} · ${esc(e.place)} · ${e.type}</div></div></div>`; }).join("")}
    <a class="btn light sm" href="#events" style="width:100%;justify-content:center;margin-top:8px">View all events</a></div>`;
  const railPartners = () => `<div class="card"><h3>Community Partners</h3>
    ${D.partners.map(p => `<div class="person"><span class="provider"><span class="logo" style="font-size:9px;line-height:1.1;text-align:center">Harvest<br>by<br>Dasseti</span></span><span><b>${esc(p.name)}</b><small>${esc(p.org)}</small></span></div>`).join("")}
    <a class="btn light sm" href="#partners" style="width:100%;justify-content:center;margin-top:8px">View all partners</a></div>`;
  const railVideo = () => `<div class="card"><div class="eyebrow">Watch</div><h3>Featured Video</h3><div class="video" role="img" aria-label="Featured community video placeholder"><span>▶</span></div><div class="small muted" style="margin-top:6px">Community highlights — placeholder in prototype.</div></div>`;

  /* ---------- pages ---------- */
  const pages = {};

  pages.login = () => `<div class="landing"><div style="width:100%">
    <div class="logo"><span class="mark" style="width:38px;height:38px;border-radius:50%;background:#fff;display:grid;place-items:center"><i style="width:18px;height:18px;border-radius:50%;background:var(--g7);display:block"></i></span><span>Sustainable<br>Investment<br>Circle</span></div>
    <h1>Connect. Share. Accelerate impact.</h1>
    <p>The professional community for ESG and sustainable investment.</p>
    <div class="verbs"><span>CONNECT</span><span>DISCOVER</span><span>CONTRIBUTE</span></div>
    <form class="auth" id="authForm">
      <h2>Create your Sustainable Investment Circle account</h2>
      <div class="small muted">Join the professional community. You can add the rest of your career profile after creating your account.</div>
      <div class="tabs"><button type="button" id="tabLogin">Log in</button><button type="button" class="on" id="tabCreate">Create account</button></div>
      <div class="field"><label>Full name</label><input placeholder="Your name" value="Nathan Walker"></div>
      <div class="field"><label>Organisation</label><input placeholder="Company or organisation" value="Sustainable Investment Circle"></div>
      <div class="field"><label>Market type</label><select>${D.marketTypes.map(t => `<option ${t === "Industry Association" ? "selected" : ""}>${t}</option>`).join("")}</select></div>
      <div class="field"><label>Job role</label><select>${D.jobRoles.map(t => `<option ${t === "Executive Director" ? "selected" : ""}>${t}</option>`).join("")}<option>Other / enter my own</option></select></div>
      <div class="field"><label>Email address</label><input type="email" placeholder="name@company.com" value="nathan@example.org"></div>
      <div class="field"><label>Password</label><input type="password" placeholder="Minimum 6 characters" value="prototype"></div>
      <button class="btn" type="submit" style="width:100%;justify-content:center;margin-top:16px">Create account</button>
    </form>
  </div></div>`;

  pages.home = () => {
    const content = `${topbar()}
      <div class="eyebrow">Sustainable Investment Circle</div>
      <h1 class="page">Welcome, ${esc(me.name.split(" ")[0])}</h1>
      <p class="lede">The professional community for ESG and sustainable investment.</p>
      <div class="stack" style="margin-top:18px">
        ${state.requests.length ? `<div class="notice"><span class="ico">${ICONS.req}</span><div style="flex:1"><b>You have ${state.requests.length} connection request${state.requests.length === 1 ? "" : "s"} waiting</b><div class="small muted">Review, accept, ignore or decline these requests in Connection Requests.</div></div><a class="btn" href="#requests">Review requests</a></div>` : ""}
        <div class="hero"><div><h2>Connect. Share. Accelerate impact.</h2><p>Build trusted relationships, discover specialist research and take part in the sustainable-investment community.</p></div>
          <div class="acts"><a class="btn" href="#members">Find members</a><a class="btn alt" href="#research">Research directory</a><a class="btn alt" href="#events">Browse events</a></div></div>
        <div class="card row between"><div><b>Complete your professional profile</b><div class="small muted">A stronger profile makes it easier for members to find you and understand your expertise.</div></div><div class="row"><span class="small muted">50%</span><span class="progress"><i style="width:50%"></i></span><a class="btn light sm" href="#profile">Complete profile</a></div></div>
        <div class="grid3"><div class="card stat"><b>${D.members.length}</b><span class="muted">Community members</span></div><div class="card stat"><b>${D.channels.length}</b><span class="muted">Active channels</span></div><div class="card stat"><b>${state.connections.length}</b><span class="muted">Your connections</span></div></div>
        <div class="card invite row between"><div class="row"><span class="ico" style="width:44px;height:44px;border-radius:10px;background:var(--g7);color:#fff;display:grid;place-items:center">${ICONS.req}</span><div><div class="eyebrow" style="color:var(--gold-d)">Grow the member community</div><b>Invite colleagues to Sustainable Investment Circle</b><div class="small muted">Help build the network by inviting ESG, sustainability and responsible investment professionals you know. Add colleagues individually using Name + Email, or upload an Excel / CSV file.</div><div class="opts"><span class="tag">Up to 100 colleagues at a time</span><span class="tag">Name + Email entry</span><span class="tag">Excel / CSV bulk upload</span></div></div></div><button class="btn" data-act="invite">✉ Invite colleagues →</button></div>
        <div class="grid2" style="grid-template-columns:1.5fr 1fr;align-items:start">
          <div><div class="row between"><h2 style="font-family:Georgia,serif;font-size:20px;color:var(--g9)">Community feed</h2><select id="feedFilter" aria-label="Filter feed by channel"><option value="">All channels</option>${D.channels.map(c => `<option value="${c.id}">${c.name}</option>`).join("")}</select></div>
            <div class="card composer" style="margin-top:10px"><textarea id="postText" placeholder="Share an insight, question or update with the community..."></textarea>
              <div class="tools"><button class="btn ghost sm" type="button" data-act="attach">📎 Add documents / photos</button><span class="small muted">Up to 5 files · PDF, Word, PowerPoint or photos · 25 MB each</span><span style="flex:1"></span><select id="postChannel" aria-label="Post to channel">${D.channels.map(c => `<option value="${c.id}">${c.name}</option>`).join("")}</select><button class="btn sm" data-act="post">Post</button></div></div>
            <div class="card" style="margin-top:14px" id="feed">${renderFeed("")}</div></div>
          <div><h2 style="font-family:Georgia,serif;font-size:20px;color:var(--g9)">Popular channels</h2><div class="card chanlist" style="margin-top:10px;padding:8px">${D.channels.slice(0, 9).map(c => `<a href="#channels/${c.id}"><b># ${esc(c.name)}</b><small>${esc(c.desc)}</small></a>`).join("")}<a href="#channels" style="color:var(--g7);font-weight:600">View all channels →</a></div></div>
        </div>
      </div>`;
    return shell("home", content, railPeople() + railEvents() + railPartners() + railVideo());
  };

  function renderFeed(filter) {
    const list = state.posts.filter(p => !filter || p.channel === filter);
    if (!list.length) return `<div class="empty">No posts in this channel yet — be the first.</div>`;
    return list.map(p => { const a = byId(p.author); const c = D.channels.find(c => c.id === p.channel); return `<div class="post">${avatar(a)}<div><b>${esc(a.name)}</b> <span class="meta"># ${esc(c.name)} · ${p.when}</span><div style="margin-top:4px">${esc(p.text)}</div><div class="acts"><span>👍 ${p.likes}</span><span>💬 ${p.comments}</span><span>↗ Share</span></div></div></div>`; }).join("");
  }

  function filterMembers(q) {
    let list = D.members.filter(m => !m.me);
    const s = (q.s || "").toLowerCase();
    if (s) list = list.filter(m => [m.name, m.org, m.role, m.city, ...m.tags].join(" ").toLowerCase().includes(s));
    if (q.country) list = list.filter(m => m.country === q.country);
    if (q.city) list = list.filter(m => m.city === q.city);
    if (q.market) list = list.filter(m => m.market === q.market);
    if (q.role) list = list.filter(m => m.role === q.role);
    list.sort((a, b) => q.sort === "exp" ? b.years - a.years : a.name.split(" ").pop().localeCompare(b.name.split(" ").pop()));
    return list;
  }
  const memberCard = (m) => `<div class="card mcard">${avatar(m, "lg")}<b>${esc(m.name)}</b><div class="role">${esc(m.role)}<br><span class="small">${esc(m.org)}</span><br><span class="small">${esc(loc(m))}</span></div><div>${m.tags.slice(0, 2).map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>${m.premium ? `<span class="tag gold">★ Premium</span>` : ""}<a class="btn sm" href="#member/${m.id}">View professional profile</a></div>`;
  const memberGrid = (list) => list.map(memberCard).join("") || `<div class="empty">No members match those filters.</div>`;

  pages.members = (q = {}) => {
    const countries = [...new Set(D.members.map(m => m.country))].sort();
    const cities = [...new Set(D.members.map(m => m.city))].sort();
    const list = filterMembers(q);
    const content = `${topbar("Search by name, company, skills or expertise...")}
      <h1 class="page">Find ESG & Sustainable Investment Professionals</h1>
      <p class="lede">Search the community by role, skills, market type, location and professional experience. Build connections and identify experienced ESG and sustainable investment professionals.</p>
      <div class="card" style="margin-top:16px">
        <div class="row between" style="align-items:flex-start"><div><div class="eyebrow">Professional talent directory</div><h3 style="font-size:18px">Search the people shaping sustainable investment</h3><div class="small muted">Member profiles can showcase experience, ESG expertise, career achievements, education and professional credentials. Members decide whether their downloadable profile is available.</div></div><div class="tip" style="max-width:300px"><b>Tip:</b> use the search for specific skills such as climate risk, stewardship, ISSB, biodiversity or investor relations.</div></div>
        <form id="memberFilters" class="filters">
          <input name="s" placeholder="Name, company, skill..." value="${esc(q.s || "")}" aria-label="Search members">
          <select name="country" aria-label="Country"><option value="">All countries</option>${countries.map(c => `<option ${q.country === c ? "selected" : ""}>${c}</option>`).join("")}</select>
          <select name="city" aria-label="City"><option value="">All cities</option>${cities.map(c => `<option ${q.city === c ? "selected" : ""}>${c}</option>`).join("")}</select>
          <select name="market" aria-label="Market type"><option value="">All market types</option>${D.marketTypes.map(c => `<option ${q.market === c ? "selected" : ""}>${c}</option>`).join("")}</select>
          <select name="role" aria-label="Job role"><option value="">All job roles</option>${[...new Set(D.members.map(m => m.role))].sort().map(c => `<option ${q.role === c ? "selected" : ""}>${c}</option>`).join("")}</select>
        </form>
        <div class="row between"><label class="small muted">Sort by <select name="sort" form="memberFilters"><option value="az" ${q.sort !== "exp" ? "selected" : ""}>Surname A–Z</option><option value="exp" ${q.sort === "exp" ? "selected" : ""}>Most experience</option></select></label><span class="small muted" id="memberCount">${list.length} professional profile${list.length === 1 ? "" : "s"} shown</span><a class="btn light sm" href="#members">Clear filters</a></div>
      </div>
      <div class="grid5" style="margin-top:16px" id="memberGrid">${memberGrid(list)}</div>`;
    return shell("members", content, railPeople() + railEvents() + railPartners());
  };

  function memberModal(id) {
    const m = byId(+id); if (!m) return "";
    const connected = state.connections.includes(m.id);
    return `<div class="modal-bg" data-close><div class="modal" role="dialog" aria-modal="true" aria-label="Professional profile">
      <button class="x" data-close aria-label="Close">×</button>
      <div class="eyebrow">Professional profile</div>
      <div class="row" style="margin-top:8px;align-items:flex-start">${avatar(m, "xl")}<div><h2 style="font-size:22px;color:var(--g9)">${esc(m.name)} ${m.premium ? `<span class="tag gold">★ Premium</span>` : ""}</h2><div class="muted">${esc(m.role)} · ${esc(m.org)}</div><div class="small" style="margin-top:4px">${esc(m.headline)}</div><div style="margin-top:6px">${m.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}<span class="tag">${m.years} yrs experience</span><span class="tag">PDF profile available</span></div></div></div>
      <div class="row" style="margin-top:14px;flex-wrap:wrap">${m.premium ? `<a class="btn gold sm" href="#premium">★ Premium Page</a>` : ""}<button class="btn ghost sm" data-act="pdf">⤓ Download profile PDF</button>${connected ? `<a class="btn light sm" href="#messages/${m.id}">Message</a>` : `<button class="btn sm" data-act="connect" data-id="${m.id}">Connect</button>`}</div>
      <div class="kv"><div><small>Title</small>${esc(m.role)}</div><div><small>Company</small>${esc(m.org)}</div><div><small>Location</small>${esc(loc(m))}</div><div><small>Market type</small>${esc(m.market)}</div><div><small>Job role</small>${esc(m.role)}</div><div><small>Years of ESG / sustainable investment experience</small>${m.years} years</div></div>
      <div style="margin-top:14px"><small class="eyebrow">Professional headline</small><div>${esc(m.headline)}</div></div>
      <div style="margin-top:12px"><small class="eyebrow">Career profile</small><div class="muted">Not yet added</div></div>
      <div class="qr" style="margin-top:14px">${qrSvg()}<div><b>Connect in person</b><div class="small muted">Scan this member's unique QR code with a phone camera to open their profile and send a connection request.</div><button class="btn light sm" style="margin-top:6px" data-act="qr">Enlarge QR code</button></div></div>
      <div style="margin-top:14px"><small class="eyebrow">Professional summary</small><div>${esc(m.summary)}</div></div>
    </div></div>`;
  }

  pages.connections = () => shell("connections", `${topbar()}<h1 class="page">My Connections</h1><p class="lede">Members you are connected with. Message them directly or review their professional profiles.</p>
    <div class="grid5" style="margin-top:16px">${state.connections.map(id => byId(id)).map(m => `<div class="card mcard">${avatar(m, "lg")}<b>${esc(m.name)}</b><div class="role">${esc(m.role)}<br><span class="small">${esc(m.org)}</span></div><a class="btn light sm" href="#messages/${m.id}">Message</a><a class="btn ghost sm" href="#member/${m.id}">View profile</a></div>`).join("") || `<div class="empty">No connections yet.</div>`}</div>`, railPeople() + railEvents());

  pages.requests = () => shell("requests", `${topbar()}<h1 class="page">Connection Requests</h1><p class="lede">Review, accept, ignore or decline requests from members who want to connect.</p>
    <div class="stack" style="margin-top:16px">${state.requests.map(id => byId(id)).map(m => `<div class="card row between">${avatar(m)}<div style="flex:1"><b>${esc(m.name)}</b><div class="small muted">${esc(m.role)} · ${esc(m.org)} · ${esc(loc(m))}</div><div class="small" style="color:var(--g7)">Shared interest: ${esc(m.tags[0])}</div></div><a class="btn ghost sm" href="#member/${m.id}">View profile</a><button class="btn ghost sm" data-act="decline" data-id="${m.id}">Decline</button><button class="btn sm" data-act="accept" data-id="${m.id}">Accept</button></div>`).join("") || `<div class="card empty">No pending requests.</div>`}</div>`, railPeople());

  pages.messages = (withId) => {
    const id = +withId || state.thread; state.thread = id;
    const conv = D.messages.find(x => x.with === id) || { with: id, thread: [] };
    const other = byId(id);
    const content = `<div class="row between"><div><h1 class="page">Messages</h1><p class="lede">Private direct messages and member-created group conversations.</p></div><button class="btn sm" data-act="group">+ Create message group</button></div>
      <div class="tip" style="margin:12px 0"><b>Private groups:</b> group conversations are shown only to members added by the group creator.</div>
      <div class="card" style="margin-bottom:12px"><div class="eyebrow">Start a direct message</div><label class="search" style="margin-top:6px">${ICONS.search}<input placeholder="Search member name, title or company..." id="msgSearch" aria-label="Search members to message"></label><div id="msgResults"></div></div>
      <div class="msgs"><div class="list"><div class="eyebrow" style="padding:6px 8px">Direct messages</div>${D.messages.map(x => byId(x.with)).map(m => `<a href="#messages/${m.id}" class="${m.id === id ? "on" : ""}">${avatar(m, "sm")}<span><b style="font-size:13px;display:block">${esc(m.name)}</b><small class="muted">${esc(m.org)}</small></span></a>`).join("")}</div>
        <div class="thread"><div class="row" style="padding-bottom:10px;border-bottom:1px solid var(--line);margin-bottom:12px">${avatar(other, "sm")}<b>${esc(other.name)}</b><span class="small muted">${esc(other.role)}, ${esc(other.org)}</span></div>
          <div class="bubbles" id="bubbles">${conv.thread.map(([who, t]) => `<div class="bubble ${who === 1 ? "me" : ""}">${esc(t)}</div>`).join("") || `<div class="empty">Say hello to ${esc(other.name.split(" ")[0])}.</div>`}</div>
          <form class="compose" id="composeForm"><input placeholder="Write a message..." aria-label="Message" id="composeInput"><button class="btn">Send</button></form></div></div>`;
    return shell("messages", content, railPeople() + railEvents());
  };

  pages.channels = (chanId) => {
    const c = D.channels.find(x => x.id === chanId) || D.channels[1];
    const content = `${topbar()}<div class="chan-layout"><div><h1 class="page"># ${esc(c.name)}</h1><p class="lede">${esc(c.desc)} · ${c.members} members</p>
        <div class="card composer" style="margin-top:14px"><textarea placeholder="Post to # ${esc(c.name)}..." id="chanPost"></textarea><div class="tools"><button class="btn ghost sm" type="button" data-act="attach">📎 Attach</button><span style="flex:1"></span><button class="btn sm" data-act="chanpost" data-chan="${c.id}">Post</button></div></div>
        <div class="card" style="margin-top:14px">${renderFeed(c.id)}</div></div>
      <div><h3 style="font-family:Georgia,serif;font-size:18px;color:var(--g9)">All channels</h3><div class="card chanlist" style="margin-top:10px;padding:8px">${D.channels.map(x => `<a href="#channels/${x.id}" class="${x.id === c.id ? "on" : ""}"><b># ${esc(x.name)}</b><small>${esc(x.desc)}</small></a>`).join("")}</div></div></div>`;
    return shell("channels", content, railPeople() + railEvents() + railPartners());
  };

  pages.research = () => shell("research", `<div class="row between"><div><div class="eyebrow">Curated resources</div><h1 class="page">Research Directory</h1><p class="lede">A community directory of external research providers relevant to ESG and sustainable investment.</p></div><div class="row"><div class="card stat" style="padding:8px 14px"><b style="font-size:20px">${D.research.length}</b><span class="small muted">Research providers</span></div><button class="btn sm" data-act="addprovider">+ Add research provider</button></div></div>
    <div class="banner" style="margin-top:16px"><div class="eyebrow" style="color:var(--gold)">Sustainable investment research</div><h2>Find research providers in one professional directory.</h2><p>Browse specialist research organisations and external research websites contributed by Sustainable Investment Circle members and administrators. Providers are always listed alphabetically.</p></div>
    <div class="card" style="margin-top:14px"><div class="filters" style="grid-template-columns:2fr 1fr 1fr 1fr auto;margin:0"><input placeholder="Search provider name, country, type, category or research focus..." aria-label="Search providers"><select aria-label="Country"><option>All countries</option><option>Australia</option><option>New Zealand</option></select><select aria-label="Provider type"><option>All provider types</option><option>Association</option><option>Research house</option><option>Data provider</option></select><select aria-label="Category"><option>All research categories</option>${D.tags.map(t => `<option>${t}</option>`).join("")}</select><button class="btn light sm">Clear filters</button></div></div>
    <div class="stack" style="margin-top:14px">${D.research.map(r => `<div class="card provider"><span class="logo">${esc(r.short)}</span><div><b>${esc(r.name)}</b><div class="small muted">${esc(r.url.replace("https://", ""))}</div><div style="margin:4px 0">${[r.country, r.type, ...r.categories].map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div><div class="small">${esc(r.desc)}</div></div><a class="btn sm" href="${r.url}" target="_blank" rel="noopener">Visit website ↗</a></div>`).join("")}</div>
    <div class="small muted" style="margin-top:12px">Available to all Sustainable Investment Circle members. Any member can add a research provider; new listings are reviewed by administrators before they appear.</div>`,
    railPeople() + railEvents() + railPartners());

  pages.events = () => shell("events", `<div class="row between"><div><h1 class="page">ESG Events</h1><p class="lede">Discover, list and plan ESG community events over the next 12 months.</p></div><button class="btn sm" data-act="listevent">+ List an ESG event</button></div>
    <div class="grid2" style="grid-template-columns:minmax(0,1fr) 260px;margin-top:16px;align-items:start"><div><div class="row between"><h3 style="font-size:17px">Upcoming events</h3><select aria-label="Event filter"><option>All events</option><option>Virtual</option><option>In person</option></select></div>
      <div class="stack" style="margin-top:10px">${D.events.map(e => { const d = fmtDate(e.date); const by = byId(e.listedBy); return `<div class="card event"><div class="date"><small>${d.mon}</small><b>${d.day}</b><small style="color:var(--mute)">${d.year}</small></div><div><b style="font-size:15px">${esc(e.title)}</b> <span class="pill ${pillClass(e.mode)}">${e.mode}</span><div class="small muted">${e.time} · ${esc(e.place)} · ${e.type} · ${e.mode === "Virtual" ? "Online" : "In person"}</div><div style="margin-top:6px">${esc(e.desc)}</div><div class="listed">${avatar(by, "sm")}<span>Listed by <b>${esc(by.name)}</b>, ${esc(by.org)}</span></div></div><div class="acts"><button class="btn ghost sm" data-act="calendar">📅 Add to calendar</button><button class="btn light sm" data-act="details">View details</button></div></div>`; }).join("")}</div></div>
      <div class="card"><h3>Event directory</h3><div class="small muted">Members can list industry conferences, roundtables, webinars, networking events, workshops and community meetings.</div><div class="field"><label>Filter by event type</label><select><option>All event types</option><option>Roundtable</option><option>Forum</option><option>Workshop</option><option>Webinar</option><option>Networking</option></select></div><div class="field"><label>Filter by location</label><input placeholder="e.g. Sydney or Online"></div><button class="btn light sm" style="margin-top:10px;width:100%;justify-content:center">Clear filters</button></div></div>`,
    railPeople() + railEvents());

  pages.partners = () => shell("partners", `<h1 class="page">Sustainable Investment Circle Partners</h1><p class="lede">Meet the organisations supporting the community — all Partner profiles are available to all members.</p>
    <div class="grid3" style="margin-top:16px">${D.partners.map(p => `<div class="card"><div class="provider" style="grid-template-columns:auto 1fr"><span class="logo" style="width:64px;height:64px;font-size:11px;line-height:1.1;text-align:center">Harvest<br>by<br>Dasseti</span><div><div class="small muted">${esc(p.org)}</div><b style="font-size:16px">${esc(p.name)}</b></div></div><p class="small" style="margin:12px 0">${esc(p.desc)}</p><a class="btn sm" href="${p.url}" target="_blank" rel="noopener">Visit website ↗</a></div>`).join("")}
      <div class="card" style="border-style:dashed;display:grid;place-items:center;text-align:center;color:var(--mute)"><div><b style="color:var(--g9)">Become a community partner</b><div class="small">Support the community and reach ESG and sustainable-investment professionals.</div><a class="btn gold sm" href="#advertise" style="margin-top:10px">Partner with us</a></div></div></div>`,
    railPeople() + railEvents());

  pages.alerts = () => shell("alerts", `<h1 class="page">Alerts</h1><p class="lede">Connection requests, replies, event listings and profile nudges.</p><div class="card stack" style="margin-top:16px;gap:0">${D.alerts.map(a => `<div class="post" style="grid-template-columns:1fr"><div><span class="tag">${a.type}</span> <span class="small muted">${a.when}</span><div style="margin-top:4px">${esc(a.text)}</div></div></div>`).join("")}</div>`, railPeople());

  pages.profile = () => shell("profile", `<div class="row between"><div><h1 class="page">My Professional Profile</h1><p class="lede">Build a profile that showcases your ESG and sustainable investment career to industry peers.</p></div><div class="row"><button class="btn light sm" data-act="public">View Public Profile</button><button class="btn ghost sm" data-act="qr">▦ Show connection QR</button><button class="btn ghost sm" data-act="pdf">⤓ Download profile PDF</button></div></div>
    <div class="banner row between" style="margin-top:16px"><div><div class="eyebrow" style="color:var(--gold)">Your industry profile</div><h2>Make your experience discoverable</h2><p>This profile is designed to work as your professional Sustainable Investment Circle career profile. Complete the sections that best demonstrate your expertise, achievements and experience.</p></div><div class="strength"><div><b>Profile strength</b><div class="small" style="color:#d6e6dd">Add career details to improve how you appear in professional searches.</div></div><span class="progress"><i style="width:50%"></i></span><b>50%</b></div></div>
    <form class="card" style="margin-top:14px" id="profileForm"><div class="row between"><div><b>Edit your professional profile</b><div class="small muted">Save your changes at any time while completing the sections below.</div></div><button class="btn sm">Save professional profile</button></div>
      <div class="row" style="margin-top:16px;align-items:flex-start">${avatar(me, "xl")}<div style="flex:1"><div class="eyebrow">1 · Professional identity</div><div class="form2"><div class="field"><label>Name</label><input value="${esc(me.name)}"></div><div class="field"><label>Title</label><input value="${esc(me.role)}"></div><div class="field"><label>Company</label><input value="${esc(me.org)}"></div><div class="field"><label>Location</label><input value="${esc(loc(me))}"></div><div class="field"><label>Market type</label><select>${D.marketTypes.map(t => `<option ${t === me.market ? "selected" : ""}>${t}</option>`).join("")}</select></div><div class="field"><label>Job role</label><select>${D.jobRoles.map(t => `<option ${t === me.role ? "selected" : ""}>${t}</option>`).join("")}<option>Other / enter my own</option></select></div><div class="field full"><label>Professional headline</label><input placeholder="e.g. Responsible investment leader | Climate strategy | Stewardship & active ownership"></div><div class="field"><label>Years of ESG / sustainable investment experience</label><input type="number" placeholder="e.g. 12"></div></div></div></div>
      <div style="margin-top:18px"><div class="eyebrow">2 · Career profile</div><div class="small muted">Showcase the depth of your professional experience.</div><div class="field"><label>Professional summary</label><textarea>${esc(me.summary)}</textarea></div><div class="form2"><div class="field"><label>Specialist skills</label><input placeholder="Climate risk, stewardship, ISSB..."></div><div class="field"><label>Education & credentials</label><input placeholder="Degrees, CFA, PRI Academy..."></div></div></div>
      <div style="margin-top:18px"><div class="eyebrow">3 · Visibility</div><label class="row small" style="margin-top:6px"><input type="checkbox" checked> Allow members to download my profile as a PDF</label><label class="row small"><input type="checkbox" checked> Show my profile in member search</label></div></form>`,
    railPeople() + railEvents());

  pages.premium = () => shell("premium", `${topbar()}<div class="banner"><div class="eyebrow" style="color:var(--gold)">Premium membership</div><h2 style="font-size:30px;max-width:760px">Turn Sustainable Investment Circle into your private professional intelligence and visibility dashboard.</h2><p>Premium combines a private intelligence dashboard, profile-view analytics, saved professional searches, audience building and a public thought-leadership page — all for one annual subscription.</p>
      <div style="margin-top:20px"><div class="small" style="color:#d6e6dd">Standard Premium <span class="strike">US$149</span> / year</div><div class="price">US$99</div><div class="small" style="color:#d6e6dd">Founding Premium Member / year</div><div class="small" style="color:#b9d2c6;max-width:520px;margin-top:4px">Join during the launch period and retain the US$99 annual rate while your Premium membership remains continuously active.</div></div>
      <div class="row" style="margin-top:18px"><button class="btn gold" data-act="premium">Request Premium access</button><span class="small" style="color:#d6e6dd">Pay securely via your external Airwallex credit-card link</span></div></div>
    <div class="grid2" style="grid-template-columns:1fr 1.1fr;margin-top:16px;align-items:start"><div class="stack">
        <div class="card"><h3>Why Premium is valuable</h3><p class="small muted" style="margin:6px 0 0">Premium is designed to create measurable professional advantage: understand who is discovering you, find the right people sooner, receive tailored intelligence and build an audience around your work. Your existing Sustainable Investment Circle profile remains the source for your identity, including your name and profile photo.</p></div>
        <div class="grid3" style="grid-template-columns:1fr 1fr 1fr">${D.premiumFeatures.map(([t, d]) => `<div class="card feat"><span class="ico">${ICONS.star}</span><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join("")}</div></div>
      <div><div class="row between small muted" style="margin-bottom:6px"><b style="color:var(--ink)">Preview: ${esc(me.name)}'s Premium Member Home Page</b><span>Personalised using your existing member profile</span></div>
        <div class="preview"><div class="ph">${avatar(me, "lg")}<div style="flex:1"><span class="tag gold">★ Premium member page</span><h3 style="color:#fff;font-size:22px;font-family:Georgia,serif;margin-top:4px">${esc(me.name)}</h3><div class="small" style="color:#d6e6dd">${esc(me.role)} · ${esc(me.org)} · ${esc(loc(me))}</div></div><div style="text-align:center"><b style="font-size:24px;display:block">12</b><small style="font-size:9px;letter-spacing:.1em;color:var(--gold)">FEATURED PIECES</small></div></div>
          <div style="padding:12px 14px 0;font-weight:600">A premium professional home page designed to showcase your expertise, research and industry contribution.</div>
          <div class="body"><div class="box"><b>Professional Summary</b>${esc(me.summary)}</div><div class="box gold"><b>Current Focus</b>Use this space to highlight the sustainable-investment themes, research priorities or professional initiatives you want other members to associate with your work.</div><div class="box dark"><b>Featured Insight</b>Promote one high-value piece of thought leadership with editorial treatment — ideal for an investment paper, stewardship framework, climate-risk note or presentation you want the community to remember.</div><div class="box"><small class="eyebrow">Research</small><b>Selected publications</b>Curate investment papers, ESG reports and practical frameworks.</div><div class="box"><small class="eyebrow">Media</small><b>Speaking & media</b>Highlight podcasts, webinars, panels, interviews and conference contributions.</div><div class="box" style="grid-column:1/-1"><small class="eyebrow">Visibility</small><b>Professional presence</b>Create a page other members can revisit, share and search.</div></div></div></div></div>`,
    null);

  pages.privacy = () => shell("privacy", `<h1 class="page">Privacy Policy</h1><p class="lede">Placeholder. The privacy policy, terms of use and community guidelines are resolved by the <code>legal-docs</code> and <code>privacy-and-residency</code> Wayfinder tickets.</p><div class="card" style="margin-top:16px"><p>This prototype stores no personal data. Nothing you type is sent anywhere; all content is fictional sample data loaded from a static file.</p></div>`, null);
  pages.advertise = () => shell("advertise", `<h1 class="page">Advertise on Sustainable Investment Circle</h1><p class="lede">Placeholder. Partner tiers, ad placements and pricing are resolved by the <code>partners-advertising</code> and <code>commercial-model</code> Wayfinder tickets.</p><div class="card" style="margin-top:16px"><b>Reach ESG and sustainable-investment professionals</b><div class="small muted" style="margin-top:4px">Partner profile · home-page rail placement · featured video · event sponsorship</div><button class="btn gold sm" style="margin-top:12px" data-act="enquire">Enquire</button></div>`, null);
  pages.support = () => shell("support", `<h1 class="page">Contact Sustainable Investment Circle Support</h1><p class="lede">Placeholder. Support channels and SLA are resolved by the <code>operating-model</code> Wayfinder ticket.</p><form class="card" style="margin-top:16px" id="supportForm"><div class="field"><label>Topic</label><select><option>Account</option><option>Profile</option><option>Premium</option><option>Report content</option><option>Other</option></select></div><div class="field"><label>Message</label><textarea placeholder="How can we help?"></textarea></div><button class="btn sm" style="margin-top:12px">Send</button></form>`, null);

  /* ---------- router ---------- */
  function render() {
    const hash = location.hash.replace(/^#\/?/, "") || "login";
    const [route, arg] = hash.split("/");
    const app = $("#app");
    let modal = "";
    let page = route;
    if (route === "member") { page = sessionStorage.getItem("sic:last") || "members"; modal = memberModal(arg); }
    else if (!pages[page]) page = "home";
    if (page !== "login" && !state.loggedIn && page !== "member") { /* allow deep links straight in */ state.loggedIn = true; }
    if (!modal) sessionStorage.setItem("sic:last", page);
    app.innerHTML = (page === "login" ? pages.login() : pages[page](arg)) + modal + tourBox(page === "login" ? "login" : hash);
    document.body.style.overflow = modal ? "hidden" : "";
    window.scrollTo(0, 0);
    bind(page);
  }

  function tourBox(hash) {
    const step = state.tour; if (!step) return "";
    const [, t, d] = TOUR[step - 1];
    return `<div class="tour" role="status"><span class="n">${step}</span><div><b>${esc(t)}</b><small>${esc(d)}</small></div><div class="acts">${step > 1 ? `<button class="btn ghost sm" data-tour="${step - 1}">Back</button>` : ""}${step < TOUR.length ? `<button class="btn sm" data-tour="${step + 1}">Next</button>` : `<button class="btn sm" data-tour="0">Finish</button>`}<button class="btn ghost sm" data-tour="0" aria-label="Close tour">×</button></div></div>`;
  }

  function goTour(step) {
    state.tour = step; sessionStorage.setItem("sic:tour", step);
    if (step) { const [route] = TOUR[step - 1]; location.hash = "#" + route; if (("#" + route) === location.hash) render(); }
    else render();
  }

  function bind(page) {
    const app = $("#app");
    app.onclick = (e) => {
      const close = e.target.closest("[data-close]");
      if (close && (e.target === close || close.classList.contains("x"))) { history.back(); return; }
      const tour = e.target.closest("[data-tour]"); if (tour) { goTour(+tour.dataset.tour); return; }
      const act = e.target.closest("[data-act]"); if (!act) return;
      const id = +act.dataset.id;
      switch (act.dataset.act) {
        case "accept": state.requests = state.requests.filter(x => x !== id); state.connections.push(id); toast(`You are now connected with ${byId(id).name}.`); render(); break;
        case "decline": state.requests = state.requests.filter(x => x !== id); toast("Request declined."); render(); break;
        case "connect": toast(`Connection request sent to ${byId(id).name}.`); act.textContent = "Request sent"; act.disabled = true; break;
        case "post": { const t = $("#postText").value.trim(); if (!t) { toast("Write something first."); break; } state.posts.unshift({ author: 1, channel: $("#postChannel").value, when: "now", text: t, likes: 0, comments: 0 }); render(); toast("Posted to the community feed."); break; }
        case "chanpost": { const t = $("#chanPost").value.trim(); if (!t) { toast("Write something first."); break; } state.posts.unshift({ author: 1, channel: act.dataset.chan, when: "now", text: t, likes: 0, comments: 0 }); render(); toast("Posted."); break; }
        case "pdf": toast("Prototype: profile PDF generation is a Wayfinder ticket (profile-pdf-qr)."); break;
        case "qr": toast("Prototype: QR payload and expiry are decided in profile-pdf-qr."); break;
        case "invite": toast("Prototype: invite flow (email / CSV) is decided in invite-import."); break;
        case "attach": toast("Prototype: attachments are mocked (5 files, 25 MB each)."); break;
        case "premium": toast("Prototype: Airwallex link and activation are decided in premium-entitlement."); break;
        case "group": toast("Prototype: group messaging rules are decided in messaging-scope."); break;
        case "addprovider": toast("Prototype: provider approval is decided in research-curation."); break;
        case "listevent": toast("Prototype: event listing workflow is decided in events-workflow."); break;
        case "calendar": toast("Prototype: ICS export is decided in events-workflow."); break;
        case "details": toast("Event detail page — not yet designed."); break;
        case "public": toast("Public profile view — same as the member modal."); location.hash = "#member/1"; break;
        case "enquire": toast("Prototype: enquiry sent nowhere."); break;
      }
    };
    const auth = $("#authForm"); if (auth) { auth.onsubmit = (e) => { e.preventDefault(); state.loggedIn = true; if (state.tour === 1) goTour(2); else location.hash = "#home"; }; $("#tabLogin").onclick = () => { state.loggedIn = true; location.hash = "#home"; }; }
    const mf = $("#memberFilters"); if (mf) { const apply = () => { const fd = new FormData(mf); const q = {}; for (const [k, v] of fd) if (v) q[k] = v; const list = filterMembers(q); $("#memberGrid").innerHTML = memberGrid(list); $("#memberCount").textContent = `${list.length} professional profile${list.length === 1 ? "" : "s"} shown`; }; mf.oninput = apply; mf.onchange = apply; mf.onsubmit = (e) => e.preventDefault(); }
    const ff = $("#feedFilter"); if (ff) ff.onchange = () => { $("#feed").innerHTML = renderFeed(ff.value); };
    const gs = $("#globalSearch"); if (gs) gs.onkeydown = (e) => { if (e.key === "Enter") { location.hash = "#members"; setTimeout(() => { const i = $("#memberFilters input[name=s]"); if (i) { i.value = gs.value; i.dispatchEvent(new Event("input", { bubbles: true })); } }, 0); } };
    const cf = $("#composeForm"); if (cf) cf.onsubmit = (e) => { e.preventDefault(); const t = $("#composeInput").value.trim(); if (!t) return; let conv = D.messages.find(x => x.with === state.thread); if (!conv) { conv = { with: state.thread, thread: [] }; D.messages.push(conv); } conv.thread.push([1, t]); render(); };
    const ms = $("#msgSearch"); if (ms) ms.oninput = () => { const q = ms.value.toLowerCase(); const r = $("#msgResults"); if (!q) { r.innerHTML = ""; return; } const hits = D.members.filter(m => !m.me && [m.name, m.org, m.role].join(" ").toLowerCase().includes(q)).slice(0, 5); r.innerHTML = hits.map(m => `<a href="#messages/${m.id}" class="person" style="text-decoration:none;color:inherit">${avatar(m, "sm")}<span><b>${esc(m.name)}</b><small>${esc(m.role)}, ${esc(m.org)}</small></span></a>`).join("") || `<div class="small muted" style="padding:8px">No members found.</div>`; };
    const pf = $("#profileForm"); if (pf) pf.onsubmit = (e) => { e.preventDefault(); toast("Profile saved (prototype — not persisted)."); };
    const sf = $("#supportForm"); if (sf) sf.onsubmit = (e) => { e.preventDefault(); toast("Message sent nowhere — prototype."); };
  }

  // Tour launcher in the banner
  document.addEventListener("click", (e) => { const t = e.target.closest("#startTour"); if (t) { e.preventDefault(); goTour(1); } });
  window.addEventListener("hashchange", render);
  state.tour = +(sessionStorage.getItem("sic:tour") || 0);
  render();
})();
