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
          Vehicle_no: 'TN-01-AB-1234',
          tireStatus: 'Good',
          issues: 0,
          pressure: '35 PSI',
          temperature: '28°C',
        },
        {
          id: '2',
          Vehicle_no: 'TN-02-BC-2345',
          tireStatus: 'Low Pressure',
          issues: 1,
          pressure: '25 PSI',
          temperature: '30°C',
        },
        {
          id: '3',
          Vehicle_no: 'TN-03-CD-3456',
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Tire Monitoring</Text>
      </View>

      {/* Role Information */}
      <View style={styles.roleContainer}>
        <Text style={styles.role}>Logged in as: Organization</Text>
      </View>

      {/* List of Vehicle Data */}
      <FlatList
        data={vehicleData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.Vehicle_no}>Vehicle No: {item.Vehicle_no}</Text>
            <Text style={styles.tireStatus}>Status: {item.tireStatus}</Text>
            <Text style={styles.details}>Pressure: {item.pressure}</Text>
            <Text style={styles.details}>Temperature: {item.temperature}</Text>
            <Text style={styles.details}>Issues: {item.issues}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('MonitoringPage', { vehicle: item })}
            >
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    width: 40, // Fixed width
    height: 40, // Fixed height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 0, // No extra padding
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  roleContainer: { padding: 10, backgroundColor: '#e8f5e9', alignItems: 'center' },
  role: { fontSize: 16, color: '#333' },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginLeft: -40, // Center aligns the title
  },
  flatListContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 10 },
  Vehicle_no: { fontSize: 18, fontWeight: 'bold' },
  tireStatus: { fontSize: 16, marginTop: 5, color: '#333' },
  details: { fontSize: 14, marginTop: 5, color: '#666' },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default TireMonitoring;
