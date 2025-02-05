import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Modal, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import tyremo from '../../assets/tyremo.png';
import carmo from '../../assets/carmo.png';
import drivermo from '../../assets/drivermo.png';
import reportmo from '../../assets/reportmo.png';


const OrganisationPage = () => {
  const [fleetData, setFleetData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchText,setSearchText] = useState("");

  const [showAddDriver, setShowAddDriver] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: '', Driver_No:'',Vehicle_No: '',exp:'', contact: '' });
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  

  useEffect(() => {
    setFilteredDrivers(drivers);
  }, [drivers]);
  
  const deleteDriver = async (id) => {
    Alert.alert("Delete Driver", "Are you sure you want to delete this driver?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`http://192.168.5.41:5000/api/drivers/${id}`, {
              method: "DELETE",
            });
  
            if (response.ok) {
              const updatedDrivers = drivers.filter((driver) => driver.id !== id);
              setDrivers(updatedDrivers);
              setFilteredDrivers(updatedDrivers);
            } else {
              Alert.alert("Error", "Failed to delete driver");
            }
          } catch (error) {
            console.error("Error deleting driver:", error);
            Alert.alert("Error", "Failed to connect to the server");
          }
        },
      },
    ]);
  };
  

  const addDriver = async () => {
    if (!newDriver.name || !newDriver.Driver_No || !newDriver.Vehicle_No || !newDriver.exp || !newDriver.contact) {
      Alert.alert("Error", "All fields are required to add a driver.");
      return;
    }
  
    console.log("Adding driver:", newDriver); // Debugging
  
    try {
      const response = await fetch("http://192.168.5.41:5000/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDriver),
      });
  
      const data = await response.json();
      console.log("Response from server:", data); // Debugging
  
      if (response.ok) {
        setDrivers((prev) => [...prev, data]);  // Update state immediately
        setFilteredDrivers((prev) => [...prev, data]); // Update filtered drivers as well
        setNewDriver({ name: "", Driver_No: "", Vehicle_No: "", contact: "", exp: "" });
        setShowAddDriver(false);
      } else {
        Alert.alert("Error", data.error || "Failed to add driver");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };
  
  
  

  const searchDriver = (text) => {
    // Trim input to handle leading/trailing spaces and ensure case-insensitivity
    const query = text.trim().toLowerCase();
  
    // If the query is empty, set filteredDrivers to all drivers
    if (!query) {
      setFilteredDrivers(drivers);
      return;
    }
  
    const filteredList = drivers.filter((driver) => {
      // Ensure the driver's Driver_No exists and is a string before performing the search
      const driverNo = driver.Driver_No ? driver.Driver_No.toString() : '';  // Convert to string if it's not already
  
      return driverNo.toLowerCase().includes(query);
    });
  
    // Debugging: Log the filtered list to ensure the logic is working
    console.log(filteredList);
  
    // Update state with the filtered list
    setFilteredDrivers(filteredList);
  };
  
  
  useEffect(() => {
    fetchDrivers();
  }, []);
  
  
  const fetchDrivers = async () => {
    try {
      const response = await fetch("http://192.168.5.41:5000/api/drivers");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched drivers data:", data); // Debugging
        setDrivers(data);
        setFilteredDrivers(data);
      } else {
        console.error("Failed to fetch drivers");
      }
    } catch (error) {
      console.error('Error fetching fleet data:', error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setFilteredDrivers(drivers);
  }, [drivers]); // Ensures filtered drivers are updated whenever drivers change
  
  const updateDriver = async () => {
    if (!selectedDriver) {
      Alert.alert("Error", "No driver selected for update");
      return;
    }
  
    console.log("Updating driver:", selectedDriver); // Log selected driver data
    try {
      const response = await fetch(`http://192.168.5.41:5000/api/drivers/${selectedDriver.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedDriver),
      });
      const updatedDriver = await response.json();
      console.log("Response from server:", updatedDriver); // Log the response
      if (response.ok) {
        const updatedDrivers = drivers.map((driver) =>
          driver.id === updatedDriver.id ? updatedDriver : driver
        );
        setDrivers(updatedDrivers); // Update state with the updated driver
        setFilteredDrivers(updatedDrivers); // Update filtered drivers
        setModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to update driver");
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };
  useEffect(() => {
    console.log("Updated drivers state:", drivers);
  }, [drivers]);

 

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