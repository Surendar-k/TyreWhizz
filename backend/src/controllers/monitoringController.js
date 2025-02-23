let sensorData = {};

// Function to handle receiving data from ESP32
const receiveSensorData = (req, res) => {
  console.log("🚀 Incoming Request:");
  console.log("➡️ Method:", req.method);
  console.log("➡️ URL:", req.url);
  console.log("➡️ Headers:", req.headers);

  // Log the received body
  console.log("📥 Body Received:", req.body);

  // Destructure data from request body
  const { pressure, incontact_temp, ambient_temp, acc_x, acc_y, acc_z } =
    req.body;

  // Validate required fields
  if (
    pressure === undefined ||
    incontact_temp === undefined ||
    ambient_temp === undefined ||
    acc_x === undefined ||
    acc_y === undefined ||
    acc_z === undefined
  ) {
    console.error("❌ Error: Missing required fields", req.body);
    return res.status(400).json({
      error:
        "Missing required data (pressure, incontact_temp, ambient_temp, acc_x, acc_y, acc_z)",
    });
  }

  // Parse values safely
  sensorData = {
    pressure: parseFloat(pressure) || 0,
    incontact_temp: parseFloat(incontact_temp) || 0,
    ambient_temp: parseFloat(ambient_temp) || 0,
    acc_x: parseInt(acc_x) || 0,
    acc_y: parseInt(acc_y) || 0,
    acc_z: parseInt(acc_z) || 0,
  };

  console.log("✅ Updated Sensor Data:", sensorData);
  return res
    .status(200)
    .json({ message: "Data received successfully", data: sensorData });
};

// Function to retrieve latest sensor data
const getSensorData = (req, res) => {
  res.json(sensorData);
};

module.exports = {
  receiveSensorData,
  getSensorData,
};
