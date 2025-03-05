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
  Platform,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "../TranslationContext";

const TechnicianPage = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isProfileVisible, setProfileVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [originalUserData, setOriginalUserData] = useState({...userData});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Notifications");
  const navigation = useNavigation();
  const [hasCertificate, setHasCertificate] = useState("No");
  const [certificateFile, setCertificateFile] = useState(null);
  const [orgId, setOrgId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedVehicles, setConnectedVehicles] = useState([]);
  const { translatedText, updateTranslations } = useTranslation();
  const handleProfileImageChange = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        translatedText["Error"] || "Error", 
        translatedText["Failed to select image"] || "Failed to select image"
      );
    }
  };
  // Update translations when component is focused
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
        "Connect with Your Customers",
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
        "Accept",
        "Reject",
        "Accepted",
        "Rejected",
        "No content available",
        "Logged in as: Technician",
        "Menu",
        "Current Plan",
        "days left",
        "Subscription Plans",
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
        "Search...",
        "Today",
        "Filter Notifications",
        "All",
        "Requests",
        "Updates",
        "Need Help?",
        "Contact Support",
      ]);
    }, [])
  );

  // Initialize notifications with sample data
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [notificationFilter, setNotificationFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (Object.keys(translatedText).length > 0) {
      const notificationsData = [
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
      ];

      setNotifications(notificationsData);
      setFilteredNotifications(notificationsData);
    }
  }, [translatedText]);

  // Filter notifications based on search query and filter type
  useEffect(() => {
    let result = [...notifications];

    // Apply type filter
    if (notificationFilter !== "All") {
      const filterType =
        notificationFilter.toLowerCase() === "requests" ? "request" : "info";
      result = result.filter((item) => item.type === filterType);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.message.toLowerCase().includes(query)
      );
    }

    setFilteredNotifications(result);
  }, [notifications, notificationFilter, searchQuery]);

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

  // Handle Connect to Vehicle
  const handleConnect = () => {
    if (!orgId || !vehicleId) {
      Alert.alert("Error", "Please enter both Organization ID and Vehicle ID");
      return;
    }

    setIsConnecting(true);

    // Simulate API connection
    setTimeout(() => {
      const newVehicle = {
        orgId,
        vehicleId,
        timestamp: new Date().toLocaleString(),
      };

      setConnectedVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
      setOrgId("");
      setVehicleId("");
      setIsConnecting(false);
    }, 1500);
  };

  // Handle Accept Request
  const handleAcceptRequest = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, status: "accepted" }
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

  // Camera/Webcam permissions
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      handleImageCapture();
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

  const handleWebcamCapture = () => {
    // Implementation for web platform if needed
  };

  // Toggle Menu and Profile visibility
  const toggleMenu = () => setMenuVisible(!isMenuVisible);
  const toggleProfile = () => {
    setProfileVisible(!isProfileVisible);
    setIsEditing(false);
  };

  const handleEdit = () => setIsEditing(!isEditing);
  const handleSave = () => setIsEditing(false);

  const pickCertificate = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
    });

    if (result.type === "success") {
      setCertificateFile(result.uri);
    }
  };

  const handleCertificateSelection = (selection) => {
    setHasCertificate(selection);
  };

  const handleLogout = () => {
    setProfileVisible(false);
    navigation.navigate("UserTypeSelectionPage");
  };

  // Configure navigation header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: translatedText["TyreWhizz"] || "TyreWhizz",
      headerStyle: {
        backgroundColor: "#4361ee",
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
  }, [navigation, translatedText]);

  // Component for editable profile fields
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

  // Render Connect Content
  const renderConnectContent = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>
        {translatedText["Connect with Your Customers"] ||
          "Connect with Your Customers"}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {translatedText["Connect to Vehicle"] || "Connect to Vehicle"}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={translatedText["Organization ID"] || "Organization ID"}
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
          style={styles.primaryButton}
          onPress={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {translatedText["Connect"] || "Connect"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {connectedVehicles.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {translatedText["Connected Vehicles"] || "Connected Vehicles"}
          </Text>
          {connectedVehicles.map((vehicle, index) => (
            <View key={index} style={styles.vehicleCard}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleTitle}>{vehicle.vehicleId}</Text>
                <Text style={styles.vehicleSubtitle}>
                  {translatedText["Organization"] || "Organization"}:{" "}
                  {vehicle.orgId}
                </Text>
                <Text style={styles.vehicleTimestamp}>
                  {translatedText["Connected"] || "Connected"}:{" "}
                  {vehicle.timestamp}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.monitorButton}
                onPress={() => navigation.navigate("MonitoringPage", vehicle)}
              >
                <Text style={styles.buttonText}>
                  {translatedText["Monitor"] || "Monitor"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {translatedText["Quick Connect"] || "Quick Connect"}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={translatedText["Enter Vehicle ID"] || "Enter Vehicle ID"}
          value={vehicleId}
          onChangeText={setVehicleId}
        />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate("MonitoringPage", { vehicleId: vehicleId })
          }
        >
          <Text style={styles.buttonText}>
            {translatedText["Pair"] || "Pair"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.helpCard}>
        <Text style={styles.helpCardTitle}>
          {translatedText["Need Help?"] || "Need Help?"}
        </Text>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>
            {translatedText["Contact Support"] || "Contact Support"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render Notifications Content
  const renderNotificationsContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={translatedText["Search..."] || "Search..."}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>
          {translatedText["Filter Notifications"] || "Filter Notifications"}:
        </Text>
        <View style={styles.filterButtons}>
          {["All", "Requests", "Updates"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                notificationFilter === filter && styles.activeFilterButton,
              ]}
              onPress={() => setNotificationFilter(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  notificationFilter === filter &&
                    styles.activeFilterButtonText,
                ]}
              >
                {translatedText[filter] || filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {filteredNotifications.length > 0 ? (
        filteredNotifications.map((notification) => (
          <View
            key={notification.id}
            style={[
              styles.notificationCard,
              notification.unread && styles.unreadNotification,
            ]}
          >
            <View style={styles.notificationHeader}>
              <View style={styles.notificationTitleContainer}>
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>
                {notification.unread && <View style={styles.unreadDot} />}
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteNotification(notification.id)}
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.notificationTime}>
              {notification.time === "2 hours ago" ||
              notification.time === "3 hours ago" ||
              notification.time === "5 hours ago"
                ? translatedText["Today"] || "Today"
                : notification.time}
            </Text>

            <Text style={styles.notificationMessage}>
              {notification.message}
            </Text>

            {notification.type === "request" && !notification.status && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAcceptRequest(notification.id)}
                >
                  <Text style={styles.buttonText}>
                    {translatedText["Accept"] || "Accept"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleRejectRequest(notification.id)}
                >
                  <Text style={styles.buttonText}>
                    {translatedText["Reject"] || "Reject"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {notification.status && (
              <View
                style={[
                  styles.statusBadge,
                  notification.status === "accepted"
                    ? styles.acceptedBadge
                    : styles.rejectedBadge,
                ]}
              >
                <Text style={styles.statusText}>
                  {notification.status === "accepted"
                    ? translatedText["Accepted"] || "Accepted"
                    : translatedText["Rejected"] || "Rejected"}
                </Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="notifications-off" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>
            {translatedText["No notifications found"] ||
              "No notifications found"}
          </Text>
        </View>
      )}
    </View>
  );

  // Render Messages Content
  const renderMessagesContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={translatedText["Search..."] || "Search..."}
        />
      </View>

      {messages.map((message) => (
        <TouchableOpacity
          key={message.id}
          style={[styles.messageCard, message.unread && styles.unreadMessage]}
        >
          <View style={styles.messageHeader}>
            <Text style={styles.messageSender}>{message.sender}</Text>
            <Text style={styles.messageTime}>{message.time}</Text>
          </View>
          <Text style={styles.messagePreview} numberOfLines={2}>
            {message.message}
          </Text>
          {message.unread && <View style={styles.unreadMessageDot} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render Tab Content
  const renderTabContent = () => {
    switch (selectedTab) {
      case "Notifications":
        return renderNotificationsContent();
      case "Connect":
        return renderConnectContent();
      case "Messages":
        return renderMessagesContent();
      default:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.emptyStateText}>
              {translatedText["No content available"] || "No content available"}
            </Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4361ee" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {translatedText["TyreWhizz"] || "TyreWhizz"}
        </Text>
      </View>

      <View style={styles.roleContainer}>
        <Text style={styles.roleText}>
          {translatedText["Logged in as: Technician"] ||
            "Logged in as: Technician"}
        </Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Notifications" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("Notifications")}
        >
          <Ionicons
            name="notifications"
            size={24}
            color={selectedTab === "Notifications" ? "#4361ee" : "#666"}
          />
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === "Notifications" && styles.activeTabText,
            ]}
          >
            {translatedText["Notifications"] || "Notifications"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Connect" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("Connect")}
        >
          <Ionicons
            name="link"
            size={24}
            color={selectedTab === "Connect" ? "#4361ee" : "#666"}
          />
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === "Connect" && styles.activeTabText,
            ]}
          >
            {translatedText["Connect"] || "Connect"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Messages" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("Messages")}
        >
          <Ionicons
            name="chatbubbles"
            size={24}
            color={selectedTab === "Messages" ? "#4361ee" : "#666"}
          />
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === "Messages" && styles.activeTabText,
            ]}
          >
            {translatedText["Messages"] || "Messages"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>{renderTabContent()}</ScrollView>

      {/* Menu Modal */}
      <Modal
        visible={isMenuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleMenu}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {translatedText["Menu"] || "Menu"}
              </Text>
              <TouchableOpacity onPress={toggleMenu}>
                <Ionicons name="close" size={24} color="#4361ee" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuSection}>
              <Text style={styles.menuSectionTitle}>
                {translatedText["Current Plan"] || "Current Plan"}
              </Text>
              <View style={styles.planCard}>
                <Text style={styles.planTitle}>{userData.currentPlan}</Text>
                <Text style={styles.planDetails}>
                  {userData.daysLeft}{" "}
                  {translatedText["days left"] || "days left"}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="card" size={24} color="#4361ee" />
              <Text style={styles.menuItemText}>
                {translatedText["Subscription Plans"] || "Subscription Plans"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="information-circle" size={24} color="#4361ee" />
              <Text style={styles.menuItemText}>
                {translatedText["About TyreWhizz"] || "About TyreWhizz"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={24} color="#fff" />
              <Text style={styles.logoutButtonText}>
                {translatedText["Logout"] || "Logout"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal
        visible={isProfileVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleProfile}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {translatedText["Profile"] || "Profile"}
              </Text>
              <TouchableOpacity onPress={toggleProfile}>
                <Ionicons name="close" size={24} color="#4361ee" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImageWrapper}>
                  <Ionicons name="person" size={64} color="#fff" />
                </View>
                {isEditing && (
                  <TouchableOpacity
                    style={styles.changePhotoButton}
                    onPress={requestCameraOrWebcamPermission}
                  >
                    <Text style={styles.changePhotoText}>
                      <Ionicons name="camera" size={16} color="#4361ee" />{" "}
                      Change
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <EditableField label="Name" value={userData.name} field="name" />
              <EditableField
                label="Email"
                value={userData.email}
                field="email"
              />
              <EditableField
                label="Phone"
                value={userData.phone}
                field="phone"
              />
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
                <Text style={styles.fieldLabel}>
                  {translatedText["Certificate"] || "Certificate"}:
                </Text>
                {isEditing ? (
                  <View style={styles.certificateOptions}>
                    <TouchableOpacity
                      style={[
                        styles.certificateOption,
                        hasCertificate === "Yes" && styles.selectedOption,
                      ]}
                      onPress={() => handleCertificateSelection("Yes")}
                    >
                      <Text
                        style={[
                          styles.certificateOptionText,
                          hasCertificate === "Yes" && styles.selectedOptionText,
                        ]}
                      >
                        {translatedText["Yes"] || "Yes"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.certificateOption,
                        hasCertificate === "No" && styles.selectedOption,
                      ]}
                      onPress={() => handleCertificateSelection("No")}
                    >
                      <Text
                        style={[
                          styles.certificateOptionText,
                          hasCertificate === "No" && styles.selectedOptionText,
                        ]}
                      >
                        {translatedText["No"] || "No"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.fieldValue}>{hasCertificate}</Text>
                )}
              </View>

              {isEditing && hasCertificate === "Yes" && (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={pickCertificate}
                >
                  <Ionicons name="document" size={20} color="#fff" />
                  <Text style={styles.uploadButtonText}>
                    {translatedText["Upload Certificate"] ||
                      "Upload Certificate"}
                  </Text>
                </TouchableOpacity>
              )}

              {certificateFile && (
                <View style={styles.filePreview}>
                  <Ionicons name="document-text" size={24} color="#4361ee" />
                  <Text style={styles.filePreviewText}>
                    {certificateFile.split("/").pop()}
                  </Text>
                </View>
              )}

              {isEditing ? (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleSave}
                >
                  <Text style={styles.buttonText}>
                    {translatedText["Save Changes"] || "Save Changes"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleEdit}
                >
                  <Text style={styles.buttonText}>
                    {translatedText["Edit Profile"] || "Edit Profile"}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>
                  {translatedText["Logout"] || "Logout"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#4361ee",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerButton: {
    paddingHorizontal: 15,
  },
  roleContainer: {
    padding: 8,
    backgroundColor: "#e6f0ff",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#d6e4ff",
  },
  roleText: {
    color: "#4361ee",
    fontWeight: "500",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#4361ee",
  },
  tabButtonText: {
    color: "#666",
    marginTop: 4,
    fontSize: 12,
  },
  activeTabText: {
    color: "#4361ee",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
  },
  primaryButton: {
    backgroundColor: "#4361ee",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  vehicleCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  vehicleSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  vehicleTimestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  monitorButton: {
    backgroundColor: "#4361ee",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  helpCard: {
    backgroundColor: "#f0f4ff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4361ee",
  },
  helpCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#4361ee",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#4361ee",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  filterButtons: {
    flexDirection: "row",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: "#4361ee",
  },
  filterButtonText: {
    color: "#666",
  },
  activeFilterButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: "#4361ee",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  notificationTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4361ee",
  },
  notificationTime: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  acceptButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  acceptedBadge: {
    backgroundColor: "#d4edda",
  },
  rejectedBadge: {
    backgroundColor: "#f8d7da",
  },
  statusText: {
    fontWeight: "bold",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#888",
    marginTop: 16,
    textAlign: "center",
  },
  messageCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    position: "relative",
  },
  unreadMessage: {
    borderLeftWidth: 4,
    borderLeftColor: "#4361ee",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  messageTime: {
    fontSize: 12,
    color: "#888",
  },
  messagePreview: {
    fontSize: 14,
    color: "#444",
  },
  unreadMessageDot: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4361ee",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  menuModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  profileModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalContent: {
    flex: 1,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  planCard: {
    backgroundColor: "#f0f4ff",
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4361ee",
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  planDetails: {
    fontSize: 14,
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4361ee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  changePhotoButton: {
    padding: 8,
  },
  changePhotoText: {
    color: "#4361ee",
    fontWeight: "500",
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  fieldValue: {
    fontSize: 16,
    color: "#444",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  certificateOptions: {
    flexDirection: "row",
  },
  certificateOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    marginRight: 12,
  },
  selectedOption: {
    backgroundColor: "#4361ee",
  },
  certificateOptionText: {
    color: "#666",
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: "#4361ee",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  filePreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    padding: 12,
    borderRadius: 6,
    marginVertical: 8,
  },
  filePreviewText: {
    marginLeft: 8,
    color: "#4361ee",
    flex: 1,
  },
});

export default TechnicianPage;
