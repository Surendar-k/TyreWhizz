const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const vehicleController = require('../controllers/vehicleController');
const monitoringController = require('../controllers/monitoringController');
const driverController = require('../controllers/driverController');
const organizationController=require('../controllers/organizationController');

// Auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Sensor routes
router.get("/sensor/status", monitoringController.getSensorStatus);
router.post("/sensor/status", monitoringController.updateSensorStatus);
router.get("/sensor/data", monitoringController.getSensorData);
router.post("/sensor/data", monitoringController.addSensorData);

// Vehicle routes
router.get("/vehicles", vehicleController.getVehicles);
router.post("/vehicles", vehicleController.addVehicle);
router.put("/vehicles/:id", vehicleController.updateVehicle);
router.delete("/vehicles/:id", vehicleController.deleteVehicle);
router.get("/vehicle/count", vehicleController.getVehicleCount);

// Routes for CRUD operations
router.get('/drivers', driverController.getDrivers);
router.post('/drivers', driverController.addDriver);
router.put('/drivers/:id', driverController.updateDriver);
router.delete('/drivers/:id', driverController.deleteDriver);
router.get('/drivers/count', driverController.getDriverCount);

router.get('/organization/profile', organizationController.getProfile);
router.put('/organization/profile', organizationController.updateProfile);
router.post('/organization/profile', organizationController.addProfile);
router.delete('/organization/profile', organizationController.deleteProfile);

module.exports = router;
