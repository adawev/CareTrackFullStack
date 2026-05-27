import pool from "../config/db.js";
import { log } from "../utils/audit.js";

export async function getPatients(req, res) {
  try {
    const search = req.query.search || "";
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;
    const like = `%${search}%`;
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM patients WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?`,
      [like, like, like]
    );
    const [rows] = await pool.query(
      `SELECT p.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name, d.specialty
       FROM patients p
       LEFT JOIN doctors d ON p.doctor_id = d.id
       WHERE p.first_name LIKE ? OR p.last_name LIKE ? OR p.email LIKE ?
       ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
      [like, like, like, limit, offset]
    );
    return res.status(200).json({ patients: rows, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}

export async function getSinglePatient(req, res) {
  try {
    const { id } = req.params;
    const [patients] = await pool.query(
      `SELECT p.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name, d.specialty, d.department
       FROM patients p
       LEFT JOIN doctors d ON p.doctor_id = d.id
       WHERE p.id = ?`,
      [id]
    );
    if (patients.length === 0) {
      return res.status(404).json({ message: "Patient not found." });
    }
    const [diseases] = await pool.query(
      "SELECT * FROM diseases WHERE patient_id = ? ORDER BY diagnosis_date DESC",
      [id]
    );
    return res.status(200).json({ patient: patients[0], diseases });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}

export async function createPatient(req, res) {
  try {
    const { first_name, last_name, date_of_birth, gender, blood_type, phone, email, address, doctor_id } = req.body;
    if (!first_name || !last_name || !date_of_birth || !gender || !phone || !doctor_id) {
      return res.status(400).json({ message: "Required fields are missing." });
    }
    const [result] = await pool.query(
      "INSERT INTO patients (first_name, last_name, date_of_birth, gender, blood_type, phone, email, address, doctor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [first_name, last_name, date_of_birth, gender, blood_type || null, phone, email, address, doctor_id]
    );
    await log(req, "CREATE", "patient", result.insertId);
    return res.status(201).json({ message: "Patient created successfully.", id: result.insertId });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}

export async function updatePatient(req, res) {
  try {
    const { id } = req.params;
    const { first_name, last_name, date_of_birth, gender, blood_type, phone, email, address, doctor_id } = req.body;

    const [existing] = await pool.query("SELECT id FROM patients WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Patient not found." });
    }

    await pool.query(
      "UPDATE patients SET first_name=?, last_name=?, date_of_birth=?, gender=?, blood_type=?, phone=?, email=?, address=?, doctor_id=? WHERE id=?",
      [first_name, last_name, date_of_birth, gender, blood_type || null, phone, email, address, doctor_id, id]
    );
    await log(req, "UPDATE", "patient", id);
    return res.status(200).json({ message: "Patient updated successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}

export async function deletePatient(req, res) {
  try {
    const { id } = req.params;
    const [existing] = await pool.query("SELECT id FROM patients WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Patient not found." });
    }
    await pool.query("DELETE FROM patients WHERE id = ?", [id]);
    await log(req, "DELETE", "patient", id);
    return res.status(200).json({ message: "Patient deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}
