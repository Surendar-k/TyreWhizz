import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import Icon from "react-native-vector-icons/FontAwesome";

const realTimeShops = [
  {
    id: 1,
    name: "Speed Auto Repairs",
    latitude: 12.9608,
    longitude: 77.6101,
    address: "456 Market Street, Chennai",
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
    address: "789 Tech Park Road, Chennai",
    phone: "+91 9876543210",
    rating: 4.6,
    hours: "8:30 AM - 6:30 PM",
    services: ["Brakes Service", "Suspension Work", "Battery Check"],
  },
];

const TechLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        setShops(realTimeShops); // Replace with dynamic fetching if needed
        setLoading(false);
      },
      (err) => {
        setError("Unable to fetch location. Please check your settings.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleOpenMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Unable to open Google Maps.")
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3b82f6" />
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
      <View style={styles.shopList}>
        {shops.map((shop) => (
          <View key={shop.id} style={styles.card}>
            <Text style={styles.cardTitle}>{shop.name}</Text>
            <Text style={styles.cardRating}>Rating: {shop.rating} ⭐</Text>
            <TouchableOpacity
              onPress={() => handleOpenMap(shop.latitude, shop.longitude)}
            >
              <Text style={styles.map}>
                <Icon name="map" size={16} color="#3b82f6" /> Get Directions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleCall(shop.phone)}>
              <Text style={styles.phone}>
                <Icon name="phone" size={16} color="#3b82f6" /> Call
              </Text>
            </TouchableOpacity>
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
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
    textAlign: "center",
  },
  shopList: {
    marginTop: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  cardRating: {
    fontSize: 16,
    color: "#f59e0b",
    marginBottom: 10,
  },
  phone: {
    fontSize: 16,
    color: "#3b82f6",
  },
  map: {
    fontSize: 16,
    color: "#3b82f6",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  alert: {
    padding: 15,
    backgroundColor: "#ef4444",
    borderRadius: 12,
    marginBottom: 20,
  },
  alertText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default TechLocation;
