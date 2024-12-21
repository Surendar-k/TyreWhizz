import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

const TireMonitoring = ({ navigation }) => {
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicleData = async () => {
    try {
      const mockData = [
        {
          id: '1',
          vehicleName: 'Truck 101',
          tireStatus: 'Good',
          issues: 0,
          pressure: '35 PSI',
          temperature: '28°C',
        },
        {
          id: '2',
          vehicleName: 'Van 202',
          tireStatus: 'Low Pressure',
          issues: 1,
          pressure: '25 PSI',
          temperature: '30°C',
        },
        {
          id: '3',
          vehicleName: 'Car 303',
          tireStatus: 'Overheated',
          issues: 2,
          pressure: '40 PSI',
          temperature: '45°C',
        },
        {
          id: '4',
          vehicleName: 'Car 303',
          tireStatus: 'Overheated',
          issues: 2,
          pressure: '40 PSI',
          temperature: '45°C',
        },
        {
          id: '5',
          vehicleName: 'Car 303',
          tireStatus: 'Overheated',
          issues: 2,
          pressure: '40 PSI',
          temperature: '45°C',
        },
      ];
      setTimeout(() => {
        setVehicleData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading tire data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Tire Monitoring</Text>
      <FlatList
        data={vehicleData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent} // Adds padding for the entire list
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.vehicleName}>{item.vehicleName}</Text>
            <Text style={styles.tireStatus}>Status: {item.tireStatus}</Text>
            <Text style={styles.details}>Pressure: {item.pressure}</Text>
            <Text style={styles.details}>Temperature: {item.temperature}</Text>
            <Text style={styles.details}>Issues: {item.issues}</Text>
            
            <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('MonitoringPage', { vehicle: item })}>
  <Text style={styles.buttonText}>View Details</Text>
</TouchableOpacity>

          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingHorizontal: 20, paddingTop: 20 },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#6200ee',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    zIndex: 1, // Ensures back button is on top
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    marginTop: 80, // Adds space below the back button
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',
    textAlign: 'center',
  },
  flatListContent: { paddingBottom: 20 }, // Adds extra padding to the bottom of the list
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  vehicleName: { fontSize: 18, fontWeight: 'bold' },
  tireStatus: { fontSize: 16, marginTop: 5, color: '#333' },
  details: { fontSize: 14, marginTop: 5, color: '#666' },
  button: { marginTop: 10, padding: 10, backgroundColor: '#4CAF50', borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default TireMonitoring;