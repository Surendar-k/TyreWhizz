import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';



const OrganisationPage = () => {
  const [fleetData, setFleetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [isEditMode, setIsEditMode] = useState(false); // Track if in edit mode
  const [profileData, setProfileData] = useState({
    organizationName: 'TyreWhizz Inc.',
    managerName: 'Shreya',
    email: 'shhre@example.com',
    phone: '+91 8973901821',
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
    setIsModalVisible(false); // Close the modal
    navigation.navigate('UserTypeSelectionPage'); // Navigate to the User Type Selection Page
    Alert.alert('Logged Out', 'You have been logged out'); // Show logout alert
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
      <View style={styles.roleContainer}>
          <Text style={styles.role}>Logged in as: Organization</Text>
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
  <Icon name="log-out" size={20} color="#fff" />
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
    container: {
      flex: 1,
      backgroundColor: '#eef2f3', // Light gradient-like background color
    },
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingHorizontal: 10,
      paddingVertical: 30,
      backgroundColor: 'rgb(59 32 77)',
      
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
      color: 'rgb(59 32 77)',
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
    roleContainer: { padding: 10, backgroundColor: 'rgb(245, 245, 245)', alignItems: 'center' },
  role: { fontSize: 18, color: 'rgb(59 32 77)' },
  profileButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  profileButtonText: {
    color: 'rgb(59 32 77)',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
    summary: {
      padding: 15,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#374151', // Gray for the title
      marginBottom: 10,
    },
    summaryCards: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    card: {
      backgroundColor: 'rgb(255 255 255)',
      borderRadius: 15,
      padding: 20,
      width: '30%',
      alignItems: 'center', // Align children to the right
      shadowColor: 'rgb(20 2 2 / 20%) 0px 0px 6px',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 8,
    },
    cardTitle: {
      fontSize: 20,
      color: 'rgb(30 37 51)',
      marginBottom: 10,
      textAlign: 'center', // Align text to the right
    },
    cardValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1e293b',
      textAlign: 'center', // Align text to the right
    },
    
    navigation: {
      padding: 15,
    },   
    navButton: {
      backgroundColor: 'rgb(136 126 143)', 
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderRadius: 15,
      marginVertical: 10,
      elevation: 5,
      justifyContent:'center'
    },
    navText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
      
      
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 20,
      width: '85%',
      padding: 25,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 20,
      textAlign: 'center',
    },
    profileRow: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb', // Light gray for differentiation
      paddingBottom: 10,
    },
    profileLabel: {
      fontSize: 16,
      color: '#1f2937', // Darker gray
      fontWeight: 'bold',
      marginBottom: 5,
    },
    profileValue: {
      fontSize: 16,
      color: '#000',
      fontWeight: 'bold',
    },
    
    editButton: {
      backgroundColor: 'rgb(91 192 91)', // Green
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center', // Centers content horizontally
      padding: 15,
      borderRadius: 10,
      marginTop: 15,
    },
    editButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
    logoutButton: {
      backgroundColor: '#ef4444', // Red
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center', // Centers content horizontally
      padding: 15,
      borderRadius: 10,
      marginTop: 15,
    },
    logoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    
    closeButton: {
      backgroundColor: '#9ca3af', // Gray
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center', // Centers content horizontally
      padding: 15,
      borderRadius: 10,
      marginTop: 15,
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center', // Center text inside the Text component
    },
    
  });
  

export default OrganisationPage;