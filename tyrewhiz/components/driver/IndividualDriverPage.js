import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import { launchImageLibrary } from "react-native-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const cartopimg = require("../../assets/car-top-view.png");
const defaultImage = require("../../assets/logo.png");

const IndividualDriverPage = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [driverName, setDriverName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedTab, setSelectedTab] = useState("pairConnection");
  const [sensorId, setSensorId] = useState("");
  const [recentConnections, setRecentConnections] = useState([]);
  const [vehicleType, setVehicleType] = useState("4wheeler"); // Default vehicle type
  const navigation = useNavigation();

  const [messages] = useState([
    {
      id: 1,
      sender: "Michael",
      message:
        "When can you check my car's tyres? I noticed some unusual wear patterns.",
      time: "10:30 AM",
      unread: true,
    },
    {
      id: 2,
      sender: "Arjun",
      message:
        "Thanks for the quick service yesterday! The ride feels much smoother now.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      sender: "Sachin",
      message:
        "Your profile verification is complete. You can now access all premium features.",
      time: "2 days ago",
      unread: false,
    },
    {
      id: 4,
      sender: "Sakthi",
      message:
        "Is it possible to reschedule my appointment from Tuesday to Wednesday?",
      time: "3 days ago",
      unread: false,
    },
    {
      id: 5,
      sender: "Shreya",
      message:
        "Could you provide a quote for a complete tire change for my SUV?",
      time: "4 days ago",
      unread: false,
    },
    {
      id: 6,
      sender: "Charan",
      message: "Monthly service report is ready for your review.",
      time: "5 days ago",
      unread: false,
    },
  ]);
  const [notifications, setNotifications] = useState([
    {
      message: "Your vehicle has been paired successfully.",
      date: "2025-01-02 10:30 AM",
    },
    {
      message: "New message from the admin.",
      date: "2025-01-01 08:45 AM",
    },
    // Add more notifications as needed
  ]);

  const [isPairModalVisible, setPairModalVisible] = useState(false);
  const [selectedPairType, setSelectedPairType] = useState(null);
  const [isAutoPairing, setIsAutoPairing] = useState(false);
  const [selectedConnectionIndex, setSelectedConnectionIndex] = useState(null);
  const [manualTireSensors, setManualTireSensors] = useState({
    frontLeft: "",
    frontRight: "",
    rearLeft: "",
    rearRight: "",
  });

  // Function to handle pair button click
  const handlePairClick = (index) => {
    setSelectedConnectionIndex(index);
    setSelectedPairType(null); // Reset pairing type so user is always asked
    setPairModalVisible(true);
  };

  // Function to handle manual pairing
  const handleManualPair = () => {
    setSelectedPairType("manual");
  };

  // Function to handle auto pairing
  const handleAutoPair = () => {
    setSelectedPairType("auto");
    setIsAutoPairing(true);
    // Simulate auto-pairing process
    setTimeout(() => {
      setIsAutoPairing(false);
      setPairModalVisible(false);
      setSelectedPairType(null);
      // Update the connection status in recentConnections
      const updatedConnections = [...recentConnections];
      updatedConnections[selectedConnectionIndex] = {
        ...updatedConnections[selectedConnectionIndex],
        paired: true,
      };
      setRecentConnections(updatedConnections);

      // Navigate to MonitoringPage after pairing is complete
      navigation.navigate("MonitoringPage");
    }, 3000);
  };

  // Function to handle manual connection
  const handleManualConnect = () => {
    // Validate all tire sensors are filled
    if (Object.values(manualTireSensors).some((value) => !value)) {
      alert("Please fill all tire sensor IDs");
      return;
    }

    // Update the connection status
    const updatedConnections = [...recentConnections];
    updatedConnections[selectedConnectionIndex] = {
      ...updatedConnections[selectedConnectionIndex],
      paired: true,
      tireSensors: { ...manualTireSensors },
    };
    setRecentConnections(updatedConnections);

    // Reset and close modal
    setManualTireSensors({
      frontLeft: "",
      frontRight: "",
      rearLeft: "",
      rearRight: "",
    });
    setPairModalVisible(false);
    setSelectedPairType(null);

    // Navigate to MonitoringPage after manual connection
    navigation.navigate("MonitoringPage");
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
        selectionLimit: 1,
      },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setProfileImage(response.assets[0].uri);
        }
      }
    );
  };

  const pickImages = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
        selectionLimit: 5,
      },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setUploadedImages(response.assets);
        }
      }
    );
  };

  const saveDriverDetails = () => {
    alert("Driver details saved successfully!");
    toggleModal();
  };
  const handleLogout = () => {

    navigation.navigate("UserTypeSelectionPage"); // Navigate to the User Type Selection Page
  };
  const handleSensorIdSubmit = () => {
    if (!sensorId) return; // Prevent adding empty sensor IDs
    setRecentConnections([...recentConnections, { sensorId, vehicleType }]);
    setSensorId("");
  };

  const handleDeleteConnection = (index) => {
    const updatedConnections = recentConnections.filter(
      (_, idx) => idx !== index
    );
    setRecentConnections(updatedConnections);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("DriverPage")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Driver Page</Text>
        <TouchableOpacity onPress={toggleModal} style={styles.profileSection}>
          <Image
            source={profileImage ? { uri: profileImage } : defaultImage}
            style={styles.profileImage}
          />
          <Text style={styles.profileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabsContainer}>
        {/*list of tabs*/}
        {/* Notifications Tab */}
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "notifications" && styles.selectedTab,
          ]}
          onPress={() => setSelectedTab("notifications")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "notifications" && styles.selectedTabText,
            ]}
          >
            Notifications
          </Text>
        </TouchableOpacity>

        {/* Pair Connection Tab */}
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "pairConnection" && styles.selectedTab,
          ]}
          onPress={() => setSelectedTab("pairConnection")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "pairConnection" && styles.selectedTabText,
            ]}
          >
            Pair Connection
          </Text>
        </TouchableOpacity>

        {/* Messages Tab */}
        <TouchableOpacity
          style={[styles.tab, selectedTab === "messages" && styles.selectedTab]}
          onPress={() => setSelectedTab("messages")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "messages" && styles.selectedTabText,
            ]}
          >
            Messages
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}

      {/*message content*/}

      {selectedTab === "messages" && (
        <View style={styles.tabContent}>
          <View style={styles.contentContainer}>
            {messages.map((message) => (
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
        </View>
      )}

      {/* Notifications Tab Content */}
      {selectedTab === "notifications" && (
        <View style={styles.tabContent}>
          <Text style={styles.notificationTitle}>Notifications</Text>
          {/* Displaying the notifications list */}
          {notifications.length > 0 ? (
            <View style={styles.notificationsList}>
              {notifications.map((notification, index) => (
                <View key={index} style={styles.notificationItem}>
                  <Text style={styles.notificationText}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationDate}>
                    {notification.date}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noNotifications}>
              No notifications available.
            </Text>
          )}
        </View>
      )}

      {/*pairconnection tab content */}
      {selectedTab === "pairConnection" && (
        <View style={styles.tabContent}>
          <Text style={styles.vehicleTypeText}>Select Vehicle Type</Text>
          <View style={styles.vehicleTypeGrid}>
            <TouchableOpacity
              onPress={() => setVehicleType("2wheeler")}
              style={[
                styles.vehicleButton,
                vehicleType === "2wheeler" && styles.selectedVehicleButton,
              ]}
            >
              <Text style={styles.vehicleButtonText}>2-Wheeler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVehicleType("4wheeler")}
              style={[
                styles.vehicleButton,
                vehicleType === "4wheeler" && styles.selectedVehicleButton,
              ]}
            >
              <Text style={styles.vehicleButtonText}>4-Wheeler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVehicleType("6wheeler")}
              style={[
                styles.vehicleButton,
                vehicleType === "6wheeler" && styles.selectedVehicleButton,
              ]}
            >
              <Text style={styles.vehicleButtonText}>6-Wheeler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVehicleType("8wheeler")}
              style={[
                styles.vehicleButton,
                vehicleType === "8wheeler" && styles.selectedVehicleButton,
              ]}
            >
              <Text style={styles.vehicleButtonText}>8-Wheeler</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Sensor ID"
            value={sensorId}
            onChangeText={setSensorId}
            style={styles.inputField}
          />
          <TouchableOpacity
            onPress={handleSensorIdSubmit}
            style={styles.addPairButton}
          >
            <Text style={styles.addPairButtonText}>Add Pair Connection</Text>
          </TouchableOpacity>

          <Text style={styles.recentConnectionsText}>
            Recent Paired Connections:
          </Text>
          {recentConnections.length > 0 ? (
            <View style={styles.recentConnectionsList}>
              {recentConnections.map((connection, index) => (
                <View key={index} style={styles.recentConnectionItem}>
                  <View>
                    <Text>{`Sensor ID: ${connection.sensorId} - Vehicle: ${connection.vehicleType}`}</Text>
                    <Text style={styles.pairStatus}>
                      {connection.paired ? "Paired" : "Not Paired"}
                    </Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    {!connection.paired && (
                      <TouchableOpacity
                        onPress={() => handlePairClick(index)}
                        style={styles.pairButton}
                      >
                        <Text style={styles.pairButtonText}>Pair</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => handleDeleteConnection(index)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text>No recent connections.</Text>
          )}
        </View>
      )}

      <Modal
        isVisible={isPairModalVisible}
        onBackdropPress={() => !isAutoPairing && setPairModalVisible(false)}
      >
        <View style={styles.pairModalContainer}>
          {!selectedPairType ? (
            <>
              <Text style={styles.modalTitle}>Select Pairing Method</Text>
              <TouchableOpacity
                style={styles.methodButton}
                onPress={handleManualPair}
              >
                <Text style={styles.methodButtonText}>Manual</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.methodButton}
                onPress={handleAutoPair}
              >
                <Text style={styles.methodButtonText}>Auto Pair</Text>
              </TouchableOpacity>
            </>
          ) : selectedPairType === "manual" ? (
            <View style={styles.manualPairingContainer}>
              <Text style={styles.modalTitle}>Manual Pairing</Text>

              <View style={styles.carContainer}>
                {/* Left side tire inputs */}
                <View style={styles.leftTires}>
                  <View style={styles.tireInputContainer}>
                    <TextInput
                      placeholder="FL"
                      value={manualTireSensors.frontLeft}
                      onChangeText={(text) =>
                        setManualTireSensors({
                          ...manualTireSensors,
                          frontLeft: text,
                        })
                      }
                      style={[styles.tireInput, styles.frontLeftInput]}
                    />
                  </View>
                  <View style={styles.tireInputContainer}>
                    <TextInput
                      placeholder="RL"
                      value={manualTireSensors.rearLeft}
                      onChangeText={(text) =>
                        setManualTireSensors({
                          ...manualTireSensors,
                          rearLeft: text,
                        })
                      }
                      style={[styles.tireInput, styles.rearLeftInput]}
                    />
                  </View>
                </View>

                {/* Center car image */}
                <Image
                  source={cartopimg}
                  style={styles.carImage}
                  resizeMode="contain"
                />

                {/* Right side tire inputs */}
                <View style={styles.rightTires}>
                  <View style={styles.tireInputContainer}>
                    <TextInput
                      placeholder="FR"
                      value={manualTireSensors.frontRight}
                      onChangeText={(text) =>
                        setManualTireSensors({
                          ...manualTireSensors,
                          frontRight: text,
                        })
                      }
                      style={[styles.tireInput, styles.frontRightInput]}
                    />
                  </View>
                  <View style={styles.tireInputContainer}>
                    <TextInput
                      placeholder="RR"
                      value={manualTireSensors.rearRight}
                      onChangeText={(text) =>
                        setManualTireSensors({
                          ...manualTireSensors,
                          rearRight: text,
                        })
                      }
                      style={[styles.tireInput, styles.rearRightInput]}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.connectButton}
                onPress={handleManualConnect}
              >
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.autoPairingContainer}>
              <Text style={styles.modalTitle}>Auto Pairing</Text>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.autoPairingText}>
                Connection in progress...
              </Text>
            </View>
          )}
        </View>
      </Modal>

      {selectedTab === "uploadedImages" && (
        <View style={styles.tabContent}>
          <TouchableOpacity onPress={pickImages} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>
              Upload Images (License, RC, etc.)
            </Text>
          </TouchableOpacity>
          {uploadedImages.length > 0 && (
            <View style={styles.imageList}>
              {uploadedImages.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img.uri }}
                  style={styles.uploadedImage}
                />
              ))}
            </View>
          )}
        </View>
      )}
      {/*profile model*/}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Ionicons name="close-circle" size={30} color="gray" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Driver Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Driver Name</Text>
            <TextInput
              placeholder="Enter Driver Name"
              value={driverName}
              onChangeText={setDriverName}
              style={styles.inputField}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Vehicle No</Text>
            <TextInput
              placeholder="Enter Vehicle No"
              value={vehicleNo}
              onChangeText={setVehicleNo}
              style={styles.inputField}
            />
          </View>

          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Profile Picture</Text>
          </TouchableOpacity>
          {profileImage && (
            <Image
              source={{ uri: profileImage }}
              style={styles.uploadedImage}
            />
          )}

          <TouchableOpacity onPress={pickImages} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>
              Upload Images (License, RC, etc.)
            </Text>
          </TouchableOpacity>
          {uploadedImages.length > 0 && (
            <View style={styles.imageList}>
              {uploadedImages.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img.uri }}
                  style={styles.uploadedImage}
                />
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveDriverDetails}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#F9F9F9",
  },
  messageItem: {
    backgroundColor: "rgb(163 163 163)",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unread: {
    backgroundColor: "rgb(166 230 163)",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  messageSender: {
    fontWeight: "bold",
  },
  messageTime: {
    fontSize: 12,
    color: "gray",
  },
  messageText: {
    marginTop: 5,
    fontSize: 14,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationsList: {
    marginTop: 10,
  },
  notificationItem: {
    backgroundColor: "rgb(145 222 156)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  notificationText: {
    fontSize: 14,
    color: "#ffff",
  },
  notificationDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  noNotifications: {
    fontSize: 14,
    color: "#999",
    marginTop: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,

    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 15,
    elevation: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  profileSection: {
    alignItems: "center",
    paddingRight: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#E0E0E0",
    borderRadius: 30,
  },
  profileText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  tabsContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedTab: {
    backgroundColor: "#4CAF50",
  },
  tabText: {
    color: "#666",
  },
  selectedTabText: {
    color: "#fff",
  },
  tabContent: {
    padding: 20,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    elevation: 3,
  },
  vehicleTypeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  vehicleTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  vehicleButton: {
    width: "48%",
    marginBottom: 15,
    paddingVertical: 15,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D0D0D0",
  },
  selectedVehicleButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#388E3C",
  },
  vehicleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  inputField: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    fontSize: 16,
  },
  addPairButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addPairButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  recentConnectionsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  recentConnectionsList: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  recentConnectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  connectionDetails: {
    flex: 1,
  },
  connectionText: {
    fontSize: 16,
    color: "#333",
  },
  pairStatus: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pairButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  pairButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF5733",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: "90%",
    alignSelf: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333333",
    alignSelf: "center",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 5,
  },
  inputField: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333333",
    backgroundColor: "#F9F9F9",
  },
  uploadButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#28A745",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 10,
  },
  uploadedImage: {
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },

  addPairButton: {
    backgroundColor: "#2196F3", // Blue background for the button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    elevation: 4, // Add shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  addPairButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  pairButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  pairButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pairStatus: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  pairModalContainer: {
    padding: 25,
    backgroundColor: "#FFFFFF", // Clean white background for clarity
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 12,
    maxWidth: 450,
    alignSelf: "center",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 1.5, // Adds space for a modern look
  },

  methodButton: {
    backgroundColor: "#3E8E41", // Darker green for professional tone
    paddingVertical: 16,
    borderRadius: 10,
    marginVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  methodButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1, // Slight letter spacing for modern touch
  },

  manualPairingContainer: {
    alignItems: "center",
    paddingBottom: 30,
  },

  carContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 25,
    position: "relative",
  },

  carImage: {
    width: 160,
    height: 160,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 1,
  },

  leftTires: {
    position: "absolute",
    left: -25,
    top: "30%",
    transform: [{ translateY: -50 }],
    justifyContent: "space-between",
    height: 180,
  },

  rightTires: {
    position: "absolute",
    right: -25,
    top: "30%",
    transform: [{ translateY: -50 }],
    justifyContent: "space-around",
    height: 180,
  },

  tireInputContainer: {
    width: 70,
    height: 70,
    marginBottom: 14,
  },

  tireInput: {
    backgroundColor: "#F5F5F5", // Subtle light grey input background
    borderWidth: 1.5,
    borderColor: "#D1D1D1", // Softer border color
    borderRadius: 10,
    width: "100%",
    height: "100%",
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },

  connectButton: {
    backgroundColor: "#3E8E41",
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  connectButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },

  autoPairingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },

  autoPairingText: {
    fontSize: 18,
    color: "#4CAF50", // Green for active status
    marginTop: 15,
    textAlign: "center",
    fontWeight: "500",
  },

  autoPairingIndicator: {
    marginVertical: 20,
  },
  logoutButton: {
    backgroundColor: "#FF4C4C", // Red color for logout
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20, // Space from other elements
    width: "100%", // Adjust width to fit nicely
    alignSelf: "center", // Center horizontally
    shadowColor: "#000", // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logoutButtonText: {
    color: "#FFFFFF", // White text color
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center", // Center the text
  },
});

export default IndividualDriverPage;
