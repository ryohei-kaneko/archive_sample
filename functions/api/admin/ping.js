/* GET /api/admin/ping — lets admin.html validate a password immediately
   on login, before submitting any real form. Auth handled by
   ./_middleware.js; reaching this handler at all means it already passed. */
import { jsonOk } from "./_lib.js";

export async function onRequestGet() {
  return jsonOk({});
}
