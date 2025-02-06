import React, { useState, useEffect } from "react";
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
const API_URL = process.env.API_URL;
const OrganisationDriverList = ({ navigation }) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: "",
    Driver_No: "",
    Vehicle_No: "",
    exp: "",
    contact: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    setFilteredDrivers(drivers);
  }, [drivers]);

  const fetchDrivers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/drivers`);
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
        setFilteredDrivers(data);
      } else {
        console.error("Failed to fetch drivers");
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchDriver = (text) => {
    const query = text.trim().toLowerCase();

    if (!query) {
      setFilteredDrivers(drivers);
      return;
    }

    const filteredList = drivers.filter((driver) => {
      const driverNo = driver.Driver_No ? driver.Driver_No.toString() : "";
      return driverNo.toLowerCase().includes(query);
    });

    setFilteredDrivers(filteredList);
  };

  const deleteDriver = async (id) => {
    Alert.alert(
      "Delete Driver",
      "Are you sure you want to delete this driver?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/api/drivers/${id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (response.ok) {
                setDrivers((prevDrivers) =>
                  prevDrivers.filter((driver) => driver.id !== id)
                );
                setFilteredDrivers((prevFiltered) =>
                  prevFiltered.filter((driver) => driver.id !== id)
                );
              } else {
                Alert.alert("Error", "Failed to delete driver");
              }
            } catch (error) {
              console.error("Error deleting driver:", error);
              Alert.alert("Error", "Failed to connect to the server");
            }
          },
        },
      ]
    );
  };

  const addDriver = async () => {
    if (
      !newDriver.name ||
      !newDriver.Driver_No ||
      !newDriver.Vehicle_No ||
      !newDriver.exp ||
      !newDriver.contact
    ) {
      Alert.alert("Error", "All fields are required to add a driver.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/drivers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDriver),
      });

      const data = await response.json();

      if (response.ok) {
        setDrivers((prev) => [...prev, data]);
        setFilteredDrivers((prev) => [...prev, data]);
        setNewDriver({
          name: "",
          Driver_No: "",
          Vehicle_No: "",
          contact: "",
          exp: "",
        });
        setShowAddDriver(false);
      } else {
        Alert.alert("Error", data.error || "Failed to add driver");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };

  const updateDriver = async () => {
    if (!selectedDriver) {
      Alert.alert("Error", "No driver selected for update");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/drivers/${selectedDriver.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedDriver),
        }
      );

      const updatedDriver = await response.json();

      if (response.ok) {
        const updatedDrivers = drivers.map((driver) =>
          driver.id === updatedDriver.id ? updatedDriver : driver
        );
        setDrivers(updatedDrivers);
        setFilteredDrivers(updatedDrivers);
        setModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to update driver");
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };

  const renderDriverItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => {
          setSelectedDriver(item);
          setModalVisible(true);
        }}
        style={{ flex: 1 }}
      >
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.driverNo}>Driver No: {item.Driver_No}</Text>
        <Text style={styles.Vehicle_No}>Vehicle No: {item.Vehicle_No}</Text>
        <Text style={styles.contact}>Contact: {item.contact}</Text>
        <Text style={{ fontSize: 16, color: "#666" }}>
          Experience: {item.exp} years
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteDriver(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

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
        <Text style={styles.title}>TyreWhizz</Text>
      </View>
      <View style={styles.roleContainer}>
        <Text style={styles.role}>Logged in as: Organization</Text>
      </View>
      {/* Search and Add Driver Section */}
      <View style={styles.actionRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Driver No"
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            searchDriver(text);
          }}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddDriver(!showAddDriver)}
        >
          <Text style={styles.addText}>Add Driver</Text>
        </TouchableOpacity>
      </View>

      {/* Show Add Driver Form */}
      {showAddDriver && (
        <View style={styles.add}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newDriver.name}
            onChangeText={(text) =>
              setNewDriver((prev) => ({ ...prev, name: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Driver No"
            value={newDriver.Driver_No}
            onChangeText={(text) =>
              setNewDriver((prev) => ({ ...prev, Driver_No: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Vehicle No"
            value={newDriver.Vehicle_No}
            onChangeText={(text) =>
              setNewDriver((prev) => ({ ...prev, Vehicle_No: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Contact"
            value={newDriver.contact}
            onChangeText={(text) =>
              setNewDriver((prev) => ({ ...prev, contact: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Experience (in years)"
            value={newDriver.exp}
            onChangeText={(text) =>
              setNewDriver((prev) => ({ ...prev, exp: text }))
            }
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.saveButton} onPress={addDriver}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Render Drivers */}
      {filteredDrivers.length === 0 ? (
        <Text>No drivers available.</Text>
      ) : (
        <FlatList
          data={filteredDrivers}
          renderItem={renderDriverItem}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : String(item.Driver_No)
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Update Driver Modal */}
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
              value={selectedDriver?.name}
              onChangeText={(text) =>
                setSelectedDriver((prev) => ({ ...prev, name: text }))
              }
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={selectedDriver?.Driver_No}
              onChangeText={(text) =>
                setSelectedDriver((prev) => ({ ...prev, Driver_No: text }))
              }
              placeholder="Driver No"
            />
            <TextInput
              style={styles.input}
              value={selectedDriver?.Vehicle_No}
              onChangeText={(text) =>
                setSelectedDriver((prev) => ({ ...prev, Vehicle_No: text }))
              }
              placeholder="Vehicle No"
            />
            <TextInput
              style={styles.input}
              value={selectedDriver?.contact}
              onChangeText={(text) =>
                setSelectedDriver((prev) => ({ ...prev, contact: text }))
              }
              placeholder="Contact"
            />
            <TextInput
              style={styles.input}
              value={selectedDriver?.exp}
              onChangeText={(text) =>
                setSelectedDriver((prev) => ({ ...prev, exp: text }))
              }
              placeholder="Experience (in years)"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.saveButton} onPress={updateDriver}>
              <Text style={styles.saveText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  addDriverForm: { marginBottom: 20, padding: 10 },
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
  driverName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  driverNo: { fontSize: 16, color: "#555" },
  vehicleNo: { fontSize: 16, color: "#555" },
  contact: { fontSize: 16, color: "#555" },
  exp: { fontSize: 16, color: "#555" },

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

export default OrganisationDriverList;
