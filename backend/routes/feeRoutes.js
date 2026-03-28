const express = require("express");
const router = express.Router();
const feeModel = require("../models/feeModel");

// Get all fee structures
router.get("/structure", async (req, res) => {
    try {
        const fees = await feeModel.getAllFees();
        res.json(fees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add fee structure
router.post("/structure", async (req, res) => {
    try {
        const newFee = await feeModel.addFeeStructure(req.body);
        res.status(201).json(newFee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete fee structure
router.delete("/structure/:id", async (req, res) => {
    try {
        await feeModel.deleteFeeStructure(req.params.id);
        res.json({ message: "Fee structure deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get student fees
router.get("/student/:studentId", async (req, res) => {
    try {
        const fees = await feeModel.getStudentFees(req.params.studentId);
        res.json(fees || { total_amount: 0, paid_amount: 0, status: 'Pending' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update student fee (record payment)
router.post("/student/:studentId", async (req, res) => {
    try {
        const updatedFee = await feeModel.updateStudentFee(req.params.studentId, req.body);
        res.json(updatedFee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Assign fee to student
router.post("/assign/:studentId", async (req, res) => {
    try {
        const result = await feeModel.assignFeeToStudent(req.params.studentId, req.body.amount);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
