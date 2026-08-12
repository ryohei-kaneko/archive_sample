/* ===========================
   CREDGE — Brands Index Page
   Requires: data.js
   =========================== */

document.addEventListener("DOMContentLoaded", () => {
  renderBrandsGrid();
  initHeaderScroll();
  initMobileMenu();
});

function renderBrandsGrid() {
  const grid = document.getElementById("brands-grid");
  if (!grid) return;

  grid.className = "agency-index-grid";

  if (brands.length === 0) {
    grid.innerHTML = `<div class="no-results">No brands found.</div>`;
    return;
  }

  grid.innerHTML = brands.map(b => `
    <a class="agency-row" href="brand.html?id=${b.id}">
      <div class="agency-row-info">
        <div class="agency-row-name">${b.name}</div>
      </div>
    </a>
  `).join("");
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
