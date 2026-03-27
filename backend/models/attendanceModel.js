const pool = require("../config/db");

// Mark Attendance
const markAttendance = async (studentId, status, date = null) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const result = await pool.query(
        `INSERT INTO attendance (student_id, status, date) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (student_id, date) 
         DO UPDATE SET status = EXCLUDED.status, marked_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [studentId, status, targetDate]
    );
    return result.rows[0];
};

// Get Attendance for a Date
const getAttendanceByDate = async (date) => {
    const result = await pool.query(
        `SELECT a.*, s.name, b.name as branch_name, c.name as course_name 
         FROM attendance a
         JOIN students s ON a.student_id = s.id
         LEFT JOIN branches b ON s.branch_id = b.id
         LEFT JOIN courses c ON s.course_id = c.id
         WHERE a.date = $1`,
        [date]
    );
    return result.rows;
};

// Get Daily Summary (For Dashboard)
const getDailySummary = async (date) => {
    const totalStudents = await pool.query("SELECT COUNT(*) FROM students");
    const presentStudents = await pool.query(
        "SELECT COUNT(*) FROM attendance WHERE date = $1 AND status = 'Present'",
        [date]
    );
    
    return {
        date,
        total: parseInt(totalStudents.rows[0].count),
        present: parseInt(presentStudents.rows[0].count)
    };
};

module.exports = {
    markAttendance,
    getAttendanceByDate,
    getDailySummary
};
