import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import axios from "axios";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";
import { useTranslation } from "../TranslationContext";
import { useFocusEffect } from "@react-navigation/native";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const TechLocation = () => {
  const navigation = useNavigation(); // Get navigation instance
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { translatedText, updateTranslations } = useTranslation(); // ✅ Added Translation Support
  
   useFocusEffect(React.useCallback(() =>{
    updateTranslations([
     "Permission to access location was denied","Unable to fetch location name","Error fetching location name:","Unable to fetch location name","No shops found", "No mechanic shops were found nearby.","Error",
        "Failed to fetch nearby shops. Check API key and permissions.","Fetching location and nearby mechanic shops...","Nearby Mechanics","Your Location: ",
        "Fetching location name...","Rating: ","Address not available","N/A","Address:"
    ])
  }));

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg(translatedText["Permission to access location was denied"]||"Permission to access location was denied");
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
      fetchLocationName();
      fetchNearbyShops();
    }
  }, [location]);

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
        setLocationName(response.data.results[0].formatted_address);
      } else {
        setLocationName(translatedText["Unable to fetch location name"]||"Unable to fetch location name");
      }
    } catch (error) {
      console.error(translatedText["Error fetching location name:"]||"Error fetching location name:", error);
      setLocationName(translatedText["Unable to fetch location name"]||"Unable to fetch location name");
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
        Alert.alert(translatedText["No shops found", "No mechanic shops were found nearby."]||"No shops found", "No mechanic shops were found nearby.");
      } else {
        setShops(response.data.results);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
      Alert.alert(
        translatedText["Error",
        "Failed to fetch nearby shops. Check API key and permissions."]||"Error",
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
        <Text>{translatedText["Fetching location and nearby mechanic shops..."]||"Fetching location and nearby mechanic shops..."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.headerText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translatedText["Nearby Mechanics"]||"Nearby Mechanics"}</Text>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        {Platform.OS === "web" ? (
          <iframe
            width="100%"
            height="400px"
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
        <Text style={styles.userLocation}>
          {translatedText["Your Location: "]||"Your Location: "}{locationName || translatedText["Fetching location name..."]||"Fetching location name..."}
        </Text>

        <View style={styles.listContainer}>
          {shops.map((shop, index) => (
            <View key={index} style={styles.shopCard}>
              <Text style={styles.shopName}>{shop.name}</Text>
              <Text>{translatedText["Rating: "]||"Rating: "}{shop.rating || translatedText["N/A"]||"N/A"}</Text>
              <Text>
                {translatedText["Address:"]||"Address:"}{shop.formatted_address || translatedText["Address not available"]||"Address not available"}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#6200ea",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "monospace",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  mapContainer: {
    width: "100%",
    height: 400,
    marginBottom: 20,
  },
  webView: {
    width: "100%",
    height: "100%",
  },
  listSection: {
    width: "100%",
    flexGrow: 1,
  },
  userLocation: {
    fontSize: 16,
    color: "blue",
    marginBottom: 10,
    textAlign: "center",
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
