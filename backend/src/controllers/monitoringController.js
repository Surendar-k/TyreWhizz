const sensorData = [];

const fetchSensorData = (req, res) => {
  // Extract data from the request body
  const newData = {
    pressure1: req.body.pressure1, // Expecting pressure1 from the request
    pressure2: req.body.pressure2, // Expecting pressure2 from the request
    ambientTemp: req.body.ambientTemp,
    objectTemp: req.body.objectTemp,
    timestamp: new Date(),
  };

  // Log the incoming sensor data
  console.log("Received sensor data:", newData);

  // Push the incoming data to the sensorData array
  sensorData.push(newData); // Store the data

  // Log the updated sensorData array
  console.log("Updated sensor data array:", sensorData);

  res.status(200).json({
    success: true,
    message: "Sensor data received successfully",
    data: newData,
  });
};

const getSensorData = (req, res) => {
  // Log the request for sensor data
  console.log("Fetching last 10 sensor readings...");

  // Send the last 10 sensor readings, including pressure1 and pressure2
  const recentData = sensorData.slice(-10);

  // Log the recent sensor data being sent
  console.log("Recent sensor data:", recentData);

  res.status(200).json({
    success: true,
    data: recentData,
  });
};

module.exports = { fetchSensorData, getSensorData };
