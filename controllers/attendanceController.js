const Attendance = require("../models/Attendance");

/**
 * CHECK-IN CONTROLLER
 * - Uses SERVER TIME only
 * - Prevents multiple check-ins
 */
exports.checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        message: "employeeId is required",
      });
    }

    const serverTime = new Date();
    const today = serverTime.toISOString().split("T")[0];

    // Check if already checked in today
    const alreadyCheckedIn = await Attendance.findOne({
      employeeId,
      date: today,
      checkOutTime: null,
    });

    if (alreadyCheckedIn) {
      return res.status(400).json({
        message: "Already checked in",
      });
    }

    // Example rule: Check-in allowed between 9 AM – 10 AM
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

    return res.status(200).json({
      message: "Check-in successful",
      checkInTime: serverTime,
      attendance,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * CHECK-OUT CONTROLLER
 * - Uses SERVER TIME only
 * - Requires active check-in
 */
exports.checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        message: "employeeId is required",
      });
    }

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

    return res.status(200).json({
      message: "Check-out successful",
      checkOutTime: serverTime,
      attendance,
    });
  } catch (error) {
    console.error("Check-out error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
