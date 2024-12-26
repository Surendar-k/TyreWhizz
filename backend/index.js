// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import controllers
const { signup, login } = require('./src/controllers/authController');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post('/api/signup', signup);
app.post('/api/login', login);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
