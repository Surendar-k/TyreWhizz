const db = require("../config/db");

// Get drivers for a specific user
const getDrivers = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const query = "SELECT * FROM drivers WHERE user_id = ?";
    const [results] = await db.promise().query(query, [user_id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "No drivers found." });
    }

    res.json(results);
  } catch (err) {
    console.error("Database error:", err.sqlMessage || err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// Add a new driver
const addDriver = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const { name, Driver_No, Vehicle_No, exp, contact, user_id } = req.body;

    if (!name || !Driver_No || !Vehicle_No || !exp || !contact || !user_id) {
      console.log("Error: Missing fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    const query =
      "INSERT INTO drivers (name, Driver_No, Vehicle_No, exp, contact, user_id) VALUES (?, ?, ?, ?, ?, ?)";
    const [results] = await db
      .promise()
      .query(query, [name, Driver_No, Vehicle_No, exp, contact, user_id]);

    console.log("Driver added successfully with ID:", results.insertId);
    res.json({
      driverId: results.insertId,
      name,
      Driver_No,
      Vehicle_No,
      exp,
      contact,
      user_id,
    });
  } catch (err) {
    console.error("Database error:", err.sqlMessage || err);
    res
      .status(500)
      .json({ error: "Database error", details: err.sqlMessage || err });
  }
};

// Update a driver (Only if the driver belongs to the user)
const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, Driver_No, Vehicle_No, exp, contact, user_id } = req.body;

    if (!name || !Driver_No || !Vehicle_No || !exp || !contact || !user_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const query =
      "UPDATE drivers SET name = ?, Driver_No = ?, Vehicle_No = ?, exp = ?, contact = ? WHERE id = ? AND user_id = ?";
    const [results] = await db
      .promise()
      .query(query, [name, Driver_No, Vehicle_No, exp, contact, id, user_id]);

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Driver not found or does not belong to this user" });
    }

    res.json({ success: true, message: "Driver updated successfully" });
  } catch (err) {
    console.error("Database error:", err.sqlMessage || err);
    res
      .status(500)
      .json({ error: "Database error", details: err.sqlMessage || err });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;

    console.log(`Deleting driver: ${id}, User: ${user_id}`); // Debugging

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const query = "DELETE FROM drivers WHERE id = ? AND user_id = ?";
    const [results] = await db.promise().query(query, [id, user_id]);

    console.log("DB Delete Results:", results); // Debugging

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Driver not found or does not belong to this user" });
    }

    res.json({ success: true, message: "Driver deleted successfully" });
  } catch (err) {
    console.error("Database error:", err.sqlMessage || err);
    res
      .status(500)
      .json({ error: "Database error", details: err.sqlMessage || err });
  }
};

// Get driver count for a specific user
const getDriverCount = async (req, res) => {
  try {
    const user_id = req.user?.id; // Ensure user_id is extracted from JWT

    if (!user_id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User authentication failed" });
    }

    const query = "SELECT COUNT(*) AS count FROM drivers WHERE user_id = ?";
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
  getDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  getDriverCount,
};
