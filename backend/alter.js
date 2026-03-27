const pool = require("./config/db");

async function alterTable() {
  try {
    const res = await pool.query(`
      ALTER TABLE students ADD COLUMN IF NOT EXISTS image TEXT;
      ALTER TABLE students ADD COLUMN IF NOT EXISTS certificate TEXT;
    `);
    console.log("Table altered successfully:", res);
    process.exit(0);
  } catch (err) {
    console.error("Error altering table:", err);
    process.exit(1);
  }
}

alterTable();
