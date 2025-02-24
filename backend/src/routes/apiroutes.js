const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const vehicleController = require("../controllers/vehicleController");
const authMiddleWare = require("../middleware/authMiddleWare");
const driverController = require("../controllers/driverController");

// const { handleSensorData } = require("../controllers/monitoringController");
// Auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
// Route to handle sensor data

// app.post('/api/sensor-data', handleSensorData);

// Vehicle routes
router.get("/vehicles", authMiddleWare, vehicleController.getVehicles);
router.post("/vehicles", authMiddleWare, vehicleController.addVehicle);
router.delete("/vehicles/:id", authMiddleWare, vehicleController.deleteVehicle);
router.put("/vehicles/:id", authMiddleWare, vehicleController.updateVehicle);
router.get("/vehiclescount", authMiddleWare, vehicleController.getVehicleCount);

// Routes for CRUD operations
router.get("/drivers", authMiddleWare, driverController.getDrivers);
router.post("/drivers", authMiddleWare, driverController.addDriver);
router.put("/drivers/:id", authMiddleWare, driverController.updateDriver);
router.delete("/drivers/:id", authMiddleWare, driverController.deleteDriver);
router.get("/driverscount", authMiddleWare, driverController.getDriverCount);

const monitoringController = require("../controllers/monitoringController");

// Fetch sensor data from cloud
router.get("/data", monitoringController.getSensorData);
router.post("/data", monitoringController.receiveSensorData);
// Get the current sensor data
router.get("/sensor", monitoringController.getSensorData);
module.exports = router;
