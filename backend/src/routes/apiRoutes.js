
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const vehicleController = require('../controllers/vehicleController');

//login and signup
router.post('/signup', authController.signup);
router.post('/login', authController.login);

//organisation page vehicles list
// Get all vehicles
router.get('/vehicles', vehicleController.getVehicles);

// Add a new vehicle
router.post('/vehicles', vehicleController.addVehicle);

// Delete a vehicle
router.delete('/vehicles/:id', vehicleController.deleteVehicle);

module.exports = router;
