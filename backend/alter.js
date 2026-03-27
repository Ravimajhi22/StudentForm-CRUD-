const pool = require("./config/db");

async function alterTable() {
  try {
    const res = await pool.query(`
      ALTER TABLE students ADD COLUMN IF NOT EXISTS image TEXT;
      ALTER TABLE students ADD COLUMN IF NOT EXISTS certificate TEXT;
      ALTER TABLE students ADD COLUMN IF NOT EXISTS country VARCHAR(100);
      ALTER TABLE students ADD COLUMN IF NOT EXISTS state VARCHAR(100);
      ALTER TABLE students ADD COLUMN IF NOT EXISTS district VARCHAR(100);
      ALTER TABLE students ADD COLUMN IF NOT EXISTS address TEXT;
      ALTER TABLE students ADD COLUMN IF NOT EXISTS pincode VARCHAR(20);
      ALTER TABLE students ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
      ALTER TABLE students ADD COLUMN IF NOT EXISTS email VARCHAR(150);
      ALTER TABLE students ADD COLUMN IF NOT EXISTS age INTEGER;
      ALTER TABLE students ADD COLUMN IF NOT EXISTS dob DATE;
      ALTER TABLE students ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
      ALTER TABLE students ADD COLUMN IF NOT EXISTS father_name VARCHAR(150);
      ALTER TABLE students ADD COLUMN IF NOT EXISTS mother_name VARCHAR(150);
      ALTER TABLE students ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10);
      ALTER TABLE students ADD COLUMN IF NOT EXISTS medical_status TEXT;
      ALTER TABLE students ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(20);
    `);
    console.log("Table altered successfully:", res);
    process.exit(0);
  } catch (err) {
    console.error("Error altering table:", err);
    process.exit(1);
  }
}

alterTable();
