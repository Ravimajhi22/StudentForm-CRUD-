const pool = require("../config/db");

// GET
const getAllStudents = async () => {
  const result = await pool.query("SELECT * FROM students ORDER BY id ASC");
  return result.rows;
};

// POST
const addStudent = async (student) => {
  const { name, address, state, district, pincode, image, certificate, country, phone, email, age, dob, gender, father_name, mother_name, blood_group, medical_status, emergency_contact } = student;

  const result = await pool.query(
    "INSERT INTO students (name, address, state, district, pincode, image, certificate, country, phone, email, age, dob, gender, father_name, mother_name, blood_group, medical_status, emergency_contact) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *",
    [name, address, state, district, pincode, image || null, certificate || null, country || null, phone || null, email || null, age || null, dob || null, gender || null, father_name || null, mother_name || null, blood_group || null, medical_status || null, emergency_contact || null]
  );

  return result.rows[0];
};

// PUT
const updateStudent = async (id, data) => {
  const { name, address, state, district, pincode, image, certificate, country, phone, email, age, dob, gender, father_name, mother_name, blood_group, medical_status, emergency_contact } = data;

  const result = await pool.query(
    "UPDATE students SET name=$1, address=$2, state=$3, district=$4, pincode=$5, image=$6, certificate=$7, country=$8, phone=$9, email=$10, age=$11, dob=$12, gender=$13, father_name=$14, mother_name=$15, blood_group=$16, medical_status=$17, emergency_contact=$18 WHERE id=$19 RETURNING *",
    [name, address, state, district, pincode, image || null, certificate || null, country || null, phone || null, email || null, age || null, dob || null, gender || null, father_name || null, mother_name || null, blood_group || null, medical_status || null, emergency_contact || null, id]
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