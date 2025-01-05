import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const OrganisationVehicleList = ({ navigation }) => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    Vehicle_No: "",
    type: "",
    capacity: "",
  });
  const [loading, setLoading] = useState(true); // Added loading state

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
      const response = await axios.get(
        "http://localhost:5000/api/vehicles"
      );
      setVehicles(response.data);
      setFilteredVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching vehicles...");
    fetchVehicles();
  }, []);

  const deleteVehicle = (id) => {
    Alert.alert(
      "Delete Vehicle",
      "Are you sure you want to delete this vehicle?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true); // Start loading
            try {
              await axios.delete(
                `http://localhost:5000/api/vehicles/${id}`
              );
              const updatedVehicles = vehicles.filter(
                (vehicle) => vehicle.id !== id
              );
              setVehicles(updatedVehicles);
              setFilteredVehicles(updatedVehicles);
              Alert.alert("Success", "Vehicle deleted successfully.");
            } catch (error) {
              console.error("Error deleting vehicle:", error);
              Alert.alert("Error", "Failed to delete the vehicle.");
            } finally {
              setLoading(false); // Stop loading
            }
          },
        },
      ]
    );
  };

  const addVehicle = async () => {
    if (newVehicle.Vehicle_No && newVehicle.type && newVehicle.capacity) {
      setLoading(true); // Start loading
      try {
        // Make the POST request to add the vehicle
        const response = await axios.post(
          "http://localhost:5000/api/vehicles",
          newVehicle
        );

        // Check if the response contains the expected data
        if (response.data && response.data.vehicleId) {
          // Assuming vehicleId is returned from backend, and appending it to the vehicle
          const newVehicleWithId = {
            ...newVehicle,
            id: response.data.vehicleId,
          };

          // Add the new vehicle to the state
          setVehicles((prev) => [...prev, newVehicleWithId]);
          setFilteredVehicles((prev) => [...prev, newVehicleWithId]);

          // Clear the form
          setNewVehicle({ name: "", type: "", capacity: "", Vehicle_No: "" });
          setShowAddVehicle(false);

          Alert.alert("Success", "Vehicle added successfully");
        } else {
          Alert.alert("Error", "Vehicle ID not received from the server");
        }

        const newVehicleWithId = { ...newVehicle, id: response.data.vehicleId };
        setVehicles((prev) => [...prev, newVehicleWithId]);
        setFilteredVehicles((prev) => [...prev, newVehicleWithId]);
        setNewVehicle({ Vehicle_No: "", type: "", capacity: "" });
        setShowAddVehicle(false);
        Alert.alert("Success", "Vehicle added successfully");
      } catch (error) {
        console.error("Error adding vehicle:", error);
        Alert.alert("Error", "Failed to add vehicle");
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      Alert.alert("Error", "Please fill all fields to add a vehicle.");
    }
  };

  const searchVehicle = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = vehicles.filter((vehicle) =>
        vehicle.Vehicle_No.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  };

  const renderVehicleItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("OrganisationVehicleDetail", { vehicle: item })
        }
        style={{ flex: 1 }}
      >
        <Text style={styles.vehicleNo}>Vehicle No: {item.Vehicle_No}</Text>
        <Text style={styles.type}>Type: {item.type}</Text>
        <Text style={styles.capacity}>Capacity: {item.capacity}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => deleteVehicle(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    // Show the loading spinner when loading state is true
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="rgb(42, 10, 62)" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>TyreWhizz</Text>
        </View>

        <View style={styles.roleContainer}>
          <Text style={styles.role}>Logged in as: Organization</Text>
        </View>

        <Text style={styles.vehicleTitle}>Vehicles List</Text>

        <View style={styles.actionRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Vehicle No"
            value={searchText}
            onChangeText={searchVehicle}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddVehicle(!showAddVehicle)}
          >
            <Text style={styles.addText}>Add Vehicle</Text>
          </TouchableOpacity>
        </View>

        {showAddVehicle && (
          <View style={styles.addVehicleForm}>
            <TextInput
              style={styles.input}
              placeholder="Vehicle No"
              value={newVehicle.Vehicle_No}
              onChangeText={(text) =>
                setNewVehicle((prev) => ({ ...prev, Vehicle_No: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Type"
              value={newVehicle.type}
              onChangeText={(text) =>
                setNewVehicle((prev) => ({ ...prev, type: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Capacity"
              value={newVehicle.capacity}
              onChangeText={(text) =>
                setNewVehicle((prev) => ({ ...prev, capacity: text }))
              }
            />
            <TouchableOpacity style={styles.saveButton} onPress={addVehicle}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={filteredVehicles}
          renderItem={renderVehicleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Ensures overall content alignment
    paddingHorizontal: 10,
    paddingVertical: 40,
    backgroundColor: "rgb(28 10 62)",
    position: "relative", // Allows absolute positioning of the back button
  },
  backButton: {
    position: "absolute", // Positions the back button independently
    left: 10, // Keeps it at the left edge
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
  container: { flex: 1, backgroundColor: "rgb(255,255,255)" },

  vehicleTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 35,
    padding: 10,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 15,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#6a0dad",
    padding: 10,
    borderRadius: 5,
  },
  addText: { color: "#fff", fontWeight: "bold" },
  addVehicleForm: { marginBottom: 20, padding: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "rgb(110 89 149)",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  vehicleNo: { fontSize: 18, fontWeight: "bold", color: "#333" },
  type: { fontSize: 16, color: "#555", marginVertical: 5 },
  capacity: { fontSize: 14, color: "#888" },

  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: { color: "#fff", fontWeight: "bold" },
});

export default OrganisationVehicleList;
