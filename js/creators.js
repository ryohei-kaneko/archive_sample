/* ===========================
   CREDGE — Creators Page
   Requires: data.js
   =========================== */

let shuffledPeople = [];
let activeRole   = "all";
let activeGender = "all";

const ROLE_FILTER_ROLES = {
  model:        ["model"],
  photographer: ["photographer"],
  stylist:      ["stylist"],
  makeup:       ["makeup", "hair_makeup"],
  hair:         ["hair", "hair_makeup"],
  casting:      ["casting"],
  set_designer: ["set_designer"],
  art_director: ["art_director"],
};

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

  renderCreatorsGrid();
  initRoleFilter();
  initGenderFilter();
  initHeaderScroll();
  initMobileMenu();
});


function initRoleFilter() {
  document.querySelectorAll("#role-filter .creators-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#role-filter .creators-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeRole = btn.dataset.role;
      renderCreatorsGrid();
    });
  });
}

function initGenderFilter() {
  document.querySelectorAll("#gender-filter .creators-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#gender-filter .creators-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeGender = btn.dataset.gender;
      renderCreatorsGrid();
    });
  });
}


function renderCreatorsGrid() {
  const grid = document.getElementById("creators-grid");
  if (!grid) return;

  let filtered = shuffledPeople;

  if (activeRole !== "all") {
    const roles = ROLE_FILTER_ROLES[activeRole] || [activeRole];
    filtered = filtered.filter(p =>
      roles.some(r => p.primary_role === r || (p.roles && p.roles.includes(r)))
    );
  }

  if (activeGender !== "all") {
    filtered = filtered.filter(p => p.gender === activeGender);
  }

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
