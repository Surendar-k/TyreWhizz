import React from "react";
import { View, Text, StyleSheet } from "react-native";

const IndividualDriverMessages = ({ messages = [] }) => {
  return (
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
  );
};

const styles = StyleSheet.create({
  tabContent: {
    padding: 20,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
  },
  messageItem: {
    backgroundColor: "rgb(163 163 163)",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,

    // Box shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    // Elevation for Android
    elevation: 5,
  },

  unread: {
    backgroundColor: "#B4A9F6",
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
});

export default IndividualDriverMessages;
