import pool from "../config/db.js";

export async function getDoctors(req, res) {
  try {
    const search = req.query.search || "";
    const [rows] = await pool.query(
      `SELECT * FROM doctors WHERE first_name LIKE ? OR last_name LIKE ? OR specialty LIKE ? OR department LIKE ? ORDER BY created_at DESC`,
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
    );
    return res.status(200).json({ doctors: rows });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}

export async function getSingleDoctor(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM doctors WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found." });
    }
    return res.status(200).json({ doctor: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}

export async function createDoctor(req, res) {
  try {
    const { first_name, last_name, specialty, department, phone, email } = req.body;
    if (!first_name || !last_name || !specialty || !department || !phone || !email) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const [result] = await pool.query(
      "INSERT INTO doctors (first_name, last_name, specialty, department, phone, email) VALUES (?, ?, ?, ?, ?, ?)",
      [first_name, last_name, specialty, department, phone, email]
    );
    return res.status(201).json({ message: "Doctor created successfully.", id: result.insertId });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}

export async function updateDoctor(req, res) {
  try {
    const { id } = req.params;
    const { first_name, last_name, specialty, department, phone, email } = req.body;

    const [existing] = await pool.query("SELECT id FROM doctors WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    await pool.query(
      "UPDATE doctors SET first_name=?, last_name=?, specialty=?, department=?, phone=?, email=? WHERE id=?",
      [first_name, last_name, specialty, department, phone, email, id]
    );
    return res.status(200).json({ message: "Doctor updated successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}

export async function deleteDoctor(req, res) {
  try {
    const { id } = req.params;
    const [existing] = await pool.query("SELECT id FROM doctors WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Doctor not found." });
    }
    await pool.query("DELETE FROM doctors WHERE id = ?", [id]);
    return res.status(200).json({ message: "Doctor deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}
