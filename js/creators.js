/* ===========================
   CREDGE — Creators Page
   Requires: data.js
   =========================== */

let shuffledPeople = [];
let activeRole        = "all";
let activeGender      = "all";
let activeNationality = "all";
let activeHeightMin   = null;
let activeHeightMax   = null;

const ROLE_FILTER_ROLES = {
  model:        ["model"],
  photographer: ["photographer"],
  stylist:      ["stylist"],
  hair_make:    ["makeup", "hair", "hair_makeup"],
  casting:      ["casting"],
  set_designer: ["set_designer"],
  art_director: ["art_director"],
  actor:        ["actor"],
  dancer:       ["dancer"],
  kid:          ["kid"],
  illustrator:  ["illustrator"],
};

const CREATORS_ORDER_KEY = "credge_creators_order";

document.addEventListener("DOMContentLoaded", async () => {
  await window.CREDGE_READY;
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

  const urlRole = new URLSearchParams(window.location.search).get("role");
  if (urlRole && ROLE_FILTER_ROLES[urlRole]) {
    activeRole = urlRole;
  }

  renderCreatorsGrid();
  initRoleFilter();
  initGenderFilter();
  initNationalityFilter();
  initHeightFilter();
  initHeaderScroll();
  initMobileMenu();

  if (urlRole && ROLE_FILTER_ROLES[urlRole]) {
    document.querySelectorAll("#role-filter .creators-filter-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.role === urlRole);
    });
  }
});


// Each filter group behaves as a toggle: clicking the already-active
// button deselects it, falling back to "all" (unfiltered) — there is no
// dedicated "All" button since it's rarely used on its own.
function initRoleFilter() {
  document.querySelectorAll("#role-filter .creators-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const wasActive = btn.classList.contains("active");
      document.querySelectorAll("#role-filter .creators-filter-btn").forEach(b => b.classList.remove("active"));
      if (wasActive) {
        activeRole = "all";
      } else {
        btn.classList.add("active");
        activeRole = btn.dataset.role;
      }
      renderCreatorsGrid();
    });
  });
}

function initGenderFilter() {
  document.querySelectorAll("#gender-filter .creators-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const wasActive = btn.classList.contains("active");
      document.querySelectorAll("#gender-filter .creators-filter-btn").forEach(b => b.classList.remove("active"));
      if (wasActive) {
        activeGender = "all";
      } else {
        btn.classList.add("active");
        activeGender = btn.dataset.gender;
      }
      renderCreatorsGrid();
    });
  });
}

function initNationalityFilter() {
  document.querySelectorAll("#nationality-filter .creators-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const wasActive = btn.classList.contains("active");
      document.querySelectorAll("#nationality-filter .creators-filter-btn").forEach(b => b.classList.remove("active"));
      if (wasActive) {
        activeNationality = "all";
      } else {
        btn.classList.add("active");
        activeNationality = btn.dataset.nationality;
      }
      renderCreatorsGrid();
    });
  });
}

// Free-entry min/max (cm) rather than preset buttons, since the useful
// range varies person to person — e.g. "170–180". Either side can be
// left blank for an open-ended range.
function initHeightFilter() {
  const minInput = document.getElementById("height-min");
  const maxInput = document.getElementById("height-max");
  if (!minInput || !maxInput) return;

  minInput.addEventListener("input", () => {
    activeHeightMin = minInput.value === "" ? null : Number(minInput.value);
    renderCreatorsGrid();
  });
  maxInput.addEventListener("input", () => {
    activeHeightMax = maxInput.value === "" ? null : Number(maxInput.value);
    renderCreatorsGrid();
  });
}

function getPersonNationality(p) {
  const divs = DIVISIONS[p.agency_id];
  if (!divs) return null;
  if (divs.asian && divs.asian.includes(p.id)) return "asian";
  return "international";
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

  if (activeNationality !== "all") {
    filtered = filtered.filter(p => getPersonNationality(p) === activeNationality);
  }

  if (activeHeightMin !== null || activeHeightMax !== null) {
    filtered = filtered.filter(p => {
      const h = p.measurements && p.measurements.height;
      if (h == null) return false;
      if (activeHeightMin !== null && h < activeHeightMin) return false;
      if (activeHeightMax !== null && h > activeHeightMax) return false;
      return true;
    });
  }

  grid.className = SHOW_MEDIA ? "creators-grid" : "people-list";
  grid.innerHTML = filtered.map(p => {
    const agency = p.agency_id ? agencies.find(a => a.id === p.agency_id) : null;
    return renderPersonItemHTML(p, agency ? agency.name : "");
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
