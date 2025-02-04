import React, { useState, useEffect } from 'react';

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
} from 'react-native';

const OrganisationDriverList = ({ navigation }) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchText,setSearchText] = useState("");

  const [showAddDriver, setShowAddDriver] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: '', Driver_No:'',Vehicle_No: '',exp:'', contact: '' });
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  

  useEffect(() => {
    setFilteredDrivers(drivers);
  }, [drivers]);
  
  const deleteDriver = async (id) => {
    Alert.alert("Delete Driver", "Are you sure you want to delete this driver?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`http://192.168.32.162:5000/api/drivers/${id}`, {
              method: "DELETE",
            });
  
            if (response.ok) {
              const updatedDrivers = drivers.filter((driver) => driver.id !== id);
              setDrivers(updatedDrivers);
              setFilteredDrivers(updatedDrivers);
            } else {
              Alert.alert("Error", "Failed to delete driver");
            }
          } catch (error) {
            console.error("Error deleting driver:", error);
            Alert.alert("Error", "Failed to connect to the server");
          }
        },
      },
    ]);
  };
  

  const addDriver = async () => {
    if (!newDriver.name || !newDriver.Driver_No || !newDriver.Vehicle_No || !newDriver.exp || !newDriver.contact) {
      Alert.alert("Error", "All fields are required to add a driver.");
      return;
    }
  
    console.log("Adding driver:", newDriver); // Debugging
  
    try {
      const response = await fetch("http://192.168.32.162:5000/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDriver),
      });
  
      const data = await response.json();
      console.log("Response from server:", data); // Debugging
  
      if (response.ok) {
        setDrivers((prev) => [...prev, data]);  // Update state immediately
        setFilteredDrivers((prev) => [...prev, data]); // Update filtered drivers as well
        setNewDriver({ name: "", Driver_No: "", Vehicle_No: "", contact: "", exp: "" });
        setShowAddDriver(false);
      } else {
        Alert.alert("Error", data.error || "Failed to add driver");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };
  
  
  

  const searchDriver = (text) => {
    // Trim input to handle leading/trailing spaces and ensure case-insensitivity
    const query = text.trim().toLowerCase();
  
    // If the query is empty, set filteredDrivers to all drivers
    if (!query) {
      setFilteredDrivers(drivers);
      return;
    }
  
    const filteredList = drivers.filter((driver) => {
      // Ensure the driver's Driver_No exists and is a string before performing the search
      const driverNo = driver.Driver_No ? driver.Driver_No.toString() : '';  // Convert to string if it's not already
  
      return driverNo.toLowerCase().includes(query);
    });
  
    // Debugging: Log the filtered list to ensure the logic is working
    console.log(filteredList);
  
    // Update state with the filtered list
    setFilteredDrivers(filteredList);
  };
  
  
  useEffect(() => {
    fetchDrivers();
  }, []);
  
  
  const fetchDrivers = async () => {
    try {
      const response = await fetch("http://192.168.32.162:5000/api/drivers");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched drivers data:", data); // Debugging
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
  
  useEffect(() => {
    setFilteredDrivers(drivers);
  }, [drivers]); // Ensures filtered drivers are updated whenever drivers change
  
  const updateDriver = async () => {
    if (!selectedDriver) {
      Alert.alert("Error", "No driver selected for update");
      return;
    }
  
    console.log("Updating driver:", selectedDriver); // Log selected driver data
    try {
      const response = await fetch(`http://192.168.32.162:5000/api/drivers/${selectedDriver.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedDriver),
      });
      const updatedDriver = await response.json();
      console.log("Response from server:", updatedDriver); // Log the response
      if (response.ok) {
        const updatedDrivers = drivers.map((driver) =>
          driver.id === updatedDriver.id ? updatedDriver : driver
        );
        setDrivers(updatedDrivers); // Update state with the updated driver
        setFilteredDrivers(updatedDrivers); // Update filtered drivers
        setModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to update driver");
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };
  useEffect(() => {
    console.log("Updated drivers state:", drivers);
  }, [drivers]);

 

  if (loading) {
      // Show the loading spinner when loading state is true
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="rgb(42, 10, 62)" />
          <Text>Loading...</Text>
        </View>
      );
    }

    if (!drivers || drivers.length === 0) {
      return <Text>No drivers found</Text>;
    }

  const renderDriverItem = ({ item }) => (
    <View style={styles.card}>
     <TouchableOpacity
  onPress={() => {
    setSelectedDriver(item); // Set the selected driver
    setModalVisible(true);  // Open the modal
  }}
  style={{ flex: 1 }}
>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.driverNo}>Driver No: {item.Driver_No}</Text>
        <Text style={styles.Vehicle_No}>Vehicle No: {item.Vehicle_No}</Text>
        <Text style={styles.contact}>Contact: {item.contact}</Text>
        <Text style={{ fontSize: 16, color: "#666" }}>Experience: {item.exp} years</Text>

      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteDriver(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
       <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
      onChangeText={(text) => setNewDriver((prev) => ({ ...prev, name: text }))}
    />
    <TextInput
      style={styles.input}
      placeholder="Driver No"
      value={newDriver.Driver_No}
      onChangeText={(text) => setNewDriver((prev) => ({ ...prev, Driver_No: text }))}
    />
    <TextInput
      style={styles.input}
      placeholder="Vehicle No"
      value={newDriver.Vehicle_No}
      onChangeText={(text) => setNewDriver((prev) => ({ ...prev, Vehicle_No: text }))}
    />
    <TextInput
      style={styles.input}
      placeholder="Contact"
      value={newDriver.contact}
      onChangeText={(text) => setNewDriver((prev) => ({ ...prev, contact: text }))}
    />
    <TextInput
  style={styles.input}
  placeholder="Experience (in years)"
  value={newDriver.exp}
  onChangeText={(text) => setNewDriver((prev) => ({ ...prev, exp: text }))}
  keyboardType="numeric"
/>

    <TouchableOpacity style={styles.saveButton} onPress={addDriver}>
      <Text style={styles.saveText}>Save</Text>
    </TouchableOpacity>
  </View>
)}
     <FlatList
  data={filteredDrivers}
  renderItem={renderDriverItem}
  keyExtractor={(item) => (item.id ? item.id.toString() : String(item.Driver_No))} // Fallback to Driver_No if id is missing
  contentContainerStyle={{ paddingBottom: 100 }}
/>

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
        onChangeText={(text) => setSelectedDriver((prev) => ({ ...prev, name: text }))}
        placeholder="Name"
      />
      
      <TextInput
        style={styles.input}
        value={selectedDriver?.Vehicle_No}
        onChangeText={(text) => setSelectedDriver((prev) => ({ ...prev, Vehicle_No: text }))}
        placeholder="Vehicle No"
      />
      <TextInput
        style={styles.input}
        value={selectedDriver?.contact}
        onChangeText={(text) => setSelectedDriver((prev) => ({ ...prev, contact: text }))}
        placeholder="Contact"
      />
      <TextInput
  style={styles.input}
  value={String(selectedDriver?.exp || '')}  // Ensure it's always a string
  onChangeText={(text) => setSelectedDriver((prev) => ({ ...prev, exp: text }))}
  placeholder="Experience"
/>


      <TouchableOpacity style={styles.saveButton} onPress={updateDriver}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 15,
  },
  searchInput: {
    flex: 1, // Take up available space in the row
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10, // Space between search input and button
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#6a0dad',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: { color: '#fff', fontWeight: 'bold' },
  add: {
    marginBottom: 20,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Ensures overall content alignment
    paddingHorizontal: 10,
    paddingVertical: 40,
    backgroundColor: 'rgb(28 10 62)',
    position: 'relative', // Allows absolute positioning of the back button
    
  },
  backButton: {
    position: 'absolute', // Positions the back button independently
    left: 10, // Keeps it at the left edge
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
  },
  backButtonText: {
    color: 'rgb(42 10 62)',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  
  
  
  roleContainer: { padding: 10, backgroundColor: 'rgb(245, 245, 245)', alignItems: 'center' },
  role: { fontSize: 18, color: 'rgb(42 10 62)' },
  
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  driverNo: { fontSize: 16, color: '#666' },
  Vehicle_No: { fontSize: 16, color: '#666' },
  contact: { fontSize: 16, color: '#666' },
  exp: { fontSize: 16, color: '#666' },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: { color: '#fff', fontWeight: 'bold' },

  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    width: '100%',
  },
  saveButton: {
    backgroundColor: 'rgb(110 89 149)',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveText: { color: '#fff', fontWeight: 'bold',textAlign:'center', },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelText: { color: '#fff', fontWeight: 'bold' },
});

export default OrganisationDriverList;