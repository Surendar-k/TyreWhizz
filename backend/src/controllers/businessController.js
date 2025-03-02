const db = require("../config/db");

const connectVehicle = async (req, res) => {
  const { vehicle_id, driver_id } = req.body;

  if (!vehicle_id || !driver_id) {
    return res
      .status(400)
      .json({ message: "Vehicle ID and Driver ID are required" });
  }

  try {
    // ✅ Check if the vehicle exists
    const [[vehicle]] = await db
      .promise()
      .query("SELECT * FROM vehicles WHERE id = ?", [vehicle_id]);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // ✅ Check if the driver exists
    const [[driver]] = await db
      .promise()
      .query("SELECT * FROM drivers WHERE id = ?", [driver_id]);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // ✅ Check if vehicle is already assigned
    const [[existingConnection]] = await db
      .promise()
      .query("SELECT * FROM connected_vehicles WHERE vehicle_id = ?", [
        vehicle_id,
      ]);
    if (existingConnection) {
      return res
        .status(409)
        .json({ message: "Vehicle is already assigned to a driver" });
    }

    // ✅ Insert the connection
    await db
      .promise()
      .query(
        "INSERT INTO connected_vehicles (vehicle_id, driver_id) VALUES (?, ?)",
        [vehicle_id, driver_id]
      );

    res.status(201).json({ message: "Vehicle connected successfully" });
  } catch (err) {
    console.error("Database Error:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const getConnectedVehicles = async (req, res) => {
  const { driver_id } = req.params;

  if (!driver_id) {
    return res.status(400).json({ message: "Driver ID is required" });
  }

  try {
    const [rows] = await db.promise().query(
      `SELECT cv.*, v.model, v.license_plate 
         FROM connected_vehicles cv 
         JOIN vehicles v ON cv.vehicle_id = v.id
         WHERE cv.driver_id = ?`,
      [driver_id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No connected vehicles found" });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  connectVehicle,
  getConnectedVehicles,
};
