const pool = require("./config/db");

async function checkAdmins() {
  try {
    const res = await pool.query("SELECT COUNT(*) FROM admins");
    console.log(`✅ Admins table exists. Current count: ${res.rows[0].count}`);
    const admin = await pool.query("SELECT email FROM admins LIMIT 1");
    if (admin.rows.length > 0) {
      console.log(`✅ Default admin found: ${admin.rows[0].email}`);
    }
    process.exit(0);
  } catch (err) {
    console.error("❌ Error checking admins table:", err.message);
    process.exit(1);
  }
}

checkAdmins();
