const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',         // Database host
  user: 'root',              // Database user
  password: 'Santhiya@31',   // Database password
  database: 'authdb', 
});

// Test DB connection
db.connect((err) => {
  if (err) {
    console.error('DB connection error:', err);
    return;
  }
  console.log('Connected to the database');
});

// User registration
app.post('/api/signup', (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  // Hash password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Error hashing password' });

    // Save user to DB
    const query = 'INSERT INTO users (email, password, userType) VALUES (?, ?, ?)';
    db.query(query, [email, hashedPassword, userType], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Account already exists with this email' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: `Account created successfully for ${userType}` });
    });
  });
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  // Retrieve user from DB
  const query = 'SELECT * FROM users WHERE email = ? AND userType = ?';
  db.query(query, [email, userType], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length === 0) {
      return res.status(400).json({ error: 'Account does not exist. Please sign up.' });
    }

    const user = results[0];

    // Compare password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Error comparing password' });

      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect password' });
      }

      res.status(200).json({ message: 'Login successful', userType: user.userType });
    });
  });
});
const signup = async (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    // Check if user already exists
    const [existingUser] = await db.promise().query(
      'SELECT * FROM users WHERE email = ? AND userType = ?',
      [email, userType]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already signed up for this role.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to DB
    await db.promise().query(
      'INSERT INTO users (email, password, userType) VALUES (?, ?, ?)',
      [email, hashedPassword, userType]
    );
    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error occurred during signup.' });
  }
};



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
