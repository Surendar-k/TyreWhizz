import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';



const TechnicianPage = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isProfileVisible, setProfileVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Notifications');
  const navigation = useNavigation();
  const [hasCertificate, setHasCertificate] = useState('No');
  const [certificateFile, setCertificateFile] = useState(null);
 
  const [notifications,setNotifications] = useState([
    {
      id: '1',
      title: 'System Update Available',
      time: '2 hours ago',
      message: 'A new system update is available. Please update your app to access the latest features.',
      unread: true,
      type:'info',
    },
    {
      id: '2',
      title: 'New Connection Request',
      time: '3 hours ago',
      message: 'John Doe has sent you a request. He had issues on tire puncture.',
      unread: false,
      type:'request',
    },
    {
      id: '3',
      title: 'Customer Feedback Alert',
      time: '5 hours ago',
      message: 'Feedback received for your recent service: \'Great job on tire replacement!\' Keep up the good work!',
      unread: true,
      type:'info',
    },
    {
      id: '4',
      title: 'Tire Puncture Repair Request',
      time: '1 day ago',
      message: 'Repair requested for a punctured rear-right tire in Vehicle PY33 11574. ETA for the site: 30 mins',
      unread: false,
      type:'request',
    },
    {
      id: '5',
      title: 'New Tire Replacement Request',
      time: '2 days ago',
      message: 'You have a new tire replacement request for Vehicle TN25 1S107. Customer prefers service on 24 Dec at 11 : 00AM .',
      unread: false,
      type:'request',
    },
    {
      id: '6',
      title: 'Upcoming Maintenance',
      time: '2 days ago',
      message: 'Reminder: You have 3 scheduled maintenance appointments next week.',
      unread: false,
      type:'info'
    },
  ]);
 
  // Handle Accept Request
const handleAcceptRequest = (id) => {
  console.log("Before accept:", notifications); // Log the state before the update
  setNotifications((prevNotifications) =>
    prevNotifications.map((notification) =>
      notification.id === id ? { ...notification, status: 'accepted' } : notification
    )
  );
  console.log("After accept:", notifications); // Log the state after the update
};

// Handle Reject Request
const handleRejectRequest = (id) => {
  console.log("Before reject:", notifications);
  setNotifications((prevNotifications) =>
    prevNotifications.map((notification) =>
      notification.id === id ? { ...notification, status: 'rejected' } : notification
    )
  );
  console.log("After reject:", notifications);
};

// Handle Delete Notification
const handleDeleteNotification = (id) => {
  console.log("Before delete:", notifications);
  setNotifications((prevNotifications) =>
    prevNotifications.filter((notification) => notification.id !== id)
  );
  console.log("After delete:", notifications);
};
const [vehicleId, setVehicleId] = useState('');

const requestCameraPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status === 'granted') {
    handleImageCapture(); // Your method to capture or select images
  } else {
    Alert.alert(
      "Permission Required",
      "Camera access is required to capture vehicle images",
      [{ text: "OK" }]
    );
  }
};
const requestWebcamPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Webcam is accessible
    console.log("Webcam stream available");
    // Use the stream for video capture or processing
    handleWebcamCapture(stream);
  } catch (error) {
    console.error("Webcam access denied or unavailable", error);
    alert("Camera access is required to capture vehicle images");
  }
};
const requestCameraOrWebcamPermission = async () => {
  if (Platform.OS === 'web') {
    // For web
    await requestWebcamPermission();
  } else {
    // For mobile
    await requestCameraPermission();
  }
};

  const [messages] = useState([
    {
      id: 1,
      sender: 'Michael',
      message: 'When can you check my car\'s tyres? I noticed some unusual wear patterns.',
      time: '10:30 AM',
      unread: true
    },
    {
      id: 2,
      sender: 'Arjun',
      message: 'Thanks for the quick service yesterday! The ride feels much smoother now.',
      time: 'Yesterday',
      unread: false
    },
    {
      id: 3,
      sender: 'Sachin',
      message: 'Your profile verification is complete. You can now access all premium features.',
      time: '2 days ago',
      unread: false
    },
    {
      id: 4,
      sender: 'Sakthi',
      message: 'Is it possible to reschedule my appointment from Tuesday to Wednesday?',
      time: '3 days ago',
      unread: false
    },
    {
      id: 5,
      sender: 'Shreya',
      message: 'Could you provide a quote for a complete tire change for my SUV?',
      time: '4 days ago',
      unread: false
    },
    {
      id: 6,
      sender: 'Charan',
      message: 'Monthly service report is ready for your review.',
      time: '5 days ago',
      unread: false
    }
  ]);
  const [userData, setUserData] = useState({
    name: 'Arjun',
    email: 'Arjun@example.com',
    phone: '+91 9857852471',
    specialization: 'Tyre Expert',
    experience: '5 years',
    currentPlan: 'Basic',
    daysLeft: 30,
  });

  // Existing functions remain the same...
  const toggleMenu = () => setMenuVisible(!isMenuVisible);
  const toggleProfile = () => {
    setProfileVisible(!isProfileVisible);
    setIsEditing(false);
  };

  const handleEdit = () => setIsEditing(!isEditing);
  const handleSave = () => setIsEditing(false);
  const [image, setImage] = useState(null);

  const pickCertificate = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
    });

    if (result.type === 'success') {
      setCertificateFile(result.uri);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'TyreWhizz',
      headerStyle: {
        backgroundColor: '#FF5733',
      },
      headerTintColor: '#fff',
      headerLeft: () => (
        <TouchableOpacity onPress={toggleMenu} style={styles.headerButton}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={toggleProfile} style={styles.headerButton}>
          <Ionicons name="person-circle" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const EditableField = ({ label, value, field }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}:</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => setUserData({ ...userData, [field]: text })}
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

  const handleCertificateSelection = (selection) => {
    setHasCertificate(selection);
  };
  const handleLogout = () => {
    // Close the modal
    setProfileVisible(false);
    navigation.navigate('UserTypeSelectionPage'); // Navigate to the User Type Selection Page

  };
 

  
  const handleImageCapture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        Alert.alert("Success", "Image captured successfully!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture image");
    }
  };
  const renderConnectContent = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>Connect with Your Customer's</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Vehicle ID"
        value={vehicleId}
        onChangeText={setVehicleId}
      />

      <TouchableOpacity 
        style={styles.scanButton}
        onPress={requestCameraPermission}
        
      >
        <Ionicons name="camera" size={24} color="#fff" />
        <Text style={styles.scanButtonText}>Capture Vehicle Image</Text>
      </TouchableOpacity>

      <Button
      style={styles.pair}
        title="Pair"
        onPress={() => {
          alert(`Vehicle ID: ${vehicleId}`);
        }}
      />
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Notifications':
        return (
          <View style={styles.contentContainer}>
        {notifications.map((notification) => (
          <View
            key={notification.id}
            style={[styles.notificationItem, notification.unread && styles.unread]}
          >
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <TouchableOpacity
                onPress={() => handleDeleteNotification(notification.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="close-circle-outline" size={24} color="#FF5733" />
              </TouchableOpacity>
            </View>
            <Text style={styles.notificationTime}>{notification.time}</Text>
            <Text style={styles.notificationMessage}>{notification.message}</Text>

            {notification.type === 'request' && !notification.status && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={() => handleAcceptRequest(notification.id)}
                >
                  <Text style={styles.actionButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleRejectRequest(notification.id)}
                >
                  <Text style={styles.actionButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}

            {notification.status && (
              <Text
                style={[
                  styles.statusText,
                  notification.status === 'accepted' ? styles.acceptedText : styles.rejectedText,
                ]}
              >
                {notification.status === 'accepted' ? 'Accepted' : 'Rejected'}
              </Text>
            )}
          </View>
            ))}
            
          </View>
          
        );
        
      case 'Connect':
        return renderConnectContent();
        
      case 'Messages':
        return (
          <View style={styles.contentContainer}>
            {messages.map(message => (
              <View 
                key={message.id} 
                style={[styles.messageItem, message.unread && styles.unread]}
              >
                <View style={styles.messageHeader}>
                  <Text style={styles.messageSender}>{message.sender}</Text>
                  <Text style={styles.messageTime}>{message.time}</Text>
                </View>
                <Text style={styles.messageText}>{message.message}</Text>
              </View>
            ))}
          </View>
        );
        
      default:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.tabContent}>No content available</Text>
          </View>
        );
    }
  };
  
  // Rest of the component remains the same...
  return (
    <View style={styles.container}>
      {/* Existing JSX structure remains the same... */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.welcometitle}>Welcome, Technician!</Text>
        <TouchableOpacity style={styles.profileButton} onPress={toggleProfile}>
          <Ionicons name="person-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'Notifications' && styles.selectedTab]}
            onPress={() => setSelectedTab('Notifications')}
          >
             <Ionicons name="notifications" size={24} color="#FF5733" />
            <Text style={styles.tabButtonText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'Connect' && styles.selectedTab]}
            onPress={() => setSelectedTab('Connect')}
          >
            <Ionicons name="people" size={24} color="#FF5733" />
            <Text style={styles.tabButtonText}>Connect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'Messages' && styles.selectedTab]}
            onPress={() => setSelectedTab('Messages')}
          >
            <Ionicons name="mail" size={24} color="#FF5733" />
            <Text style={styles.tabButtonText}>Messages</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContentContainer}>{renderTabContent()}</View>

        <Modal
          visible={isMenuVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleMenu}
        >
          <View style={styles.modalBackground}>
            <View style={styles.menuContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Menu</Text>
                <TouchableOpacity onPress={toggleMenu}>
                  <Ionicons name="close" size={24} color="#FF5733" />
                </TouchableOpacity>
              </View>
              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Current Plan</Text>
                <View style={styles.planInfo}>
                  <Text style={styles.planType}>{userData.currentPlan}</Text>
                  <Text style={styles.daysLeft}>{userData.daysLeft} days left</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="card-outline" size={24} color="#FF5733" />
                <Text style={styles.menuItemText}>Subscription Plans</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="information-circle-outline" size={24} color="#FF5733" />
                <Text style={styles.menuItemText}>About TyreWhizz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        <Modal
          visible={isProfileVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleProfile}
        >
          <View style={styles.modalBackground}>
            <View style={styles.profileContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Profile</Text>
                <TouchableOpacity onPress={toggleProfile}>
                  <Ionicons name="close" size={24} color="#FF5733" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.profileContent}>
                <View style={styles.profileImageContainer}>
                  <Ionicons name="person-circle" size={80} color="#FF5733" />
                </View>
                <EditableField label="Name" value={userData.name} field="name" />
                <EditableField label="Email" value={userData.email} field="email" />
                <EditableField label="Phone" value={userData.phone} field="phone" />
                <EditableField
                  label="Specialization"
                  value={userData.specialization}
                  field="specialization"
                />
                <EditableField
                  label="Experience"
                  value={userData.experience}
                  field="experience"
                />

                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Certificate:</Text>
                  {isEditing ? (
                    <View style={styles.certSelection}>
                      <TouchableOpacity
                        onPress={() => handleCertificateSelection('Yes')}
                        style={[styles.certButton, hasCertificate === 'Yes' && styles.selectedButton]}
                      >
                        <Text style={styles.certButtonText}>Yes</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleCertificateSelection('No')}
                        style={[styles.certButton, hasCertificate === 'No' && styles.selectedButton]}
                      >
                        <Text style={styles.certButtonText}>No</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={styles.fieldValue}>{hasCertificate}</Text>
                  )}
                  {hasCertificate === 'Yes' && (
                    <View style={styles.uploadContainer}>
                      <Button title="Upload Certificate" onPress={pickCertificate} />
                      {certificateFile && (
                        <Image source={{ uri: certificateFile }} style={styles.uploadedImage} />
                      )}
                    </View>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  {isEditing ? (
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                      <Text style={styles.buttonText}>Save Changes</Text>
                    </TouchableOpacity>
                  ) : (
                    
                    <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                      <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                    
                  )}
                
                </View>
                <View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
    <Text style={styles.buttonText}>Logout</Text>
  </TouchableOpacity>
                </View>
            
              </ScrollView>
              
            </View>
            
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5733',
    padding: 15,
    borderRadius: 8,
    marginVertical: 15,
    justifyContent: 'center'
  },
  scanButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold'
  },
  // Layout & Containers
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  tabContentContainer: {
    padding: 15
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  uploadContainer: {
    marginTop: 10
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF5733',
    paddingVertical: 15,
    paddingHorizontal: 10
  },
  title: {
    color: '#FF5733',
    fontSize: 30,
    fontWeight: 'bold',
    padding:10,
    fontFamily:'cursive',
  },
  welcometitle:{
    color:'#ffff',
    fontSize:20,
    
  },
  menuButton: {
    padding: 5
  },
  profileButton: {
    padding: 5
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10
  },
  tabButtonText: {
    fontSize: 16,
    color: '#333'
  },
  selectedTab: {
    backgroundColor: 'antiquewhite'
  },
  tabContent: {
    fontSize: 16,
    color: '#333'
  },

  // Notifications
  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ddd'
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 16
  },
  notificationTime: {
    color: '#666',
    fontSize: 12
  },
  notificationMessage: {
    color: '#333',
    fontSize: 14
  },
  deleteButton: {
    padding: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#FF5733',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statusText: {
    marginTop: 5,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  acceptedText: {
    color: '#4CAF50',
  },
  rejectedText: {
    color: '#FF5733',
  },

  // Messages
  messageItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ddd'
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  messageSender: {
    fontWeight: 'bold',
    fontSize: 16
  },
  messageTime: {
    color: '#666',
    fontSize: 12
  },
  messageText: {
    color: '#333',
    fontSize: 14
  },

  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5733'
  },

  // Menu Modal
  menuContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    height: '70%'
  },
  menuSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  menuItemText: {
    fontSize: 14,
    marginLeft: 10
  },
  planInfo: {
    marginBottom: 20
  },
  planType: {
    fontSize: 14
  },
  daysLeft: {
    fontSize: 12,
    color: '#777'
  },

  // Profile Modal
  profileContainer: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 10
  },
  profileContent: {
    maxHeight: '80%'
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  fieldContainer: {
    marginBottom: 10
  },
  fieldLabel: {
    fontWeight: 'bold'
  },
  fieldValue: {
    fontSize: 16,
    color: '#333'
  },

  // Form Elements
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5
  },
  certSelection: {
    flexDirection: 'row'
  },
  certButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#ddd',
    borderRadius: 5
  },
  selectedButton: {
    backgroundColor: '#FF5733'
  },
  certButtonText: {
    color: '#fff'
  },

  // Images
  uploadedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
pair:{
  fontFamily:'curse',
  color:'#ffff',
  },
  // Buttons
  editButton: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 5
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  // Shared States
  unread: {
    borderLeftColor: '#FF5733'
  },
  logoutButton: {
    backgroundColor: '#ef4444', // Red
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centers content horizontally
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
    
    
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
  
  export default TechnicianPage;