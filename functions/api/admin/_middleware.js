/* ===========================
   Auth gate for everything under /api/admin/*
   Cloudflare Pages Functions middleware — runs before any handler in
   this directory. Shared-password model: the 3 people running CREDGE
   share one ADMIN_SECRET (set via `wrangler secret put ADMIN_SECRET`),
   entered once in admin.html and sent back as a Bearer token on every
   request. No per-person accounts — deliberately as light as the rest
   of the auth-less "mypage" design in
   /Users/admin/.claude/plans/splendid-chasing-hellman.md.
   =========================== */

export async function onRequest(context) {
  const { request, env, next } = context;

  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!env.ADMIN_SECRET || token !== env.ADMIN_SECRET) {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  return next();
}
