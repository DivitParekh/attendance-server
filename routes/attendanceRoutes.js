const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Attendance routes working");
});

const {
  checkIn,
  checkOut,
} = require("../controllers/attendanceController");

router.post("/check-in", checkIn);
router.post("/check-out", checkOut);

module.exports = router;
