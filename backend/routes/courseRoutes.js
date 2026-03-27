const express = require("express");
const router = express.Router();
const courseModel = require("../models/courseModel");
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
router.get("/branches", async (req, res) => {
    try {
        const branches = await courseModel.getAllBranches();
        res.json(branches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/branches", async (req, res) => {
    try {
        const branch = await courseModel.addBranch(req.body.name);
        res.status(201).json(branch);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/branches/:id", async (req, res) => {
    try {
        await courseModel.deleteBranch(req.params.id);
        res.json({ message: "Branch deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Course API
router.get("/all", async (req, res) => {
    try {
        const courses = await courseModel.getAllCourses();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/branch/:branchId", async (req, res) => {
    try {
        const courses = await courseModel.getCoursesByBranch(req.params.branchId);
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", upload.single("syllabus"), async (req, res) => {
    try {
        const courseData = {
            branch_id: req.body.branch_id,
            name: req.body.name,
            syllabus_pdf: req.file ? req.file.filename : null
        };
        const course = await courseModel.addCourse(courseData);
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await courseModel.deleteCourse(req.params.id);
        res.json({ message: "Course deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
