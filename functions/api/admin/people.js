/* ===========================
   POST /api/admin/people — internal staff CMS, "add new creator only"
   scope (see plan addendum: no edit/delete yet). Auth handled by
   ./_middleware.js.
   =========================== */

import { jsonOk, jsonError, slugify, uniqueId, isValidUrl, cleanStr, cleanNum } from "./_lib.js";

// Fallback color per primary_role, lifted from the --role-* accent colors
// already used sitewide (css/style.css :root) so a creator added here
// looks consistent with the hand-entered roster without staff having to
// pick a hex value themselves.
const ROLE_COLOR = {
  photographer: "#4A6858",
  model: "#485068",
  stylist: "#584878",
  hair_makeup: "#784848",
  hair: "#784848",
  makeup: "#784848",
  director: "#385848",
  videographer: "#385848",
  art_director: "#484858",
  creative_director: "#484858",
};
const DEFAULT_COLOR = "#5A5650"; // muted neutral, matches --text-muted family

function roleColor(role) {
  return ROLE_COLOR[role] || DEFAULT_COLOR;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid JSON body");
  }

  const name = cleanStr(body.name, 120);
  const name_en = cleanStr(body.name_en, 120);
  const name_kana = cleanStr(body.name_kana, 120);
  const primary_role = cleanStr(body.primary_role, 40);
  const agency_id = cleanStr(body.agency_id, 60);
  const profile_image = cleanStr(body.profile_image, 500);
  const instagram_url = cleanStr(body.instagram_url, 500);
  const composite_url = cleanStr(body.composite_url, 500);
  const gender = cleanStr(body.gender, 10);

  if (!name) return jsonError("name is required");
  if (!name_en) return jsonError("name_en is required");
  if (!primary_role || !/^[a-z_]+$/.test(primary_role)) {
    return jsonError("primary_role is required (lowercase, e.g. 'model', 'photographer')");
  }
  if (profile_image && !isValidUrl(profile_image)) return jsonError("profile_image must be a valid https:// URL");
  if (instagram_url && !isValidUrl(instagram_url)) return jsonError("instagram_url must be a valid https:// URL");
  if (composite_url && !isValidUrl(composite_url)) return jsonError("composite_url must be a valid https:// URL");
  if (gender && !["m", "f", "nb"].includes(gender)) return jsonError("gender must be 'm', 'f', or 'nb'");

  if (agency_id) {
    const agency = await env.DB.prepare("SELECT 1 FROM agencies WHERE id = ?").bind(agency_id).first();
    if (!agency) return jsonError("agency_id does not match an existing agency");
  }

  const measurements = {
    height: cleanNum(body.measurements?.height, 100, 230),
    bust: cleanNum(body.measurements?.bust, 0, 200),
    waist: cleanNum(body.measurements?.waist, 0, 200),
    hip: cleanNum(body.measurements?.hip, 0, 200),
    shoe: cleanNum(body.measurements?.shoe, 15, 35),
  };
  const hasMeasurements = Object.values(measurements).some((v) => v !== null);

  const tags = Array.isArray(body.tags)
    ? body.tags.map((t) => cleanStr(t, 40)).filter(Boolean).slice(0, 20)
    : [];

  const id = await uniqueId(env.DB, "people", "p-", slugify(name_en));
  const roles = JSON.stringify([primary_role]);
  const color = roleColor(primary_role);

  await env.DB.prepare(
    `INSERT INTO people
      (id, name, name_en, name_kana, primary_role, roles, agency_id, color,
       profile_image, portfolio_images, instagram_url, composite_url,
       measurements, gender, direct_booking, is_verified, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)`
  )
    .bind(
      id,
      name,
      name_en,
      name_kana,
      primary_role,
      roles,
      agency_id || null,
      color,
      profile_image,
      JSON.stringify([]),
      instagram_url,
      composite_url,
      hasMeasurements ? JSON.stringify(measurements) : null,
      gender,
      JSON.stringify(tags)
    )
    .run();

  return jsonOk(
    {
      person: {
        id,
        name,
        name_en,
        name_kana,
        primary_role,
        roles: [primary_role],
        agency_id: agency_id || null,
        color,
        profile_image,
        instagram_url,
        composite_url,
        measurements: hasMeasurements ? measurements : null,
        gender,
        tags,
      },
    },
    201
  );
}
