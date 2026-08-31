#!/usr/bin/env node
/* ===========================
   One-time migration: js/data.js  ->  D1
   Phase 1 of /Users/admin/.claude/plans/splendid-chasing-hellman.md

   Loads the real agencies/brands/people/works arrays straight out of
   js/data.js (rather than hand-writing a parser for JS literal syntax),
   generates a batch of parameterized-safe INSERT statements, and writes
   them to migration-data.sql — for the operator to apply themselves with
   their own wrangler auth:

     node scripts/migrate-data-js-to-d1.mjs
     wrangler d1 execute credge-db --remote --file=schema.sql
     wrangler d1 execute credge-db --remote --file=migration-data.sql

   Also prints a row-count + anomaly report (e.g. credits whose `person`
   name doesn't exactly match any people[].name — known pre-existing
   placeholder data, see the plan's Migration section).
   =========================== */

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_JS_PATH = join(ROOT, "js", "data.js");
const OUT_SQL_PATH = join(ROOT, "migration-data.sql");

// ── Load the real arrays out of data.js ──
// data.js is a plain (non-module) script written for the browser: it
// references `document` once (to set data-media) and declares its arrays
// as top-level `const`. Strip the document line and append a
// module.exports so a stock CommonJS `require()` can hand us the real,
// live objects — no bespoke JS-literal parser needed.
//
// It also sets `window.CREDGE_READY` to a fetch()-backed IIFE (the Phase 1
// live-data loader — see the "Live data" block near the bottom of
// data.js). That fetch failing is fine and expected here (there's no
// browser `fetch`/`window` in Node) — the IIFE already catches its own
// errors — but `window` itself must exist as an object first or the
// assignment throws before we ever get there. Stub both.
async function loadDataJs() {
  const src = readFileSync(DATA_JS_PATH, "utf8");
  const stripped = src.replace(
    /document\.documentElement\.setAttribute\([^)]*\);?/,
    "// (stripped for Node migration — no `document` here)"
  );
  const exported =
    'global.window = global.window || { documentElement: { setAttribute() {} } };\n' +
    'global.fetch = global.fetch || (() => Promise.reject(new Error("no fetch in migration script")));\n' +
    stripped +
    "\nmodule.exports = { agencies, brands, people, works };\n";

  const tmpDir = mkdtempSync(join(tmpdir(), "credge-migrate-"));
  const tmpFile = join(tmpDir, "data.cjs");
  writeFileSync(tmpFile, exported, "utf8");
  try {
    const { createRequire } = await import("node:module");
    const require = createRequire(import.meta.url);
    return require(tmpFile);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

// ── SQL helpers ──
function sqlStr(v) {
  if (v === null || v === undefined) return "NULL";
  return `'${String(v).replace(/'/g, "''")}'`;
}
function sqlInt(v) {
  if (v === null || v === undefined) return "NULL";
  return v ? "1" : "0";
}
function sqlNum(v) {
  if (v === null || v === undefined || v === "") return "NULL";
  return Number(v);
}
function sqlJSON(v) {
  if (v === null || v === undefined) return "NULL";
  return sqlStr(JSON.stringify(v));
}

async function main() {
  const { agencies, brands, people, works } = await loadDataJs();
  // No manual BEGIN TRANSACTION/COMMIT — `wrangler d1 execute` rejects
  // explicit SQL transaction statements (D1 wraps each execute in its own
  // transaction already).
  const lines = [];

  for (const a of agencies) {
    lines.push(
      `INSERT INTO agencies (id, name, type, website, instagram_url) VALUES (${sqlStr(a.id)}, ${sqlStr(a.name)}, ${sqlStr(a.type)}, ${sqlStr(a.website)}, ${sqlStr(a.instagram_url)});`
    );
  }

  for (const b of brands) {
    lines.push(
      `INSERT INTO brands (id, name, designer, website, instagram_url) VALUES (${sqlStr(b.id)}, ${sqlStr(b.name)}, ${sqlStr(b.designer)}, ${sqlStr(b.website)}, ${sqlStr(b.instagram_url)});`
    );
  }

  const peopleNames = new Set(people.map((p) => p.name));
  const agencyIds = new Set(agencies.map((a) => a.id));
  const brandIds = new Set(brands.map((b) => b.id));
  const orphanedAgencyRefs = [];
  const orphanedBrandRefs = [];

  for (const p of people) {
    const agencyIdOk = p.agency_id && agencyIds.has(p.agency_id);
    if (p.agency_id && !agencyIdOk) orphanedAgencyRefs.push({ person: p.id, agency_id: p.agency_id });

    lines.push(
      `INSERT INTO people (id, name, name_en, name_kana, primary_role, roles, agency_id, color, profile_image, portfolio_images, instagram_url, composite_url, measurements, gender, direct_booking, is_verified, tags) VALUES (` +
        [
          sqlStr(p.id),
          sqlStr(p.name),
          sqlStr(p.name_en),
          sqlStr(p.name_kana),
          sqlStr(p.primary_role),
          sqlJSON(p.roles),
          sqlStr(agencyIdOk ? p.agency_id : null),
          sqlStr(p.color),
          sqlStr(p.profile_image),
          sqlJSON(p.portfolio_images),
          sqlStr(p.instagram_url),
          sqlStr(p.composite_url),
          sqlJSON(p.measurements),
          sqlStr(p.gender),
          sqlInt(p.direct_booking),
          sqlInt(p.is_verified),
          sqlJSON(p.tags),
        ].join(", ") +
        ");"
    );
  }

  const unresolvedCredits = [];

  for (const w of works) {
    const brandIdOk = w.brand_id && brandIds.has(w.brand_id);
    if (w.brand_id && !brandIdOk) orphanedBrandRefs.push({ work: w.id, brand_id: w.brand_id });

    lines.push(
      `INSERT INTO works (id, title, type, brand_id, brand, season, year, tags, is_published, featured, color, accent, image_url) VALUES (` +
        [
          sqlStr(w.id),
          sqlStr(w.title),
          sqlStr(w.type),
          sqlStr(brandIdOk ? w.brand_id : null),
          sqlStr(w.brand),
          sqlStr(w.season),
          sqlNum(w.year),
          sqlJSON(w.tags),
          sqlInt(w.is_published ?? true),
          sqlInt(w.featured ?? false),
          sqlStr(w.color),
          sqlStr(w.accent),
          sqlStr(w.image_url),
        ].join(", ") +
        ");"
    );

    for (const c of w.credits || []) {
      lines.push(
        `INSERT INTO credits (work_id, credit_role, person, order_index) VALUES (${sqlStr(w.id)}, ${sqlStr(c.credit_role)}, ${sqlStr(c.person)}, ${sqlNum(c.order_index ?? 1)});`
      );
      if (!peopleNames.has(c.person)) {
        unresolvedCredits.push({ work: w.id, role: c.credit_role, person: c.person });
      }
    }
  }

  writeFileSync(OUT_SQL_PATH, lines.join("\n") + "\n", "utf8");

  // ── Report ──
  console.log(`Wrote ${OUT_SQL_PATH}`);
  console.log("");
  console.log("Row counts:");
  console.log(`  agencies: ${agencies.length}`);
  console.log(`  brands:   ${brands.length}`);
  console.log(`  people:   ${people.length}`);
  console.log(`  works:    ${works.length}`);
  console.log(`  credits:  ${works.reduce((n, w) => n + (w.credits?.length || 0), 0)}`);

  if (orphanedAgencyRefs.length > 0) {
    console.log("");
    console.log(`⚠ ${orphanedAgencyRefs.length} people row(s) had an agency_id with no matching agencies[] entry`);
    console.log("  — written as NULL (unaffiliated) instead of violating the foreign key. Fix in");
    console.log("  data.js and re-run if these should point somewhere real:");
    for (const u of orphanedAgencyRefs.slice(0, 20)) console.log(`    - ${u.person}: "${u.agency_id}"`);
    if (orphanedAgencyRefs.length > 20) console.log(`    ...and ${orphanedAgencyRefs.length - 20} more`);
  }

  if (orphanedBrandRefs.length > 0) {
    console.log("");
    console.log(`⚠ ${orphanedBrandRefs.length} works row(s) had a brand_id with no matching brands[] entry`);
    console.log("  (pre-existing placeholder data, e.g. old sample works using ids like \"b1\")");
    console.log("  — written as NULL instead of violating the foreign key. The `brand` display");
    console.log("  string is untouched, so these still show a brand name, just unlinked:");
    for (const u of orphanedBrandRefs.slice(0, 20)) console.log(`    - ${u.work}: "${u.brand_id}"`);
    if (orphanedBrandRefs.length > 20) console.log(`    ...and ${orphanedBrandRefs.length - 20} more`);
  }

  if (unresolvedCredits.length > 0) {
    console.log("");
    console.log(`⚠ ${unresolvedCredits.length} credit(s) reference a person name with no matching people[] entry`);
    console.log("  (these are preserved as-is in the migration — the `person` string linkage");
    console.log("  is unchanged, but they won't resolve to a real profile page). Review before");
    console.log("  or after migration, operator's call:");
    for (const u of unresolvedCredits.slice(0, 30)) {
      console.log(`    - ${u.work} / ${u.role}: "${u.person}"`);
    }
    if (unresolvedCredits.length > 30) {
      console.log(`    ...and ${unresolvedCredits.length - 30} more`);
    }
  } else {
    console.log("");
    console.log("✓ every credit's person name resolves to a people[] entry");
  }

  console.log("");
  console.log("Next steps:");
  console.log("  wrangler d1 execute credge-db --remote --file=schema.sql");
  console.log("  wrangler d1 execute credge-db --remote --file=migration-data.sql");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
