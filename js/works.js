/* ===========================
   CREDGE — Works Index Page
   Requires: data.js
   =========================== */

document.addEventListener("DOMContentLoaded", () => {
  renderWorksGrid();
  initModal();
  initHeaderScroll();
  initMobileMenu();
});

function renderWorksGrid() {
  const grid = document.getElementById("works-grid");
  if (!grid) return;

  if (works.length === 0) {
    grid.innerHTML = `<div class="no-results">No works found.</div>`;
    return;
  }

  grid.innerHTML = works.map(renderCard).join("");
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


// ── Modal (same as main.js/agency.js/brand.js) ──
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
