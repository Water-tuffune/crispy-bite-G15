const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const createToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "crispybite_student_secret",
    { expiresIn: "7d" }
  );
};

const register = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // bcrypt stores a salted hash, never the plain password.
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (full_name, email, phone, password, role, status) VALUES (?, ?, ?, ?, 'customer', 'active')",
      [full_name, email, phone || null, hashedPassword]
    );

    const user = { id: result.insertId, full_name, email, phone, role: "customer", status: "active" };
    res.status(201).json({ user, token: createToken(user) });
  } catch (error) {
    res.status(500).json({ message: "Registration failed.", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (!users.length) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = users[0];
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches || user.status !== "active") {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    delete user.password;
    res.json({ user, token: createToken(user) });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

const me = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, me };
