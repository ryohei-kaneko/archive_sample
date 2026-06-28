/* ===========================
   ARCHIVE JP — Person Page
   Requires: data.js
   =========================== */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get("id");
  const person = people.find(p => p.id === id);

  if (!person) {
    document.getElementById("person-main").innerHTML =
      `<div class="container" style="padding:80px 0;text-align:center;color:var(--text-muted);font-size:14px;">Person not found.</div>`;
    return;
  }

  document.title = `${person.name_en} — CREDGE`;

  const agency       = person.agency_id ? agencies.find(a => a.id === person.agency_id) : null;
  const personWorks  = works.filter(w => w.credits.some(c => c.person === person.name));

  renderPersonHeader(person, agency, personWorks.length);
  renderPersonWorks(personWorks, person.name);
  initCreditsModal();
  initHeaderScroll();
  initMobileMenu();
});


function renderPersonHeader(person, agency, workCount) {
  const el = document.getElementById("person-header");
  if (!el) return;

  const photoHTML = person.profile_image
    ? `<img class="person-profile-photo" src="${person.profile_image}" alt="${person.name}">`
    : `<div class="person-avatar-xl" style="background:${person.color}">
         ${person.name.slice(0, 1)}
         ${person.is_verified ? `<div class="verified-dot"></div>` : ""}
       </div>`;

  const linksHTML = `
    <div class="person-links">
      ${person.instagram_url
        ? `<a class="person-link" href="${person.instagram_url}" target="_blank" rel="noopener">Instagram</a>`
        : ""}
      ${person.composite_url
        ? `<a class="person-link" href="${person.composite_url}" target="_blank" rel="noopener">Composite</a>`
        : ""}
    </div>
  `;

  const agencyHTML = agency
    ? `
      <div class="person-contact-area">
        <a class="person-agency-link" href="agency.html?id=${agency.id}">
          <span class="person-agency-label">Model Agency</span>
          ${agency.name}
        </a>
        ${agency.website && agency.website !== "#"
          ? `<a class="btn-booking" href="${agency.website}" target="_blank" rel="noopener">Book via Agency →</a>`
          : ""}
      </div>
    `
    : "";

  el.innerHTML = `
    <div class="person-profile-inner">
      ${photoHTML}
      <div class="person-profile-info">
        <div class="person-profile-role">${ROLE_LABEL[person.primary_role] || person.primary_role}</div>
        <h1 class="person-profile-name">${person.name_en}</h1>
        ${person.name !== person.name_en ? `<div class="person-profile-name-sub">${person.name}</div>` : ""}
        ${linksHTML}
        ${renderMeasurements(person)}
        ${agencyHTML}
      </div>
    </div>
  `;
}


function renderMeasurements(person) {
  const m = person.measurements;
  if (!m) return "";

  const items = [
    { label: "Height", value: m.height ? `${m.height} cm` : null },
    { label: "Bust",   value: m.bust   ? `${m.bust} cm`   : null },
    { label: "Waist",  value: m.waist  ? `${m.waist} cm`  : null },
    { label: "Hip",    value: m.hip    ? `${m.hip} cm`    : null },
    { label: "Shoe",   value: m.shoe   ? `${m.shoe} cm`   : null },
  ].filter(i => i.value);

  return `
    <dl class="person-measurements">
      ${items.map(i => `
        <div class="person-measurements-item">
          <dt>${i.label}</dt>
          <dd>${i.value}</dd>
        </div>
      `).join("")}
    </dl>
  `;
}



function renderPersonWorks(personWorks, personName) {
  const grid = document.getElementById("person-works-grid");
  if (!grid) return;

  grid.className = "person-works-list";
  if (personWorks.length === 0) {
    grid.innerHTML = `<div class="no-results">No works found.</div>`;
    return;
  }
  grid.innerHTML = personWorks.map(w => renderPersonWorkRow(w)).join("");
  grid.querySelectorAll(".work-row").forEach(el => {
    el.addEventListener("click", () => openCreditsModal(el.dataset.id));
  });
}


function renderPersonWorkRow(w) {
  const thumb = w.image_url
    ? `<img src="${w.image_url}" alt="${w.title}" class="work-row-thumb">`
    : `<div class="work-row-thumb work-row-thumb--color" style="background:${w.color};"></div>`;

  return `
    <article class="work-row" data-id="${w.id}">
      ${thumb}
      <div class="work-row-brand">${w.brand || "—"}</div>
      <div class="work-row-title">${w.title}</div>
    </article>
  `;
}


function openCreditsModal(workId) {
  const w = works.find(x => x.id === workId);
  if (!w) return;

  const creditsHTML = groupCredits(w.credits).map(g => `
    <div class="cm-credit-row">
      <div class="cm-credit-role">${ROLE_LABEL[g.role] || g.role}</div>
      <div class="cm-credit-names">${g.people.map(n => buildCreditNameHTML(n, "")).join(", ")}</div>
    </div>
  `).join("");

  document.getElementById("cm-title").textContent = w.title;
  document.getElementById("cm-brand").textContent = w.brand || "—";
  document.getElementById("cm-season").textContent = w.season;
  document.getElementById("cm-credits").innerHTML = creditsHTML;

  const modal = document.getElementById("credits-modal");
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCreditsModal() {
  document.getElementById("credits-modal")?.classList.remove("open");
  document.body.style.overflow = "";
}

function initCreditsModal() {
  document.getElementById("cm-close")?.addEventListener("click", closeCreditsModal);
  document.getElementById("cm-backdrop")?.addEventListener("click", closeCreditsModal);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeCreditsModal(); });
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
