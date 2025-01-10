const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import controllers
const { signup, login } = require("./src/controllers/authController");
const apiroutes = require("./src/routes/apiroutes");

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.post("/api/signup", signup); // Signup route
app.post("/api/login", login); // Login route
app.use("/api", apiroutes); // General API routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
