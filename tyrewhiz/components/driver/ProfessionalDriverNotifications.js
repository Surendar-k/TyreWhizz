import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProfessionalDriverNotifications = ({ notifications }) => {
  return (
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
  );
};

const styles = StyleSheet.create({
  tabContent: {
    padding: 20,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    elevation: 3,
  },
  notificationItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationMessage: {
    fontSize: 14,
    fontWeight: "bold",
  },
  notificationDate: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});

export default ProfessionalDriverNotifications;
