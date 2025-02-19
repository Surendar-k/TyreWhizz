import React from "react";
import { View, Text, StyleSheet } from "react-native";

const IndividualDriverNotifications = ({ notifications = [] }) => {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.notificationTitle}>Notifications</Text>
      {notifications.length > 0 ? (
        <View style={styles.notificationsList}>
          {notifications.map((notification, index) => (
            <View key={index} style={styles.notificationItem}>
              <Text style={styles.notificationText}>
                {notification.message}
              </Text>
              <Text style={styles.notificationDate}>{notification.date}</Text>
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
    // Box shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    // Elevation for Android
    elevation: 5,
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
});

export default IndividualDriverNotifications;
