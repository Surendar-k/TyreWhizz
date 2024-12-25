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
    Alert.alert('Success', 'Driver details updated successfully!');
    navigation.goBack(); // Return to the list page
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>TyreWhizz</Text>
      </View>

      {/* Role Information */}
      <View style={styles.roleContainer}>
        <Text style={styles.role}>Logged in as: Organization</Text>
      </View>

      {/* Update Driver Section */}
      <Text style={styles.pageTitle}>Update Driver</Text>
      <TextInput
        style={styles.input}
        value={updatedDriver.name}
        onChangeText={(text) =>
          setUpdatedDriver((prev) => ({ ...prev, name: text }))
        }
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={updatedDriver.vehicle}
        onChangeText={(text) =>
          setUpdatedDriver((prev) => ({ ...prev, vehicle: text }))
        }
        placeholder="Vehicle"
      />
      <TextInput
        style={styles.input}
        value={updatedDriver.contact}
        onChangeText={(text) =>
          setUpdatedDriver((prev) => ({ ...prev, contact: text }))
        }
        placeholder="Contact"
      />
      <TouchableOpacity style={styles.saveButton} onPress={updateDriverDetails}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: 10,
    paddingVertical: 10,
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
    marginRight: 40, // Offsets the title to center it
  },
  roleContainer: {
    padding: 10,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
  },
  role: { fontSize: 16, color: '#333' },
  pageTitle: { fontSize: 24, fontWeight: 'bold', marginVertical: 20 },
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
