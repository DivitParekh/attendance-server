 import connectDB from "../lib/db";
import Attendance from "../models/Attendance";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  const { employeeId } = req.body;

  const serverTime = new Date(); // 🔐 trusted
  const today = serverTime.toISOString().split("T")[0];

  const existing = await Attendance.findOne({
    employeeId,
    date: today,
    checkOutTime: null,
  });

  if (existing) {
    return res.status(400).json({ message: "Already checked in" });
  }

  const hour = serverTime.getHours();
  if (hour < 9 || hour > 10) {
    return res.status(400).json({ message: "Check-in not allowed" });
  }

  const attendance = await Attendance.create({
    employeeId,
    date: today,
    checkInTime: serverTime,
  });

  res.status(200).json({
    message: "Check-in successful",
    time: serverTime,
  });
}
