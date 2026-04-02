const pool = require("./config/db");

async function listTables() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Current Tables in 'stu' Database:");
    res.rows.forEach(row => console.log(`- ${row.table_name}`));
    process.exit(0);
  } catch (err) {
    console.error("❌ Error listing tables:", err.message);
    process.exit(1);
  }
}

listTables();
