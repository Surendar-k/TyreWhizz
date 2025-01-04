import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

// Sample real-time mock data for the shops
const realTimeShops = [
  {
    id: 1,
    name: "Speed Auto Repairs",
    latitude: 12.9608, // Updated latitude for the real shop
    longitude: 77.6101, // Updated longitude for the real shop
    address: "456 Market Street, Bangalore",
    phone: "+91 9123456789",
    rating: 4.7,
    hours: "9:00 AM - 7:00 PM",
    services: ["Engine Repair", "Tire Replacement", "Oil Change"],
  },
  {
    id: 2,
    name: "AutoFix Garage",
    latitude: 12.9487,
    longitude: 77.5982,
    address: "789 Tech Park Road, Bangalore",
    phone: "+91 9876543210",
    rating: 4.6,
    hours: "8:30 AM - 6:30 PM",
    services: ["Brakes Service", "Suspension Work", "Battery Check"],
  },
  // Add more real-time shops here...
];

const TechLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setShops(realTimeShops); // Using the real-time shops data
          setLoading(false);
        },
        (error) => {
          setError("Unable to retrieve your location");
          setLoading(false);
        }
      );
    };

    getUserLocation();
  }, []);

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // Function to open the location in Google Maps
  const handleOpenMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.alert}>
        <Text style={styles.alertText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Auto Repair Shops</Text>
      {location && (
        <Text style={styles.location}>
          <Icon name="map-pin" size={20} color="#2563eb" /> Your location:{" "}
          {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </Text>
      )}

      <View style={styles.shopList}>
        {shops.map((shop) => (
          <View key={shop.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                <Icon name="car" size={20} color="white" /> {shop.name}
              </Text>
            </View>
            <View style={styles.cardContent}>
              <TouchableOpacity
                onPress={() => handleOpenMap(shop.latitude, shop.longitude)}
              >
                <Text style={styles.address}>
                  <Icon name="map-marker" size={16} color="#2563eb" />{" "}
                  {shop.address}
                </Text>
              </TouchableOpacity>
              <Text style={styles.phone}>
                <Icon name="phone" size={16} color="#2563eb" /> {shop.phone}
              </Text>
              <Text style={styles.hours}>
                <Icon name="clock" size={16} color="#2563eb" /> {shop.hours}
              </Text>
              <View style={styles.services}>
                <Text style={styles.serviceTitle}>Services:</Text>
                <View style={styles.serviceList}>
                  {shop.services.map((service, index) => (
                    <Text key={index} style={styles.serviceBadge}>
                      {service}
                    </Text>
                  ))}
                </View>
              </View>
              <Text style={styles.distance}>
                <Text style={styles.boldText}>{shop.distance} miles away</Text>{" "}
                • Rating: <Text style={styles.rating}>⭐ {shop.rating}/5</Text>
              </Text>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall(shop.phone)}
              >
                <Text style={styles.callButtonText}>Call Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  location: {
    color: "#555",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  shopList: {
    flex: 1,
    flexDirection: "column",
    marginTop: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ scale: 1 }],
    transition: "transform 0.2s ease-in-out",
  },
  cardHeader: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  cardContent: {
    padding: 10,
  },
  address: {
    fontSize: 14,
    color: "#2563eb",
    marginTop: 5,
  },
  phone: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  hours: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  services: {
    marginTop: 10,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  serviceList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  serviceBadge: {
    backgroundColor: "#e0f2fe",
    color: "#2563eb",
    padding: 6,
    borderRadius: 16,
    margin: 4,
    fontSize: 12,
  },
  distance: {
    fontSize: 14,
    color: "#444",
    marginTop: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  rating: {
    fontWeight: "bold",
    color: "#f59e0b",
  },
  alert: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  alertText: {
    color: "white",
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  callButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  callButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TechLocation;
