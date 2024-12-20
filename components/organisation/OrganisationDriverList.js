import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';

const OrganisationDriverList = ({ navigation }) => {
  const [drivers, setDrivers] = useState([
    { id: '1', name: 'John Doe', vehicle: 'Truck A', contact: '123-456-7890' },
    { id: '2', name: 'Jane Smith', vehicle: 'Van B', contact: '987-654-3210' },
    { id: '3', name: 'Mike Johnson', vehicle: 'Car C', contact: '456-789-1230' },
  ]);

  const [showAddDriver, setShowAddDriver] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: '', vehicle: '', contact: '' });

  // Delete driver from the list
  const deleteDriver = (id) => {
    Alert.alert('Delete Driver', 'Are you sure you want to delete this driver?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.id !== id));
        },
      },
    ]);
  };

  // Add a new driver
  const addDriver = () => {
    if (newDriver.name && newDriver.vehicle && newDriver.contact) {
      setDrivers((prev) => [
        ...prev,
        { id: (prev.length + 1).toString(), ...newDriver },
      ]);
      setNewDriver({ name: '', vehicle: '', contact: '' });
      setShowAddDriver(false);
    } else {
      Alert.alert('Error', 'Please fill all fields to add a driver.');
    }
  };

  // Render driver item with delete button
  const renderDriverItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('OrganisationDriverDetail', { driver: item })}
        style={{ flex: 1 }}
      >
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.vehicle}>Vehicle: {item.vehicle}</Text>
        <Text style={styles.contact}>Contact: {item.contact}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteDriver(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drivers List</Text>

      {/* Add Driver Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddDriver(!showAddDriver)}
      >
        <Text style={styles.addText}>Add Driver</Text>
      </TouchableOpacity>

      {/* Add Driver Form */}
      {showAddDriver && (
        <View style={styles.addDriverForm}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newDriver.name}
            onChangeText={(text) => setNewDriver((prev) => ({ ...prev, name: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Vehicle"
            value={newDriver.vehicle}
            onChangeText={(text) => setNewDriver((prev) => ({ ...prev, vehicle: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact"
            value={newDriver.contact}
            onChangeText={(text) => setNewDriver((prev) => ({ ...prev, contact: text }))}
          />
          <TouchableOpacity style={styles.saveButton} onPress={addDriver}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Drivers List */}
      <FlatList
        data={drivers}
        renderItem={renderDriverItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  vehicle: { fontSize: 16, color: '#555', marginVertical: 5 },
  contact: { fontSize: 14, color: '#888' },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: { color: '#fff', fontWeight: 'bold' },
  addButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#6a0dad',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addText: { color: '#fff', fontWeight: 'bold' },
  addDriverForm: { marginBottom: 20 },
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
});

export default OrganisationDriverList;
