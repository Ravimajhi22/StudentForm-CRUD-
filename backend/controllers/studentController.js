const studentModel = require("../models/studentModel");

const formatStudent = (student) => {
  if (!student) return student;
  return {
    ...student,
    image: student.image && !student.image.startsWith('http') && !student.image.startsWith('data:') ? `http://localhost:5000/uploads/${student.image}` : student.image,
    certificate: student.certificate && !student.certificate.startsWith('http') && !student.certificate.startsWith('data:') ? `http://localhost:5000/uploads/${student.certificate}` : student.certificate,
  };
};

// GET
exports.getStudents = async (req, res) => {
  const students = await studentModel.getAllStudents();
  res.json(students.map(formatStudent));
};

// POST
exports.createStudent = async (req, res) => {
  const studentData = req.body;
  if (req.files) {
    if (req.files["image"]) {
      studentData.image = req.files["image"][0].filename;
    }
    if (req.files["certificate"]) {
      studentData.certificate = req.files["certificate"][0].filename;
    }
  }

  const student = await studentModel.addStudent(studentData);
  res.status(201).json(formatStudent(student));
};

// PUT
exports.updateStudent = async (req, res) => {
  const id = parseInt(req.params.id);
  const studentData = req.body;
  
  if (req.files) {
    if (req.files["image"]) {
      studentData.image = req.files["image"][0].filename;
    }
    if (req.files["certificate"]) {
      studentData.certificate = req.files["certificate"][0].filename;
    }
  }

  const updated = await studentModel.updateStudent(id, studentData);

  if (!updated) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(formatStudent(updated));
};

// DELETE
exports.deleteStudent = async (req, res) => {
  const id = parseInt(req.params.id);
  await studentModel.deleteStudent(id);
  res.json({ message: "Deleted" });
};