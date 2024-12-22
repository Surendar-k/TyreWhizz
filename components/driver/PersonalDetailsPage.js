import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';

const PersonalDetailsPage = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>List of Vehicles</Text>
      <RNPickerSelect
        items={[
          { label: '2-Wheeler', value: '2-wheeler' },
          { label: '3-Wheeler', value: '3-wheeler' },
          { label: '4-Wheeler', value: '4-wheeler' },
          { label: '6-Wheeler', value: '6-wheeler' },
        ]}
        style={{
          inputAndroid: { color: 'black' },
          inputIOS: { color: 'black' },
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  backButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default PersonalDetailsPage;
