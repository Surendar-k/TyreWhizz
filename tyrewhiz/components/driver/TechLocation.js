import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Platform,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";

import { GOOGLE_MAPS_API_KEY } from "@env";
const TechLocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    };

    getLocation();
  }, []);

  const fetchNearbyShops = async () => {
    if (!location) return;

    const { latitude, longitude } = location;
    try {
      const response = await axios.get(
        "http://overpass-api.de/api/interpreter",
        {
          params: {
            data: `[out:json];(node["shop"="car_repair"](around:5000, ${latitude},${longitude}););out;`,
          },
        }
      );

      if (response.data.elements.length === 0) {
        Alert.alert(
          "No shops found",
          "Sorry, no automobile shops were found nearby."
        );
      } else {
        setShops(response.data.elements);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch nearby shops.");
    }
  };

  const handleSearch = () => {
    fetchNearbyShops();
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for automobile shops"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />

      {Platform.OS === "web" ? (
        // Web: Google Maps Embed
        <iframe
          width="100%"
          height="500px"
          style={{ border: 0, marginTop: 20 }}
          src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${location.latitude},${location.longitude}`}
          allowFullScreen
        ></iframe>
      ) : (
        // Mobile: React Native Maps
        <View style={styles.mapPlaceholder}>
          <Text>Map is not supported on this platform</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
  },
  mapPlaceholder: {
    width: "100%",
    height: 500,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%",
    marginTop: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default TechLocation;