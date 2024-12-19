import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TechnicianPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Technician Dashboard</Text>
      <Text style={styles.content}>Here you can manage and track your service tasks.</Text>
      {/* Add other technician-related components and functionalities */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
});

export default TechnicianPage;
