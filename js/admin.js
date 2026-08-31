/* ===========================
   CREDGE — Internal Admin CMS (add-only)
   No data.js dependency — talks directly to /api/admin/* and the public
   /api/data endpoint. Auth is a single shared password (ADMIN_SECRET),
   kept in sessionStorage only (cleared when the tab closes) and sent as
   a Bearer token on every /api/admin/* request.
   =========================== */

const TOKEN_KEY = "credge_admin_token";

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || "";
}
function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

async function adminFetch(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${getToken()}`,
    },
  });
  let body = null;
  try { body = await res.json(); } catch { /* no body */ }
  return { ok: res.ok, status: res.status, body };
}

function showStatus(el, message, isError) {
  el.textContent = message;
  el.className = "admin-status " + (isError ? "admin-status--error" : "admin-status--ok");
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Success message + a direct link to the new record's real page. The
// homepage only samples 15 of 500+ people at random and the full
// Creators list is shuffled, so "did my registration actually work?"
// isn't answerable just by browsing — this lets staff check the one
// page that matters immediately instead of hunting for it.
function showStatusWithLink(el, message, href, linkLabel) {
  el.innerHTML = `${escapeHTML(message)} — <a href="${escapeHTML(href)}" target="_blank" rel="noopener">${escapeHTML(linkLabel)}</a>`;
  el.className = "admin-status admin-status--ok";
}

function logEntry(listEl, text) {
  const li = document.createElement("li");
  li.textContent = text;
  listEl.prepend(li);
}

// ── Login ──
async function tryLogin(password) {
  setToken(password);
  const { ok } = await adminFetch("/api/admin/ping");
  return ok;
}

function showMain() {
  document.getElementById("admin-login-gate").hidden = true;
  document.getElementById("admin-main").hidden = false;
}

function initLogin() {
  const gate       = document.getElementById("admin-login-gate");
  const input      = document.getElementById("admin-password");
  const btn        = document.getElementById("admin-login-btn");
  const statusEl   = document.getElementById("admin-login-status");

  async function attempt() {
    const password = input.value.trim();
    if (!password) return;
    btn.disabled = true;
    const success = await tryLogin(password);
    btn.disabled = false;
    if (success) {
      showMain();
      loadAgencies();
    } else {
      setToken("");
      showStatus(statusEl, "パスワードが違います。", true);
    }
  }

  btn.addEventListener("click", attempt);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") attempt(); });

  // Already logged in this tab (sessionStorage survives reload, not new tabs).
  if (getToken()) {
    tryLogin(getToken()).then((success) => {
      if (success) { showMain(); loadAgencies(); }
    });
  }
}

// ── Agency dropdown (person form) — reads the public /api/data endpoint,
//    no auth needed for this part. ──
async function loadAgencies() {
  const select = document.getElementById("person-agency");
  const hint   = document.getElementById("person-agency-hint");
  try {
    const res = await fetch("/api/data", { cache: "no-store" });
    if (!res.ok) throw new Error("bad status " + res.status);
    const json = await res.json();
    const agencies = (json.agencies || []).slice().sort((a, b) => a.name.localeCompare(b.name));
    for (const a of agencies) {
      const opt = document.createElement("option");
      opt.value = a.id;
      opt.textContent = a.name;
      select.appendChild(opt);
    }
    hint.textContent = agencies.length > 0
      ? `${agencies.length}件の事務所を読み込みました。`
      : "登録済みの事務所がまだありません（先に事務所を登録してください、または未所属のままでもOK）。";
  } catch (err) {
    hint.textContent = "事務所一覧を読み込めませんでした（バックエンド未接続の可能性）。未所属として登録できます。";
  }
}

// ── Agency form ──
function initAgencyForm() {
  const form   = document.getElementById("agency-form");
  const status = form.querySelector('[data-status-for="agency-form"]');
  const log    = document.getElementById("agency-log");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("agency-name").value.trim(),
      type: document.getElementById("agency-type").value,
      website: document.getElementById("agency-website").value.trim(),
      instagram_url: document.getElementById("agency-instagram").value.trim(),
    };

    const { ok, body } = await adminFetch("/api/admin/agencies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (ok && body?.ok) {
      showStatusWithLink(status, `登録しました（id: ${body.agency.id}）`, `agency.html?id=${body.agency.id}`, "登録したページを見る →");
      logEntry(log, `✓ ${body.agency.name}`);
      form.reset();
      document.getElementById("agency-type").value = "model";
      // New agency should be selectable right away for the person form too.
      const select = document.getElementById("person-agency");
      const opt = document.createElement("option");
      opt.value = body.agency.id;
      opt.textContent = body.agency.name;
      select.appendChild(opt);
    } else {
      showStatus(status, `登録に失敗しました: ${body?.error || "unknown error"}`, true);
    }
  });
}

// ── Person form ──
function initPersonForm() {
  const form   = document.getElementById("person-form");
  const status = form.querySelector('[data-status-for="person-form"]');
  const log    = document.getElementById("person-log");

  function numOrUndefined(id) {
    const v = document.getElementById(id).value;
    return v === "" ? undefined : Number(v);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tags = document.getElementById("person-tags").value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      name: document.getElementById("person-name").value.trim(),
      name_en: document.getElementById("person-name-en").value.trim(),
      name_kana: document.getElementById("person-name-kana").value.trim(),
      primary_role: document.getElementById("person-role").value,
      agency_id: document.getElementById("person-agency").value || null,
      gender: document.getElementById("person-gender").value || null,
      profile_image: document.getElementById("person-profile-image").value.trim(),
      instagram_url: document.getElementById("person-instagram").value.trim(),
      composite_url: document.getElementById("person-composite").value.trim(),
      tags,
      measurements: {
        height: numOrUndefined("person-height"),
        bust: numOrUndefined("person-bust"),
        waist: numOrUndefined("person-waist"),
        hip: numOrUndefined("person-hip"),
        shoe: numOrUndefined("person-shoe"),
      },
    };

    const { ok, body } = await adminFetch("/api/admin/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (ok && body?.ok) {
      showStatusWithLink(status, `登録しました（id: ${body.person.id}）`, `person.html?id=${body.person.id}`, "登録したページを見る →");
      logEntry(log, `✓ ${body.person.name_en} / ${body.person.name}`);
      form.reset();
    } else {
      showStatus(status, `登録に失敗しました: ${body?.error || "unknown error"}`, true);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initAgencyForm();
  initPersonForm();
});
