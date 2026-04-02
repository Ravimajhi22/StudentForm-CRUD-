const pool = require("../config/db");

const createAdmin = async (email, hashedPassword) => {
  const result = await pool.query(
    "INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING *",
    [email, hashedPassword]
  );
  return result.rows[0];
};

const findAdminByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
  return result.rows[0];
};

module.exports = {
  createAdmin,
  findAdminByEmail,
};
