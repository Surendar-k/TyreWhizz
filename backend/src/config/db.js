 mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: 'Surendar@19', // replace with your MySQL password
  database: 'authdb',
});

db.connect((err) => {
<<<<<<< HEAD
  if (err) {
    console.error('DB connection error:', err);
    return;
  }
  console.log('Connected to the database');
=======
  if (err) throw err;
  console.log('Database connected!');
>>>>>>> f53e84497dbc7070322a1752262835ceb063b97a
});

module.exports = db;
