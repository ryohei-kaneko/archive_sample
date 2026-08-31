/* ===========================
   Shared helpers for /api/admin/* routes.
   Leading underscore = Cloudflare Pages Functions won't treat this file
   as a route itself, only as an importable module.
   =========================== */

export function jsonOk(data, status = 200) {
  return new Response(JSON.stringify({ ok: true, ...data }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export function jsonError(error, status = 400) {
  return new Response(JSON.stringify({ ok: false, error }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

// ASCII slug for a record id, e.g. "Keita Utsumi" -> "keita-utsumi".
// Falls back to "item" if the input has no ASCII letters/digits at all
// (callers should pass a guaranteed-Latin field — name_en for people,
// name for agencies, both already romanized brand-style names here).
export function slugify(str) {
  return (
    String(str || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "") // strip accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "item"
  );
}

// Appends -2, -3, ... until `${prefix}${base}` doesn't collide with an
// existing row. `table` is always a caller-supplied literal ("agencies" /
// "people"), never request input, so string-building the table name here
// is safe.
export async function uniqueId(db, table, prefix, base) {
  let candidate = prefix + base;
  let n = 2;
  while (true) {
    const row = await db.prepare(`SELECT 1 FROM ${table} WHERE id = ?`).bind(candidate).first();
    if (!row) return candidate;
    candidate = `${prefix}${base}-${n++}`;
  }
}

export function isValidUrl(value) {
  if (!value) return true; // empty/null is fine, "required" is checked separately
  try {
    const u = new URL(value);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

export function cleanStr(v, maxLen = 200) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  return s.slice(0, maxLen);
}

export function cleanNum(v, min, max) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  if (min !== undefined && n < min) return null;
  if (max !== undefined && n > max) return null;
  return n;
}
