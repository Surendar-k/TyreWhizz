const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const vehicleController = require("../controllers/vehicleController");
const authMiddleWare = require("../middleware/authMiddleWare");
const driverController = require("../controllers/driverController");
const monitoringController = require("../controllers/monitoringController");
const businessController = require("../controllers/businessController");

//login and signup controls
router.post("/signup", authController.signup);
router.post("/login", authController.login);

//organization vehicle controls
router.get("/vehicles", authMiddleWare, vehicleController.getVehicles);
router.post("/vehicles", authMiddleWare, vehicleController.addVehicle);
router.delete("/vehicles/:id", authMiddleWare, vehicleController.deleteVehicle);
router.put("/vehicles/:id", authMiddleWare, vehicleController.updateVehicle);
router.get("/vehiclescount", authMiddleWare, vehicleController.getVehicleCount);
//organization driver controls
router.get("/drivers", authMiddleWare, driverController.getDrivers);
router.post("/drivers", authMiddleWare, driverController.addDriver);
router.put("/drivers/:id", authMiddleWare, driverController.updateDriver);
router.delete("/drivers/:id", authMiddleWare, driverController.deleteDriver);
router.get("/driverscount", authMiddleWare, driverController.getDriverCount);

// Connect Vehicle (with auth)
router.post(
  "/connectvehicle",
  authMiddleWare,
  businessController.connectVehicle
);

// Get Connected Vehicles (with auth)
router.get(
  "/connectedvehicles/:driver_id",
  authMiddleWare,
  businessController.getConnectedVehicles
);
//sensor data
router.get("/data", monitoringController.getSensorData);
router.post("/data", monitoringController.receiveSensorData);
router.get("/sensor", monitoringController.getSensorData);

module.exports = router;
