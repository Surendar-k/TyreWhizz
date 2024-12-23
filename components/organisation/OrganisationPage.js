import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
=======
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
>>>>>>> parent of b4f597f (Profile section added)
import { useNavigation } from '@react-navigation/native';

const OrganisationPage = () => {
  const [fleetData, setFleetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
<<<<<<< HEAD
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track edit mode
  
  const [profileData, setProfileData] = useState({
    organizationName: 'TyreWhizz Inc.',
    managerName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 123-456-7890',
  });

  const toggleProfileDrawer = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
=======
>>>>>>> parent of b4f597f (Profile section added)

  // Simulated fetch function (replace with actual API call later)
  const fetchFleetData = async () => {
    try {
      // Simulating API response
      const mockData = {
        totalVehicles: 50,
        activeIssues: 5,
        resolvedIssues: [
<<<<<<< HEAD
          { id: 1, timestamp: Date.now() - 1000 * 60 * 60 }, 
          { id: 2, timestamp: Date.now() - 1000 * 60 * 60 * 2 }, 
          { id: 3, timestamp: Date.now() - 1000 * 60 * 60 * 25 }, 
=======
          { id: 1, timestamp: Date.now() - 1000 * 60 * 60 }, // Resolved 1 hour ago
          { id: 2, timestamp: Date.now() - 1000 * 60 * 60 * 2 }, // Resolved 2 hours ago
          { id: 3, timestamp: Date.now() - 1000 * 60 * 60 * 25 }, // Resolved 25 hours ago
>>>>>>> parent of b4f597f (Profile section added)
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

<<<<<<< HEAD
  const handleProfileChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value,
    });
  };

=======
>>>>>>> parent of b4f597f (Profile section added)
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
<<<<<<< HEAD
        <TouchableOpacity style={styles.profileButton} onPress={toggleProfileDrawer}>
          <Text style={styles.profileButtonText}>☰</Text> {/* Profile Icon */}
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      {isProfileOpen && (
        <View style={styles.profileDrawer}>
          <TouchableOpacity onPress={toggleProfileDrawer} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.profileTitle}>Profile</Text>

          <TouchableOpacity onPress={toggleEditMode} style={styles.editButton}>
            <Text style={styles.editButtonText}>{isEditMode ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>

          {isEditMode ? (
            <>
              <TextInput
                style={styles.input}
                value={profileData.organizationName}
                onChangeText={(text) => handleProfileChange('organizationName', text)}
              />
              <TextInput
                style={styles.input}
                value={profileData.managerName}
                onChangeText={(text) => handleProfileChange('managerName', text)}
              />
              <TextInput
                style={styles.input}
                value={profileData.email}
                onChangeText={(text) => handleProfileChange('email', text)}
              />
              <TextInput
                style={styles.input}
                value={profileData.phone}
                onChangeText={(text) => handleProfileChange('phone', text)}
              />
            </>
          ) : (
            <>
              <Text style={styles.profileText}>Organization Name: {profileData.organizationName}</Text>
              <Text style={styles.profileText}>Manager: {profileData.managerName}</Text>
              <Text style={styles.profileText}>Email: {profileData.email}</Text>
              <Text style={styles.profileText}>Phone: {profileData.phone}</Text>
            </>
          )}

          <Text style={styles.sectionHeader}>Account Settings</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

=======
      </View>

      {/* Role Information */}
>>>>>>> parent of b4f597f (Profile section added)
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
        <TouchableOpacity style={styles.navButton}
        onPress={() => navigation.navigate('OrganisationVehicleList')}>
          <Text style={styles.navText}>Vehicle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('OrganisationDriverList')}
        >
          <Text style={styles.navText}>Drivers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}
        onPress={() => navigation.navigate('OrganisationAnalytics')}>
          <Text style={styles.navText}>Analytics Report</Text>
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
    justifyContent: 'space-between', 
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    width: 40, // Set a fixed width for the button
    height: 40, // Set a fixed height for the button
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 0, // Remove extra padding
  },
  backButtonText: { 
    color: '#4CAF50', 
    fontSize: 30, 
    fontWeight: 'bold', 
    textAlign: 'center', 
  },
  title: { 
    flex: 2, 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff', 
    textAlign: 'center',
    marginLeft: -40, 
  },
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
<<<<<<< HEAD
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#4CAF50',
  },
  button: {
    marginVertical: 5,
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
  },
=======
>>>>>>> parent of b4f597f (Profile section added)
});




export default OrganisationPage;
