let sensorData = {};

// Function to handle receiving data from ESP32 via query parameters
const receiveSensorData = (req, res) => {
  console.log("Received request with query params:", req.query);

  // Extract sensor values from query parameters
  const { pressure, incontact_temp, ambient_temp, acc_x, acc_y, acc_z } =
    req.query;

  if (
    pressure !== undefined &&
    incontact_temp !== undefined &&
    ambient_temp !== undefined
  ) {
    sensorData = {
      pressure: parseFloat(pressure), // Convert string to float
      incontact_temp: parseFloat(incontact_temp),
      ambient_temp: parseFloat(ambient_temp),
      acc_x: parseFloat(acc_x), // Convert to integer
      acc_y: parseFloat(acc_y),
      acc_z: parseFloat(acc_z),
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
