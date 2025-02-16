require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

// Login Handler
exports.login = async (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ? AND userType = ?", [
        email,
        userType,
      ]);

    if (results.length === 0) {
      return res
        .status(400)
        .json({ error: "Account does not exist. Please sign up." });
    }

    const user = results[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, userType: user.userType },
      process.env.JWT_SECRET, // Use secret from .env
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user.id,
      userType: user.userType,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error occurred during login." });
  }
};

// Signup Handler
exports.signup = async (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into users table
    const userQuery =
      "INSERT INTO users (email, password, userType) VALUES (?, ?, ?)";
    await db.promise().query(userQuery, [email, hashedPassword, userType]);

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "User already exists with this email and role." });
    }

    res.status(500).json({ error: "Database error during signup" });
  }
};

// Middleware for Authentication
exports.authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided or malformed token" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token using secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
