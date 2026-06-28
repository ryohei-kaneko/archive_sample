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
  renderPortfolioGallery(person);
  renderPersonWorks(personWorks, person.name);
  initHeaderScroll();
  initMobileMenu();
  initLightbox();
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
        <div class="person-profile-name-sub">${person.name}</div>
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


function renderPortfolioGallery(person) {
  if (!person.portfolio_images || person.portfolio_images.length === 0) return;
  const section = document.getElementById("person-gallery-section");
  const grid    = document.getElementById("person-gallery");
  if (!section || !grid) return;

  section.style.display = "";
  const visible = person.portfolio_images.slice(0, 4);
  grid.className = "person-gallery-strip";
  grid.innerHTML = visible.map((url, i) => `
    <div class="gallery-item" data-index="${i}">
      <img src="${url}" alt="Photo ${i + 1}" loading="lazy">
    </div>
  `).join("");

  grid.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => openLightbox(person.portfolio_images, parseInt(item.dataset.index)));
  });
}


let _lbImages = [];
let _lbIndex  = 0;

function openLightbox(images, index) {
  _lbImages = images;
  _lbIndex  = index;
  const lb = document.getElementById("lightbox");
  lb.querySelector("#lb-img").src = images[index];
  lb.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
  document.body.style.overflow = "";
}

function initLightbox() {
  if (document.getElementById("lightbox")) return;

  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.style.cssText = "display:none;position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;align-items:center;justify-content:center;";
  lb.innerHTML = `
    <button onclick="closeLightbox()" style="position:absolute;top:20px;right:24px;color:#fff;font-size:28px;background:none;border:none;cursor:pointer;opacity:0.7;">✕</button>
    <button onclick="_lbIndex=(_lbIndex-1+_lbImages.length)%_lbImages.length;document.getElementById('lb-img').src=_lbImages[_lbIndex]"
            style="position:absolute;left:20px;color:#fff;font-size:36px;background:none;border:none;cursor:pointer;opacity:0.7;">‹</button>
    <img id="lb-img" src="" style="max-width:90vw;max-height:90vh;object-fit:contain;display:block;">
    <button onclick="_lbIndex=(_lbIndex+1)%_lbImages.length;document.getElementById('lb-img').src=_lbImages[_lbIndex]"
            style="position:absolute;right:20px;color:#fff;font-size:36px;background:none;border:none;cursor:pointer;opacity:0.7;">›</button>
  `;
  lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });
  document.body.appendChild(lb);

  document.addEventListener("keydown", e => {
    if (lb.style.display === "none") return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft")  { _lbIndex = (_lbIndex - 1 + _lbImages.length) % _lbImages.length; document.getElementById("lb-img").src = _lbImages[_lbIndex]; }
    if (e.key === "ArrowRight") { _lbIndex = (_lbIndex + 1) % _lbImages.length; document.getElementById("lb-img").src = _lbImages[_lbIndex]; }
  });
}


function renderPersonWorks(personWorks, personName) {
  const grid = document.getElementById("person-works-grid");
  if (!grid) return;

  grid.className = "person-works-list";
  grid.innerHTML = personWorks.length === 0
    ? `<div class="no-results">No works found.</div>`
    : personWorks.map(w => renderPersonWorkRow(w, personName)).join("");
}


function renderPersonWorkRow(w, personName) {
  const myRoles = w.credits
    .filter(c => c.person === personName)
    .map(c => ROLE_LABEL[c.credit_role] || c.credit_role)
    .join(", ");

  const typeLabel = WORK_TYPES.find(t => t.id === w.type)?.label || w.type;

  const thumb = w.image_url
    ? `<img src="${w.image_url}" alt="${w.title}" class="work-row-thumb">`
    : `<div class="work-row-thumb work-row-thumb--color" style="background:${w.color};"></div>`;

  return `
    <article class="work-row" data-id="${w.id}">
      ${thumb}
      <div class="work-row-info">
        <div class="work-row-brand">${w.brand || "—"}</div>
        <div class="work-row-title">${w.title}</div>
      </div>
      <div class="work-row-meta">
        <span class="work-row-season">${w.season}</span>
        <span class="work-row-type">${typeLabel}</span>
        <span class="work-row-role">${myRoles}</span>
      </div>
    </article>
  `;
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
    toggle.setAttribute("aria-expanded", open);
  });
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));
}
