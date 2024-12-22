// PersonalDetailsPage.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const PersonalDetailsPage = () => (
  <ScrollView contentContainerStyle={styles.container}>
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
});

export default PersonalDetailsPage;
