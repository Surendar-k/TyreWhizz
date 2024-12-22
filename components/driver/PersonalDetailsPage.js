import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { AsyncStorage } from 'react-native';

const PersonalDetailsPage = () => {
  const [name, setName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
    if (!name || !vehicleNumber || !registerNumber || !image) {
      Alert.alert('Error', 'Please fill all fields and upload an image');
      return;
    }

    const personalDetails = {
      name,
      vehicleNumber,
      registerNumber,
      image,
    };

    try {
      const existingDetails = await AsyncStorage.getItem('personalDetails');
      let personalDetailsArray = existingDetails ? JSON.parse(existingDetails) : [];

      personalDetailsArray.push(personalDetails);
      await AsyncStorage.setItem('personalDetails', JSON.stringify(personalDetailsArray));
      Alert.alert('Success', 'Personal details saved!');
    } catch (error) {
      console.error('Error saving personal details:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Personal Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Vehicle Number"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Register Number"
        value={registerNumber}
        onChangeText={setRegisterNumber}
      />

      <TouchableOpacity style={styles.imagePickerButton}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>

      <Button title="Save Personal Details" onPress={handleSubmit} />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  imagePickerButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
};

export default PersonalDetailsPage;
