/* ===========================
   ARCHIVE JP — Homepage Logic
   Requires: data.js
   =========================== */

// ── State ──
let activeType  = "all";
let activeRole  = null;
let searchQuery = "";


// ── Render: Works Grid ──
function renderWorks() {
  const grid = document.getElementById("works-grid");
  if (!grid) return;

  const filtered = works.filter(w => {
    const matchType = activeType === "all" || w.type === activeType;
    const matchRole = !activeRole || w.credits.some(c => c.credit_role === activeRole);
    const matchQ    = !searchQuery ||
      w.title.toLowerCase().includes(searchQuery) ||
      (w.brand && w.brand.toLowerCase().includes(searchQuery)) ||
      (w.season && w.season.toLowerCase().includes(searchQuery)) ||
      w.credits.some(c => c.person.toLowerCase().includes(searchQuery)) ||
      w.tags.some(t => t.toLowerCase().includes(searchQuery));
    return matchType && matchRole && matchQ;
  });

  grid.innerHTML = filtered.length === 0
    ? `<div class="no-results">No works found.</div>`
    : filtered.map(renderCard).join("");
}

function renderCard(w) {
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
}


// ── Modal ──
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


// ── Render: Filter Tabs ──
function renderFilters() {
  const bar = document.getElementById("filter-tabs");
  if (!bar) return;

  bar.innerHTML = WORK_TYPES.map(t => `
    <button class="filter-btn${t.id === activeType ? " active" : ""}" data-type="${t.id}">
      ${t.label}
    </button>
  `).join("");

  bar.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeType = btn.dataset.type;
      activeRole = null;
      renderFilters();
      renderWorks();
      clearRoleHighlight();
    });
  });
}


// ── Render: People Grid ──
function renderPeople() {
  const grid = document.getElementById("people-grid");
  if (!grid) return;

  grid.innerHTML = people.map(p => {
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


// ── Render: Brands ──
function renderBrands() {
  const row = document.getElementById("brands-row");
  if (!row) return;

  row.innerHTML = brands.map(b => `
    <button class="brand-chip" data-brand="${b.name}">
      ${b.name}
    </button>
  `).join("");

  row.querySelectorAll(".brand-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const active = chip.classList.toggle("active");
      searchQuery = active ? chip.dataset.brand.toLowerCase() : "";
      document.querySelectorAll(".brand-chip").forEach(c => { if (c !== chip) c.classList.remove("active"); });
      renderWorks();
      document.getElementById("works-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}


// ── Render: Agencies ──
function renderAgencies() {
  const grid = document.getElementById("agencies-grid");
  if (!grid) return;

  grid.className = "agency-index-grid";
  grid.innerHTML = agencies.map(ag => {
    const typeLabel = ag.type === "model" ? "Model Agency" : "Creative Agency";
    return `
      <a class="agency-row" href="agency.html?id=${ag.id}">
        <div class="agency-row-avatar">${ag.name.slice(0, 1)}</div>
        <div class="agency-row-info">
          <div class="agency-row-name">${ag.name}</div>
          <div class="agency-row-sub">${typeLabel}</div>
        </div>
        <div class="agency-row-arrow">→</div>
      </a>
    `;
  }).join("");
}

function clearRoleHighlight() {
  document.querySelectorAll(".role-nav-card").forEach(c => c.classList.remove("active"));
}


// ── Search ──
function initSearch() {
  const overlay  = document.getElementById("search-overlay");
  const input    = document.getElementById("search-input");
  const openBtn  = document.getElementById("btn-search-open");
  const closeBtn = document.getElementById("btn-search-close");

  openBtn?.addEventListener("click",  () => { overlay?.classList.add("open"); setTimeout(() => input?.focus(), 50); });
  closeBtn?.addEventListener("click", () => closeSearch());
  overlay?.addEventListener("click",  e => { if (e.target === overlay) closeSearch(); });

  input?.addEventListener("input", () => {
    searchQuery = input.value.toLowerCase().trim();
    renderWorks();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      overlay?.classList.add("open");
      setTimeout(() => input?.focus(), 50);
    }
  });

  function closeSearch() {
    overlay?.classList.remove("open");
    if (input) { searchQuery = ""; input.value = ""; renderWorks(); }
  }
}


// ── Mobile Menu ──
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu   = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));
}


// ── Header scroll ──
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.style.boxShadow = window.scrollY > 8 ? "0 1px 0 rgba(0,0,0,0.06)" : "none";
  }, { passive: true });
}


// ── Init ──
document.addEventListener("DOMContentLoaded", () => {
  renderFilters();
  renderWorks();
  renderPeople();
  renderBrands();
  renderAgencies();
  initSearch();
  initMobileMenu();
  initHeaderScroll();
  initModal();
});
