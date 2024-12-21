import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

const OrganisationDriverDetail = ({ route, navigation }) => {
  const { driver } = route.params;
  const [updatedDriver, setUpdatedDriver] = useState({ ...driver });

  const updateDriverDetails = () => {
    if (updatedDriver.name && updatedDriver.vehicle && updatedDriver.contact) {
      Alert.alert('Success', 'Driver details updated successfully!');
      navigation.goBack(); // Navigate back to the driver list page
    } else {
      Alert.alert('Error', 'Please fill all fields before saving!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Update Driver</Text>
      <TextInput
        style={styles.input}
        value={updatedDriver.name}
        onChangeText={(text) => setUpdatedDriver((prev) => ({ ...prev, name: text }))}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={updatedDriver.vehicle}
        onChangeText={(text) => setUpdatedDriver((prev) => ({ ...prev, vehicle: text }))}
        placeholder="Vehicle"
      />
      <TextInput
        style={styles.input}
        value={updatedDriver.contact}
        onChangeText={(text) => setUpdatedDriver((prev) => ({ ...prev, contact: text }))}
        placeholder="Contact"
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.saveButton} onPress={updateDriverDetails}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures the content expands properly
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-start',
    marginBottom: 20,
    borderRadius: 5,
  },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
});

export default OrganisationDriverDetail;
