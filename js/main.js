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

  // Homepage teaser is one row (3-col grid) — the full list lives on works.html.
  const limit = 3;
  grid.innerHTML = filtered.length === 0
    ? `<div class="no-results">No works found.</div>`
    : filtered.slice(0, limit).map(renderCard).join("");
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



// ── Render: People Grid ──
function renderPeople() {
  const grid = document.getElementById("people-grid");
  if (!grid) return;

  const limit = window.innerWidth <= 520 ? 8 : 15;
  const shuffled = [...people].sort(() => Math.random() - 0.5);
  grid.innerHTML = shuffled.slice(0, limit).map(p => {
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
const BRANDS_ORDER_KEY = "credge_brands_order";

function getShuffledBrands() {
  const saved = sessionStorage.getItem(BRANDS_ORDER_KEY);
  if (saved) {
    const ids = JSON.parse(saved);
    const idMap = new Map(brands.map(b => [b.id, b]));
    const restored = ids.map(id => idMap.get(id)).filter(Boolean);
    const savedSet = new Set(ids);
    brands.filter(b => !savedSet.has(b.id)).forEach(b => restored.push(b));
    return restored;
  }
  const shuffled = [...brands].sort(() => Math.random() - 0.5);
  sessionStorage.setItem(BRANDS_ORDER_KEY, JSON.stringify(shuffled.map(b => b.id)));
  return shuffled;
}

function renderBrands() {
  const grid = document.getElementById("brands-grid");
  if (!grid) return;

  const shuffled = getShuffledBrands().slice(0, 9);

  grid.className = "agency-index-grid";
  grid.innerHTML = shuffled.map(b => `
    <a class="agency-row" href="brand.html?id=${b.id}">
      <div class="agency-row-info">
        <div class="agency-row-name">${b.name}</div>
      </div>
    </a>
  `).join("");
}


// ── Render: Agencies ──
const AGENCIES_ORDER_KEY = "credge_agencies_order";

function getShuffledAgencies() {
  const saved = sessionStorage.getItem(AGENCIES_ORDER_KEY);
  if (saved) {
    const ids = JSON.parse(saved);
    const idMap = new Map(agencies.map(a => [a.id, a]));
    const restored = ids.map(id => idMap.get(id)).filter(Boolean);
    const savedSet = new Set(ids);
    agencies.filter(a => !savedSet.has(a.id)).forEach(a => restored.push(a));
    return restored;
  }
  const shuffled = [...agencies].sort(() => Math.random() - 0.5);
  sessionStorage.setItem(AGENCIES_ORDER_KEY, JSON.stringify(shuffled.map(a => a.id)));
  return shuffled;
}

function renderAgencies() {
  const grid = document.getElementById("agencies-grid");
  if (!grid) return;

  const shuffled = getShuffledAgencies().slice(0, 9);

  grid.className = "agency-index-grid";
  grid.innerHTML = shuffled.map(ag => {
    const typeLabel = ag.type === "model" ? "Model Agency" : "Creative Agency";
    return `
      <a class="agency-row" href="agency.html?id=${ag.id}">
        <div class="agency-row-info">
          <div class="agency-row-name">${ag.name}</div>
          <div class="agency-row-sub">${typeLabel}</div>
        </div>
      </a>
    `;
  }).join("");
}

function clearRoleHighlight() {
  document.querySelectorAll(".role-nav-card").forEach(c => c.classList.remove("active"));
}


// ── Search ──
function initSearch() {
  const overlay    = document.getElementById("search-overlay");
  const input      = document.getElementById("search-input");
  const results    = document.getElementById("search-results");
  const openBtn    = document.getElementById("btn-search-open");
  const closeBtn   = document.getElementById("btn-search-close");
  const heroInput  = document.getElementById("hero-search-input");

  function openSearch() {
    overlay?.classList.add("open");
    setTimeout(() => input?.focus(), 50);
  }

  function closeSearch() {
    overlay?.classList.remove("open");
    if (input) { input.value = ""; }
    if (heroInput) { heroInput.value = ""; }
    if (results) { results.innerHTML = ""; }
  }

  openBtn?.addEventListener("click", openSearch);
  closeBtn?.addEventListener("click", closeSearch);
  overlay?.addEventListener("click", e => { if (e.target === overlay) closeSearch(); });

  input?.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    if (!q) { results.innerHTML = ""; return; }
    renderSearchResults(q, results);
  });

  // The hero search box is a always-visible entry point into the same
  // overlay: focusing it opens the overlay, and anything typed before
  // focus lands there is mirrored over so no keystrokes are lost.
  heroInput?.addEventListener("focus", openSearch);
  heroInput?.addEventListener("input", () => {
    if (input) input.value = heroInput.value;
    const q = heroInput.value.toLowerCase().trim();
    if (!q) { results.innerHTML = ""; return; }
    renderSearchResults(q, results);
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      openSearch();
    }
  });
}

function renderSearchResults(q, container) {
  const matchedPeople = people.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.name_en.toLowerCase().includes(q) ||
    (p.name_kana && p.name_kana.toLowerCase().includes(q))
  );

  const matchedBrands = brands.filter(b =>
    b.name.toLowerCase().includes(q)
  );

  const matchedAgencies = agencies.filter(a =>
    a.name.toLowerCase().includes(q)
  );

  const matchedWorks = works.filter(w =>
    w.title.toLowerCase().includes(q) ||
    (w.brand && w.brand.toLowerCase().includes(q)) ||
    (w.season && w.season.toLowerCase().includes(q)) ||
    w.credits.some(c => {
      const person = people.find(p => p.name === c.person);
      return c.person.toLowerCase().includes(q) ||
             (person && person.name_en.toLowerCase().includes(q));
    })
  );

  let html = "";

  if (matchedPeople.length > 0) {
    html += `<div class="search-group-label">Creators</div>`;
    html += matchedPeople.map(p => `
      <a class="search-result-item" href="person.html?id=${p.id}">
        <div class="search-result-name">${p.name_en}</div>
        <div class="search-result-sub">${p.name} · ${ROLE_LABEL[p.primary_role] || p.primary_role}</div>
      </a>
    `).join("");
  }

  if (matchedBrands.length > 0) {
    html += `<div class="search-group-label">Brands</div>`;
    html += matchedBrands.map(b => `
      <a class="search-result-item" href="brand.html?id=${b.id}">
        <div class="search-result-name">${b.name}</div>
      </a>
    `).join("");
  }

  if (matchedAgencies.length > 0) {
    html += `<div class="search-group-label">Agencies</div>`;
    html += matchedAgencies.map(a => `
      <a class="search-result-item" href="agency.html?id=${a.id}">
        <div class="search-result-name">${a.name}</div>
        <div class="search-result-sub">${a.type === "model" ? "Model Agency" : "Creative Agency"}</div>
      </a>
    `).join("");
  }

  if (matchedWorks.length > 0) {
    html += `<div class="search-group-label">Works</div>`;
    html += matchedWorks.slice(0, 6).map(w => `
      <a class="search-result-item search-result-work" data-id="${w.id}" href="#">
        <div class="search-result-name">${w.title}</div>
        <div class="search-result-sub">${w.brand || "—"} · ${w.season}</div>
      </a>
    `).join("");
  }

  if (!html) {
    html = `<div class="search-empty">No results found.</div>`;
  }

  container.innerHTML = html;

  container.querySelectorAll(".search-result-work").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      document.getElementById("search-overlay")?.classList.remove("open");
      openModal(el.dataset.id);
    });
  });
}


// ── Mobile Menu ──
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
  renderWorks();
  renderPeople();
  renderBrands();
  renderAgencies();
  initSearch();
  initMobileMenu();
  initHeaderScroll();
  initModal();
});
