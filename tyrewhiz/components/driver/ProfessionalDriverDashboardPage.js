import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";

import { launchImageLibrary } from "react-native-image-picker";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "../TranslationContext";
import { useFocusEffect } from "@react-navigation/native";
import { drivertype } from "../../assets/drivertype.png";
import ProfessionalDriverMessages from "./ProfessionalDriverMessages";
import ProfessionalDriverNotifications from "./ProfessionalDriverNotifications";
import novehicles from "../../assets/novehicles.png";
const defaultImage = require("../../assets/logo.png");

const ProfessionalDriverDashboardPage = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("connection");
  const [isModalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [driverName, setDriverName] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [orgId, setOrgId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedVehicles, setConnectedVehicles] = useState([]);
  const { translatedText, updateTranslations } = useTranslation();

  useFocusEffect(
    React.useCallback(() => {
      updateTranslations([
        "Please enter both Organization ID and Vehicle ID",
        "Successfully connected to vehicle!",
        "Please fill in all required fields",
        "Driver details saved successfully!",
        "Professional Driver",
        "Edit Profile",
        "Notifications",
        "Connection",
        "Messages",
        "Connect to Vehicle",
        "Organization ID",
        "Vehicle ID",
        "Connect",
        "Connected Vehicles",
        "Organization: ",
        "Vehicle ID:",
        "Connected: ",
        "Monitor",
        "Professional Driver Details",
        "Upload Profile Picture",
        "Driver Name",
        "License Number",
        "Save Details",
        "Logout",
      ]);
    }, [])
  );

  // Sample messages data
  const [messages] = useState([
    {
      id: 1,
      sender: "Fleet Manager",
      message: "New route assignment for tomorrow.",
      time: "10:30 AM",
      unread: true,
    },
    {
      id: 2,
      sender: "Dispatch",
      message: "Please confirm your arrival at destination.",
      time: "Yesterday",
      unread: false,
    },
  ]);

  // Sample notifications data
  const [notifications] = useState([
    {
      id: 1,
      message: "Successfully connected to Vehicle XYZ-123",
      date: "2025-01-02 10:30 AM",
    },
    {
      id: 2,
      message: "Route schedule updated for tomorrow",
      date: "2025-01-01 08:45 AM",
    },
  ]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please allow access to photos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    navigation.navigate("UserTypeSelectionPage");
  };

  const handleConnect = () => {
    if (!orgId || !vehicleId) {
      alert(
        translatedText["Please enter both Organization ID and Vehicle ID"] ||
          "Please enter both Organization ID and Vehicle ID"
      );
      return;
    }

    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setConnectedVehicles([
        ...connectedVehicles,
        {
          orgId,
          vehicleId,
          timestamp: new Date().toLocaleString(),
        },
      ]);
      setOrgId("");
      setVehicleId("");
      alert(
        translatedText["Successfully connected to vehicle!"] ||
          "Successfully connected to vehicle!"
      );
    }, 2000);
  };

  const saveDriverDetails = () => {
    if (!driverName || !licenseNo) {
      alert(
        translatedText["Please fill in all required fields"] ||
          "Please fill in all required fields"
      );
      return;
    }
    alert(
      translatedText["Driver details saved successfully!"] ||
        "Driver details saved successfully!"
    );
    toggleModal();
  };

  const handleRemoveVehicle = (index) => {
    const updatedVehicles = connectedVehicles.filter((_, i) => i !== index);
    setConnectedVehicles(updatedVehicles);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#3b1a78" />
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate("DriverPage")}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            {translatedText["Professional Driver"] || "Professional Driver"}
          </Text>
          <TouchableOpacity onPress={toggleModal} style={styles.profileSection}>
            <Image
              source={profileImage ? { uri: profileImage } : defaultImage}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.roleContainer}>
          <Text style={styles.role}>
            {translatedText["Logged in as: Driver"] || "Logged in as: Driver"}
          </Text>
        </View>

        {/* Tabs */}
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
              color={selectedTab === "notifications" ? "#fff" : "#555"}
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
              selectedTab === "connection" && styles.selectedTab,
            ]}
            onPress={() => setSelectedTab("connection")}
          >
            <Ionicons
              name="link"
              size={22}
              color={selectedTab === "connection" ? "#fff" : "#555"}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === "connection" && styles.selectedTabText,
              ]}
            >
              {translatedText["Connection"] || "Connection"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "messages" && styles.selectedTab,
            ]}
            onPress={() => setSelectedTab("messages")}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={22}
              color={selectedTab === "messages" ? "#fff" : "#555"}
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

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Connection Tab Content */}
          {selectedTab === "connection" && (
            <View style={styles.tabContent}>
              <View style={styles.connectionForm}>
                <Text style={styles.formTitle}>
                  {translatedText["Connect to Vehicle"] || "Connect to Vehicle"}
                </Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="business"
                    size={22}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={
                      translatedText["Organization ID"] || "Organization ID"
                    }
                    value={orgId}
                    onChangeText={setOrgId}
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="car"
                    size={22}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={translatedText["Vehicle ID"] || "Vehicle ID"}
                    value={vehicleId}
                    onChangeText={setVehicleId}
                    placeholderTextColor="#999"
                  />
                </View>
                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={handleConnect}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons
                        name="link"
                        size={20}
                        color="#fff"
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.connectButtonText}>
                        {translatedText["Connect"] || "Connect"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Connected Vehicles List */}
              {connectedVehicles.length === 0 ? (
                <View style={styles.noVehiclesContainer}>
                  <Image source={novehicles} style={styles.noVehiclesImage} />
                  <Text style={styles.noVehiclesText}>
                    {translatedText["No connected vehicles"] ||
                      "No connected vehicles"}
                  </Text>
                  <Text style={styles.noVehiclesSubText}>
                    Connect to a vehicle to start monitoring
                  </Text>
                </View>
              ) : (
                <View style={styles.connectedVehicles}>
                  <Text style={styles.sectionTitle}>
                    {translatedText["Connected Vehicles"] ||
                      "Connected Vehicles"}
                  </Text>
                  {connectedVehicles.map((vehicle, index) => (
                    <View key={index} style={styles.vehicleItem}>
                      <View style={styles.vehicleIcon}>
                        <MaterialIcons
                          name="local-shipping"
                          size={28}
                          color="#3b1a78"
                        />
                      </View>
                      <View style={styles.vehicleInfo}>
                        <Text style={styles.vehicleText}>
                          <Text style={styles.vehicleLabel}>
                            {translatedText["Organization: "] ||
                              "Organization: "}
                          </Text>
                          {vehicle.orgId}
                        </Text>
                        <Text style={styles.vehicleText}>
                          <Text style={styles.vehicleLabel}>
                            {translatedText["Vehicle ID:"] || "Vehicle ID:"}
                          </Text>{" "}
                          {vehicle.vehicleId}
                        </Text>
                        <Text style={styles.timestampText}>
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color="#666"
                          />{" "}
                          {vehicle.timestamp}
                        </Text>
                      </View>
                      <View style={styles.vehicleActions}>
                        <TouchableOpacity
                          style={styles.monitorButton}
                          onPress={() =>
                            navigation.navigate("MonitoringPage", vehicle)
                          }
                        >
                          <FontAwesome5
                            name="chart-line"
                            size={14}
                            color="#fff"
                          />
                          <Text style={styles.monitorButtonText}>
                            {translatedText["Monitor"] || "Monitor"}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleRemoveVehicle(index)}
                        >
                          <Ionicons name="close" size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Tab Content */}
          {selectedTab === "messages" && (
            <ProfessionalDriverMessages messages={messages} />
          )}
          {selectedTab === "notifications" && (
            <ProfessionalDriverNotifications notifications={notifications} />
          )}
        </ScrollView>

        {/* Profile Modal */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropTransitionOutTiming={0}
          style={styles.modalStyle}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {translatedText["Professional Driver Details"] ||
                  "Professional Driver Details"}
              </Text>
              <TouchableOpacity
                onPress={toggleModal}
                style={styles.closeButton}
              >
                <Ionicons name="close-circle" size={30} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileImageContainer}>
              <Image
                source={profileImage ? { uri: profileImage } : defaultImage}
                style={styles.modalProfileImage}
              />
              <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                <Ionicons
                  name="camera"
                  size={22}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.uploadButtonText}>
                  {translatedText["Change Photo"] || "Change Photo"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>Personal Information</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="person"
                  size={22}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder={translatedText["Driver Name"] || "Driver Name"}
                  value={driverName}
                  onChangeText={setDriverName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="card"
                  size={22}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder={
                    translatedText["License Number"] || "License Number"
                  }
                  value={licenseNo}
                  onChangeText={setLicenseNo}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveDriverDetails}
            >
              <Ionicons
                name="save"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.saveButtonText}>
                {translatedText["Save Details"] || "Save Details"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.logoutButtonText}>
                {translatedText["Logout"] || "Logout"}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#3b1a78", // Primary color for status bar area
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3b1a78", // Deeper purple for better contrast
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  profileSection: {
    padding: 4,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  roleContainer: {
    padding: 10,
    backgroundColor: "#e8e6f2", // Lighter purple background
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  role: {
    fontSize: 14,
    color: "#3b1a78",
    fontWeight: "500",
    textAlign: "center",
  },
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
    top: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  selectedTab: {
    backgroundColor: "#5c2ec9", // Lighter purple for selected tab
    borderBottomWidth: 3,
    borderBottomColor: "#3b1a78",
  },
  tabText: {
    color: "#555",
    fontWeight: "500",
    marginLeft: 6,
  },
  selectedTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  tabContent: {
    padding: 16,
  },
  connectionForm: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  connectButton: {
    backgroundColor: "#3b1a78",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  connectButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  noVehiclesContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noVehiclesImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    opacity: 0.8,
  },
  noVehiclesText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 16,
  },
  noVehiclesSubText: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
    textAlign: "center",
  },
  connectedVehicles: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    paddingHorizontal: 4,
  },
  vehicleItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  vehicleIcon: {
    backgroundColor: "#e8e6f2",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleLabel: {
    fontWeight: "bold",
    color: "#555",
  },
  vehicleText: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  timestampText: {
    fontSize: 12,
    color: "#666",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  vehicleActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  monitorButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  monitorButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    padding: 8,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  modalStyle: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#e8e6f2",
  },
  formSection: {
    marginBottom: 20,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 12,
  },
  modalInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: "#5c2ec9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfessionalDriverDashboardPage;
