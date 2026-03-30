const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// Get Day Summary
router.get("/summary", attendanceController.getAttendanceSummary);

// Get Attendance List
router.get("/list", attendanceController.getAttendanceList);

// Mark Attendance (Individual/QR)
router.post("/mark", attendanceController.markAttendance);

// Bulk Mark Attendance
router.post("/bulk", attendanceController.bulkMarkAttendance);

module.exports = router;

