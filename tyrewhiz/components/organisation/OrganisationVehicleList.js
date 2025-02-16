import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_URL = process.env.API_URL;
const OrganisationVehicleList = ({ navigation }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    vehicle_no: "",
    driver_id: "",
    type: "",
    capacity: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);
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

  const fetchVehicles = async () => {
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

      if (!response.ok) {
        throw new Error(`Failed to fetch vehicles: ${response.status}`);
      }

      const data = await response.json();
      setVehicles(Array.isArray(data) ? data : []);
      setFilteredVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehicles([]); // Ensure state is reset even on error
      setFilteredVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const updateVehicle = async () => {
    if (!selectedVehicle) {
      Alert.alert("Error", "No vehicle selected for update");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await fetchUserId();

      if (!token || !userId) {
        Alert.alert("Error", "Authentication token or User ID is missing");
        return;
      }

      console.log("Token being sent:", token);
      console.log("User ID:", userId);

      const updatedData = {
        ...selectedVehicle,
        user_id: userId, // Ensure user_id is always sent
      };

      const response = await fetch(
        `http://192.168.18.19:5000/api/vehicles/${selectedVehicle.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update vehicle. Status: ${response.status}`);
      }

      // Fetch updated vehicle list after successful update
      await fetchVehicles();

      setModalVisible(false);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };

  const deleteVehicle = async (id) => {
    let token = await AsyncStorage.getItem("token");
    let userId = await AsyncStorage.getItem("user_id");

    console.log("Retrieved Token:", token);
    console.log("Retrieved User ID:", userId);

    if (!userId) {
      userId = await fetchUserId();
      if (userId) {
        await AsyncStorage.setItem("user_id", userId.toString());
      }
    }

    if (!token || !userId) {
      Alert.alert("Error", "Authentication required.");
      return;
    }

    Alert.alert(
      "Delete Vehicle",
      "Are you sure you want to delete this vehicle?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // ✅ **Optimistic UI Update**
            setVehicles((prevVehicles) =>
              prevVehicles.filter((v) => v.id !== id)
            );

            try {
              // 🔥 **API Call**
              const response = await fetch(
                `http://192.168.18.19:5000/api/vehicles/${id}?user_id=${userId}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const data = await response.json();
              console.log("Delete Response:", data);

              if (!response.ok) {
                throw new Error(data.error || "Failed to delete vehicle");
              }

              // ✅ **Fetch latest vehicles to ensure UI is updated**
              await fetchVehicles();

              Alert.alert("Success", "Vehicle deleted successfully");
            } catch (error) {
              console.error("Error deleting vehicle:", error);

              // ❌ **Revert UI if API fails**
              setVehicles((prevVehicles) => [
                ...prevVehicles,
                { id, user_id: userId },
              ]);

              Alert.alert("Error", "Failed to delete vehicle");
            }
          },
        },
      ]
    );
  };

  const addVehicle = async () => {
    if (
      !newVehicle.vehicle_no ||
      !newVehicle.driver_id ||
      !newVehicle.type ||
      !newVehicle.capacity
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const user_id = await fetchUserId();
      if (!user_id) {
        Alert.alert("Error", "User ID missing.");
        return;
      }

      const response = await fetch("http://192.168.18.19:5000/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newVehicle, user_id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add vehicle");
      }

      const data = await response.json();
      setVehicles((prev) => [...prev, data]);
      setFilteredVehicles((prev) => [...prev, data]);
      setNewVehicle({ vehicle_no: "", driver_id: "", type: "", capacity: "" });
      setShowAddVehicle(false);
    } catch (error) {
      console.error("Error adding vehicle:", error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };

  const searchVehicle = (text) => {
    const query = text.trim().toLowerCase();
    setSearchText(text);

    if (!query) {
      setFilteredVehicles(vehicles);
      return;
    }

    setFilteredVehicles(
      vehicles.filter((vehicle) =>
        vehicle.vehicle_no.toLowerCase().includes(query)
      )
    );
  };
  if (loading) {
    // Show the loading spinner when loading state is true
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="rgb(42, 10, 62)" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderVehicleItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => {
          setSelectedVehicle(item); // Set the selected driver
          setModalVisible(true); // Open the modal
        }}
        style={{ flex: 1 }}
      >
        <Text style={styles.vehicleNo}>Vehicle No: {item.vehicle_no}</Text>
        <Text style={styles.driver_id}>Driver_id: {item.driver_id}</Text>
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

  return (
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

      <View style={styles.actionRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Vehicle No"
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            searchVehicle(text);
          }}
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
            value={newVehicle.vehicle_no}
            onChangeText={(text) =>
              setNewVehicle((prev) => ({ ...prev, vehicle_no: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Driver_id"
            value={newVehicle.driver_id}
            onChangeText={(text) =>
              setNewVehicle((prev) => ({ ...prev, driver_id: text }))
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
        keyExtractor={(item) =>
          item.id ? item.id.toString() : String(item.Vehicle_No)
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.noVehicleText}>No vehicles found</Text>
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Driver Details</Text>

            <TextInput
              style={styles.input}
              value={selectedVehicle?.vehicle_no || ""} // Ensures an empty string instead of undefined
              onChangeText={(text) =>
                setSelectedVehicle((prev) => ({ ...prev, vehicle_no: text }))
              }
              placeholder="Vehicle No"
            />
            <TextInput
              style={styles.input}
              value={
                selectedVehicle?.driver_id
                  ? String(selectedVehicle.driver_id)
                  : ""
              } // Convert to string
              onChangeText={(text) =>
                setSelectedVehicle((prev) => ({ ...prev, driver_id: text }))
              }
              placeholder="Driver ID"
            />
            <TextInput
              style={styles.input}
              value={selectedVehicle?.type || ""}
              onChangeText={(text) =>
                setSelectedVehicle((prev) => ({ ...prev, type: text }))
              }
              placeholder="Type of Vehicle"
            />
            <TextInput
              style={styles.input}
              value={
                selectedVehicle?.capacity
                  ? String(selectedVehicle.capacity)
                  : ""
              } // Convert to string
              onChangeText={(text) =>
                setSelectedVehicle((prev) => ({ ...prev, capacity: text }))
              }
              placeholder="Capacity"
            />

            <TouchableOpacity style={styles.saveButton} onPress={updateVehicle}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    width: "100%",
  },
  saveButton: {
    backgroundColor: "rgb(110 89 149)",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
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
  driver_id: { fontSize: 16, color: "#555" },
  type: { fontSize: 16, color: "#555" },
  capacity: { fontSize: 16, color: "#555" },

  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: { color: "#fff", fontWeight: "bold" },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelText: { color: "#fff", fontWeight: "bold" },
});

export default OrganisationVehicleList;
