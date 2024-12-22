import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const DriverPage = ({ detailsType, setDetailsType, handleSave, imageUri, setImageUri, handleImagePick }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[
            styles.switchButton,
            detailsType === 'Personal' && styles.activeButton,
          ]}
          onPress={() => setDetailsType('Personal')}
        >
          <Text style={styles.switchText}>Personal Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.switchButton,
            detailsType === 'Business' && styles.activeButton,
          ]}
          onPress={() => setDetailsType('Business')}
        >
          <Text style={styles.switchText}>Business Details</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.heading}>{detailsType} Details Form</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={detailsType === 'Personal' ? detailsType.name : detailsType.organization}
        onChangeText={(text) => detailsType === 'Personal' ? setDetailsType({...detailsType, name: text}) : setDetailsType({...detailsType, organization: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Register Number"
        value={detailsType.registerNumber}
        onChangeText={(text) => setDetailsType({...detailsType, registerNumber: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Vehicle Number"
        value={detailsType.vehicleNumber}
        onChangeText={(text) => setDetailsType({...detailsType, vehicleNumber: text})}
      />
      {detailsType === 'Business' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Organization"
            value={detailsType.organization}
            onChangeText={(text) => setDetailsType({...detailsType, organization: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="ID"
            value={detailsType.id}
            onChangeText={(text) => setDetailsType({...detailsType, id: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            keyboardType="numeric"
            value={detailsType.pincode}
            onChangeText={(text) => setDetailsType({...detailsType, pincode: text})}
          />
        </>
      )}
      <Button title="Pick an Image" onPress={handleImagePick} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Details</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f2f2f2', flex: 1 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  switchButton: {
    padding: 10,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
    borderRadius: 8,
  },
  activeButton: { backgroundColor: '#6200ea' },
  switchText: { color: '#fff', fontWeight: 'bold' },
  saveButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 20,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginVertical: 10,
    alignSelf: 'center',
  },
});

export default DriverPage;
