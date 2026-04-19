const express = require("express");
const router = express.Router();
const Slot = require("../models/ParkingSlot");
const { authMiddleware, adminOnly } = require("./auth");

// GET ALL SLOTS (public)
router.get("/", async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD SLOT (admin)
router.post("/add", authMiddleware, adminOnly, async (req, res) => {
  try {
    const slot = new Slot(req.body);
    await slot.save();
    res.json({ message: "Slot added ✅", slot });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE SLOT (admin)
router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const updated = await Slot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Updated ✅", slot: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE SLOT (admin)
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await Slot.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;