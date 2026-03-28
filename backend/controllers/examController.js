const examModel = require("../models/examModel");

const getAllExams = async (req, res) => {
    try {
        const exams = await examModel.getAllExams();
        res.json(exams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getExamById = async (req, res) => {
    try {
        const exam = await examModel.getExamById(req.params.id);
        if (!exam) return res.status(404).json({ error: "Exam not found" });
        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addExam = async (req, res) => {
    try {
        const newExam = await examModel.addExam(req.body);
        res.status(201).json(newExam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateExam = async (req, res) => {
    try {
        const updatedExam = await examModel.updateExam(req.params.id, req.body);
        res.json(updatedExam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteExam = async (req, res) => {
    try {
        await examModel.deleteExam(req.params.id);
        res.json({ message: "Exam deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllExams,
    getExamById,
    addExam,
    updateExam,
    deleteExam
};
