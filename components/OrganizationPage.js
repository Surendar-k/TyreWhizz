import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const OrganizationPage = () => {
  const [fleetData, setFleetData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulated fetch function (replace with actual API call later)
  const fetchFleetData = async () => {
    try {
      // Simulating API response
      const mockData = {
        totalVehicles: 50,
        activeIssues: 5,
        resolvedIssues: 10,
      };
      // Simulating network delay
      setTimeout(() => {
        setFleetData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching fleet data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleetData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading...</Text>
      </View>
    );
  }
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>TyreWhizz</Text>
        <Text style={styles.role}>Logged in as: Organization</Text>
      </View>

      {/* Fleet Summary */}
      <View style={styles.summary}>
        <Text style={styles.sectionTitle}>Fleet Summary</Text>
        <View style={styles.summaryCards}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Vehicles</Text>
            <Text style={styles.cardValue}>{fleetData.totalVehicles}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Active Issues</Text>
            <Text style={styles.cardValue}>{fleetData.activeIssues}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resolved Issues</Text>
            <Text style={styles.cardValue}>{fleetData.resolvedIssues}</Text>
          </View>
        </View>
      </View>

      
      {/* Navigation Options */}
      
      <View style={styles.navigation}>
      

      <TouchableOpacity
      style={styles.navButton}
      onPress={() => navigation.navigate('TireMonitoring')}>
        <Text style={styles.navText}>Tire Monitoring</Text>
       </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Issue Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Mechanic Assistance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
  header: { padding: 20, backgroundColor: '#4CAF50', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  role: { fontSize: 16, color: '#fff' },
  summary: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  summaryCards: { flexDirection: 'row', justifyContent: 'space-between' },
  card: { width: '30%', padding: 15, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: '#4CAF50' },
  navigation: { padding: 20 },
  navButton: { marginVertical: 10, padding: 15, backgroundColor: '#4CAF50', borderRadius: 10, alignItems: 'center' },
  navText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
} 
);


export default OrganizationPage;
