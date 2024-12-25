// /config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',         // Database host
  user: 'root',              // Database user
  password: 'Surendar@19',   // Database password
  database: 'authdb',
});

db.connect((err) => {
  if (err) {
    console.error('DB connection error:', err);
    return;
  }
  console.log('Connected to the database');
});

module.exports = db;
