/* ===========================
   CREDGE — Creators Page
   Requires: data.js
   =========================== */

let shuffledPeople = [];

const CREATORS_ORDER_KEY = "credge_creators_order";

document.addEventListener("DOMContentLoaded", () => {
  const saved = sessionStorage.getItem(CREATORS_ORDER_KEY);

  if (saved) {
    const ids = JSON.parse(saved);
    const idMap = new Map(people.map(p => [p.id, p]));
    shuffledPeople = ids.map(id => idMap.get(id)).filter(Boolean);
    const savedSet = new Set(ids);
    people.filter(p => !savedSet.has(p.id)).forEach(p => shuffledPeople.push(p));
  } else {
    shuffledPeople = [...people].sort(() => Math.random() - 0.5);
    sessionStorage.setItem(CREATORS_ORDER_KEY, JSON.stringify(shuffledPeople.map(p => p.id)));
  }

  renderCreatorsGrid("all");
  initGenderFilter();
  initHeaderScroll();
  initMobileMenu();
});


function initGenderFilter() {
  document.querySelectorAll(".creators-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".creators-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCreatorsGrid(btn.dataset.gender);
    });
  });
}


function renderCreatorsGrid(gender) {
  const grid = document.getElementById("creators-grid");
  if (!grid) return;

  const filtered = gender === "all" ? shuffledPeople : shuffledPeople.filter(p => p.gender === gender);

  grid.className = "creators-grid";
  grid.innerHTML = filtered.map(p => {
    const bg = p.profile_image
      ? `background: url('${p.profile_image}') center/cover no-repeat;`
      : `background: ${p.color};`;

    const agency = p.agency_id ? agencies.find(a => a.id === p.agency_id) : null;
    const agencyName = agency ? agency.name : "";

    return `
      <a class="creator-card" href="person.html?id=${p.id}">
        <div class="creator-card-img" style="${bg}"></div>
        <div class="creator-card-overlay">
          <div class="creator-card-name">${p.name_en}</div>
          ${p.name !== p.name_en ? `<div class="creator-card-sub">${p.name}</div>` : ""}
          <div class="creator-card-role">${ROLE_LABEL[p.primary_role] || p.primary_role}</div>
          ${agencyName ? `<div class="creator-card-agency">${agencyName}</div>` : ""}
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
