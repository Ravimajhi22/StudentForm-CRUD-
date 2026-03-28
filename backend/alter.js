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
      ALTER TABLE students ADD COLUMN IF NOT EXISTS adhar_number VARCHAR(20);
      ALTER TABLE students ADD COLUMN IF NOT EXISTS country_code VARCHAR(10) DEFAULT '+91';

      CREATE TABLE IF NOT EXISTS fees_structure (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        academic_year VARCHAR(20)
      );

      CREATE TABLE IF NOT EXISTS student_fees (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        total_amount DECIMAL(10,2) NOT NULL,
        paid_amount DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Pending',
        last_payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS branches (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        syllabus_pdf VARCHAR(255)
      );

      ALTER TABLE students ADD COLUMN IF NOT EXISTS branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL;
      ALTER TABLE students ADD COLUMN IF NOT EXISTS course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL;

      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        status VARCHAR(20) NOT NULL DEFAULT 'Present',
        marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (student_id, date)
      );

      CREATE TABLE IF NOT EXISTS exams (
        id SERIAL PRIMARY KEY,
        exam_name VARCHAR(200) NOT NULL,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        exam_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        room_number VARCHAR(50),
        total_marks INTEGER DEFAULT 100,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table altered successfully:", res);
    process.exit(0);
  } catch (err) {
    console.error("Error altering table:", err);
    process.exit(1);
  }
}

alterTable();
