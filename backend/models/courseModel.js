const pool = require("../config/db");

// Branch Operations
const getAllBranches = async () => {
    const result = await pool.query("SELECT * FROM branches ORDER BY name ASC");
    return result.rows;
};

const addBranch = async (name) => {
    const result = await pool.query("INSERT INTO branches (name) VALUES ($1) RETURNING *", [name]);
    return result.rows[0];
};

const deleteBranch = async (id) => {
    await pool.query("DELETE FROM branches WHERE id = $1", [id]);
};

// Course Operations
const getCoursesByBranch = async (branchId) => {
    const result = await pool.query("SELECT * FROM courses WHERE branch_id = $1 ORDER BY name ASC", [branchId]);
    return result.rows;
};

const getAllCourses = async () => {
    const result = await pool.query(`
        SELECT c.*, b.name as branch_name 
        FROM courses c 
        JOIN branches b ON c.branch_id = b.id 
        ORDER BY b.name, c.name ASC
    `);
    return result.rows;
};

const addCourse = async (course) => {
    const { branch_id, name, syllabus_pdf } = course;
    const result = await pool.query(
        "INSERT INTO courses (branch_id, name, syllabus_pdf) VALUES ($1, $2, $3) RETURNING *",
        [branch_id, name, syllabus_pdf]
    );
    return result.rows[0];
};

const updateCourseSyllabus = async (id, syllabusPdf) => {
    const result = await pool.query(
        "UPDATE courses SET syllabus_pdf = $1 WHERE id = $2 RETURNING *",
        [syllabusPdf, id]
    );
    return result.rows[0];
};

const deleteCourse = async (id) => {
    await pool.query("DELETE FROM courses WHERE id = $1", [id]);
};

module.exports = {
    getAllBranches,
    addBranch,
    deleteBranch,
    getCoursesByBranch,
    getAllCourses,
    addCourse,
    updateCourseSyllabus,
    deleteCourse
};
