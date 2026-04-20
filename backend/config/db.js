const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("Paste your mongo DB URL here");
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("DB Error:", error);
  }
};

module.exports = connectDB;
