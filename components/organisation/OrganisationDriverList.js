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

const OrganisationDriverList = ({ navigation }) => {
  const [drivers, setDrivers] = useState([
    { id: '1', name: 'John Doe', Driver_No: '3457', vehicle: 'Truck A', contact: '123-456-7890' },
    { id: '2', name: 'Jane Smith', Driver_No: '3057', vehicle: 'Van B', contact: '987-654-3210' },
    { id: '3', name: 'Mike Johnson', Driver_No: '3497', vehicle: 'Car C', contact: '456-789-1230' },
    { id: '4', name: 'Mike Jo', Driver_No: '3450', vehicle: 'Car E', contact: '456-739-1230' },
    { id: '5', name: 'Mike Joh', Driver_No: '3456', vehicle: 'Car P', contact: '456-789-1200' },
    { id: '6', name: 'Mie Lhnson', Driver_No: '3456', vehicle: 'Car O', contact: '496-789-1230' },
    { id: '7', name: 'Mike Johnon', Driver_No: '3457', vehicle: 'Car N', contact: '456-787-1230' },
  ]);

  const [filteredDrivers, setFilteredDrivers] = useState(drivers);
  const [searchText, setSearchText] = useState('');
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: '', vehicle: '', contact: '' });

  const deleteDriver = (id) => {
    Alert.alert('Delete Driver', 'Are you sure you want to delete this driver?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedDrivers = drivers.filter((driver) => driver.id !== id);
          setDrivers(updatedDrivers);
          setFilteredDrivers(updatedDrivers);
        },
      },
    ]);
  };

  const addDriver = () => {
    if (newDriver.name && newDriver.vehicle && newDriver.contact) {
      const newDriverData = { id: Date.now().toString(), ...newDriver };
      setDrivers((prev) => [...prev, newDriverData]);
      setFilteredDrivers((prev) => [...prev, newDriverData]);
      setNewDriver({ name: '',Driver_No:'', vehicle: '', contact: '' });
      setShowAddDriver(false);
    } else {
      Alert.alert('Error', 'Please fill all fields to add a driver.');
    }
  };

  const searchDriver = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = drivers.filter((driver) =>
        driver.Driver_No.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDrivers(filtered);
    } else {
      setFilteredDrivers(drivers);
    }
  };

  const renderDriverItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('OrganisationDriverDetail', {
            driver: item,
            onUpdate: (updatedDriver) => {
              setDrivers((prevDrivers) =>
                prevDrivers.map((driver) =>
                  driver.id === updatedDriver.id ? updatedDriver : driver
                )
              );
              setFilteredDrivers((prevDrivers) =>
                prevDrivers.map((driver) =>
                  driver.id === updatedDriver.id ? updatedDriver : driver
                )
              );
            },
          })
        }
        style={{ flex: 1 }}
      >
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.driverNo}>Driver No: {item.Driver_No}</Text>
        <Text style={styles.vehicle}>Vehicle: {item.vehicle}</Text>
        <Text style={styles.contact}>Contact: {item.contact}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteDriver(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>TyreWhizz</Text>
        </View>

        {/* Role Information */}
        <View style={styles.roleContainer}>
          <Text style={styles.role}>Logged in as: Organization</Text>
        </View>

        <Text style={styles.drivertitle}>Drivers List</Text>

        {/* Search and Add Driver Section */}
        <View style={styles.actionRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Driver No"
            value={searchText}
            onChangeText={searchDriver}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddDriver(!showAddDriver)}
          >
            <Text style={styles.addText}>Add Driver</Text>
          </TouchableOpacity>
        </View>

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

        <FlatList
          data={filteredDrivers}
          renderItem={renderDriverItem}
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    flex: 2,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginLeft: -40, // Center-aligns the title between back button
  },
  container: { flex: 2, backgroundColor: '#f9f9f9', padding: 20 },
  roleContainer: { padding: 10, backgroundColor: '#e8f5e9', alignItems: 'center' },
  role: { fontSize: 16, color: '#333' },
  drivertitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
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
  driverNo: { fontSize: 14, color: '#666' },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: { color: '#fff', fontWeight: 'bold' },
});

export default OrganisationDriverList;