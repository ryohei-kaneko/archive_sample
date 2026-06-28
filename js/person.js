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

  document.title = `${person.name} — ARCHIVE`;

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

  const contactHTML = agency
    ? `
      <a class="person-agency-link" href="agency.html?id=${agency.id}">
        <span class="person-agency-label">所属事務所</span>
        ${agency.name}
      </a>
      ${agency.website && agency.website !== "#"
        ? `<a class="btn-booking" href="${agency.website}" target="_blank" rel="noopener">Book via Agency →</a>`
        : ""}
      ${person.instagram_url
        ? `<a class="person-insta-link person-insta-secondary" href="${person.instagram_url}" target="_blank" rel="noopener">Instagram (personal)</a>`
        : ""}
    `
    : `${person.instagram_url
        ? `<a class="person-insta-link" href="${person.instagram_url}" target="_blank" rel="noopener">Instagram →</a>`
        : ""}`;

  el.innerHTML = `
    <div class="person-profile-inner">
      ${photoHTML}
      <div class="person-profile-info">
        <div class="person-profile-role">${ROLE_LABEL[person.primary_role] || person.primary_role}</div>
        <h1 class="person-profile-name">${person.name}</h1>
        <div class="person-profile-name-en">${person.name_en}</div>
        <div class="person-profile-tags">
          ${person.tags.map(t => `<span class="ptag">${t}</span>`).join("")}
        </div>
        <div class="person-profile-stats"><strong>${workCount}</strong> works</div>
        <div class="person-contact-area">${contactHTML}</div>
      </div>
    </div>
  `;
}


function renderPortfolioGallery(person) {
  if (!person.portfolio_images || person.portfolio_images.length === 0) return;
  const section = document.getElementById("person-gallery-section");
  const grid    = document.getElementById("person-gallery");
  if (!section || !grid) return;

  section.style.display = "";
  grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;";
  grid.innerHTML = person.portfolio_images.map((url, i) => `
    <div class="gallery-item" data-index="${i}" style="cursor:pointer;overflow:hidden;aspect-ratio:3/4;background:#111;">
      <img src="${url}" alt="Photo ${i + 1}"
           style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.3s ease;"
           loading="lazy"
           onmouseover="this.style.transform='scale(1.04)'"
           onmouseout="this.style.transform='scale(1)'">
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
  const countEl = document.getElementById("person-works-count");
  const grid    = document.getElementById("person-works-grid");
  if (!grid) return;

  if (countEl) countEl.textContent = personWorks.length;

  grid.innerHTML = personWorks.length === 0
    ? `<div class="no-results">No works found.</div>`
    : personWorks.map(w => renderPersonCard(w, personName)).join("");
}


function renderPersonCard(w, personName) {
  const myRoles = w.credits
    .filter(c => c.person === personName)
    .map(c => ROLE_LABEL[c.credit_role] || c.credit_role)
    .join(", ");

  const creditGroups = groupCredits(w.credits).slice(0, 4);
  const creditHTML   = creditGroups.map(g => `
    <div class="credit-row">
      <span class="credit-role">${ROLE_LABEL[g.role] || g.role}</span>
      <span class="credit-names">
        ${g.people.map(n => buildCreditNameHTML(n, "")).join(" / ")}
      </span>
    </div>
  `).join("");

  const typeLabel = WORK_TYPES.find(t => t.id === w.type)?.label || w.type;
  const typeColor = getWorkColor(w.type);
  const tagHTML   = w.tags.slice(0, 2).map(t => `<span class="work-tag">${t}</span>`).join("");

  return `
    <article class="work-card" data-id="${w.id}">
      <div class="card-image">
        <div class="card-placeholder" style="${w.image_url
          ? `background:url('${w.image_url}') center/cover no-repeat, ${w.color};`
          : `background:${w.color};`}">
          <div style="position:absolute;inset:0;background:linear-gradient(160deg,transparent 30%,rgba(0,0,0,0.55));"></div>
          <div style="position:absolute;bottom:20px;left:20px;right:20px;">
            <div style="font-size:9px;font-weight:700;letter-spacing:0.16em;color:rgba(255,255,255,0.45);text-transform:uppercase;margin-bottom:6px;">${w.brand || "ARCHIVE JP"}</div>
            <div style="font-size:13px;font-weight:700;color:#fff;line-height:1.25;letter-spacing:-0.01em;">${w.title}</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:6px;">${w.season}</div>
          </div>
        </div>
        <span class="card-type-badge" style="--badge-color:${typeColor}">${typeLabel}</span>
        <span class="card-myrole-badge">${myRoles}</span>
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
