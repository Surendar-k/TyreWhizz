import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const IndividualDriverNotifications = ({ notifications = [] }) => {
  const [notificationList, setNotificationList] = useState(notifications);

  const handleDeleteNotification = (index) => {
    const updatedNotifications = notificationList.filter((_, i) => i !== index);
    setNotificationList(updatedNotifications);
  };

  return (
    <View style={styles.tabContent}>
      <Text style={styles.notificationTitle}>Notifications</Text>
      {notificationList.length > 0 ? (
        <View style={styles.notificationsList}>
          {notificationList.map((notification, index) => (
            <View key={index} style={styles.notificationItem}>
              <Text style={styles.notificationText}>{notification.message}</Text>
              <Text style={styles.notificationDate}>{notification.date}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteNotification(index)}
              >
                <Text style={styles.deleteText}>✖</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noNotifications}>No notifications available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    padding: 20,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationsList: {
    marginTop: 10,
  },
  notificationItem: {
    backgroundColor: "rgb(180 169 246)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  notificationText: {
    fontSize: 14,
    color: "#fff",
    flex: 1, // Ensures text takes available space
  },
  notificationDate: {
    fontSize: 12,
    color: "#ddd",
    marginLeft: 10,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
  deleteText: {
    fontSize: 16,
    color: "#fff",
  },
  noNotifications: {
    fontSize: 14,
    color: "#999",
    marginTop: 20,
  },
});

export default IndividualDriverNotifications;

