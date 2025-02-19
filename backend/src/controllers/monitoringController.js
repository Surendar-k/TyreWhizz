const axios = require("axios");

let sensorData = {};

const fetchSensorDataFromCloud = async () => {
  try {
    const response = await axios.get(
      "https://us-central1-tyrewhizz.cloudfunctions.net/sensordata"
    );
    // console.log("Raw API Response:", response.data);

    // Now directly access sensor data from the response body
    if (response.data && response.data.body) {
      const sensor = response.data.body; // Directly accessing body
      // console.log("Sensor Data in body:", sensor);

      const { pressure, temp_contact, temp_amb, accX, accY, accZ, data_count } =
        sensor;
      console.log("Fetched Sensor Data:", {
        pressure,
        temp_contact,
        temp_amb,
        accX,
        accY,
        accZ,
        data_count,
      });

      sensorData = {
        pressure1: pressure,
        pressure2: pressure, // Assuming both pressures are the same
        ambientTemp: temp_amb,
        objectTemp: temp_contact,
        accX,
        accY,
        accZ,
        data_count,
      };

      // console.log("Updated sensor data:", sensorData);
    } else {
      // console.log("Sensor data not found in the response body");
    }
  } catch (error) {
    // console.error("Error fetching sensor data:", error);
  }
};

// Fetch the sensor data every 1 second
setInterval(fetchSensorDataFromCloud, 1000); // every 1 second

// Function to get the current sensor data
const getSensorData = (req, res) => {
  res.json(sensorData);
};

module.exports = {
  fetchSensorDataFromCloud,
  getSensorData,
};
