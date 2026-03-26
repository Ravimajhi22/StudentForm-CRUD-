const studentModel = require("../models/studentModel");

// GET
exports.getStudents = async (req, res) => {
  const students = await studentModel.getAllStudents();
  res.json(students);
};

// POST
exports.createStudent = async (req, res) => {
  const student = await studentModel.addStudent(req.body);
  res.status(201).json(student);
};

// PUT
exports.updateStudent = async (req, res) => {
  const id = parseInt(req.params.id);
  const updated = await studentModel.updateStudent(id, req.body);

  if (!updated) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(updated);
};

// DELETE
exports.deleteStudent = async (req, res) => {
  const id = parseInt(req.params.id);
  await studentModel.deleteStudent(id);
  res.json({ message: "Deleted" });
};