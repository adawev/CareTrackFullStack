import pool from "../config/db.js";

export async function log(req, action, entity, entityId) {
  try {
    await pool.query(
      "INSERT INTO audit_logs (user_id, user_email, action, entity, entity_id) VALUES (?,?,?,?,?)",
      [req.user?.id || null, req.user?.email || null, action, entity, entityId || null]
    );
  } catch {}
}
