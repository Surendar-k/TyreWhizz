// /controllers/authController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Signup Handler
exports.signup = async (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Insert user into users table
    const userQuery = "INSERT INTO users (email, password, userType) VALUES (?, ?, ?)";
    await db.query(userQuery, [email, password, userType]);

    // If user is an organization, create a profile entry in organization_profile
    if (userType === "organisation") {
      const profileQuery = "INSERT INTO organization_profile (email, organization_name, manager_name, phone) VALUES (?, ?, ?, ?)";
      await db.query(profileQuery, [email, '', '', '']); // Empty placeholders
    }

    res.json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Database error during signup" });
  }
};

// Login Handler
exports.login = async (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    // Retrieve user from DB
    const [results] = await db.promise().query(
      'SELECT * FROM users WHERE email = ? AND userType = ?',
      [email, userType]
    );

    if (results.length === 0) {
      return res.status(400).json({ error: 'Account does not exist. Please sign up.' });
    }

    const user = results[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful', userType: user.userType });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error occurred during login.' });
  }
};
