let sensorData = {};

// Function to handle receiving data from ESP32 via query parameters or body
const receiveSensorData = (req, res) => {
  console.log("Received request:", req.method, req.url);
  console.log("Query Params:", req.query);
  console.log("Body:", req.body);

  // Extract sensor values from query parameters (GET) or request body (POST)
  const { pressure, incontact_temp, ambient_temp, acc_x, acc_y, acc_z } =
    req.query.pressure !== undefined ? req.query : req.body; // Prioritize query first, then body

  if (
    pressure !== undefined &&
    incontact_temp !== undefined &&
    ambient_temp !== undefined
  ) {
    sensorData = {
      pressure: parseFloat(pressure), // Convert string to float
      incontact_temp: parseFloat(incontact_temp),
      ambient_temp: parseFloat(ambient_temp),
      acc_x: parseFloat(acc_x), // Convert to float
      acc_y: parseFloat(acc_y),
      acc_z: parseFloat(acc_z),
    };
    console.log("Received sensor data:", sensorData);

    // Respond to ESP32
    res.status(200).json({ message: "Data received successfully" });
  } else {
    res.status(400).json({ error: "Invalid or missing sensor data" });
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
