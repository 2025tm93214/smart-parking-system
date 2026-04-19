const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "smartparking_secret_2025";

// Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const user = new User({ name, email, password, role: role === "admin" ? "admin" : "user" });
    await user.save();
    res.json({ message: "Registered successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: "Invalid credentials ❌" });

    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful ✅", token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL USERS (admin)
router.get("/users", authMiddleware, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// UPDATE USER ROLE (admin)
router.put("/users/:id/role", authMiddleware, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { role: req.body.role });
  res.json({ message: "Role updated" });
});

// DELETE USER (admin)
router.delete("/users/:id", authMiddleware, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
module.exports.adminOnly = adminOnly;