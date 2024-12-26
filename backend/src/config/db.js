const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', // replace with your MySQL username
  password: '123qwe', // replace with your MySQL password
  database: 'authdb',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});

module.exports = db;
