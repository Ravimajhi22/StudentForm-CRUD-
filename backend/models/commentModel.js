const pool = require("../config/db");

const getAllComments = async () => {
    const result = await pool.query("SELECT * FROM comments");
    return result.rows;
};

const addComment = async (comment) => {
    const result = await pool.query(
        "INSERT INTO comments (comment) VALUES ($1) RETURNING *",
        [comment]
    );
    return result.rows[0];
};

module.exports = { getAllComments, addComment };
