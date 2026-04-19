const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: "ParkingSlot" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: String,
  vehicleNumber: String,
  startTime: Date,
  endTime: Date,
  totalAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active"
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);