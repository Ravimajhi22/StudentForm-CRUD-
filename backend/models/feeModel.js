const pool = require("../config/db");

// Fee Structure Operations
const getAllFees = async () => {
    const result = await pool.query("SELECT * FROM fees_structure ORDER BY id ASC");
    return result.rows;
};

const addFeeStructure = async (fee) => {
    const { title, amount, category, academic_year } = fee;
    const result = await pool.query(
        "INSERT INTO fees_structure (title, amount, category, academic_year) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, amount, category, academic_year]
    );
    return result.rows[0];
};

const deleteFeeStructure = async (id) => {
    await pool.query("DELETE FROM fees_structure WHERE id = $1", [id]);
};

// Student Fee Operations
const getStudentFees = async (studentId) => {
    const result = await pool.query("SELECT * FROM student_fees WHERE student_id = $1", [studentId]);
    return result.rows[0];
};

const updateStudentFee = async (studentId, data) => {
    const { total_amount, paid_amount } = data;
    const status = paid_amount >= total_amount ? 'Paid' : (paid_amount > 0 ? 'Partial' : 'Pending');
    
    const checkExist = await pool.query("SELECT id FROM student_fees WHERE student_id = $1", [studentId]);
    
    if (checkExist.rows.length > 0) {
        const result = await pool.query(
            "UPDATE student_fees SET total_amount=$1, paid_amount=$2, status=$3, last_payment_date=CURRENT_TIMESTAMP WHERE student_id=$4 RETURNING *",
            [total_amount, paid_amount, status, studentId]
        );
        return result.rows[0];
    } else {
        const result = await pool.query(
            "INSERT INTO student_fees (student_id, total_amount, paid_amount, status) VALUES ($1, $2, $3, $4) RETURNING *",
            [studentId, total_amount, paid_amount, status]
        );
        return result.rows[0];
    }
};

module.exports = {
    getAllFees,
    addFeeStructure,
    deleteFeeStructure,
    getStudentFees,
    updateStudentFee
};
