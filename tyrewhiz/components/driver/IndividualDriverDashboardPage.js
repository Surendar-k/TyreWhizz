import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { launchImageLibrary } from "react-native-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import IndividualDriverMessages from "./IndividualDriverMessages";
import IndividualDriverNotifications from "./IndividualDriverNotifications";
import { useTranslation } from "../TranslationContext";
import { useFocusEffect } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const cartopimg = require("../../assets/car-top-view.png");
const defaultImage = require("../../assets/logo.png");

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
  const { translatedText, updateTranslations } = useTranslation();

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
      Alert.alert("Error", "Please fill all tire sensor IDs");
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
        selectionLimit: 1, // Limit to 1 image
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.error("Image Picker Error: ", response.errorMessage);
          Alert.alert("Error", response.errorMessage);
        } else if (response.assets?.length > 0) {
          console.log("Profile Image selected: ", response.assets[0]);
          setProfileImage(response.assets[0].uri); // Set only 1 profile image
        }
      }
    );
  };

  // Function to pick multiple images (up to 5)
  const pickImages = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
        selectionLimit: 5, // Allow up to 5 images at a time
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.error("Image Picker Error: ", response.errorMessage);
          Alert.alert("Error", response.errorMessage);
        } else if (response.assets?.length > 0) {
          console.log("New Images selected: ", response.assets);

          // Append new images while ensuring total count does not exceed 5
          setUploadedImages((prevImages) => {
            const totalImages = [...prevImages, ...response.assets].slice(0, 5);
            return totalImages;
          });
        }
      }
    );
  };

  const saveDriverDetails = () => {
    Alert.alert("Success", "Driver details saved successfully!");
    toggleModal();
  };

  const handleLogout = () => {
    navigation.navigate("UserTypeSelectionPage"); // Navigate to the User Type Selection Page
  };

  const handleSensorIdSubmit = () => {
    if (!sensorId) {
      Alert.alert("Error", "Please enter a Sensor ID");
      return;
    } // Prevent adding empty sensor IDs
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
          <Ionicons name="chevron-back" size={28} color="#fff" />
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
          <Ionicons
            name="notifications"
            size={22}
            color={selectedTab === "notifications" ? "#fff" : "#444"}
          />
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
          <Ionicons
            name="link"
            size={22}
            color={selectedTab === "pairConnection" ? "#fff" : "#444"}
          />
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
          <Ionicons
            name="chatbubble-ellipses"
            size={22}
            color={selectedTab === "messages" ? "#fff" : "#444"}
          />
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
          <Text style={styles.sectionTitle}>
            {translatedText["Select Vehicle Type"] || "Select Vehicle Type"}
          </Text>

          <View style={styles.vehicleTypeContainer}>
            <View style={styles.vehicleTypeGrid}>
              <TouchableOpacity
                onPress={() => setVehicleType("2wheeler")}
                style={[
                  styles.vehicleButton,
                  vehicleType === "2wheeler" && styles.selectedVehicleButton,
                ]}
              >
                <MaterialCommunityIcons
                  name="motorbike"
                  size={36}
                  color={vehicleType === "2wheeler" ? "#fff" : "#333"}
                />
                <Text
                  style={[
                    styles.vehicleButtonText,
                    vehicleType === "2wheeler" && styles.selectedVehicleText,
                  ]}
                >
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
                <MaterialCommunityIcons
                  name="car"
                  size={36}
                  color={vehicleType === "4wheeler" ? "#fff" : "#333"}
                />
                <Text
                  style={[
                    styles.vehicleButtonText,
                    vehicleType === "4wheeler" && styles.selectedVehicleText,
                  ]}
                >
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
                <MaterialCommunityIcons
                  name="truck"
                  size={36}
                  color={vehicleType === "6wheeler" ? "#fff" : "#333"}
                />
                <Text
                  style={[
                    styles.vehicleButtonText,
                    vehicleType === "6wheeler" && styles.selectedVehicleText,
                  ]}
                >
                  {translatedText["6-Wheeler"] || "6-Wheeler"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setVehicleType("8wheeler")}
                style={[
                  styles.vehicleButton,
                  vehicleType === "8wheeler" && styles.selectedVehicleButton,
                ]}
              >
                <MaterialCommunityIcons
                  name="truck-fast"
                  size={36}
                  color={vehicleType === "8wheeler" ? "#fff" : "#333"}
                />
                <Text
                  style={[
                    styles.vehicleButtonText,
                    vehicleType === "8wheeler" && styles.selectedVehicleText,
                  ]}
                >
                  {translatedText["8-Wheeler"] || "8-Wheeler"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.pairingSection}>
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
          </View>

          <Text style={styles.sectionTitle}>
            {translatedText["Recent Paired Connections:"] ||
              "Recent Paired Connections:"}
          </Text>

          {recentConnections.length > 0 ? (
            <View style={styles.recentConnectionsList}>
              {recentConnections.map((connection, index) => (
                <View key={index} style={styles.connectionCard}>
                  <View style={styles.connectionDetails}>
                    <View style={styles.connectionHeader}>
                      <Text style={styles.connectionId}>
                        {`ID: ${connection.sensorId}`}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          connection.paired
                            ? styles.pairedBadge
                            : styles.unpairedBadge,
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {connection.paired ? "Paired" : "Not Paired"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.vehicleInfo}>
                      <MaterialCommunityIcons
                        name={
                          connection.vehicleType === "2wheeler"
                            ? "motorbike"
                            : connection.vehicleType === "6wheeler" ||
                              connection.vehicleType === "8wheeler"
                            ? "truck"
                            : "car"
                        }
                        size={20}
                        color="#555"
                      />
                      <Text style={styles.vehicleTypeText}>
                        {`${connection.vehicleType}`}
                      </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                      {!connection.paired && (
                        <TouchableOpacity
                          onPress={() => handlePairClick(index)}
                          style={styles.pairButton}
                        >
                          <Ionicons name="link" size={16} color="#fff" />
                          <Text style={styles.pairButtonText}>
                            {translatedText["Pair"] || "Pair"}
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => handleDeleteConnection(index)}
                        style={styles.deleteButton}
                      >
                        <Ionicons name="trash-outline" size={16} color="#fff" />
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
            <View style={styles.emptyContainer}>
              <Ionicons name="link-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>
                {translatedText["No recent connections."] ||
                  "No recent connections."}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Pairing Modal */}
      <Modal
        isVisible={isPairModalVisible}
        onBackdropPress={() => !isAutoPairing && setPairModalVisible(false)}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.modal}
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
                <Ionicons
                  name="create-outline"
                  size={24}
                  color="#fff"
                  style={styles.methodIcon}
                />
                <Text style={styles.methodButtonText}>
                  {translatedText["Manual"] || "Manual"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.methodButton}
                onPress={handleAutoPair}
              >
                <Ionicons
                  name="flash-outline"
                  size={24}
                  color="#fff"
                  style={styles.methodIcon}
                />
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
                      style={styles.tireInput}
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
                      style={styles.tireInput}
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
                      style={styles.tireInput}
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
                      style={styles.tireInput}
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
              <ActivityIndicator
                size="large"
                color="#4CAF50"
                style={styles.pairingIndicator}
              />
              <Text style={styles.autoPairingText}>
                {translatedText["Connection in progress..."] ||
                  "Connection in progress..."}
              </Text>
            </View>
          )}
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Ionicons name="close-circle" size={28} color="#777" />
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
              style={styles.modalInput}
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
              style={styles.modalInput}
            />
          </View>

          <View style={styles.profileImageSection}>
            <Text style={styles.inputLabel}>
              {translatedText["Profile Picture"] || "Profile Picture"}
            </Text>

            <View style={styles.profileImageContainer}>
              <Image
                source={profileImage ? { uri: profileImage } : defaultImage}
                style={styles.modalProfileImage}
              />

              <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                <Ionicons
                  name="camera"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.uploadButtonText}>
                  {translatedText["Upload Profile Picture"] ||
                    "Upload Profile Picture"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.documentSection}>
            <Text style={styles.inputLabel}>
              {translatedText["Documents"] || "Documents"}
            </Text>

            <TouchableOpacity onPress={pickImages} style={styles.uploadButton}>
              <Ionicons
                name="document"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.uploadButtonText}>
                {translatedText["Upload Images (License, RC, etc.)"] ||
                  "Upload Images (License, RC, etc.)"}
              </Text>
            </TouchableOpacity>

            {uploadedImages.length > 0 && (
              <View style={styles.imageList}>
                {uploadedImages.map((img, index) => (
                  <View key={index} style={styles.documentImageContainer}>
                    <Image
                      source={{ uri: img.uri }}
                      style={styles.documentImage}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveDriverDetails}
            >
              <Text style={styles.saveButtonText}>
                {translatedText["Save"] || "Save"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>
                {translatedText["Logout"] || "Logout"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },

  // Header styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3b1a78",
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  profileText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },

  // Role container
  roleContainer: {
    backgroundColor: "#e8e6f2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  role: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
    textAlign: "center",
  },

  // Tab navigation
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  selectedTab: {
    backgroundColor: "rgb(135, 85, 255)", // Lighter purple for selected tab
    borderBottomWidth: 3,
    borderBottomColor: "#3b1a78",
  },
  tabText: {
    fontSize: 14,
    color: "#444",
    marginLeft: 6,
    fontWeight: "500",
  },
  selectedTabText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // Tab content
  tabContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  // Section titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
  },

  // Vehicle type selection
  vehicleTypeContainer: {
    marginBottom: 24,
  },
  vehicleTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  vehicleButton: {
    width: "48%",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  selectedVehicleButton: {
    backgroundColor: "#4E1980",
    borderColor: "#2954CC",
  },
  vehicleButtonText: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 8,
    color: "#333",
  },
  selectedVehicleText: {
    color: "#ffffff",
  },

  // Pairing section
  pairingSection: {
    marginBottom: 24,
  },
  inputField: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  addPairButton: {
    backgroundColor: "rgb(59, 26, 120)",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#3563E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addPairButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Connection cards
  recentConnectionsList: {
    marginBottom: 16,
  },
  connectionCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  connectionDetails: {
    padding: 16,
  },
  connectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  connectionId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  pairedBadge: {
    backgroundColor: "#DCFCE7",
  },
  unpairedBadge: {
    backgroundColor: "#FFE4E6",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#166534",
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  vehicleTypeText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  pairButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3563E9",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 10,
  },
  pairButtonText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "500",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "500",
  },

  // Empty state
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#94A3B8",
    marginTop: 16,
    textAlign: "center",
  },

  // Modal styles
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
  },
  pairModalContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "70%",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 24,
    textAlign: "center",
  },

  // Profile modal inputs
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },

  // Profile image section
  profileImageSection: {
    marginBottom: 20,
  },
  profileImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  modalProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  // Document section
  documentSection: {
    marginBottom: 24,
  },
  uploadButton: {
    flexDirection: "row",
    backgroundColor: "#3563E9",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#3563E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  uploadButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "500",
  },
  imageList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  documentImageContainer: {
    width: "30%",
    aspectRatio: 1,
    marginRight: "5%",
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  documentImage: {
    width: "100%",
    height: "100%",
  },

  // Action buttons
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "rgb(76, 175, 80)",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginRight: 8,
    elevation: 2,
    shadowColor: "#3563E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    flex: 1,
    backgroundColor: "rgb(255, 77, 77)",
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginLeft: 8,
  },
  logoutButtonText: {
    color: "#475569",
    fontSize: 16,
    fontWeight: "600",
  },

  // Manual pairing styles
  manualPairingContainer: {
    alignItems: "center",
  },
  carContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  leftTires: {
    marginRight: 16,
  },
  rightTires: {
    marginLeft: 16,
  },
  tireInputContainer: {
    marginVertical: 16,
  },
  tireInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: 80,
    textAlign: "center",
  },
  carImage: {
    width: 160,
    height: 100,
  },
  connectButton: {
    backgroundColor: "#3563E9",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#3563E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  connectButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Auto pairing styles
  autoPairingContainer: {
    alignItems: "center",
    paddingVertical: 36,
  },
  pairingIndicator: {
    marginVertical: 24,
  },
  autoPairingText: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
  },

  // Pairing method selection
  methodButton: {
    flexDirection: "row",
    backgroundColor: "#3563E9",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: "100%",
    elevation: 2,
    shadowColor: "#3563E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  methodButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  methodIcon: {
    marginRight: 12,
  },
});
export default IndividualDriverDashboardPage;
