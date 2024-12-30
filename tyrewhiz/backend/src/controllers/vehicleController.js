const db = require('../config/db');

// Get all vehicles
exports.getVehicles = (req, res) => {
  db.query('SELECT * FROM vehicles', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);
  });
};

exports.addVehicle = (req, res) => {
    const { name, type, capacity, Vehicle_No } = req.body;
  
    console.log('Received vehicle data:', req.body); // Logs the incoming request data
  
    if (!name || !type || !capacity || !Vehicle_No) {
      console.error('Missing required fields');
      return res.status(400).json({ message: 'Please provide all vehicle details' });
    }
  
    const query = 'INSERT INTO vehicles (name, type, capacity, Vehicle_No) VALUES (?, ?, ?, ?)';
    db.query(query, [name, type, capacity, Vehicle_No], (err, result) => {
      if (err) {
        console.error('Error inserting data into the database:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }
      console.log('Vehicle added successfully with ID:', result.insertId);
      res.status(201).json({
        message: 'Vehicle added successfully',
        vehicleId: result.insertId,
      });
    });
  };
  
  

  exports.deleteVehicle = (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Vehicle ID is required" });
    }
    const query = 'DELETE FROM vehicles WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error deleting vehicle:", err);
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      res.status(200).json({ message: 'Vehicle deleted successfully' });
    });
  };
  
