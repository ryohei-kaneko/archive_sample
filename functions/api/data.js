/* ===========================
   GET /api/data — CREDGE Phase 1 read path
   Cloudflare Pages Function. Returns the full public dataset shaped
   exactly like the arrays js/data.js used to hardcode, so the existing
   render functions (renderWorkItemHTML, renderPersonItemHTML, etc. in
   data.js) need zero changes. See:
     /Users/admin/.claude/plans/splendid-chasing-hellman.md
   =========================== */

function toJSONField(raw, fallback) {
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function mapAgency(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    website: row.website,
    instagram_url: row.instagram_url,
  };
}

function mapBrand(row) {
  return {
    id: row.id,
    name: row.name,
    designer: row.designer,
    website: row.website,
    instagram_url: row.instagram_url,
  };
}

function mapPerson(row) {
  return {
    id: row.id,
    name: row.name,
    name_en: row.name_en,
    name_kana: row.name_kana,
    primary_role: row.primary_role,
    roles: toJSONField(row.roles, []),
    agency_id: row.agency_id,
    color: row.color,
    profile_image: row.profile_image,
    portfolio_images: toJSONField(row.portfolio_images, []),
    instagram_url: row.instagram_url,
    composite_url: row.composite_url,
    measurements: toJSONField(row.measurements, null),
    gender: row.gender,
    direct_booking: !!row.direct_booking,
    is_verified: !!row.is_verified,
    tags: toJSONField(row.tags, []),
  };
}

function mapWork(row, creditsByWork) {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    brand_id: row.brand_id,
    brand: row.brand,
    season: row.season,
    year: row.year,
    tags: toJSONField(row.tags, []),
    is_published: !!row.is_published,
    featured: !!row.featured,
    color: row.color,
    accent: row.accent,
    image_url: row.image_url,
    credits: creditsByWork.get(row.id) || [],
  };
}

export async function onRequestGet(context) {
  const { env } = context;

  const [agenciesRes, brandsRes, peopleRes, worksRes, creditsRes] = await Promise.all([
    env.DB.prepare("SELECT * FROM agencies ORDER BY rowid").all(),
    env.DB.prepare("SELECT * FROM brands ORDER BY rowid").all(),
    env.DB.prepare("SELECT * FROM people ORDER BY rowid").all(),
    env.DB.prepare("SELECT * FROM works ORDER BY rowid").all(),
    env.DB.prepare("SELECT * FROM credits ORDER BY work_id, order_index, id").all(),
  ]);

  const creditsByWork = new Map();
  for (const c of creditsRes.results) {
    if (!creditsByWork.has(c.work_id)) creditsByWork.set(c.work_id, []);
    creditsByWork.get(c.work_id).push({
      credit_role: c.credit_role,
      person: c.person,
      order_index: c.order_index,
    });
  }

  const body = {
    agencies: agenciesRes.results.map(mapAgency),
    brands: brandsRes.results.map(mapBrand),
    people: peopleRes.results.map(mapPerson),
    works: worksRes.results.map((w) => mapWork(w, creditsByWork)),
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
