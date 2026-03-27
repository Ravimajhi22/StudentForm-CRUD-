const pool = require("../config/db");

const getAllStudents = async () => {
  const result = await pool.query(`
    SELECT s.*, 
           b.name as branch_name,
           c.name as course_name,
           COALESCE(sf.total_amount, 0) as fee_total, 
           COALESCE(sf.paid_amount, 0) as fee_paid,
           COALESCE(sf.status, 'Pending') as fee_status,
           (COALESCE(sf.total_amount, 0) - COALESCE(sf.paid_amount, 0)) as fee_balance
    FROM students s
    LEFT JOIN branches b ON s.branch_id = b.id
    LEFT JOIN courses c ON s.course_id = c.id
    LEFT JOIN student_fees sf ON s.id = sf.student_id
    ORDER BY s.id DESC
  `);
  return result.rows;
};

const getStudentById = async (id) => {
  const result = await pool.query(`
    SELECT s.*, 
           b.name as branch_name,
           c.name as course_name,
           COALESCE(sf.total_amount, 0) as fee_total, 
           COALESCE(sf.paid_amount, 0) as fee_paid,
           COALESCE(sf.status, 'Pending') as fee_status,
           (COALESCE(sf.total_amount, 0) - COALESCE(sf.paid_amount, 0)) as fee_balance
    FROM students s
    LEFT JOIN branches b ON s.branch_id = b.id
    LEFT JOIN courses c ON s.course_id = c.id
    LEFT JOIN student_fees sf ON s.id = sf.student_id
    WHERE s.id = $1
  `, [id]);
  return result.rows[0];
};

// POST
const addStudent = async (student) => {
  const { name, address, state, district, pincode, image, certificate, country, phone, email, age, dob, gender, father_name, mother_name, blood_group, adhar_number, country_code, branch_id, course_id } = student;

  const result = await pool.query(
    "INSERT INTO students (name, address, state, district, pincode, image, certificate, country, phone, email, age, dob, gender, father_name, mother_name, blood_group, adhar_number, country_code, branch_id, course_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING *",
    [name, address, state, district, pincode, image || null, certificate || null, country || null, phone || null, email || null, age || null, dob || null, gender || null, father_name || null, mother_name || null, blood_group || null, adhar_number || null, country_code || '+91', branch_id || null, course_id || null]
  );

  return result.rows[0];
};

// PUT
const updateStudent = async (id, data) => {
  const { name, address, state, district, pincode, image, certificate, country, phone, email, age, dob, gender, father_name, mother_name, blood_group, adhar_number, country_code, branch_id, course_id } = data;

  const result = await pool.query(
    "UPDATE students SET name=$1, address=$2, state=$3, district=$4, pincode=$5, image=$6, certificate=$7, country=$8, phone=$9, email=$10, age=$11, dob=$12, gender=$13, father_name=$14, mother_name=$15, blood_group=$16, adhar_number=$17, country_code=$18, branch_id=$19, course_id=$20 WHERE id=$21 RETURNING *",
    [name, address, state, district, pincode, image || null, certificate || null, country || null, phone || null, email || null, age || null, dob || null, gender || null, father_name || null, mother_name || null, blood_group || null, adhar_number || null, country_code || '+91', branch_id || null, course_id || null, id]
  );

  return result.rows[0];
};

// DELETE
const deleteStudent = async (id) => {
  await pool.query("DELETE FROM students WHERE id=$1", [id]);
};

module.exports = {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
};