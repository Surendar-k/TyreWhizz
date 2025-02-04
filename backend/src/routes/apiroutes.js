const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const vehicleController = require("../controllers/vehicleController");

const driverController = require("../controllers/driverController");
// const { handleSensorData } = require("../controllers/monitoringController");
// Auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
// Route to handle sensor data

// app.post('/api/sensor-data', handleSensorData);

// Vehicle routes
router.get("/vehicles", vehicleController.getVehicles);
router.post("/vehicles", vehicleController.addVehicle);
router.delete("/vehicles/:id", vehicleController.deleteVehicle);
router.put("/vehicles/:id", vehicleController.updateVehicle);
router.get("/vehicle-count", vehicleController.getVehicleCount);

// Routes for CRUD operations
router.get("/drivers", driverController.getDrivers);
router.post("/drivers", driverController.addDriver);
router.put("/drivers/:id", driverController.updateDriver);
router.delete("/drivers/:id", driverController.deleteDriver);
router.get("/drivers/count", driverController.getDriverCount);

const monitoringController = require("../controllers/monitoringController");

// Route to handle POST request for receiving sensor data
router.post("/data", monitoringController.fetchSensorData);

// Route to handle GET request to fetch the last 10 sensor readings
router.get("/data", monitoringController.getSensorData);

module.exports = router;
