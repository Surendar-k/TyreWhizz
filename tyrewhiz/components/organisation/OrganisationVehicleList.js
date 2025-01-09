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

const OrganisationVehicleList = ({ navigation }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ vehicle_no: '', driver_id: '', type: '', capacity: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState({driver_id: '',type: '',capacity: '',});
  

  useEffect(() => {
    setFilteredVehicles(vehicles);
  }, [vehicles]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch("http://192.168.34.92:5000/api/vehicles");
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
        setFilteredVehicles(data);
      } else {
        console.error("Failed to fetch vehicles");
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const deleteVehicle = async (id) => {
    Alert.alert("Delete Vehicle", "Are you sure you want to delete this vehicle?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`http://192.168.34.92:5000/api/vehicles/${id}`, {
              method: "DELETE",
            });
  
            if (response.ok) {
              const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== id);
              setVehicles(updatedVehicles);
              setFilteredVehicles(updatedVehicles);
              Alert.alert("Success", "Vehicle deleted successfully");
            } else {
              const errorMessage = await response.text();
              Alert.alert("Error", errorMessage || "Failed to delete vehicle");
            }
          } catch (error) {
            console.error("Error deleting vehicle:", error);
            Alert.alert("Error", "Failed to connect to the server");
          }
        },
      },
    ]);
  };
  

  const addVehicle = async () => {
    if (newVehicle.vehicle_no && newVehicle.driver_id && newVehicle.type && newVehicle.capacity) {
      try {
        const response = await fetch("http://192.168.34.92:5000/api/vehicles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newVehicle),
        });
        const data = await response.json();
        if (response.ok) {
          setVehicles((prev) => [...prev, data]);
          setFilteredVehicles((prev) => [...prev, data]);
          setNewVehicle({ vehicle_no: '', driver_id: '', type: '', capacity: '' });
          setShowAddVehicle(false);
        } else {
          Alert.alert("Error", data.error || "Failed to add vehicle");
        }
      } catch (error) {
        console.error("Error during API call:", error);
        Alert.alert("Error", "Failed to connect to the server");
      }
    } else {
      Alert.alert("Error", "Please fill all fields to add a vehicle.");
    }
  };

  const updateVehicle = async () => {
    if (!selectedVehicle) {
      Alert.alert("Error", "No vehicle selected for update");
      return;
    }

    try {
      const response = await fetch(`http://192.168.34.92:5000/api/vehicles/${selectedVehicle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedVehicle),
      });
      const updatedVehicle = await response.json();
      if (response.ok) {
        const updatedVehicles = vehicles.map((vehicle) =>
          vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
        );
        setVehicles(updatedVehicles);
        setFilteredVehicles(updatedVehicles);
        setModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to update vehicle");
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };

  const searchVehicle = (text) => {
    const query = text.trim().toLowerCase();
    if (!query) {
      setFilteredVehicles(vehicles);
      return;
    }
    const filteredList = vehicles.filter((vehicle) =>
      vehicle.vehicle_no.toLowerCase().includes(query)
    );
    setFilteredVehicles(filteredList);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="rgb(42, 10, 62)" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return <Text>No vehicles found</Text>;
  }

  const renderVehicleItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => {
          setSelectedVehicle(item);
          setModalVisible(true);
        }}
        style={{ flex: 1 }}
      >
        <Text style={styles.vehicleNo}>Vehicle No: {item.vehicle_no}</Text>
        <Text style={styles.driver_id}>Driver ID: {item.driver_id}</Text>
        <Text style={styles.type}>Type: {item.type}</Text>
        <Text style={styles.capacity}>Capacity: {item.capacity}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteVehicle(item.id)} style={styles.deleteButton}>
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
        <View style={styles.add}>
          <TextInput
            style={styles.input}
            placeholder="Vehicle No"
            value={newVehicle.vehicle_no}
            onChangeText={(text) => setNewVehicle((prev) => ({ ...prev, vehicle_no: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Driver ID"
            value={newVehicle.driver_id}
            onChangeText={(text) => setNewVehicle((prev) => ({ ...prev, driver_id: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Type"
            value={newVehicle.type}
            onChangeText={(text) => setNewVehicle((prev) => ({ ...prev, type: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Capacity"
            value={newVehicle.capacity}
            onChangeText={(text) => setNewVehicle((prev) => ({ ...prev, capacity: text }))}
          />
          <TouchableOpacity style={styles.saveButton} onPress={addVehicle}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

<FlatList
  data={filteredVehicles}
  renderItem={renderVehicleItem}
  keyExtractor={(item) => (item.id ? item.id.toString() : String(item.Vehicle_No))}
  contentContainerStyle={{ paddingBottom: 100 }}
/>

<Modal
  visible={modalVisible}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
  transparent={true}
>
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Update Vehicle Details</Text>

      <TextInput
        style={styles.input}
        value={selectedVehicle?.driver_id ? String(selectedVehicle.driver_id) : ''}
        onChangeText={(text) => setSelectedVehicle((prev) => ({ ...prev, driver_id: text }))}
        placeholder={selectedVehicle?.driver_id ? String(selectedVehicle.driver_id) : "Driver ID"}
      />
      <TextInput
        style={styles.input}
        value={selectedVehicle?.type ? String(selectedVehicle.type) : ''}
        onChangeText={(text) => setSelectedVehicle((prev) => ({ ...prev, type: text }))}
        placeholder={selectedVehicle?.type ? String(selectedVehicle.type) : "Type"}
      />
      <TextInput
        style={styles.input}
        value={selectedVehicle?.capacity ? String(selectedVehicle.capacity) : ''}
        onChangeText={(text) => setSelectedVehicle((prev) => ({ ...prev, capacity: text }))}
        placeholder={selectedVehicle?.capacity ? String(selectedVehicle.capacity) : "Capacity"}
      />
      
      <TouchableOpacity style={styles.saveButton} onPress={updateVehicle}>
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
  container: { flex: 1, backgroundColor: 'rgb(255,255,255)'},
  
  vehicleTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 35,padding:10 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding:15
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#6a0dad',
    padding: 10,
    borderRadius: 5,
  },
  addText: { color: '#fff', fontWeight: 'bold' },
  addVehicleForm: { marginBottom: 20,padding:10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: 'rgb(110 89 149)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold',textAlign:'center', },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  vehicleNo:{ fontSize: 18, fontWeight: 'bold', color: '#333' },
  driver_id: { fontSize: 16, color: '#555'},
  type: { fontSize: 16, color: '#555' },
  capacity: { fontSize: 16, color: '#555' },
  
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: { color: '#fff', fontWeight: 'bold' },
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

export default OrganisationVehicleList;