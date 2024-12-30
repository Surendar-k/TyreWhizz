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
        <ActivityIndicator size="large" color="rgb(42, 10, 62)" />
                <Text>Loading...</Text>
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
  container: { flex: 1, backgroundColor: 'rgb(255,255,255)' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Ensures overall content alignment
    paddingHorizontal: 10,
    paddingVertical: 40,
    backgroundColor: 'rgb(28 10 62)',
    position: 'relative', // Allows absolute positioning of the back button
    
  },
  backButton: {
    position: 'absolute', // Positions the back button independently
    left: 10, // Keeps it at the left edge
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
  },
  backButtonText: {
    color: 'rgb(42 10 62)',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  
  roleContainer: { padding: 10, backgroundColor: 'rgb(245, 245, 245)', alignItems: 'center' },
  role: { fontSize: 18, color: 'rgb(42 10 62)' },
  flatListContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 10,shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8, },
  Vehicle_no: { fontSize: 18, fontWeight: 'bold' },
  tireStatus: { fontSize: 16, marginTop: 5, color: '#333' },
  details: { fontSize: 14, marginTop: 5, color: '#666' },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgb(110 89 149)',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default TireMonitoring;
