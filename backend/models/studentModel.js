const pool = require("../config/db");

// GET
const getAllStudents = async () => {
  const result = await pool.query("SELECT * FROM students ORDER BY id ASC");
  return result.rows;
};

// POST
const addStudent = async (student) => {
  const { name, address, state, district, pincode, image, certificate } = student;

  const result = await pool.query(
    "INSERT INTO students (name, address, state, district, pincode, image, certificate) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
    [name, address, state, district, pincode, image || null, certificate || null]
  );

  return result.rows[0];
};

// PUT
const updateStudent = async (id, data) => {
  const { name, address, state, district, pincode, image, certificate } = data;

  const result = await pool.query(
    "UPDATE students SET name=$1, address=$2, state=$3, district=$4, pincode=$5, image=$6, certificate=$7 WHERE id=$8 RETURNING *",
    [name, address, state, district, pincode, image || null, certificate || null, id]
  );

  return result.rows[0];
};

// DELETE
const deleteStudent = async (id) => {
  await pool.query("DELETE FROM students WHERE id=$1", [id]);
};

module.exports = {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
};