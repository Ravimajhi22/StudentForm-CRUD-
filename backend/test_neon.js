const pool = require('./config/db');

async function testConnection() {
  console.log('Testing connection to Neon...');
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Connection successful!', result.rows[0]);
  } catch (err) {
    console.error('Connection failed:', err.message);
    if (!process.env.DATABASE_URL) {
      console.warn('HINT: Your DATABASE_URL in .env is empty. Please paste your Neon connection string there.');
    }
  } finally {
    await pool.end();
  }
}

testConnection();
