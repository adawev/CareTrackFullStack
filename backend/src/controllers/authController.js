import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";


const JWT_SECRET = process.env.JWT_SECRET;

export async function register(req, res) {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const validRoles = ["admin", "clinician", "receptionist"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, passwordHash, role]
    );

    return res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
}
