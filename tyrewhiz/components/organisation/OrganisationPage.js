import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Modal, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import tyremo from '../../assets/tyremo.png';
import carmo from '../../assets/carmo.png';
import drivermo from '../../assets/drivermo.png';
import reportmo from '../../assets/reportmo.png';
import { API_URL } from '@env';


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

  const fetchFleetData = async () => {
    try {
      // Fetch drivers data from the driver list API
      const response = await fetch(`${API_URL}/api/drivers`);
      const driverData = await response.json();
  
      // Calculate the total number of drivers from the fetched data
      const totalDrivers = driverData.length;  // Assuming each driver in the response is an object
  
      // Example of other fleet data (replace with your actual data)
      const mockData = {
        totalVehicles: 50,
        totalDrivers: totalDrivers, // Use the calculated number of drivers
        activeIssues: 5,
        resolvedIssues: [
          { id: 1, timestamp: Date.now() - 1000 * 60 * 60 },
          { id: 2, timestamp: Date.now() - 1000 * 60 * 60 * 2 },
          { id: 3, timestamp: Date.now() - 1000 * 60 * 60 * 25 },
        ],
      };
  
      // Set the fleet data with the actual fetched data
      setFleetData(mockData); // Replace mockData with actual data from API
      setLoading(false);
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
        <ActivityIndicator size="large" color="rgb(42, 10, 62)" />
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
                <Icon name="pencil" size={15} color="#fff"/>
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
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.summaryCards}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Vehicles</Text>
          <Text style={styles.cardValue}>{fleetData.totalVehicles}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Drivers</Text>
          <Text style={styles.cardValue}>{fleetData.totalDrivers}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Issues</Text>
          <Text style={styles.cardValue}>{fleetData.activeIssues}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resolved Issues (Last 24 Hrs)</Text>
          <Text style={styles.cardValue}>{getResolvedIssuesLast24Hrs()}</Text>
        </View>
      </ScrollView>
    </View>

    <View style={styles.navigation}>
  <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('TireMonitoring')}>
    <Image source={tyremo} style={styles.icon} />
    <Text style={styles.navText}>Tire Monitoring</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('OrganisationVehicleList')}>
  <Image source={carmo} style={styles.icon} />
    <Text style={styles.navText}>Vehicles</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('OrganisationDriverList')}>
    <Image source={drivermo} style={styles.icon}/>
    <Text style={styles.navText}>Drivers</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('OrganisationAnalytics')}>
    <Image source={reportmo} style={styles.icon}/>
    <Text style={styles.navText}>Analytics Report</Text>
  </TouchableOpacity>
</View>

    </ScrollView>
  );
};



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(255,255,255)', // Light gradient-like background color
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
      justifyContent: 'space-between', // Keeps spacing consistent
      paddingHorizontal: 10,
      paddingVertical: 30,
      backgroundColor: 'rgb(28 10 62)',
    },
    backButton: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 5,
    },
    backButtonText: {
      color: 'rgb(42 10 62)',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    title: {
      flex: 1,
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center', // Center-align the title
    },
    
    
    profileButton: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 5,
    },
    profileButtonText: {
      color: 'rgb(42 10 62)',
      fontSize: 24,
      fontWeight: 'bold',
    },
    
    
    roleContainer: { padding: 10, backgroundColor: 'rgb(245, 245, 245)', alignItems: 'center' },
  role: { fontSize: 18, color: 'rgb(42 10 62)' },
  
  
  icon:{
  width:5,
  height:2,

  },
  summary: {
    margin: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  summaryCards: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '10%', // Center-align the Active Issues card initially
  },
  card: {
    backgroundColor: '#eef2f3',
    borderRadius: 15,
    padding: 15,
    width: 150, // Fixed width for all cards
    height: 140, // Fixed height for uniformity
    marginHorizontal: 10, // Add spacing between cards
    alignItems: 'center', // Center align content in the card
    justifyContent: 'center', // Vertically center content
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 16,
    color: 'rgb(30 37 51)',
    marginBottom: 10,
    textAlign: 'center',
    justifyContent:'center',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    justifyContent:'center',
  },
  navigation: {
    padding: 15,
  },
  navButton: {
    backgroundColor: 'rgb(110 89 149)',
    alignItems: 'center', // Align items to the center (for vertical stacking)
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    elevation: 5,
  },
  navText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5, // Add spacing between the icon and text
    textAlign: 'center', // Center-align text under the icon
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
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
      backgroundColor: 'rgb(110, 89, 149)', // Green
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