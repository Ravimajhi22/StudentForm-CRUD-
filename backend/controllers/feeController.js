const feeModel = require("../models/feeModel");

// Get all fee structures
const getAllFeeStructures = async (req, res) => {
    try {
        const fees = await feeModel.getAllFees();
        res.json(fees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add fee structure
const addFeeStructure = async (req, res) => {
    try {
        const newFee = await feeModel.addFeeStructure(req.body);
        res.status(201).json(newFee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete fee structure
const deleteFeeStructure = async (req, res) => {
    try {
        await feeModel.deleteFeeStructure(req.params.id);
        res.json({ message: "Fee structure deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get student fees
const getStudentFees = async (req, res) => {
    try {
        const fees = await feeModel.getStudentFees(req.params.studentId);
        res.json(fees || { total_amount: 0, paid_amount: 0, status: 'Pending' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update student fee (record payment)
const updateStudentFee = async (req, res) => {
    try {
        const updatedFee = await feeModel.updateStudentFee(req.params.studentId, req.body);
        res.json(updatedFee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Assign fee to student
const assignFeeToStudent = async (req, res) => {
    try {
        const result = await feeModel.assignFeeToStudent(req.params.studentId, req.body.amount);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllFeeStructures,
    addFeeStructure,
    deleteFeeStructure,
    getStudentFees,
    updateStudentFee,
    assignFeeToStudent
};
