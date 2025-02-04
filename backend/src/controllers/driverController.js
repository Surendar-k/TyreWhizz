const db = require('../config/db');

// Get all drivers
const getDrivers = (req, res) => {
  const query = 'SELECT * FROM drivers';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

 

// Add a new driver
const addDriver = (req, res) => {
  console.log("Incoming request body:", req.body); // Debugging

  const { name, Driver_No, Vehicle_No, exp, contact } = req.body;

  if (!name || !Driver_No || !Vehicle_No || !exp || !contact) {
    console.log("Error: Missing fields"); // Debugging
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO drivers (name, Driver_No, Vehicle_No, exp, contact) VALUES (?, ?, ?, ?, ?)";
  
  db.query(query, [name, Driver_No, Vehicle_No, exp, contact], (err, results) => {
    if (err) {
      console.error("Database error:", err); // Debugging
      return res.status(500).json({ error: "Database error" });
    }

    console.log("Driver added successfully with ID:", results.insertId);
    res.json({ driverId: results.insertId, name, Driver_No, Vehicle_No, exp, contact });
  });
};



// Update a driver's details
const updateDriver = (req, res) => {
  const { id } = req.params;
  const { name, Driver_No, Vehicle_No, exp,contact } = req.body;

  if (!name || !Driver_No || !Vehicle_No || !exp ||!contact) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'UPDATE drivers SET name = ?, Driver_No = ?, Vehicle_No = ?, exp=? ,contact = ? WHERE id = ?';
  db.query(query, [name, Driver_No, Vehicle_No, exp,contact, id], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true, message: 'Driver updated successfully' });
  });
};

// Delete a driver
const deleteDriver = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM drivers WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json({ success: true, message: 'Driver deleted successfully' });
  });
};

// Get driver count
const getDriverCount = (req, res) => {
  const query = 'SELECT COUNT(*) as count FROM drivers';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ count: results[0].count });
  });
};

module.exports = {
  getDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  getDriverCount,
};
