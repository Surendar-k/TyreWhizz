const db = require('../config/db');

const getVehicles = (req, res) => {
  const query = 'SELECT * FROM vehicles';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

const addVehicle = (req, res) => {
    const {  Vehicle_No,driver_id,type, capacity, } = req.body;
    if ( !Vehicle_No||!driver_id|| !type || !capacity ) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    const query = 'INSERT INTO vehicles (vehicle_no,driver_id, type, capacity) VALUES (?, ?, ?,?)';
    db.query(query, [!Vehicle_No,driver_id,type, capacity], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ vehicleId: results.insertId, driver_id, type, capacity, Vehicle_No });
    });
  };
  

const deleteVehicle = (req, res) => {
  const query = 'DELETE FROM vehicles WHERE id = ?';
  db.query(query, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
};

const getVehicleCount = (req, res) => {
  const query = 'SELECT COUNT(*) as count FROM vehicles';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ count: results[0].count });
  });
};

module.exports = {
  getVehicles,
  addVehicle,
  deleteVehicle,
  getVehicleCount
};
