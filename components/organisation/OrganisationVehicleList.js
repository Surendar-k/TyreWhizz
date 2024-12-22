import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';

const OrganisationVehicleList = ({ navigation }) => {
  const [vehicles, setVehicles] = useState([
    { id: '1', name: 'Truck A', Vehicle_No: 'TN-01-AB-1234', type: 'Truck', capacity: '10 Tons' },
    { id: '2', name: 'Van B', Vehicle_No: 'TN-02-BC-2345', type: 'Van', capacity: '2 Tons' },
    { id: '3', name: 'Car C', Vehicle_No: 'TN-03-CD-3456', type: 'Car', capacity: '1 Ton' },
  ]);

  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
  const [searchText, setSearchText] = useState('');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ name: '', type: '', capacity: '', Vehicle_No: '' });

  const deleteVehicle = (id) => {
    Alert.alert('Delete Vehicle', 'Are you sure you want to delete this vehicle?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== id);
          setVehicles(updatedVehicles);
          setFilteredVehicles(updatedVehicles);
        },
      },
    ]);
  };

  const addVehicle = () => {
    if (newVehicle.name && newVehicle.type && newVehicle.capacity && newVehicle.Vehicle_No) {
      const newVehicleData = { id: Date.now().toString(), ...newVehicle };
      setVehicles((prev) => [...prev, newVehicleData]);
      setFilteredVehicles((prev) => [...prev, newVehicleData]);
      setNewVehicle({ name: '', type: '', capacity: '', Vehicle_No: '' });
      setShowAddVehicle(false);
    } else {
      Alert.alert('Error', 'Please fill all fields to add a vehicle.');
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
        onPress={() => navigation.navigate('OrganisationVehicleDetail', { vehicle: item })}
        style={{ flex: 1 }}
      >
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.type}>Type: {item.type}</Text>
        <Text style={styles.capacity}>Capacity: {item.capacity}</Text>
        <Text style={styles.vehicleNo}>Vehicle No: {item.Vehicle_No}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteVehicle(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView>
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

        <Text style={styles.vehicleTitle}>Vehicles List</Text>

        {/* Search and Add Vehicle Section */}
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
              placeholder="Name"
              value={newVehicle.name}
              onChangeText={(text) => setNewVehicle((prev) => ({ ...prev, name: text }))}
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
            <TextInput
              style={styles.input}
              placeholder="Vehicle No"
              value={newVehicle.Vehicle_No}
              onChangeText={(text) => setNewVehicle((prev) => ({ ...prev, Vehicle_No: text }))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginLeft: -40,
  },
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
  roleContainer: { padding: 10, backgroundColor: '#e8f5e9', alignItems: 'center' },
  role: { fontSize: 16, color: '#333' },
  vehicleTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  addVehicleForm: { marginBottom: 20 },
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
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  type: { fontSize: 16, color: '#555', marginVertical: 5 },
  capacity: { fontSize: 14, color: '#888' },
  vehicleNo: { fontSize: 14, color: '#666' },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: { color: '#fff', fontWeight: 'bold' },
});

export default OrganisationVehicleList;
