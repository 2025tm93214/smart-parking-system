const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const ParkingSlot = require("../models/ParkingSlot");
const { authMiddleware, adminOnly } = require("./auth");

// CREATE BOOKING
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { slotId, startTime, endTime, vehicleNumber } = req.body;
    const start = new Date(startTime);
    const end = new Date(endTime);

    const slot = await ParkingSlot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (!slot.isAvailable) return res.status(400).json({ message: "Slot not available ❌" });

    const conflict = await Booking.findOne({
      slotId,
      status: "active",
      startTime: { $lt: end },
      endTime: { $gt: start }
    });
    if (conflict) return res.status(400).json({ message: "Slot already booked for this time ❌" });

    const hours = (end - start) / 3600000;
    const totalAmount = hours * slot.pricePerHour;

    const booking = new Booking({
      slotId,
      userId: req.user._id,
      userName: req.user.name,
      vehicleNumber,
      startTime: start,
      endTime: end,
      totalAmount,
      status: "active"
    });
    await booking.save();

    // mark slot occupied
    await ParkingSlot.findByIdAndUpdate(slotId, { isAvailable: false });

    res.json({ message: "Booking successful ✅", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET ALL BOOKINGS (admin) or own bookings (user)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { userId: req.user._id };
    const bookings = await Booking.find(query).populate("slotId").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ANALYTICS (admin)
router.get("/analytics", authMiddleware, adminOnly, async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const active = await Booking.countDocuments({ status: "active" });
    const completed = await Booking.countDocuments({ status: "completed" });
    const cancelled = await Booking.countDocuments({ status: "cancelled" });
    const revenue = await Booking.aggregate([
      { $match: { status: { $in: ["active", "completed"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    // bookings per day last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600000);
    const daily = await Booking.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      total, active, completed, cancelled,
      totalRevenue: revenue[0]?.total || 0,
      daily
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE BOOKING STATUS
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });

    booking.status = req.body.status;
    await booking.save();

    // free slot if completed/cancelled
    if (["completed", "cancelled"].includes(req.body.status)) {
      await ParkingSlot.findByIdAndUpdate(booking.slotId, { isAvailable: true });
    }

    res.json({ message: "Updated ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE BOOKING (admin)
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (booking) await ParkingSlot.findByIdAndUpdate(booking.slotId, { isAvailable: true });
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted ✅" });
});

module.exports = router;