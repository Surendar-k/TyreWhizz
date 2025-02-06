import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const TechLocation = () => {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(null); // New state for location name
  const [errorMsg, setErrorMsg] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchLocationName(); // Fetch location name when the location is available
      fetchNearbyShops();
    }
  }, [location]);

  // Reverse geocode the coordinates to get the location name
  const fetchLocationName = async () => {
    const { latitude, longitude } = location;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            latlng: `${latitude},${longitude}`,
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (response.data.results.length > 0) {
        setLocationName(response.data.results[0].formatted_address); // Set location name
      } else {
        setLocationName("Unable to fetch location name");
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName("Unable to fetch location name");
    }
  };

  const fetchNearbyShops = async () => {
    const { latitude, longitude } = location;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json`,
        {
          params: {
            query: "mechanic shop",
            location: `${latitude},${longitude}`,
            radius: 10000,
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (response.data.results.length === 0) {
        Alert.alert("No shops found", "No mechanic shops were found nearby.");
      } else {
        setShops(response.data.results);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
      Alert.alert(
        "Error",
        "Failed to fetch nearby shops. Check API key and permissions."
      );
    } finally {
      setLoading(false);
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Fetching location and nearby mechanic shops...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        {Platform.OS === "web" ? (
          <iframe
            width="100%"
            height="400px" // Increased map height
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_API_KEY}&q=mechanic+shop+near+${location.latitude},${location.longitude}&center=${location.latitude},${location.longitude}&zoom=14`}
            allowFullScreen
          ></iframe>
        ) : (
          <WebView
            source={{
              uri: `https://www.google.com/maps/search/mechanic+shop+near+${location.latitude},${location.longitude}`,
            }}
            style={styles.webView}
          />
        )}
      </View>

      {/* List Section */}
      <ScrollView style={styles.listSection}>
        <Text style={styles.heading}>Nearby Mechanic Shops</Text>
        <Text style={styles.userLocation}>
          Your Location: {locationName || "Fetching location name..."}
        </Text>

        <View style={styles.listContainer}>
          {shops.map((shop, index) => (
            <View key={index} style={styles.shopCard}>
              <Text style={styles.shopName}>{shop.name}</Text>
              <Text>Rating: {shop.rating || "N/A"}</Text>
              <Text>
                Address: {shop.formatted_address || "Address not available"}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  mapContainer: {
    width: "100%",
    height: 400, // Increased height for the map
    marginBottom: 20, // Space between map and the list
  },
  webView: {
    width: "100%",
    height: "100%",
  },
  listSection: {
    width: "100%",
    flexGrow: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userLocation: {
    fontSize: 16,
    color: "blue",
    marginBottom: 10,
  },
  listContainer: {
    width: "100%",
  },
  shopCard: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#f8f8f8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TechLocation;
