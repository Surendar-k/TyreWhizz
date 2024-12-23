// DriverPage.js
import React, { useState } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure to install react-native-vector-icons

const DriverPage = ({ navigation }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [name, setName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleImage, setVehicleImage] = useState(null); // Placeholder for image

  const handleSubmit = (type) => {
    if (type === 'personal') {
      navigation.navigate('PersonalDetailsPage', { name, vehicleNumber, vehicleType, vehicleImage });
    } else {
      navigation.navigate('BusinessDetailsPage', { name, vehicleNumber, vehicleType, vehicleImage });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setSidebarVisible(!isSidebarVisible)}>
        <Icon name="bars" size={30} />
      </TouchableOpacity>
      
      {isSidebarVisible && (
        <View style={styles.sidebar}>
          <Text style={styles.sidebarItem} onPress={() => setSidebarVisible(false)}>Profile Upload</Text>
          <Text style={styles.sidebarItem} onPress={() => setSidebarVisible(false)}>Business Details</Text>
          {/* Add more sidebar items as needed */}
        </View>
      )}
      
      <ScrollView style={styles.form}>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Vehicle Number" value={vehicleNumber} onChangeText={setVehicleNumber} />
        <TextInput style={styles.input} placeholder="Type of Vehicle" value={vehicleType} onChangeText={setVehicleType} />
        
        {/* Placeholder for image upload */}
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadText}>Upload Vehicle Image</Text>
        </TouchableOpacity>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit('personal')}>
            <Text style={styles.submitText}>Submit Personal Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit('business')}>
            <Text style={styles.submitText}>Submit Business Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 200,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  sidebarItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  form: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  uploadText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    flex: 0.48,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
  },
});

export default DriverPage;