// const handleSensorData = (req, res) => {
//   const { pressure1, pressure2, ambientTemp, objectTemp } = req.body;
//   console.log('Received Data:');
//   console.log(`Pressure 1: ${pressure1} PSI`);
//   console.log(`Pressure 2: ${pressure2} PSI`);
//   console.log(`Ambient Temp: ${ambientTemp} °C`);
//   console.log(`Object Temp: ${objectTemp} °C`);
//   res.status(200).send('Data received successfully');
// };

// module.exports = {
//   handleSensorData,
// };


// monitoringController.js

let sensorData = {};

// Function to handle receiving data from ESP32
const receiveSensorData = (req, res) => {
    console.log("Received request:", req.query);
    const { pressure1, pressure2, ambientTemp, objectTemp } = req.query;

    if (pressure1 && pressure2 && ambientTemp && objectTemp) {
        sensorData = { pressure1, pressure2, ambientTemp, objectTemp };
        console.log('Received sensor data:', sensorData);

        // Respond to ESP32
        res.status(200).send('Data received');
    } else {
        res.status(400).send('Invalid data');
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
