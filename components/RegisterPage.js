import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from 'react-native';

const RegisterPage = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    licenseNumber: '',
    licenseExpiry: '',
    vehicleType: '',
    registrationNumber: '',
    mileage: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = () => {
    if (
      !form.name ||
      !form.licenseNumber ||
      !form.licenseExpiry ||
      !form.vehicleType ||
      !form.registrationNumber ||
      !form.mileage
    ) {
      Alert.alert('Error', 'Please fill in all fields.');
    } else {
      setSuccessMessage('Hurray! Registration completed successfully!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Driver's Details</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          onChangeText={(text) => setForm({ ...form, name: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>License Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter license number"
          onChangeText={(text) => setForm({ ...form, licenseNumber: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>License Expiry Date:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter license expiry date"
          onChangeText={(text) => setForm({ ...form, licenseExpiry: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Vehicle Type:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter vehicle type"
          onChangeText={(text) => setForm({ ...form, vehicleType: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Registration Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter registration number"
          onChangeText={(text) =>
            setForm({ ...form, registrationNumber: text })
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Current Mileage:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter current mileage"
          keyboardType="numeric"
          onChangeText={(text) => setForm({ ...form, mileage: text })}
        />
      </View>

      <Button title="Submit" onPress={handleSubmit} />

      {successMessage ? (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  successMessage: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#d4edda',
    borderRadius: 8,
  },
  successText: {
    color: '#155724',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default RegisterPage;
