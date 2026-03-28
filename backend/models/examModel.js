const pool = require("../config/db");

const getAllExams = async () => {
    const result = await pool.query(`
        SELECT e.*, c.name as course_name 
        FROM exams e
        LEFT JOIN courses c ON e.course_id = c.id
        ORDER BY e.exam_date DESC, e.start_time DESC
    `);
    return result.rows;
};

const getExamById = async (id) => {
    const result = await pool.query(`
        SELECT e.*, c.name as course_name 
        FROM exams e
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE e.id = $1
    `, [id]);
    return result.rows[0];
};

const addExam = async (exam) => {
    const { exam_name, course_id, exam_date, start_time, end_time, room_number, total_marks, description } = exam;
    const result = await pool.query(
        "INSERT INTO exams (exam_name, course_id, exam_date, start_time, end_time, room_number, total_marks, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [exam_name, course_id, exam_date, start_time, end_time, room_number || null, total_marks || 100, description || null]
    );
    return result.rows[0];
};

const updateExam = async (id, data) => {
    const { exam_name, course_id, exam_date, start_time, end_time, room_number, total_marks, description } = data;
    const result = await pool.query(
        "UPDATE exams SET exam_name=$1, course_id=$2, exam_date=$3, start_time=$4, end_time=$5, room_number=$6, total_marks=$7, description=$8 WHERE id=$9 RETURNING *",
        [exam_name, course_id, exam_date, start_time, end_time, room_number || null, total_marks || 100, description || null, id]
    );
    return result.rows[0];
};

const deleteExam = async (id) => {
    await pool.query("DELETE FROM exams WHERE id = $1", [id]);
};

module.exports = {
    getAllExams,
    getExamById,
    addExam,
    updateExam,
    deleteExam
};
