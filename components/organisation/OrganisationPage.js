import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OrganisationPage = () => {
  const [fleetData, setFleetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [isEditMode, setIsEditMode] = useState(false); // Track if in edit mode
  const [profileData, setProfileData] = useState({
    organizationName: 'TyreWhizz Inc.',
    managerName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 123-456-7890',
  });
  
  const navigation = useNavigation();

  // Function to fetch fleet data
  const fetchFleetData = async () => {
    try {
      const mockData = {
        totalVehicles: 50,
        activeIssues: 5,
        resolvedIssues: [
          { id: 1, timestamp: Date.now() - 1000 * 60 * 60 },
          { id: 2, timestamp: Date.now() - 1000 * 60 * 60 * 2 },
          { id: 3, timestamp: Date.now() - 1000 * 60 * 60 * 25 },
        ],
      };
      
      setTimeout(() => {
        setFleetData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching fleet data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleetData();
  }, []);

  const getResolvedIssuesLast24Hrs = () => {
    const now = Date.now();
    return fleetData.resolvedIssues.filter(
      (issue) => now - issue.timestamp <= 1000 * 60 * 60 * 24
    ).length;
  };

  // Function to handle profile data change
  const handleProfileChange = (field, value) => {
    setProfileData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Handle Logout
  const handleLogout = () => {
    Alert.alert('Logged Out', 'You have been logged out');
    // Redirect to login screen or reset navigation state here
  };

  // Render loader until data is fetched
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>TyreWhizz</Text>
        <TouchableOpacity style={styles.profileButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.profileButtonText}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profile</Text>

            {/* Profile Content */}
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Organization Name:</Text>
              {isEditMode ? (
                <TextInput
                  style={styles.input}
                  value={profileData.organizationName}
                  onChangeText={(text) => handleProfileChange('organizationName', text)}
                />
              ) : (
                <Text style={styles.profileValue}>{profileData.organizationName}</Text>
              )}
            </View>

            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Manager Name:</Text>
              {isEditMode ? (
                <TextInput
                  style={styles.input}
                  value={profileData.managerName}
                  onChangeText={(text) => handleProfileChange('managerName', text)}
                />
              ) : (
                <Text style={styles.profileValue}>{profileData.managerName}</Text>
              )}
            </View>

            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Email:</Text>
              {isEditMode ? (
                <TextInput
                  style={styles.input}
                  value={profileData.email}
                  onChangeText={(text) => handleProfileChange('email', text)}
                />
              ) : (
                <Text style={styles.profileValue}>{profileData.email}</Text>
              )}
            </View>

            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Phone:</Text>
              {isEditMode ? (
                <TextInput
                  style={styles.input}
                  value={profileData.phone}
                  onChangeText={(text) => handleProfileChange('phone', text)}
                />
              ) : (
                <Text style={styles.profileValue}>{profileData.phone}</Text>
              )}
            </View>

            {/* Edit/Save Button */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditMode(!isEditMode)}>
              <Text style={styles.editButtonText}>
                {isEditMode ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Fleet Data Summary */}
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

      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('TireMonitoring')}>
          <Text style={styles.navText}>Tire Monitoring</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('OrganisationVehicleList')}>
          <Text style={styles.navText}>Vehicles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('OrganisationDriverList')}>
          <Text style={styles.navText}>Drivers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('OrganisationAnalytics')}>
          <Text style={styles.navText}>Analytics Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  profileDrawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '70%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  closeButton: {
    position: 'absolute', // Position it absolutely in the modal content
    top: 10, // Distance from the top
    right: 10, // Distance from the left
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background to focus on modal
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '80%',
    position: 'relative', // Allow absolute positioning inside this container
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  editButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  profileRow: {
    width: '100%',
    marginBottom: 15,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',

  },
  input: {
    height: 45,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  profileButtonText: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 0,
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
  card: { backgroundColor: '#E0E0E0', padding: 15, borderRadius: 20,width: '30%',},
  cardTitle: { fontSize: 14, fontWeight: 'bold' },
  cardValue: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  navigation: { padding: 20 },
  navButton: {
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  navText: { fontSize: 16, color: '#fff' },
});

export default OrganisationPage;
