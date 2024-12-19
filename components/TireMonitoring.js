import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

const TireMonitoring = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulated fetch function
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
      ];
      setTimeout(() => {
        setVehicleData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
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
      <Text style={styles.title}>Tire Monitoring</Text>
      <FlatList
        data={vehicleData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.vehicleName}>{item.vehicleName}</Text>
            <Text style={styles.tireStatus}>Status: {item.tireStatus}</Text>
            <Text style={styles.details}>Pressure: {item.pressure}</Text>
            <Text style={styles.details}>Temperature: {item.temperature}</Text>
            <Text style={styles.details}>Issues: {item.issues}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#4CAF50' },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  vehicleName: { fontSize: 18, fontWeight: 'bold' },
  tireStatus: { fontSize: 16, marginTop: 5, color: '#333' },
  details: { fontSize: 14, marginTop: 5, color: '#666' },
  button: { marginTop: 10, padding: 10, backgroundColor: '#4CAF50', borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default TireMonitoring;
