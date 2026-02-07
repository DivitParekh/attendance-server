const Attendance = require("../models/Attendance");

exports.checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const serverTime = new Date();
    const today = serverTime.toISOString().split("T")[0];

    // Prevent multiple check-ins
    const existing = await Attendance.findOne({
      employeeId,
      date: today,
      checkOutTime: null,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already checked in",
      });
    }

    // Time rule example (9AM–10AM)
    const hour = serverTime.getHours();
    if (hour < 9 || hour > 10) {
      return res.status(400).json({
        message: "Check-in not allowed at this time",
      });
    }

    const attendance = await Attendance.create({
      employeeId,
      date: today,
      checkInTime: serverTime,
    });

    res.json({
      message: "Check-in successful",
      time: serverTime,
      attendance,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const serverTime = new Date();

    const attendance = await Attendance.findOne({
      employeeId,
      checkOutTime: null,
    });

    if (!attendance) {
      return res.status(400).json({
        message: "No active check-in found",
      });
    }

    attendance.checkOutTime = serverTime;
    await attendance.save();

    res.json({
      message: "Check-out successful",
      time: serverTime,
      attendance,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
