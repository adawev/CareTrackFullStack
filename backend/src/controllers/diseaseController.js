import pool from "../config/db.js";

export async function getDiseases(req, res) {
  try {
    const search = req.query.search || "";
    const [rows] = await pool.query(
      `SELECT d.*, p.first_name as patient_first_name, p.last_name as patient_last_name
       FROM diseases d
       LEFT JOIN patients p ON d.patient_id = p.id
       WHERE d.icd_code LIKE ? OR d.description LIKE ? OR d.severity LIKE ? OR p.first_name LIKE ? OR p.last_name LIKE ?
       ORDER BY d.created_at DESC`,
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
    );
    return res.status(200).json({ diseases: rows });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}

export async function getSingleDisease(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT d.*, p.first_name as patient_first_name, p.last_name as patient_last_name
       FROM diseases d
       LEFT JOIN patients p ON d.patient_id = p.id
       WHERE d.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Disease not found." });
    }
    return res.status(200).json({ disease: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}

export async function createDisease(req, res) {
  try {
    const { patient_id, icd_code, description, severity, status, diagnosis_date } = req.body;
    if (!patient_id || !icd_code || !description || !severity || !status || !diagnosis_date) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const validSeverity = ["mild", "moderate", "severe"];
    const validStatus = ["active", "resolved", "chronic"];
    if (!validSeverity.includes(severity) || !validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid severity or status value." });
    }
    const [result] = await pool.query(
      "INSERT INTO diseases (patient_id, icd_code, description, severity, status, diagnosis_date) VALUES (?, ?, ?, ?, ?, ?)",
      [patient_id, icd_code, description, severity, status, diagnosis_date]
    );
    return res.status(201).json({ message: "Disease created successfully.", id: result.insertId });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}

export async function updateDisease(req, res) {
  try {
    const { id } = req.params;
    const { patient_id, icd_code, description, severity, status, diagnosis_date } = req.body;

    const [existing] = await pool.query("SELECT id FROM diseases WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Disease not found." });
    }

    await pool.query(
      "UPDATE diseases SET patient_id=?, icd_code=?, description=?, severity=?, status=?, diagnosis_date=? WHERE id=?",
      [patient_id, icd_code, description, severity, status, diagnosis_date, id]
    );
    return res.status(200).json({ message: "Disease updated successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}

export async function deleteDisease(req, res) {
  try {
    const { id } = req.params;
    const [existing] = await pool.query("SELECT id FROM diseases WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Disease not found." });
    }
    await pool.query("DELETE FROM diseases WHERE id = ?", [id]);
    return res.status(200).json({ message: "Disease deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}
