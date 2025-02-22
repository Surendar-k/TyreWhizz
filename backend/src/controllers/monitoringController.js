let sensorData = {};

// Function to handle receiving data from ESP32 via query parameters
const receiveSensorData = (req, res) => {
  console.log("Received request with query params:", req.query);

  // Extract sensor values from query parameters
  const {
    pressure,
    temperature_object,
    temperature_ambient,
    acc_x,
    acc_y,
    acc_z,
  } = req.query;

  if (
    pressure !== undefined &&
    temperature_object !== undefined &&
    temperature_ambient !== undefined
  ) {
    sensorData = {
      pressure: parseFloat(pressure), // Convert string to float
      temperature_object: parseFloat(temperature_object),
      temperature_ambient: parseFloat(temperature_ambient),
      acc_x: parseInt(acc_x) || 0, // Convert to integer
      acc_y: parseInt(acc_y) || 0,
      acc_z: parseInt(acc_z) || 0,
    };
    console.log("Received sensor data:", sensorData);

    // Respond to ESP32
    res.status(200).json({ message: "Data received" });
  } else {
    res.status(400).json({ error: "Invalid data" });
  }
};

// Function to handle retrieving the latest sensor data
const getSensorData = (req, res) => {
  res.json(sensorData);
};

module.exports = {
  receiveSensorData,
  getSensorData,
};
