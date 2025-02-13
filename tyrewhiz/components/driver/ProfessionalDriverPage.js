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
} from "react-native";
import Modal from "react-native-modal";
import { launchImageLibrary } from "react-native-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "../TranslationContext";
import { useFocusEffect } from "@react-navigation/native";

const defaultImage = require("../../assets/logo.png");

const ProfessionalDriverPage = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("connection");
  const [isModalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [driverName, setDriverName] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [orgId, setOrgId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedVehicles, setConnectedVehicles] = useState([]);
  const { translatedText, updateTranslations } = useTranslation(); // ✅ Added Translation Support

   useFocusEffect(React.useCallback(() =>{
    updateTranslations([
          "Please enter both Organization ID and Vehicle ID",
          "Successfully connected to vehicle!","Please fill in all required fields","Driver details saved successfully!","Professional Driver","Edit Profile",
          "Notifications","Connection","Messages","Connect to Vehicle","Organization ID","Vehicle ID","Connect","Connected Vehicles","Organization: ","Vehicle ID:",
          "Connected: ","Monitor","Professional Driver Details","Upload Profile Picture","Driver Name","License Number","Save Details","Logout"
    ]);
  },[]));
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
  const handleLogout = () => {
    navigation.navigate("UserTypeSelectionPage"); // Navigate to the User Type Selection Page
  };
  const handleConnect = () => {
    if (!orgId || !vehicleId) {
      alert(translatedText["Please enter both Organization ID and Vehicle ID"]||"Please enter both Organization ID and Vehicle ID");
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
      alert(translatedText["Successfully connected to vehicle!"]||"Successfully connected to vehicle!");
    }, 2000);
  };

  const saveDriverDetails = () => {
    if (!driverName || !licenseNo) {
      alert(translatedText["Please fill in all required fields"]||"Please fill in all required fields");
      return;
    }
    alert(translatedText["Driver details saved successfully!"]||"Driver details saved successfully!");
    toggleModal();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("DriverPage")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{translatedText["Professional Driver"]||"Professional Driver"}</Text>
        <TouchableOpacity onPress={toggleModal} style={styles.profileSection}>
          <Image
            source={profileImage ? { uri: profileImage } : defaultImage}
            style={styles.profileImage}
          />
          <Text style={styles.profileText}>{translatedText["Edit Profile"]||"Edit Profile"}</Text>
        </TouchableOpacity>
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
          <Text
            style={[
              styles.tabText,
              selectedTab === "notifications" && styles.selectedTabText,
            ]}
          >
            {translatedText["Notifications"]||"Notifications"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "connection" && styles.selectedTab,
          ]}
          onPress={() => setSelectedTab("connection")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "connection" && styles.selectedTabText,
            ]}
          >
            {translatedText["Connection"]||"Connection"}
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
            {translatedText["Messages"]||"Messages"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Connection Tab Content */}
      {selectedTab === "connection" && (
        <View style={styles.tabContent}>
          <View style={styles.connectionForm}>
            <Text style={styles.formTitle}>{translatedText["Connect to Vehicle"]||"Connect to Vehicle"}</Text>
            <TextInput
              style={styles.input}
              placeholder={translatedText["Organization ID"]||"Organization ID"}
              value={orgId}
              onChangeText={setOrgId}
            />
            <TextInput
              style={styles.input}
              placeholder={translatedText["Vehicle ID"]||"Vehicle ID"}
              value={vehicleId}
              onChangeText={setVehicleId}
            />
            <TouchableOpacity
              style={styles.connectButton}
              onPress={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.connectButtonText}>{translatedText["Connect"]||"Connect"}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Connected Vehicles List */}
          {connectedVehicles.length > 0 && (
            <View style={styles.connectedVehicles}>
              <Text style={styles.sectionTitle}>{translatedText["Connected Vehicles"]||"Connected Vehicles"}</Text>
              {connectedVehicles.map((vehicle, index) => (
                <View key={index} style={styles.vehicleItem}>
                  <View>
                    <Text style={styles.vehicleText}>
                      {translatedText["Organization: "]||"Organization: "}{vehicle.orgId}
                    </Text>
                    <Text style={styles.vehicleText}>
                      {translatedText["Vehicle ID:"]||"Vehicle ID:"} {vehicle.vehicleId}
                    </Text>
                    <Text style={styles.timestampText}>
                      {translatedText["Connected: "]||"Connected: "}{vehicle.timestamp}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.monitorButton}
                    onPress={() =>
                      navigation.navigate("MonitoringPage", vehicle)
                    }
                  >
                    <Text style={styles.monitorButtonText}>{translatedText["Monitor"]||"Monitor"}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Notifications Tab Content */}
      {selectedTab === "notifications" && (
        <View style={styles.tabContent}>
          {notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationItem}>
              <Text style={styles.notificationMessage}>
                {notification.message}
              </Text>
              <Text style={styles.notificationDate}>{notification.date}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Messages Tab Content */}
      {selectedTab === "messages" && (
        <View style={styles.tabContent}>
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
      )}

      {/* Profile Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Ionicons name="close-circle" size={30} color="gray" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>{translatedText["Professional Driver Details"]||"Professional Driver Details"}</Text>

          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>{translatedText["Upload Profile Picture"]||"Upload Profile Picture"}</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.modalInput}
            placeholder={translatedText["Driver Name"]||"Driver Name"}
            value={driverName}
            onChangeText={setDriverName}
          />

          <TextInput
            style={styles.modalInput}
            placeholder={translatedText["License Number"]||"License Number"}
            value={licenseNo}
            onChangeText={setLicenseNo}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveDriverDetails}
          >
            <Text style={styles.saveButtonText}>{translatedText["Save Details"]||"Save Details"}</Text>
          </TouchableOpacity>
          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>{translatedText["Logout"]||"Logout"}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 15,
    elevation: 4,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  profileSection: {
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileText: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
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
    padding: 15,
  },
  connectionForm: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  connectButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  connectButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  connectedVehicles: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  vehicleItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vehicleText: {
    fontSize: 14,
    marginBottom: 2,
  },
  timestampText: {
    fontSize: 12,
    color: "#666",
  },
  monitorButton: {
    backgroundColor: "#2196F3",
    padding: 8,
    borderRadius: 5,
  },
  monitorButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  notificationItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: "#666",
  },
  messageItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1,
  },
  unread: {
    backgroundColor: "#E8F5E9",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  messageSender: {
    fontWeight: "bold",
  },
  messageTime: {
    fontSize: 12,
    color: "#666",
  },
  messageText: {
    fontSize: 14,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  uploadButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  uploadButtonText: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
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

export default ProfessionalDriverPage;
