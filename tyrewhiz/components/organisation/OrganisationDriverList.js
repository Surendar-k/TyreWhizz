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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

import { useTranslation } from "../TranslationContext";
import { useFocusEffect } from "@react-navigation/native";
// const API_URL = process.env.API_URL;
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
  const { translatedText, updateTranslations } = useTranslation(); // ✅ Added Translation Support

  useFocusEffect(
    React.useCallback(() => {
      updateTranslations([
        "Logged in as: Organization",
        "Search by Driver No",
        "Add Driver",
        "Name",
        "Save",
        "Driver No:",
        "Vehicle No:",
        "Contact:",
        "Experience: {exp} years",
        "Delete",
        "Loading...",
        "Delete Driver",
        "Are you sure you want to delete this driver?",
        "Cancel",
        "Error",
        "Failed to delete driver",
        "Failed to connect to the server",
        "Failed to fetch drivers",
        "Error fetching drivers:",
        "All fields are required to add a driver.",
        "Failed to add driver",
        "No driver selected for update",
        "Failed to update driver",
        "No drivers available.",
        "Update Driver Details",
        "Update",
        "Name",
        "Driver No",
        "Vehicle No",
        "Contact",
        "Experience (in years)",
      ]);
    }, [])
  );

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    setFilteredDrivers(drivers);
  }, [drivers]);

  const fetchUserId = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
       
        return null;
      }

      const payload = jwtDecode(token);

      // Check if the token is expired
      if (payload.exp * 1000 < Date.now()) {
        
        await AsyncStorage.removeItem("token"); // Clear expired token
        return null;
      }

      return payload.userId || payload.userID || payload.id || null;
    } catch (error) {
    
      return null;
    }
  };
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
    
        return;
      }

      const userId = await fetchUserId();
      if (!userId) {
       
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/drivers?user_id=${userId}`, // Correct query param
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch Drivers: ${response.status}`);
      }

      const data = await response.json();
      setDrivers(data);
      setFilteredDrivers(data);
    } catch (error) {
      console.error(
        `${
          translatedText["Error fetching drivers:"] || "Error fetching drivers:"
        }`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const searchDriver = (text) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredDrivers(drivers);
      return;
    }
    const filteredList = drivers.filter((driver) =>
      driver.Driver_No.toLowerCase().includes(text.trim().toLowerCase())
    );
    setFilteredDrivers(filteredList);
  };
  const deleteDriver = async (id) => {
    let token = await AsyncStorage.getItem("token");
    let userId = await AsyncStorage.getItem("user_id");

 

    // If userId is missing, attempt to fetch it again
    if (!userId) {
      userId = await fetchUserId(); // Ensure fetchUserId() is implemented correctly
      if (userId) {
        await AsyncStorage.setItem("user_id", userId.toString());
      }
    }

    if (!token || !userId) {
      Alert.alert("Error", "Authentication required.");
      return;
    }

    Alert.alert(
      translatedText["Delete Driver"] || "Delete Driver",
      translatedText["Are you sure you want to delete this driver?"] ||
        "Are you sure you want to delete this driver?",
      [
        { text: translatedText["Cancel"] || "Cancel", style: "cancel" },
        {
          text: translatedText["Delete"] || "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `http://localhost:5000/api/drivers/${id}?user_id=${userId}`, // Pass user_id correctly
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const data = await response.json();
            

              if (response.ok) {
                setDrivers((prev) => prev.filter((driver) => driver.id !== id));
                Alert.alert("Success", "Driver deleted successfully");
              } else {
                Alert.alert("Error", data.error || "Failed to delete driver");
              }
            } catch (error) {
             
              Alert.alert(
                translatedText["Error"] || "Error",
                translatedText["Failed to connect to the server"] ||
                  "Failed to connect to the server"
              );
            }
          },
        },
      ]
    );
  };

  const addDriver = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Authentication required.");
        return;
      }

      const userId = await fetchUserId();
      if (!userId) {
        Alert.alert("Error", "User ID not found.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newDriver,
          user_id: userId, // Ensure user_id is correctly sent
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add driver");
      }

      const addedDriver = await response.json();

      // Update state immediately to reflect changes
      setDrivers((prev) => [...prev, addedDriver]);
      setFilteredDrivers((prev) => [...prev, addedDriver]);

      setNewDriver({
        name: "",
        Driver_No: "",
        Vehicle_No: "",
        exp: "",
        contact: "",
      });

      setShowAddDriver(false);
    } catch (error) {
     
      Alert.alert(
        translatedText["Error"] || "Error",
        translatedText["Failed to connect to the server"] ||
          "Failed to connect to the server"
      );
    }
  };

  const updateDriver = async () => {
    if (!selectedDriver) {
      Alert.alert(
        translatedText["Error"] || "Error",
        translatedText["No driver selected for update"] ||
          "No driver selected for update"
      );
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Authentication required.");
        return;
      }

      const userId = await fetchUserId();
      if (!userId) {
        Alert.alert("Error", "User ID is missing.");
        return;
      }

      const updatedData = {
        ...selectedDriver,
        user_id: userId, // Ensure user_id is sent
      };

      const response = await fetch(
        `http://localhost:5000/api/drivers/${selectedDriver.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        // Fetch the latest drivers list
        fetchDrivers(); // <--- This ensures UI updates immediately
        setModalVisible(false);
      } else {
        Alert.alert(
          translatedText["Error"] || "Error",
          translatedText["Failed to update driver"] || "Failed to update driver"
        );
      }
    } catch (error) {
     
      Alert.alert(
        translatedText["Error"] || "Error",
        translatedText["Failed to connect to the server"] ||
          "Failed to connect to the server"
      );
    }
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
        <Text style={styles.driverNo}>
          {translatedText["Driver No:"] || "Driver No:"} {item.Driver_No}
        </Text>
        <Text style={styles.vehicleNo}>
          {translatedText["Vehicle No:"] || "Vehicle No:"} {item.Vehicle_No}
        </Text>
        <Text style={styles.contact}>
          {translatedText["Contact:"] || "Contact:"} {item.contact}
        </Text>
        <Text style={{ fontSize: 16, color: "#666" }}>
          {translatedText["Experience: {exp} years"]?.replace(
            "{exp}",
            item.exp
          ) || `Experience: ${item.exp} years`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteDriver(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>
          {translatedText["Delete"] || "Delete"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="rgb(42, 10, 62)" />
        <Text>{translatedText["Loading..."] || "Loading..."}</Text>
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
          <Text style={styles.backButtonText}>❮</Text>
        </TouchableOpacity>
        <Text style={styles.title}>TyreWhizz</Text>
      </View>

      <View style={styles.roleContainer}>
        <Text style={styles.role}>
          {translatedText["Logged in as: Organization"] ||
            "Logged in as: Organization"}
        </Text>
      </View>

      {/* Search and Add Driver Section */}
      <View style={styles.actionRow}>
        <TextInput
          style={styles.searchInput}
          placeholder={
            translatedText["Search by Driver No"] || "Search by Driver No"
          }
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
          <Text style={styles.addText}>
            {translatedText["Add Driver"] || "Add Driver"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Show Add Driver Form */}
      {showAddDriver && (
        <View style={styles.add}>
          <TextInput
            style={styles.input}
            placeholder={translatedText["Name"] || "Name"}
            value={newDriver.name}
            onChangeText={(text) =>
              setNewDriver((prev) => ({ ...prev, name: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder={translatedText["Driver No"] || "Driver No"}
            value={newDriver.Driver_No}
            onChangeText={(text) =>
              setNewDriver((prev) => ({ ...prev, Driver_No: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder={translatedText["Vehicle No"] || "Vehicle No"}
            value={newDriver.Vehicle_No}
            onChangeText={(text) =>
              setNewDriver((prev) => ({ ...prev, Vehicle_No: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder={translatedText["Contact"] || "Contact"}
            value={newDriver.contact}
            onChangeText={(text) =>
              setNewDriver((prev) => ({ ...prev, contact: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder={
              translatedText["Experience (in years)"] || "Experience (in years)"
            }
            value={newDriver.exp}
            onChangeText={(text) =>
              setNewDriver((prev) => ({ ...prev, exp: text }))
            }
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.saveButton} onPress={addDriver}>
            <Text style={styles.saveText}>
              {translatedText["Save"] || "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Render Drivers */}
      {filteredDrivers.length === 0 ? (
        <Text>
          {translatedText["No drivers available."] || "No drivers available."}
        </Text>
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
            <Text style={styles.modalTitle}>
              {translatedText["Update Driver Details"] ||
                "Update Driver Details"}
            </Text>
            <TextInput
              style={styles.input}
              value={selectedDriver?.name}
              onChangeText={(text) =>
                setSelectedDriver((prev) => ({ ...prev, name: text }))
              }
              placeholder={translatedText["Name"] || "Name"}
            />
            <TextInput
              style={styles.input}
              value={selectedDriver?.Driver_No}
              onChangeText={(text) =>
                setSelectedDriver((prev) => ({ ...prev, Driver_No: text }))
              }
              placeholder={translatedText["Driver No"] || "Driver No"}
            />
            <TextInput
              style={styles.input}
              value={selectedDriver?.Vehicle_No}
              onChangeText={(text) =>
                setSelectedDriver((prev) => ({ ...prev, Vehicle_No: text }))
              }
              placeholder={translatedText["Vehicle No"] || "Vehicle No"}
            />
            <TextInput
              style={styles.input}
              value={selectedDriver?.contact}
              onChangeText={(text) =>
                setSelectedDriver((prev) => ({ ...prev, contact: text }))
              }
              placeholder={translatedText["Contact"] || "Contact"}
            />
            <TextInput
              style={styles.input}
              value={selectedDriver?.exp}
              onChangeText={(text) =>
                setSelectedDriver((prev) => ({ ...prev, exp: text }))
              }
              placeholder={
                translatedText["Experience (in years)"] ||
                "Experience (in years)"
              }
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.saveButton} onPress={updateDriver}>
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

    borderRadius: 5,
    borderWidth: 1,
  },
  backButtonText: {
    color: "#fff",
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
