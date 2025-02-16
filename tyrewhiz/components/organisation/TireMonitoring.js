import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_URL = process.env.API_URL;

const TireMonitoring = ({ navigation }) => {
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchUserId = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found.");
        return null;
      }

      console.log("jwtDecode function:", jwtDecode); // Debugging
      const payload = jwtDecode(token);

      console.log("Decoded Payload:", payload);
      return payload.userId || payload.userID || payload.id || null;
    } catch (error) {
      console.error("Error retrieving user ID:", error);
      return null;
    }
  };
  const fetchVehicleData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found.");
        return;
      }

      const userId = await fetchUserId();
      if (!userId) {
        console.error("User ID not found.");
        return;
      }
      const response = await fetch(
        `http://192.168.18.19:5000/api/vehicles?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 404) {
        console.warn("No vehicles found for this user.");
        setVehicles([]); // Ensure it sets an empty array
        setFilteredVehicles([]);
        return;
      }
      if (response.ok) {
        const vehicles = await response.json();

        // Assigning default tire monitoring details
        const updatedData = vehicles.map((vehicle) => ({
          id: vehicle.id,
          Vehicle_no: vehicle.vehicle_no,
          tireStatus: "Good", // Default status (should be updated based on actual sensor data)
          issues: 0,
          pressure: "35 PSI",
          temperature: "28°C",
        }));

        setVehicleData(updatedData);
      } else {
        console.error("Failed to fetch vehicle data");
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="rgb(42, 10, 62)" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Tire Monitoring</Text>
      </View>

      <View style={styles.roleContainer}>
        <Text style={styles.role}>Logged in as: Organization</Text>
      </View>

      <FlatList
        data={vehicleData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.Vehicle_no}>Vehicle No: {item.Vehicle_no}</Text>
            <Text style={styles.tireStatus}>Status: {item.tireStatus}</Text>
            <Text style={styles.details}>Issues: {item.issues}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("MonitoringPage", { vehicle: item })
              }
            >
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgb(255,255,255)" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 40,
    backgroundColor: "rgb(28 10 62)",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 10,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
  },
  backButtonText: {
    color: "rgb(42 10 62)",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  roleContainer: {
    padding: 10,
    backgroundColor: "rgb(245, 245, 245)",
    alignItems: "center",
  },
  role: { fontSize: 18, color: "rgb(42 10 62)" },
  flatListContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  Vehicle_no: { fontSize: 18, fontWeight: "bold" },
  tireStatus: { fontSize: 16, marginTop: 5, color: "#333" },
  details: { fontSize: 14, marginTop: 5, color: "#666" },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "rgb(110 89 149)",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});

export default TireMonitoring;
