import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DriverPage from './DriverPage';
import * as ImagePicker from 'expo-image-picker';

const PersonalDetailsPage = () => {
  const [details, setDetails] = useState({
    name: '',
    registerNumber: '',
    vehicleNumber: '',
  });
  const [imageUri, setImageUri] = useState('');
  const [detailsType, setDetailsType] = useState('Personal');

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // Handle Save Logic Here
    console.log('Details saved:', details);
  };

  return (
    <DriverPage
      detailsType={details}
      setDetailsType={setDetails}
      handleSave={handleSave}
      imageUri={imageUri}
      setImageUri={setImageUri}
      handleImagePick={handleImagePick}
    />
  );
};

const styles = StyleSheet.create({
  // Add styles for PersonalDetailsPage if necessary
});

export default PersonalDetailsPage;

