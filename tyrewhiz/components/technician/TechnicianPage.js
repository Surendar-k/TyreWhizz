import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Picker, ScrollView } from 'react-native';
const profileImage = require('../../assets/icon.png');

const TechnicianPage = () => {
  const [certified, setCertified] = useState('No');
  const [currentPlan, setCurrentPlan] = useState('Basic');
  const bestPlans = ['Standard', 'Premium'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Technician Profile</Text>

      {/* Profile Picture */}
      <View style={styles.profilePicContainer}>
        <Image
          source={profileImage}
          // Replace with your placeholder image
          style={styles.profilePic}
        />
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Profile Picture</Text>
        </TouchableOpacity>
      </View>

      {/* Name */}
      <TextInput
        style={styles.input}
        placeholder="Name"
      />

      {/* Contact Number */}
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        keyboardType="phone-pad"
      />

      {/* Email Address */}
      <TextInput
        style={styles.input}
        placeholder="Email Address (optional)"
        keyboardType="email-address"
      />

      {/* Certified */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Certified:</Text>
        <Picker
          selectedValue={certified}
          style={styles.picker}
          onValueChange={(itemValue) => setCertified(itemValue)}
        >
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>
      </View>

      {/* Years of Experience */}
      <TextInput
        style={styles.input}
        placeholder="Years of Experience"
        keyboardType="numeric"
      />

      {/* Shop Address */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Shop Address"
        multiline
        numberOfLines={4}
      />

      {/* Subscription Plans */}
      <View style={styles.subscriptionContainer}>
        <Text style={styles.label}>Current Plan:</Text>
        <Text style={styles.currentPlan}>{currentPlan}</Text>
        <Text style={styles.label}>Best Plan Recommendations:</Text>
        {bestPlans.map((plan, index) => (
          <Text key={index} style={styles.plan}>
            - {plan}
          </Text>
        ))}
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
  },
  uploadButton: {
    marginTop: 10,
    backgroundColor: '#6200ee',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  subscriptionContainer: {
    marginVertical: 20,
  },
  currentPlan: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  plan: {
    fontSize: 14,
    color: '#777',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TechnicianPage;