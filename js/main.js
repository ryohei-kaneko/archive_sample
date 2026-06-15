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

  const countEl = document.getElementById("works-count");
  if (countEl) countEl.textContent = filtered.length;

  grid.innerHTML = filtered.length === 0
    ? `<div class="no-results">No works found.</div>`
    : filtered.map(renderCard).join("");
}

function renderCard(w) {
  const creditGroups = groupCredits(w.credits).slice(0, 5);
  const creditHTML = creditGroups.map(g => `
    <div class="credit-row">
      <span class="credit-role">${ROLE_LABEL[g.role] || g.role}</span>
      <span class="credit-names">
        ${g.people.map(n => buildCreditNameHTML(n, "")).join(" / ")}
      </span>
    </div>
  `).join("");

  const typeLabel = WORK_TYPES.find(t => t.id === w.type)?.label || w.type;
  const typeColor = getWorkColor(w.type);
  const tagHTML   = w.tags.slice(0, 3).map(t => `<span class="work-tag">${t}</span>`).join("");

  return `
    <article class="work-card${w.featured ? " featured" : ""}" data-id="${w.id}">
      <div class="card-image">
        <div class="card-placeholder" style="${w.image_url
          ? `background:url('${w.image_url}') center/cover no-repeat, ${w.color};`
          : `background:${w.color};`}">
          <div style="position:absolute;inset:0;background:linear-gradient(160deg,transparent 30%,rgba(0,0,0,0.55));"></div>
          <div style="position:absolute;bottom:20px;left:20px;right:20px;">
            <div style="font-size:9px;font-weight:700;letter-spacing:0.16em;color:rgba(255,255,255,0.45);text-transform:uppercase;margin-bottom:6px;">${w.brand || "ARCHIVE JP"}</div>
            <div style="font-size:${w.featured ? "17px" : "13px"};font-weight:700;color:#fff;line-height:1.25;letter-spacing:-0.01em;">${w.title}</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:6px;">${w.season}</div>
          </div>
        </div>
        <span class="card-type-badge" style="--badge-color:${typeColor}">${typeLabel}</span>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-brand">${w.brand || "—"}</span>
          <span class="card-season">${w.season}</span>
        </div>
        <div class="card-title">${w.title}</div>
        <div class="card-tags">${tagHTML}</div>
        <div class="card-credits">${creditHTML}</div>
      </div>
    </article>
  `;
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


// ── Render: Role Nav ──
function renderRoleNav() {
  const grid = document.getElementById("role-nav-grid");
  if (!grid) return;

  grid.innerHTML = CREDIT_ROLES_NAV.map(r => `
    <button class="role-nav-card" data-role="${r.id}">
      <div class="role-nav-label">${r.label}</div>
      <div class="role-nav-count">${r.count} people</div>
    </button>
  `).join("");

  grid.querySelectorAll(".role-nav-card").forEach(card => {
    card.addEventListener("click", () => {
      const role = card.dataset.role;
      if (activeRole === role) {
        activeRole = null;
        card.classList.remove("active");
      } else {
        activeRole = role;
        grid.querySelectorAll(".role-nav-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
      }
      activeType = "all";
      renderFilters();
      renderWorks();
      document.getElementById("works-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
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


// ── Stats counter ──
function animateCounters() {
  document.querySelectorAll(".stat-num[data-target]").forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur.toLocaleString();
      if (cur >= target) clearInterval(timer);
    }, 18);
  });
}


// ── Init ──
document.addEventListener("DOMContentLoaded", () => {
  renderFilters();
  renderWorks();
  renderPeople();
  renderBrands();
  renderRoleNav();
  initSearch();
  initMobileMenu();
  initHeaderScroll();
  setTimeout(animateCounters, 400);
});
