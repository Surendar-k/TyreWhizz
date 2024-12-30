import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';

const OrganisationDriverList = ({ navigation }) => {
  const [drivers, setDrivers] = useState([
    { id: '1', name: 'John Doe', Driver_No: '3457', Vehicle_No: 'TN-01-AB-1204', contact: '123-456-7890' },
    { id: '2', name: 'Jane Smith', Driver_No: '3057', Vehicle_No: 'TN-01-AB-4234', contact: '987-654-3210' },
    { id: '3', name: 'Mike Johnson', Driver_No: '3497', Vehicle_No: 'TN-01-AB-6234', contact: '456-789-1230' },
    { id: '4', name: 'Mike Jo', Driver_No: '3450', Vehicle_No: 'TN-01-AB-1834', contact: '456-739-1230' },
    { id: '5', name: 'Mike Joh', Driver_No: '3456', Vehicle_No: 'TN-01-AB-1237', contact: '456-789-1200' },
    { id: '6', name: 'Mie Lhnson', Driver_No: '3456', Vehicle_No: 'TN-01-AB-5234', contact: '496-789-1230' },
    { id: '7', name: 'Mike Johnon', Driver_No: '3457', Vehicle_No: 'TN-01-AB-1264', contact: '456-787-1230' },
  ]);

  const [filteredDrivers, setFilteredDrivers] = useState(drivers);
  const [searchText, setSearchText] = useState('');
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: '', Vehicle_No: '', contact: '' });
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  
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
      setNewDriver({ name: '', Driver_No: '', Vehicle_No: '', contact: '' });
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

  const openUpdateModal = (driver) => {
    setSelectedDriver(driver);
    setModalVisible(true);
  };

  const updateDriver = () => {
    if (selectedDriver.name && selectedDriver.Vehicle_No && selectedDriver.contact) {
      const updatedDrivers = drivers.map((driver) =>
        driver.id === selectedDriver.id ? selectedDriver : driver
      );
      setDrivers(updatedDrivers);
      setFilteredDrivers(updatedDrivers);
      setModalVisible(false);
      Alert.alert('Success', 'Driver details updated successfully!');
    } else {
      Alert.alert('Error', 'Please fill all fields to update the driver.');
    }
  };

  const renderDriverItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => openUpdateModal(item)} // Open the update modal
        style={{ flex: 1 }}
      >
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.driverNo}>Driver No: {item.Driver_No}</Text>
        <Text style={styles.Vehicle_No}>Vehicle No: {item.Vehicle_No}</Text>
        <Text style={styles.contact}>Contact: {item.contact}</Text>
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
    onChangeText={searchDriver}
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
              onChangeText={(text) => setSelectedDriver({ ...selectedDriver, name: text })}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={selectedDriver?.Vehicle_No}
              onChangeText={(text) => setSelectedDriver({ ...selectedDriver, Vehicle_No: text })}
              placeholder="Vehicle No"
            />
            <TextInput
              style={styles.input}
              value={selectedDriver?.contact}
              onChangeText={(text) => setSelectedDriver({ ...selectedDriver, contact: text })}
              placeholder="Contact"
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
  driverNo: { fontSize: 14, color: '#666' },
  Vehicle_No: { fontSize: 14, color: '#666' },
  contact: { fontSize: 14, color: '#888' },
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