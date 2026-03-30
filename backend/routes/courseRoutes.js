const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer Config for Syllabuses
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "uploads/syllabuses/";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "syllabus-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"), false);
        }
    }
});

// Branch API
router.get("/branches", courseController.getAllBranches);
router.post("/branches", courseController.addBranch);
router.delete("/branches/:id", courseController.deleteBranch);

// Course API
router.get("/all", courseController.getAllCourses);
router.get("/branch/:branchId", courseController.getCoursesByBranch);
router.post("/", upload.single("syllabus"), courseController.addCourse);
router.delete("/:id", courseController.deleteCourse);

module.exports = router;

