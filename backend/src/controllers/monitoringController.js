let sensorData = {};

// Function to handle receiving data from ESP32
const receiveSensorData = (req, res) => {
  console.log("Incoming request:", req.method, req.url);
  console.log("Headers:", req.headers);
  
  if (req.method === "POST") {
    console.log("Body:", req.body);
  } else {
    console.log("Query Params:", req.query);
  }

  const { pressure, incontact_temp, ambient_temp, acc_x, acc_y, acc_z } = req.body;

  // Check if required fields exist and are not empty
  if (pressure === undefined || incontact_temp === undefined || ambient_temp === undefined) {
    console.error("Error: Missing required fields", req.body);
    return res.status(400).json({
      error: "Missing required data (pressure, incontact_temp, ambient_temp)",
    });
  }

  // Convert values safely without using NaN
  sensorData = {
    pressure: pressure ? parseFloat(pressure) : 0,
    incontact_temp: incontact_temp ? parseFloat(incontact_temp) : 0,
    ambient_temp: ambient_temp ? parseFloat(ambient_temp) : 0,
    acc_x: acc_x ? parseFloat(acc_x) : 0,
    acc_y: acc_y ? parseFloat(acc_y) : 0,
    acc_z: acc_z ? parseFloat(acc_z) : 0,
  };

  console.log("Updated sensor data:", sensorData);
  return res.status(200).json({ message: "Data received", data: sensorData });
};

// Function to retrieve latest sensor data
const getSensorData = (req, res) => {
  res.json(sensorData);
};

module.exports = {
  receiveSensorData,
  getSensorData,
};
