 mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',
  host: '127.0.0.1',
  user: 'root', // replace with your MySQL username
  password: 'shreya', // replace with your MySQL password
  password: 'Surendar@19', // replace with your MySQL password
  database: 'authdb',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});

module.exports = db;
