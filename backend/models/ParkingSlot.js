const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  location: String,
  slotNumber: String,

  type: {
    type: String,
    enum: ["car", "bike"],
    default: "car"
  },

  pricePerHour: Number,

  isAvailable: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("ParkingSlot", slotSchema);