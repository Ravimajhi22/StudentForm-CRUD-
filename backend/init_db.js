require('dotenv').config();
const pool = require("./config/db");

const initDb = async () => {
  try {
    console.log("Initializing database tables...");

    // 1. Branches Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS branches (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      );
    `);

    // 2. Courses Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        syllabus_pdf TEXT,
        UNIQUE(branch_id, name)
      );
    `);

    // 3. Students Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address TEXT,
        state VARCHAR(50),
        district VARCHAR(50),
        pincode VARCHAR(10),
        image TEXT,
        certificate TEXT,
        country VARCHAR(50),
        phone VARCHAR(20),
        email VARCHAR(100) UNIQUE,
        age INTEGER,
        dob DATE,
        gender VARCHAR(10),
        father_name VARCHAR(100),
        mother_name VARCHAR(100),
        blood_group VARCHAR(5),
        adhar_number VARCHAR(20) UNIQUE,
        country_code VARCHAR(5) DEFAULT '+91',
        branch_id INTEGER REFERENCES branches(id),
        course_id INTEGER REFERENCES courses(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Fees Structure Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fees_structure (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50),
        academic_year VARCHAR(20)
      );
    `);

    // 5. Student Fees Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_fees (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE UNIQUE,
        total_amount DECIMAL(10, 2) DEFAULT 0,
        paid_amount DECIMAL(10, 2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'Pending',
        last_payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Attendance Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        status VARCHAR(20) NOT NULL,
        date DATE NOT NULL,
        marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, date)
      );
    `);

    // 7. Exams Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exams (
        id SERIAL PRIMARY KEY,
        exam_name VARCHAR(100) NOT NULL,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        exam_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        room_number VARCHAR(20),
        total_marks INTEGER DEFAULT 100,
        description TEXT
      );
    `);

    console.log("All tables created successfully!");

    // Optional: Seed initial data if tables are empty
    const branchCheck = await pool.query("SELECT COUNT(*) FROM branches");
    if (parseInt(branchCheck.rows[0].count) === 0) {
      console.log("Seeding initial branch data...");
      await pool.query("INSERT INTO branches (name) VALUES ('Computer Science'), ('Electronics'), ('Mechanical')");
      console.log("Seed complete.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
};

initDb();
