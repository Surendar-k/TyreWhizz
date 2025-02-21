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
import IndividualDriverMessages from "./IndividualDriverMessages";
import IndividualDriverNotifications from "./IndividualDriverNotifications";
import { useTranslation } from "../TranslationContext";
import { useFocusEffect } from "@react-navigation/native";
const cartopimg = require("../../assets/car-top-view.png");
const defaultImage = require("../../assets/logo.png");
import { ActivityIndicator } from "react-native";

const IndividualDriverDashboardPage = () => {
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
  const { translatedText, updateTranslations } = useTranslation(); // ✅ Added Translation Support

  useFocusEffect(
    React.useCallback(() => {
      updateTranslations([
        "Logged in as: Driver",
        "Edit Profile",
        "Messages",
        "Select Vehicle Type",
        "2-Wheeler",
        "4-Wheeler",
        "6-Wheeler",
        "8-Wheeler",
        "Add Pair Connection",
        "Recent Paired Connections:",
        "Pair",
        "Delete",
        "No recent connections.",
        "Select Pairing Method",
        "Manual",
        "Auto Pair",
        "Manual Pairing",
        "Connect",
        "Auto Pairing",
        "Connection in progress...",
        "Upload Images (License, RC, etc.)",
        "Driver Details",
        "Driver Name",
        "Vehicle No",
        "Upload Profile Picture",
        "Save",
        "Logout",
        "Notifications",
        "Enter Driver Name",
        "Enter Vehicle No",
        "Sensor ID/Vehicle ID",
      ]);
    }, [])
  );

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
        mediaType: "photo", // Pick photos
        quality: 1, // High quality
        selectionLimit: 1, // Limit to 1 image
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.error("Image Picker Error: ", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          console.log("Image selected: ", response.assets[0]);
          setProfileImage(response.assets[0].uri); // Set the selected image URI
        }
      }
    );
  };

  const pickImages = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
        selectionLimit: 5, // Allow multiple selections
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.error("Image Picker Error: ", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          console.log("Images selected: ", response.assets);
          setUploadedImages(response.assets); // Set multiple selected images
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
          <Text style={styles.backButtonText}>❮</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>TyreWhizz</Text>
        <TouchableOpacity onPress={toggleModal} style={styles.profileSection}>
          <Image
            source={profileImage ? { uri: profileImage } : defaultImage}
            style={styles.profileImage}
          />
          <Text style={styles.profileText}>
            {translatedText["Edit Profile"] || "Edit Profile"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.roleContainer}>
        <Text style={styles.role}>
          {translatedText["Logged in as: Driver"] || "Logged in as: Driver"}
        </Text>
      </View>
      <View style={styles.tabsContainer}>
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
            {translatedText["Notifications"] || "Notifications"}
          </Text>
        </TouchableOpacity>

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
            {translatedText["Pair"] || "Pair"}
          </Text>
        </TouchableOpacity>

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
            {translatedText["Messages"] || "Messages"}
          </Text>
        </TouchableOpacity>
      </View>

      {/*message content*/}
      {selectedTab === "messages" && (
        <IndividualDriverMessages messages={messages} />
      )}

      {selectedTab === "notifications" && (
        <IndividualDriverNotifications notifications={notifications} />
      )}
      {/*pairconnection tab content */}
      {selectedTab === "pairConnection" && (
        <View style={styles.tabContent}>
          <Text style={styles.vehicleTypeText}>
            {translatedText["Select Vehicle Type"] || "Select Vehicle Type"}
          </Text>
          <View style={styles.vehicleTypeGrid}>
            <TouchableOpacity
              onPress={() => setVehicleType("2wheeler")}
              style={[
                styles.vehicleButton,
                vehicleType === "2wheeler" && styles.selectedVehicleButton,
              ]}
            >
              <Text style={styles.vehicleButtonText}>
                {translatedText["2-Wheeler"] || "2-Wheeler"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVehicleType("4wheeler")}
              style={[
                styles.vehicleButton,
                vehicleType === "4wheeler" && styles.selectedVehicleButton,
              ]}
            >
              <Text style={styles.vehicleButtonText}>
                {translatedText["4-Wheeler"] || "4-Wheeler"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVehicleType("6wheeler")}
              style={[
                styles.vehicleButton,
                vehicleType === "6wheeler" && styles.selectedVehicleButton,
              ]}
            >
              <Text style={styles.vehicleButtonText}>
                {translatedText["6-Wheeler"] || "2-Wheeler"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVehicleType("8wheeler")}
              style={[
                styles.vehicleButton,
                vehicleType === "8wheeler" && styles.selectedVehicleButton,
              ]}
            >
              <Text style={styles.vehicleButtonText}>
                {translatedText["8-Wheeler"] || "2-Wheeler"}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder={
              translatedText["Sensor ID/Vehicle ID"] || "Sensor ID/Vehicle ID"
            }
            value={sensorId}
            onChangeText={setSensorId}
            style={styles.inputField}
          />
          <TouchableOpacity
            onPress={handleSensorIdSubmit}
            style={styles.addPairButton}
          >
            <Text style={styles.addPairButtonText}>
              {translatedText["Add Pair Connection"] || "Add Pair Connection"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.recentConnectionsText}>
            {translatedText["Recent Paired Connections:"] ||
              "Recent Paired Connections:"}
          </Text>
          {recentConnections.length > 0 ? (
            <View style={styles.recentConnectionsList}>
              {recentConnections.map((connection, index) => (
                <View key={index} style={styles.recentConnectionItem}>
                  <View>
                    <Text>
                      {`Sensor ID/Vehicle ID: ${connection.sensorId}`}{" "}
                    </Text>
                    <Text>{`Vehicle: ${connection.vehicleType}`}</Text>
                    <Text>
                      Status:{" "}
                      <Text style={styles.pairStatus}>
                        {connection.paired ? "Paired" : "Not Paired"}
                      </Text>
                    </Text>
                    <View style={styles.buttonContainer}>
                      {!connection.paired && (
                        <TouchableOpacity
                          onPress={() => handlePairClick(index)}
                          style={styles.pairButton}
                        >
                          <Text style={styles.pairButtonText}>
                            {translatedText["Pair"] || "Pair"}
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => handleDeleteConnection(index)}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteButtonText}>
                          {translatedText["Delete"] || "Delete"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text>
              {translatedText["No recent connections."] ||
                "No recent connections."}
            </Text>
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
              <Text style={styles.modalTitle}>
                {translatedText["Select Pairing Method"] ||
                  "Select Pairing Method"}
              </Text>
              <TouchableOpacity
                style={styles.methodButton}
                onPress={handleManualPair}
              >
                <Text style={styles.methodButtonText}>
                  {translatedText["Manual"] || "Manual"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.methodButton}
                onPress={handleAutoPair}
              >
                <Text style={styles.methodButtonText}>
                  {translatedText["Auto Pair"] || "Auto Pair"}
                </Text>
              </TouchableOpacity>
            </>
          ) : selectedPairType === "manual" ? (
            <View style={styles.manualPairingContainer}>
              <Text style={styles.modalTitle}>
                {translatedText["Manual Pairing"] || "Manual Pairing"}
              </Text>

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
                <Text style={styles.connectButtonText}>
                  {translatedText["Connect"] || "Connect"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.autoPairingContainer}>
              <Text style={styles.modalTitle}>
                {translatedText["Auto Pairing"] || "Auto Pairing"}
              </Text>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.autoPairingText}>
                {translatedText["Connection in progress..."] ||
                  "Connection in progress..."}
              </Text>
            </View>
          )}
        </View>
      </Modal>

      {selectedTab === "uploadedImages" && (
        <View style={styles.tabContent}>
          <TouchableOpacity onPress={pickImages} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>
              {translatedText["Upload Images (License, RC, etc.)"] ||
                "Upload Images (License, RC, etc.)"}
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

          <Text style={styles.modalTitle}>
            {translatedText["Driver Details"] || "Driver Details"}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {translatedText["Driver Name"] || "Driver Name"}
            </Text>
            <TextInput
              placeholder={
                translatedText["Enter Driver Name"] || "Enter Driver Name"
              }
              value={driverName}
              onChangeText={setDriverName}
              style={styles.inputField}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {translatedText["Vehicle No"] || "Vehicle No"}
            </Text>
            <TextInput
              placeholder={
                translatedText["Enter Vehicle No"] || "Enter Vehicle No"
              }
              value={vehicleNo}
              onChangeText={setVehicleNo}
              style={styles.inputField}
            />
          </View>

          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>
              {translatedText["Upload Profile Picture"] ||
                "Upload Profile Picture"}
            </Text>
          </TouchableOpacity>
          {profileImage && (
            <Image
              source={{ uri: profileImage }}
              style={styles.uploadedImage}
            />
          )}

          <TouchableOpacity onPress={pickImages} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>
              {translatedText["Upload Images (License, RC, etc.)"] ||
                "Upload Images (License, RC, etc.)"}
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
            <Text style={styles.saveButtonText}>
              {translatedText["Save"] || "Save"}
            </Text>
          </TouchableOpacity>
          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>
              {translatedText["Logout"] || "Logout"}
            </Text>
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
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgb(28 10 62)",
    padding: 15,
    elevation: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  roleContainer: {
    padding: 10,
    backgroundColor: "#a296ba49",
    alignItems: "center",
  },
  role: { fontSize: 18, color: "rgb(42 10 62)" },
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
    backgroundColor: "#C6C6C649",
    elevation: 2,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  selectedTab: {
    backgroundColor: "rgb(90 50 177)",
  },
  tabText: {
    color: "#333",
  },
  selectedTabText: {
    color: "#fff",
  },
  tabContent: {
    padding: 20,
    backgroundColor: "rgb(201 201 201)", // Updated background color
    borderRadius: 10,

    // Box shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    // Elevation for Android
    elevation: 5,
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
    backgroundColor: "#321CD289",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D0D0D0",

    // Box shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Elevation for Android
    elevation: 5,
  },

  selectedVehicleButton: {
    backgroundColor: "rgb(110 89 149)",
    borderColor: "#388E3C",
  },
  vehicleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
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
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addPairButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
  recentConnectionsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    color: "#333",
  },
  recentConnectionsList: {
    backgroundColor: "rgba(50, 28, 210, 0.54)",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  recentConnectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15, // Add some padding for spacing
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9", // Optional: Better visibility
    borderRadius: 8,
    marginVertical: 8, // Add spacing between rows
    elevation: 2, // For subtle shadow
  },
  recentConnectionDetails: {
    flex: 1, // Allow details to take up remaining space
    marginRight: 10, // Add space between details and buttons
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
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
    flexWrap: "wrap", // Allows wrapping
    justifyContent: "space-between", // Distributes buttons evenly
    padding: 10, // Adds padding around buttons
  },
  pairButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    margin: 5, // Adds space between buttons
  },
  pairButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center", // Ensures text is centered
  },
  deleteButton: {
    backgroundColor: "#FF5733",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    margin: 5, // Adds space between buttons
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center", // Ensures text is centered
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
    backgroundColor: "rgb(88 217 108)", // Blue background for the button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    elevation: 4, // Add shadow for depth
    shadowColor: "rgb(88 217 108)",
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

export default IndividualDriverDashboardPage;
