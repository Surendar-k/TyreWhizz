import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { AsyncStorage } from 'react-native';

const BusinessDetailsPage = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [organizationID, setOrganizationID] = useState('');
  const [pincode, setPincode] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
    if (!organizationName || !organizationID || !pincode || !image) {
      Alert.alert('Error', 'Please fill all fields and upload an image');
      return;
    }

    const businessDetails = {
      organizationName,
      organizationID,
      pincode,
      image,
    };

    try {
      const existingBusinessDetails = await AsyncStorage.getItem('businessDetails');
      let businessDetailsArray = existingBusinessDetails ? JSON.parse(existingBusinessDetails) : [];

      businessDetailsArray.push(businessDetails);
      await AsyncStorage.setItem('businessDetails', JSON.stringify(businessDetailsArray));
      Alert.alert('Success', 'Business details saved!');
    } catch (error) {
      console.error('Error saving business details:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Business Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Organization Name"
        value={organizationName}
        onChangeText={setOrganizationName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Organization ID"
        value={organizationID}
        onChangeText={setOrganizationID}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Pincode"
        value={pincode}
        onChangeText={setPincode}
      />

      <TouchableOpacity style={styles.imagePickerButton}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>

      <Button title="Save Business Details" onPress={handleSubmit} />
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

export default BusinessDetailsPage;
