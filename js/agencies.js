/* ===========================
   CREDGE — Agencies Index Page
   Requires: data.js
   =========================== */

document.addEventListener("DOMContentLoaded", () => {
  renderAgenciesGrid();
  initHeaderScroll();
  initMobileMenu();
});

function renderAgenciesGrid() {
  const grid = document.getElementById("agencies-grid");
  if (!grid) return;

  grid.className = "agency-index-grid";
  grid.innerHTML = agencies.map(ag => {
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
