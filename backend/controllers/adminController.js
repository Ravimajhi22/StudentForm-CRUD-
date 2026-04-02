const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findAdminByEmail, createAdmin } = require("../models/adminModel");

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await findAdminByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await createAdmin(email, hashedPassword);
    res.status(201).json({ message: "Admin created", admin: { id: newAdmin.id, email: newAdmin.email } });
  } catch (error) {
    res.status(500).json({ message: "Register error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET || 'secret_key', {
      expiresIn: "24h",
    });

    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

module.exports = {
  register,
  login,
};
