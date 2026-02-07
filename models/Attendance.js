const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  checkInTime: Date,
  checkOutTime: Date,
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
