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
      pressure: parseFloat(pressure) || 0,
      incontact_temp: parseFloat(incontact_temp) || 0,
      ambient_temp: parseFloat(ambient_temp) || 0,
      acc_x: acc_x !== undefined ? parseFloat(acc_x) : 0,
      acc_y: acc_y !== undefined ? parseFloat(acc_y) : 0,
      acc_z: acc_z !== undefined ? parseFloat(acc_z) : 0,
    };

    console.log("Received sensor data:", sensorData);

    // Respond to ESP32
    res.status(200).json({ message: "Data received", data: sensorData });
  } else {
    res.status(400).json({
      error: "Missing required data (pressure, incontact_temp, ambient_temp)",
    });
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
