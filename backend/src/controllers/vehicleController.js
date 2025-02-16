const db = require("../config/db");

// Get Vehicles for Logged-in User
const getVehicles = (req, res) => {
  const user_id = req.user?.userId || req.query.userId;
  console.log(`Fetching vehicles for user ID: ${user_id}`);

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = "SELECT * FROM vehicles WHERE user_id = ?";
  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results.length ? results : { message: "No vehicles found" });
  });
};

// Add Vehicle for Logged-in User
const addVehicle = (req, res) => {
  
  const { vehicle_no, driver_id, type, capacity, user_id } = req.body;

  if (!vehicle_no || !driver_id || !type || !capacity || !user_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (isNaN(driver_id) || isNaN(user_id)) {
    return res
      .status(400)
      .json({ error: "driver_id, capacity, and user_id must be numbers" });
  }

  const query =
    "INSERT INTO vehicles (vehicle_no, driver_id, type, capacity, user_id) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [vehicle_no, driver_id, type, capacity, user_id],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "Database error", details: err.sqlMessage });
      }

      res.json({
        success: true,
        vehicleId: results.insertId,
        vehicle_no,
        driver_id,
        type,
        capacity,
        user_id,
      });
    }
  );
};
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query; // Extract user_id from query parameters

    console.log(`Deleting vehicle: ${id}, User: ${user_id}`); // Debugging

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const query = "DELETE FROM vehicles WHERE id = ? AND user_id = ?";
    const [results] = await db.promise().query(query, [id, user_id]);

    console.log("DB Delete Results:", results); // Debugging

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Vehicle not found or does not belong to this user" });
    }

    res.json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error("Database error:", err.sqlMessage || err);
    res
      .status(500)
      .json({ error: "Database error", details: err.sqlMessage || err });
  }
};

// Update Vehicle (Only if Owned by User)
const updateVehicle = (req, res) => {
  const { vehicle_no, driver_id, type, capacity } = req.body;
  const user_id = req.user?.userId || req.query.userId; // Extract userId from token or query params
  const vehicle_id = req.params.id;

  // Debugging Logs:
  console.log("User ID from token:", user_id);
  console.log("Vehicle ID from params:", vehicle_id);

  if (!vehicle_no || !driver_id || !type || !capacity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const checkQuery = "SELECT * FROM vehicles WHERE id = ? AND user_id = ?";
  db.query(checkQuery, [vehicle_id, user_id], (err, results) => {
    console.log("Check Query Results:", results);
    if (err || results.length === 0) {
      return res
        .status(403)
        .json({ error: "Unauthorized or vehicle not found" });
    }

    const updateQuery =
      "UPDATE vehicles SET vehicle_no=?, driver_id=?, type=?, capacity=? WHERE id=?";
    db.query(
      updateQuery,
      [vehicle_no, driver_id, type, capacity, vehicle_id],
      (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "No changes were made or vehicle not found" });
        }
        res.json({ success: true, message: "Vehicle updated successfully" });
      }
    );
  });
};

// Get Vehicle Count for Logged-in User
const getVehicleCount = async (req, res) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User authentication failed" });
    }

    const query = "SELECT COUNT(*) AS count FROM vehicles WHERE user_id = ?";
    const [[result]] = await db.promise().query(query, [user_id]);

    return res.json({ count: result?.count || 0 });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({
      error: "Database error",
      details: err.sqlMessage || err.message,
    });
  }
};

module.exports = {
  getVehicles,
  addVehicle,
  deleteVehicle,
  updateVehicle,
  getVehicleCount,
};
