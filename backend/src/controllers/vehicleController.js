const db = require('../config/db');

const getVehicles = (req, res) => {
  const query = 'SELECT * FROM vehicles';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

const addVehicle = (req, res) => {
    const {  vehicle_no,driver_id,type, capacity, } = req.body;
    if ( !vehicle_no||!driver_id|| !type || !capacity ) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (isNaN(driver_id) || isNaN(capacity)) {
      return res.status(400).json({ error: 'driver_id and capacity must be numbers' });
    }
  
  
    const query = 'INSERT INTO vehicles (vehicle_no,driver_id, type, capacity) VALUES (?, ?, ?,?)';
    db.query(query, [vehicle_no,driver_id,type, capacity], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ vehicleId: results.insertId, vehicle_no,driver_id, type, capacity });
    });
  };
  

const deleteVehicle = (req, res) => {
  const query = 'DELETE FROM vehicles WHERE id = ?';
  db.query(query, [req.params.id], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true });
  });
};
// Update a vehicle's details
const updateVehicle = (req, res) => {
  console.log('Received PUT request for vehicle:', req.params.id);
  console.log('Request body:', req.body);

  const { id } = req.params;
  const { vehicle_no, driver_id, type, capacity } = req.body;

  if (!vehicle_no || !driver_id || !type || !capacity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'UPDATE vehicles SET driver_id = ?, type = ?, capacity = ? WHERE id = ?';
  db.query(query, [driver_id, type, capacity, id], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true, message: 'Vehicle updated successfully' });
  });
};




const getVehicleCount = (req, res) => {
  const query = 'SELECT COUNT(*) as count FROM vehicles';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ count: results[0].count });
  });
};
module.exports = {
  getVehicles,
  addVehicle,
  deleteVehicle,
  updateVehicle,
  getVehicleCount
};
