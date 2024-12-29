
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const vehicleController = require('../controllers/vehicleController');

//login and signup
router.post('/signup', authController.signup);
router.post('/login', authController.login);



module.exports = router;
