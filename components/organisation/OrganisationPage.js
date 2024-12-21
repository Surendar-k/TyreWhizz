import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OrganisationPage = () => {
  const [fleetData, setFleetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Simulated fetch function (replace with actual API call later)
  const fetchFleetData = async () => {
    try {
      // Simulating API response
      const mockData = {
        totalVehicles: 50,
        activeIssues: 5,
        resolvedIssues: [
          { id: 1, timestamp: Date.now() - 1000 * 60 * 60 }, // Resolved 1 hour ago
          { id: 2, timestamp: Date.now() - 1000 * 60 * 60 * 2 }, // Resolved 2 hours ago
          { id: 3, timestamp: Date.now() - 1000 * 60 * 60 * 25 }, // Resolved 25 hours ago
        ],
      };

      // Simulating network delay
      setTimeout(() => {
        setFleetData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching fleet data:', error);
      setLoading(false);
    }
  };

  // Calculate resolved issues in the last 24 hours
  const getResolvedIssuesLast24Hrs = () => {
    const now = Date.now();
    return fleetData.resolvedIssues.filter(
      (issue) => now - issue.timestamp <= 1000 * 60 * 60 * 24
    ).length;
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

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>TyreWhizz</Text>
      </View>

      {/* Role Information */}
      <View style={styles.roleContainer}>
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
            <Text style={styles.cardTitle}>Resolved Issues (Last 24 Hrs)</Text>
            <Text style={styles.cardValue}>{getResolvedIssuesLast24Hrs()}</Text>
          </View>
        </View>
      </View>

      {/* Navigation Options */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('TireMonitoring')}
        >
          <Text style={styles.navText}>Tire Monitoring</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Issue Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('OrganisationDriverList')}
        >
          <Text style={styles.navText}>Drivers</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    marginRight: 10,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width:20,
  },
  backButtonText: { color: '#4CAF50', fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', flex: 1, textAlign: 'center' },
  roleContainer: { padding: 10, backgroundColor: '#e8f5e9', alignItems: 'center' },
  role: { fontSize: 16, color: '#333' },
  summary: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  summaryCards: { flexDirection: 'row', justifyContent: 'space-between' },
  card: { width: '30%', padding: 15, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: '#4CAF50' },
  navigation: { padding: 20 },
  navButton: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    alignItems: 'center',
  },
  navText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default OrganisationPage;
