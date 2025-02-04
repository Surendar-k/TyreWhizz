const db = require('../config/db');  // Your MySQL database connection

// Get organization profile details
const getProfile = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = "SELECT * FROM organization_profile WHERE LOWER(email) = LOWER(?)";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(results[0]);
  });
};

// Update organization profile details
const updateProfile = (req, res) => {
  const { organizationName, managerName, email, phone } = req.body;
  
  // Validate input
  if (!organizationName || !managerName || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `
    UPDATE organization_profile
    SET organization_name = ?, manager_name = ?,  phone = ?
    WHERE email=?`;  // Assuming there is only one profile with id = 1

  const values = [organizationName, managerName,  phone,email];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ success: true, message: 'Profile updated successfully' });
  });
};

// Add organization profile (for the first time)
const addProfile = (req, res) => {
  const { organizationName, managerName, email, phone } = req.body;

  // Validate input
  if (!organizationName || !managerName || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `
    INSERT INTO organization_profile (organization_name, manager_name, email, phone)
    VALUES (?, ?, ?, ?)`;

  const values = [organizationName, managerName, email, phone];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true, message: 'Profile created successfully', profileId: results.insertId });
  });
};

// Delete organization profile (optional)
const deleteProfile = (req, res) => {
  const query = 'DELETE FROM organization_profile WHERE id = 1';  // Assuming only one profile exists

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ success: true, message: 'Profile deleted successfully' });
  });
};

module.exports = {
  getProfile,
  updateProfile,
  addProfile,
  deleteProfile
};
