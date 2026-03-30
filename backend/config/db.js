const { Pool } = require("pg");
require("dotenv").config();

// Using Pool for connecting to local or production PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Testing connection to local db
pool.on('connect', () => {
  console.log('✅ Connected to local PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Exporting pool for used across the application
module.exports = pool;