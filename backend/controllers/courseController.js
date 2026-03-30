const courseModel = require("../models/courseModel");

// Branch API
const getAllBranches = async (req, res) => {
    try {
        const branches = await courseModel.getAllBranches();
        res.json(branches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addBranch = async (req, res) => {
    try {
        const branch = await courseModel.addBranch(req.body.name);
        res.status(201).json(branch);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteBranch = async (req, res) => {
    try {
        await courseModel.deleteBranch(req.params.id);
        res.json({ message: "Branch deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Course API
const getAllCourses = async (req, res) => {
    try {
        const courses = await courseModel.getAllCourses();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCoursesByBranch = async (req, res) => {
    try {
        const courses = await courseModel.getCoursesByBranch(req.params.branchId);
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addCourse = async (req, res) => {
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
};

const deleteCourse = async (req, res) => {
    try {
        await courseModel.deleteCourse(req.params.id);
        res.json({ message: "Course deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllBranches,
    addBranch,
    deleteBranch,
    getAllCourses,
    getCoursesByBranch,
    addCourse,
    deleteCourse
};
