const express = require("express");
const router = express.Router();
const attendanceModel = require("../models/attendanceModel");

// Get Day Summary
router.get("/summary", async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const summary = await attendanceModel.getDailySummary(date);
        res.json(summary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Attendance List
router.get("/list", async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const list = await attendanceModel.getAttendanceByDate(date);
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark Attendance (Individual/QR)
router.post("/mark", async (req, res) => {
    try {
        const { student_id, status, date } = req.body;
        const result = await attendanceModel.markAttendance(student_id, status || 'Present', date);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bulk Mark Attendance
router.post("/bulk", async (req, res) => {
    try {
        const { attendanceData } = req.body; // Array of { student_id, status, date }
        const results = await Promise.all(
            attendanceData.map(item => 
                attendanceModel.markAttendance(item.student_id, item.status, item.date)
            )
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
