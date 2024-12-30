const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const vehicleController = require('../controllers/vehicleController');
const monitoringController = require('../controllers/monitoringController');

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Sensor routes    
router.get('/sensor/status', monitoringController.getSensorStatus);
router.post('/sensor/status', monitoringController.updateSensorStatus);
router.get('/sensor/data', monitoringController.getSensorData);
router.post('/sensor/data', monitoringController.addSensorData);

// Vehicle routes
router.get('/vehicles', vehicleController.getVehicles);
router.post('/vehicles', vehicleController.addVehicle);
router.delete('/vehicles/:id', vehicleController.deleteVehicle);
router.get('/vehicle-count', vehicleController.getVehicleCount);

module.exports = router;