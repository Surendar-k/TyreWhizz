const db = require('../config/db');

const getSensorStatus = (req, res) => {
  const query = 'SELECT is_connected FROM sensor_status ORDER BY last_updated DESC LIMIT 1';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    const isConnected = results.length > 0 ? results[0].is_connected : false;
    res.json({ isConnected });
  });
};

const updateSensorStatus = (req, res) => {
  const { isConnected } = req.body;
  const query = 'INSERT INTO sensor_status (is_connected) VALUES (?)';
  db.query(query, [isConnected], err => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
};

const getSensorData = (req, res) => {
  const query = `
    SELECT 
      tire_position, pressure, temperature, timestamp 
    FROM tire_readings 
    WHERE timestamp IN (
      SELECT MAX(timestamp) 
      FROM tire_readings 
      GROUP BY tire_position
    );
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    const data = results.reduce((acc, curr) => {
      acc.pressure[curr.tire_position] = curr.pressure;
      acc.temperature[curr.tire_position] = curr.temperature;
      return acc;
    }, { pressure: {}, temperature: {} });
    res.json(data);
  });
};

const addSensorData = (req, res) => {
  const { readings } = req.body;
  const values = Object.entries(readings).map(([position, data]) => [
    position,
    data.pressure,
    data.temperature,
  ]);
  const query = 'INSERT INTO tire_readings (tire_position, pressure, temperature) VALUES ?';
  db.query(query, [values], err => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
};

module.exports = {
  getSensorStatus,
  updateSensorStatus,
  getSensorData,
  addSensorData
};
