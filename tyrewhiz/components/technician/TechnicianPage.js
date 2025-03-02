import React, { useState, useEffect, useLayoutEffect } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "../TranslationContext"; // Import translation context

const TechnicianPage = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isProfileVisible, setProfileVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Notifications");
  const navigation = useNavigation();
  const [hasCertificate, setHasCertificate] = useState("No");
  const [certificateFile, setCertificateFile] = useState(null);
  const { translatedText, updateTranslations } = useTranslation();
  useFocusEffect(
    React.useCallback(() => {
      updateTranslations([
        "System Update Available",
        "A new system update is available. Please update your app to access the latest features.",
        "New Connection Request",
        "John Doe has sent you a request. He had issues on tire puncture.",
        "Customer Feedback Alert",
        "Feedback received for your recent service: 'Great job on tire replacement!' Keep up the good work!",
        "Tire Puncture Repair Request",
        "Repair requested for a punctured rear-right tire in Vehicle PY33 11574. ETA for the site: 30 mins",
        "New Tire Replacement Request",
        "You have a new tire replacement request for Vehicle TN25 1S107. Customer prefers service on 24 Dec at 11:00 AM.",
        "Upcoming Maintenance",
        "Reminder: You have 3 scheduled maintenance appointments next week.",
        "Accepted",
        "Rejected",
        "Permission Required",
        "Camera access is required to capture vehicle images",
        "OK",
        "When can you check my car's tyres? I noticed some unusual wear patterns.",
        "Thanks for the quick service yesterday! The ride feels much smoother now.",
        "Your profile verification is complete. You can now access all premium features.",
        "Is it possible to reschedule my appointment from Tuesday to Wednesday?",
        "Could you provide a quote for a complete tire change for my SUV?",
        "Monthly service report is ready for your review.",
        "Tyre Expert",
        "5 years",
        "Basic",
        "Certificate",
        "Menu",
        "Edit",
        "Save",
        "Logout",
        "Success",
        "Image captured successfully!",
        "Error",
        "Failed to capture image",
        "Connect with Your Customer's",
        "Connect to Vehicle",
        "Organization ID",
        "Vehicle ID",
        "Connect",
        "Connected Vehicles",
        "Organization",
        "Connected",
        "Monitor",
        "Enter Vehicle ID",
        "Pair",
        "Notifications",
        "Connect",
        "Messages",
        "Accept ",
        "Reject",
        "Accepted",
        "Rejected",
        "No content available",
        "Logged in as: Technician",
        "Menu",
        "Current Plan",
        "days left",
        "Subscription  Plans",
        "About TyreWhizz",
        "Profile",
        "Name",
        "Email",
        "Phone",
        "Specialization",
        "Experience",
        "Certificate",
        "Yes",
        "No",
        "Upload Certificate",
        "Save Changes",
        "Edit Profile",
        "Logout",
        "TyreWhizz",
      ]);
    }, [])
  );

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (Object.keys(translatedText).length > 0) {
      setNotifications([
        {
          id: "1",
          title:
            translatedText["System Update Available"] ||
            "System Update Available",
          time: "2 hours ago",
          message:
            translatedText[
              "A new system update is available. Please update your app to access the latest features."
            ] ||
            "A new system update is available. Please update your app to access the latest features.",
          unread: true,
          type: "info",
        },
        {
          id: "2",
          title:
            translatedText["New Connection Request"] ||
            "New Connection Request",
          time: "3 hours ago",
          message:
            translatedText[
              "John Doe has sent you a request. He had issues on tire puncture."
            ] ||
            "John Doe has sent you a request. He had issues on tire puncture.",
          unread: false,
          type: "request",
        },
        {
          id: "3",
          title:
            translatedText["Customer Feedback Alert"] ||
            "Customer Feedback Alert",
          time: "5 hours ago",
          message:
            translatedText[
              "Feedback received for your recent service: 'Great job on tire replacement!' Keep up the good work!"
            ] ||
            "Feedback received for your recent service: 'Great job on tire replacement!' Keep up the good work!",
          unread: true,
          type: "info",
        },
        {
          id: "4",
          title:
            translatedText["Tire Puncture Repair Request"] ||
            "Tire Puncture Repair Request",
          time: "1 day ago",
          message:
            translatedText[
              "Repair requested for a punctured rear-right tire in Vehicle PY33 11574. ETA for the site: 30 mins"
            ] ||
            "Repair requested for a punctured rear-right tire in Vehicle PY33 11574. ETA for the site: 30 mins",
          unread: false,
          type: "request",
        },
        {
          id: "5",
          title:
            translatedText["New Tire Replacement Request"] ||
            "New Tire Replacement Request",
          time: "2 days ago",
          message:
            translatedText[
              "You have a new tire replacement request for Vehicle TN25 1S107. Customer prefers service on 24 Dec at 11:00 AM."
            ] ||
            "You have a new tire replacement request for Vehicle TN25 1S107. Customer prefers service on 24 Dec at 11:00 AM.",
          unread: false,
          type: "request",
        },
        {
          id: "6",
          title:
            translatedText["Upcoming Maintenance"] || "Upcoming Maintenance",
          time: "2 days ago",
          message:
            translatedText[
              "Reminder: You have 3 scheduled maintenance appointments next week."
            ] ||
            "Reminder: You have 3 scheduled maintenance appointments next week.",
          unread: false,
          type: "info",
        },
      ]);
    }
  }, [translatedText]); // Re-run when translations update

  // Handle Accept Request
  const handleAcceptRequest = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, status: "accepted" } // Store raw status
          : notification
      )
    );
  };

  // Handle Reject Request
  const handleRejectRequest = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, status: "rejected" }
          : notification
      )
    );
  };

  // Handle Delete Notification
  const handleDeleteNotification = (id) => {
    
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
   
  };

  const [vehicleId, setVehicleId] = useState("");

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      handleImageCapture(); // Your method to capture or select images
    } else {
      Alert.alert(
        translatedText["Permission Required"] || "Permission Required",
        translatedText["Camera access is required to capture vehicle images"] ||
          "Camera access is required to capture vehicle images",
        [{ text: translatedText["OK"] || "OK" }]
      );
    }
  };

  const requestWebcamPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      handleWebcamCapture(stream);
    } catch (error) {
      
      alert(
        translatedText["Camera access is required to capture vehicle images"] ||
          "Camera access is required to capture vehicle images"
      );
    }
  };

  const requestCameraOrWebcamPermission = async () => {
    if (Platform.OS === "web") {
      await requestWebcamPermission();
    } else {
      await requestCameraPermission();
    }
  };

  const [messages] = useState([
    {
      id: 1,
      sender: "Michael",
      message:
        translatedText[
          "When can you check my car's tyres? I noticed some unusual wear patterns."
        ] ||
        "When can you check my car's tyres? I noticed some unusual wear patterns.",
      time: "10:30 AM",
      unread: true,
    },
    {
      id: 2,
      sender: "Arjun",
      message:
        translatedText[
          "Thanks for the quick service yesterday! The ride feels much smoother now."
        ] ||
        "Thanks for the quick service yesterday! The ride feels much smoother now.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      sender: "Sachin",
      message:
        translatedText[
          "Your profile verification is complete. You can now access all premium features."
        ] ||
        "Your profile verification is complete. You can now access all premium features.",
      time: "2 days ago",
      unread: false,
    },
    {
      id: 4,
      sender: "Sakthi",
      message:
        translatedText[
          "Is it possible to reschedule my appointment from Tuesday to Wednesday?"
        ] ||
        "Is it possible to reschedule my appointment from Tuesday to Wednesday?",
      time: "3 days ago",
      unread: false,
    },
    {
      id: 5,
      sender: "Shreya",
      message:
        translatedText[
          "Could you provide a quote for a complete tire change for my SUV?"
        ] || "Could you provide a quote for a complete tire change for my SUV?",
      time: "4 days ago",
      unread: false,
    },
    {
      id: 6,
      sender: "Charan",
      message:
        translatedText["Monthly service report is ready for your review."] ||
        "Monthly service report is ready for your review.",
      time: "5 days ago",
      unread: false,
    },
  ]);

  const [userData, setUserData] = useState({
    name: "Arjun",
    email: "Arjun@example.com",
    phone: "+91 9857852471",
    specialization: translatedText["Tyre Expert"] || "Tyre Expert",
    experience: translatedText["5 years"] || "5 years",
    currentPlan: translatedText["Basic"] || "Basic",
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

  const pickCertificate = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "/",
    });

    if (result.type === "success") {
      setCertificateFile(result.uri);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: translatedText["TyreWhizz"] || "TyreWhizz",
      headerStyle: {
        backgroundColor: "#FF5733",
      },
      headerTintColor: "#fff",
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
      <Text style={styles.fieldLabel}>{translatedText[label] || label}:</Text>
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
    setProfileVisible(false);
    navigation.navigate("UserTypeSelectionPage");
  };
  const handleImageCapture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        Alert.alert(
          translatedText["Success"] || "Success",
          translatedText["Image captured successfully!"] ||
            "Image captured successfully!"
        );
      }
    } catch (error) {
      Alert.alert(
        translatedText["Error"] || "Error",
        translatedText["Failed to capture image"] || "Failed to capture image"
      );
    }
  };

  const renderConnectContent = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>
        {translatedText["Connect with Your Customer's"] ||
          "Connect with Your Customer's"}
      </Text>

      {/* Connection Tab Content */}
      {selectedTab === "connection" && (
        <View style={styles.tabContent}>
          <View style={styles.connectionForm}>
            <Text style={styles.formTitle}>
              {translatedText["Connect to Vehicle"] || "Connect to Vehicle"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                translatedText["Organization ID"] || "Organization ID"
              }
              value={orgId}
              onChangeText={setOrgId}
            />
            <TextInput
              style={styles.input}
              placeholder={translatedText["Vehicle ID"] || "Vehicle ID"}
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
                <Text style={styles.connectButtonText}>
                  {translatedText["Connect"] || "Connect"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Connected Vehicles List */}
          {connectedVehicles.length > 0 && (
            <View style={styles.connectedVehicles}>
              <Text style={styles.sectionTitle}>
                {translatedText["Connected Vehicles"] || "Connected Vehicles"}
              </Text>
              {connectedVehicles.map((vehicle, index) => (
                <View key={index} style={styles.vehicleItem}>
                  <View>
                    <Text style={styles.vehicleText}>
                      {translatedText["Organization"] || "Organization"}:{" "}
                      {vehicle.orgId}
                    </Text>
                    <Text style={styles.vehicleText}>
                      {translatedText["Vehicle ID"] || "Vehicle ID"}:{" "}
                      {vehicle.vehicleId}
                    </Text>
                    <Text style={styles.timestampText}>
                      {translatedText["Connected"] || "Connected"}:{" "}
                      {vehicle.timestamp}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.monitorButton}
                    onPress={() =>
                      navigation.navigate("MonitoringPage", vehicle)
                    }
                  >
                    <Text style={styles.monitorButtonText}>
                      {translatedText["Monitor"] || "Monitor"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder={translatedText["Enter Vehicle ID"] || "Enter Vehicle ID"}
        value={vehicleId}
        onChangeText={setVehicleId}
      />

      <TouchableOpacity
        style={[styles.button, styles.pair]}
        onPress={() =>
          navigation.navigate("MonitoringPage", { vehicleId: vehicleId })
        }
      >
        <Text style={styles.buttonText}>
          {translatedText["Pair"] || "Pair"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Notifications":
        return (
          <View style={styles.contentContainer}>
            {notifications.map((notification) => (
              <View
                key={notification.id}
                style={[
                  styles.notificationItem,
                  notification.unread && styles.unread,
                ]}
              >
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteNotification(notification.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="rgb(28 10 62)"
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.notificationTime}>{notification.time}</Text>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>

                {notification.type === "request" && !notification.status && (
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
                      <Text style={styles.actionButtonText}>
                        {translatedText["Reject"] || "Reject"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {notification.status && (
                  <Text
                    style={[
                      styles.statusText,
                      notification.status === "accepted"
                        ? styles.acceptedText
                        : styles.rejectedText,
                    ]}
                  >
                    {notification.status === "accepted"
                      ? translatedText["Accepted"] || "Accepted"
                      : translatedText["Rejected"] || "Rejected"}
                  </Text>
                )}
              </View>
            ))}
          </View>
        );

      case "Connect":
        return renderConnectContent();

      case "Messages":
        return (
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
        );

      default:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.tabContent}>
              {translatedText["No content available"] || "No content available"}
            </Text>
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
        <Text style={styles.welcometitle}>TyreWhizz</Text>
        <TouchableOpacity style={styles.profileButton} onPress={toggleProfile}>
          <Ionicons name="person-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.roleContainer}>
        <Text style={styles.role}>
          {" "}
          {translatedText["Logged in as: Technician"] ||
            "Logged in as: Technician"}
        </Text>
      </View>

      <ScrollView>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === "Notifications" && styles.selectedTab,
            ]}
            onPress={() => setSelectedTab("Notifications")}
          >
            <Ionicons name="notifications" size={24} color="rgb(28 10 62)" />
            <Text style={styles.tabButtonText}>
              {" "}
              {translatedText["Notifications"] || "Notifications"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === "Connect" && styles.selectedTab,
            ]}
            onPress={() => setSelectedTab("Connect")}
          >
            <Ionicons name="people" size={24} color="rgb(28 10 62)" />
            <Text style={styles.tabButtonText}>
              {translatedText["Connect"] || "Connect"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === "Messages" && styles.selectedTab,
            ]}
            onPress={() => setSelectedTab("Messages")}
          >
            <Ionicons name="mail" size={24} color="rgb(28 10 62)" />
            <Text style={styles.tabButtonText}>
              {translatedText["Messages"] || "Messages"}
            </Text>
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
                <Text style={styles.modalTitle}>
                  {translatedText["Menu"] || "Menu"}
                </Text>
                <TouchableOpacity onPress={toggleMenu}>
                  <Ionicons name="close" size={24} color="#FF5733" />
                </TouchableOpacity>
              </View>
              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>
                  {translatedText["Current Plan"] || "Current Plan"}
                </Text>
                <View style={styles.planInfo}>
                  <Text style={styles.planType}>{userData.currentPlan}</Text>
                  <Text style={styles.daysLeft}>
                    {userData.daysLeft}{" "}
                    {translatedText["days left"] || "days left"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="card-outline" size={24} color="#FF5733" />
                <Text style={styles.menuItemText}>
                  {translatedText["Subscription Plans"] || "Subscription Plans"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color="#FF5733"
                />
                <Text style={styles.menuItemText}>
                  {translatedText["About TyreWhizz"] || "About TyreWhizz"}
                </Text>
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
                <Text style={styles.modalTitle}>
                  {translatedText["Profile"] || "Profile"}
                </Text>
                <TouchableOpacity onPress={toggleProfile}>
                  <Ionicons name="close" size={24} color="#FF5733" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.profileContent}>
                <View style={styles.profileImageContainer}>
                  <Ionicons name="person-circle" size={80} color="#FF5733" />
                </View>
                <EditableField
                  label={translatedText["Name"] || "Name"}
                  value={userData.name}
                  field="name"
                />
                <EditableField
                  label={translatedText["Email"] || "Email"}
                  value={userData.email}
                  field="email"
                />
                <EditableField
                  label={translatedText["Phone"] || "Phone"}
                  value={userData.phone}
                  field="phone"
                />
                <EditableField
                  label={translatedText["Specialization"] || "Specialization"}
                  value={userData.specialization}
                  field="specialization"
                />
                <EditableField
                  label={translatedText["Experience"] || "Experience"}
                  value={userData.experience}
                  field="experience"
                />

                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>
                    {translatedText["Certificate"] || "Certificate"}:
                  </Text>
                  {isEditing ? (
                    <View style={styles.certSelection}>
                      <TouchableOpacity
                        onPress={() => handleCertificateSelection("Yes")}
                        style={[
                          styles.certButton,
                          hasCertificate === "Yes" && styles.selectedButton,
                        ]}
                      >
                        <Text style={styles.certButtonText}>
                          {translatedText["Yes"] || "Yes"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleCertificateSelection("No")}
                        style={[
                          styles.certButton,
                          hasCertificate === "No" && styles.selectedButton,
                        ]}
                      >
                        <Text style={styles.certButtonText}>
                          {translatedText["No"] || "No"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={styles.fieldValue}>
                      {translatedText[hasCertificate] || hasCertificate}
                    </Text>
                  )}
                  {hasCertificate === "Yes" && (
                    <View style={styles.uploadContainer}>
                      <Button
                        title={
                          translatedText["Upload Certificate"] ||
                          "Upload Certificate"
                        }
                        onPress={pickCertificate}
                      />
                      {certificateFile && (
                        <Image
                          source={{ uri: certificateFile }}
                          style={styles.uploadedImage}
                        />
                      )}
                    </View>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  {isEditing ? (
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSave}
                    >
                      <Text style={styles.buttonText}>
                        {translatedText["Save Changes"] || "Save Changes"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={handleEdit}
                    >
                      <Text style={styles.buttonText}>
                        {translatedText["Edit Profile"] || "Edit Profile"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                  >
                    <Text style={styles.buttonText}>
                      {translatedText["Logout"] || "Logout"}
                    </Text>
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
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },

  roleContainer: {
    padding: 10,
    backgroundColor: "rgba(162, 150, 186, 0.29)",
    alignItems: "center",
  },
  role: { fontSize: 18, color: "rgb(42 10 62)" },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  tabContent: {
    flex: 1,
    marginTop: 20,
  },
  connectionForm: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  connectButton: {
    height: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  connectButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  connectedVehicles: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  vehicleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  vehicleText: {
    fontSize: 16,
    color: "#333",
  },
  timestampText: {
    fontSize: 14,
    color: "#999",
  },
  monitorButton: {
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  monitorButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 8,
    marginTop: 20
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Layout & Containers
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabContentContainer: {
    padding: 15,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  uploadContainer: {
    marginTop: 10,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgb(28 10 62)",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  title: {
    color: "rgb(144 104 232)",
    fontSize: 30,
    fontWeight: "bold",
    padding: 10,
    fontFamily: "cursive",
  },
  welcometitle: {
    color: "#ffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  menuButton: {
    padding: 5,
  },
  profileButton: {
    padding: 5,
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#C6C6C649",
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  tabButtonText: {
    fontSize: 16,
    color: "#333",
  },
  selectedTab: {
    backgroundColor: "rgb(144 104 232)",
  },
  tabContent: {
    fontSize: 16,
    color: "rgb(201 201 201)",
  },

  // Notifications
  notificationItem: {
    backgroundColor: "rgb(224 221 244)",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "rgb(28 10 62)",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  notificationTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  notificationTime: {
    color: "#666",
    fontSize: 12,
  },
  notificationMessage: {
    color: "#333",
    fontSize: 14,
  },
  deleteButton: {
    padding: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "rgb(255 1 1)",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  statusText: {
    marginTop: 5,
    fontWeight: "bold",
    textAlign: "right",
  },
  acceptedText: {
    color: "#4CAF50",
  },
  rejectedText: {
    color: "rgb(28 10 62)",
  },

  // Messages
  messageItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ddd",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  messageSender: {
    fontWeight: "bold",
    fontSize: 16,
  },
  messageTime: {
    color: "#666",
    fontSize: 12,
  },
  messageText: {
    color: "#333",
    fontSize: 14,
  },

  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF5733",
  },

  // Menu Modal
  menuContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    height: "70%",
  },
  menuSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  menuItemText: {
    fontSize: 14,
    marginLeft: 10,
  },
  planInfo: {
    marginBottom: 20,
  },
  planType: {
    fontSize: 14,
  },
  daysLeft: {
    fontSize: 12,
    color: "#777",
  },

  // Profile Modal
  profileContainer: {
    backgroundColor: "#fff",
    padding: 20,
    width: "80%",
    borderRadius: 10,
  },
  profileContent: {
    maxHeight: "80%",
  },
  profileImageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontWeight: "bold",
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
  },

  // Form Elements
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
  certSelection: {
    flexDirection: "row",
  },
  certButton: {
    padding: 10,
    margin: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: "#FF5733",
  },
  certButtonText: {
    color: "#fff",
  },

  // Images
  uploadedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  pair: {
    fontFamily: "curse",
    color: "#ffff",
  },
  // Buttons
  editButton: {
    backgroundColor: "#FF5733",
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pairButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },

  // Shared States
  unread: {
    borderLeftColor: "rgb(28 10 62)",
  },
  logoutButton: {
    backgroundColor: "#ef4444", // Red
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Centers content horizontally
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TechnicianPage;
