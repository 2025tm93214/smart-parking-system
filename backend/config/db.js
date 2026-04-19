const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://2025tm93214_db_user:5dQ5Pcwv2KmpST8I@cluster0.dnqmthc.mongodb.net/parkingDB");
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("DB Error:", error);
  }
};

module.exports = connectDB;