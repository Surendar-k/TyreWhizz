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
  const { id, organizationName, managerName, phone } = req.body;
  
  if (!id || !organizationName || !managerName || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `
    UPDATE organization_profile
    SET organization_name = ?, manager_name = ?, phone = ?
    WHERE id = ?`;

  const values = [organizationName, managerName, phone, id];

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

// Add organization profile (with email uniqueness check)
const addProfile = (req, res) => {
  const { organizationName, managerName, email, phone } = req.body;

  if (!organizationName || !managerName || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const lowerCaseEmail = email.toLowerCase();

  // Check if email already exists
  const checkQuery = "SELECT id FROM organization_profile WHERE LOWER(email) = ?";
  db.query(checkQuery, [lowerCaseEmail], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Insert new profile if email is unique
    const insertQuery = `
      INSERT INTO organization_profile (organization_name, manager_name, email, phone)
      VALUES (?, ?, ?, ?)`;
    const values = [organizationName, managerName, lowerCaseEmail, phone];

    db.query(insertQuery, values, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true, message: 'Profile created successfully', profileId: results.insertId });
    });
  });
};

// Delete organization profile (now deletes by email or id)
const deleteProfile = (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Profile ID is required for deletion" });
  }

  const query = 'DELETE FROM organization_profile WHERE id = ?';

  db.query(query, [id], (err, results) => {
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
