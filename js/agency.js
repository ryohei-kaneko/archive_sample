/* ===========================
   ARCHIVE JP — Agency Page
   Requires: data.js
   =========================== */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get("id");
  const agency = agencies.find(a => a.id === id);

  if (!agency) {
    document.getElementById("agency-main").innerHTML =
      `<div class="container" style="padding:80px 0;text-align:center;color:var(--text-muted);font-size:14px;">Agency not found.</div>`;
    return;
  }

  document.title = `${agency.name} — CREDGE`;

  const roster      = people.filter(p => p.agency_id === id);
  const rosterNames = new Set(roster.map(p => p.name));
  const agencyWorks = works.filter(w =>
    w.credits.some(c => rosterNames.has(c.person))
  );

  renderAgencyHeader(agency, roster.length, agencyWorks.length);
  renderAgencyRoster(roster);
  renderAgencyWorks(agencyWorks);
  initModal();
  initHeaderScroll();
  initMobileMenu();
});


function renderAgencyHeader(agency, rosterCount, worksCount) {
  const el = document.getElementById("agency-header");
  if (!el) return;

  const typeLabel = agency.type === "model" ? "Model Agency" : "Creative Agency";

  el.innerHTML = `
    <div class="agency-profile-inner">
      <div class="agency-profile-info">
        <div class="person-profile-role">${typeLabel}</div>
        <h1 class="person-profile-name" style="font-size:clamp(20px,4vw,32px);">${agency.name}</h1>
        <div class="agency-links">
          ${agency.website && agency.website !== "#"
            ? `<a class="agency-website-link" href="${agency.website}" target="_blank" rel="noopener">Website</a>`
            : ""}
          ${agency.instagram_url
            ? `<a class="agency-insta-link" href="${agency.instagram_url}" target="_blank" rel="noopener" aria-label="Instagram">
                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                   <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                   <circle cx="12" cy="12" r="4"/>
                   <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                 </svg>
               </a>`
            : ""}
        </div>
      </div>
    </div>
  `;
}


function renderAgencyRoster(roster) {
  const countEl = document.getElementById("agency-roster-count");
  const grid    = document.getElementById("agency-roster-grid");
  if (!grid) return;

  if (countEl) countEl.textContent = roster.length;

  if (roster.length === 0) {
    grid.innerHTML = `<div class="no-results">No talents listed.</div>`;
    return;
  }

  grid.className = "agency-roster-grid";
  grid.innerHTML = roster.map(p => {
    const avatarInner = p.profile_image
      ? `<img src="${p.profile_image}" alt="${p.name}">`
      : p.name.slice(0, 1);
    return `
      <a class="person-row" href="person.html?id=${p.id}">
        <div class="person-row-avatar" style="${p.profile_image ? "" : `background:${p.color};`}">
          ${avatarInner}
        </div>
        <div class="person-row-info">
          <div class="person-row-name">${p.name_en.toUpperCase()}</div>
          <div class="person-row-sub">${p.name} &nbsp;·&nbsp; ${ROLE_LABEL[p.primary_role] || p.primary_role}</div>
        </div>
      </a>
    `;
  }).join("");
}


function renderAgencyWorks(agencyWorks) {
  const countEl = document.getElementById("agency-works-count");
  const grid    = document.getElementById("agency-works-grid");
  if (!grid) return;

  if (countEl) countEl.textContent = agencyWorks.length;

  if (agencyWorks.length === 0) {
    grid.innerHTML = `<div class="no-results">No works found.</div>`;
    return;
  }

  grid.id = "works-grid";
  grid.innerHTML = agencyWorks.map(w => {
    const bg = w.image_url
      ? `background: url('${w.image_url}') center/cover no-repeat, ${w.color};`
      : `background: ${w.color};`;
    return `
      <article class="work-card" data-id="${w.id}">
        <div class="card-photo" style="${bg}">
          <div class="card-overlay">
            <div class="card-overlay-brand">${w.brand || ""}</div>
            <div class="card-overlay-title">${w.title}</div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}


// ── Modal (same as main.js) ──
function openModal(workId) {
  const w = works.find(x => x.id === workId);
  if (!w) return;

  const imgEl  = document.getElementById("modal-img");
  const infoEl = document.getElementById("modal-info");

  imgEl.style.cssText = w.image_url
    ? `background: url('${w.image_url}') center/cover no-repeat, ${w.color};`
    : `background: ${w.color};`;

  const creditsHTML = groupCredits(w.credits).map(g => `
    <div class="modal-credit-row">
      <div class="modal-credit-role">${ROLE_LABEL[g.role] || g.role}</div>
      <div class="modal-credit-names">
        ${g.people.map(n => buildCreditNameHTML(n, "")).join(",  ")}
      </div>
    </div>
  `).join("");

  const tagsHTML = w.tags.map(t => `<span class="work-tag">${t}</span>`).join("");

  infoEl.innerHTML = `
    <button id="modal-close" aria-label="Close">✕</button>
    <div class="modal-meta">
      <div class="modal-brand">${w.brand || "—"}</div>
      <h2 class="modal-title">${w.title}</h2>
      <div class="modal-season">${w.season}</div>
    </div>
    ${tagsHTML ? `<div class="modal-tags">${tagsHTML}</div>` : ""}
    <div class="modal-credits">${creditsHTML}</div>
  `;

  document.getElementById("modal-close").addEventListener("click", closeModal);

  const modal = document.getElementById("work-modal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("work-modal");
  modal?.classList.remove("open");
  modal?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function initModal() {
  document.getElementById("works-grid")?.addEventListener("click", e => {
    const card = e.target.closest(".work-card");
    if (card) openModal(card.dataset.id);
  });
  document.getElementById("modal-backdrop")?.addEventListener("click", closeModal);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
}


function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.style.boxShadow = window.scrollY > 8 ? "0 1px 0 rgba(0,0,0,0.06)" : "none";
  }, { passive: true });
}

function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu   = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
  });
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.classList.remove("open");
  }));
}
