const express = require("express");
const router = express.Router();
const feeController = require("../controllers/feeController");

// Get all fee structures
router.get("/structure", feeController.getAllFeeStructures);

// Add fee structure
router.post("/structure", feeController.addFeeStructure);

// Delete fee structure
router.delete("/structure/:id", feeController.deleteFeeStructure);

// Get student fees
router.get("/student/:studentId", feeController.getStudentFees);

// Update student fee (record payment)
router.post("/student/:studentId", feeController.updateStudentFee);

// Assign fee to student
router.post("/assign/:studentId", feeController.assignFeeToStudent);

module.exports = router;

