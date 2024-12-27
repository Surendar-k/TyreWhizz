const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', // replace with your MySQL username
  password: 'shreya', // replace with your MySQL password
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
