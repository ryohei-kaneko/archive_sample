/* ===========================
   POST /api/admin/agencies — internal staff CMS, "add new agency only"
   scope (see plan addendum: no edit/delete yet). Auth handled by
   ./_middleware.js.
   =========================== */

import { jsonOk, jsonError, slugify, uniqueId, isValidUrl, cleanStr } from "./_lib.js";

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid JSON body");
  }

  const name = cleanStr(body.name, 120);
  const type = body.type;
  const website = cleanStr(body.website, 500);
  const instagram_url = cleanStr(body.instagram_url, 500);

  if (!name) return jsonError("name is required");
  if (type !== "model" && type !== "creative") return jsonError("type must be 'model' or 'creative'");
  if (website && !isValidUrl(website)) return jsonError("website must be a valid https:// URL");
  if (instagram_url && !isValidUrl(instagram_url)) return jsonError("instagram_url must be a valid https:// URL");

  const id = await uniqueId(env.DB, "agencies", "a-", slugify(name));

  await env.DB.prepare(
    "INSERT INTO agencies (id, name, type, website, instagram_url) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(id, name, type, website, instagram_url)
    .run();

  return jsonOk({ agency: { id, name, type, website, instagram_url } }, 201);
}
