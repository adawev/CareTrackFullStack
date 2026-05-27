import pool from "../config/db.js";

export async function getPatients(req, res) {
  try {
    const search = req.query.search || "";
    const [rows] = await pool.query(
      `SELECT p.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name, d.specialty
       FROM patients p
       LEFT JOIN doctors d ON p.doctor_id = d.id
       WHERE p.first_name LIKE ? OR p.last_name LIKE ? OR p.email LIKE ?
       ORDER BY p.created_at DESC`,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );
    return res.status(200).json({ patients: rows });
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
    const { first_name, last_name, date_of_birth, gender, phone, email, address, doctor_id } = req.body;
    if (!first_name || !last_name || !date_of_birth || !gender || !phone || !doctor_id) {
      return res.status(400).json({ message: "Required fields are missing." });
    }
    const [result] = await pool.query(
      "INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, address, doctor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [first_name, last_name, date_of_birth, gender, phone, email, address, doctor_id]
    );
    return res.status(201).json({ message: "Patient created successfully.", id: result.insertId });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}

export async function updatePatient(req, res) {
  try {
    const { id } = req.params;
    const { first_name, last_name, date_of_birth, gender, phone, email, address, doctor_id } = req.body;

    const [existing] = await pool.query("SELECT id FROM patients WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Patient not found." });
    }

    await pool.query(
      "UPDATE patients SET first_name=?, last_name=?, date_of_birth=?, gender=?, phone=?, email=?, address=?, doctor_id=? WHERE id=?",
      [first_name, last_name, date_of_birth, gender, phone, email, address, doctor_id, id]
    );
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
    return res.status(200).json({ message: "Patient deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}
