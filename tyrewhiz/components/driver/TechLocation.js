import React, { useEffect, useState } from "react"; 
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Platform, 
  Alert, 
} from "react-native"; 
import axios from "axios"; 
import * as Location from "expo-location"; 

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY; 

const TechLocation = () => { 
  const [location, setLocation] = useState(null); 
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
      fetchNearbyShops(); 
    } 
  }, [location]); 

  const fetchNearbyShops = async () => { 
    setLoading(true); 
    const { latitude, longitude } = location; 

    try { 
      const response = await axios.get( 
        `https://maps.googleapis.com/maps/api/place/textsearch/json`, 
        { 
          params: { 
            query: "mechanic shop",
            location: `${latitude},${longitude}`, 
            radius: 10000, // 10km radius for better results
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
      Alert.alert("Error", "Failed to fetch nearby shops. Check API key and permissions."); 
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
      <Text style={styles.heading}>Nearby Mechanic Shops</Text> 
      
      <Text style={styles.userLocation}>
        Your Location: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
      </Text>

      <View style={styles.listContainer}> 
        {shops.map((shop, index) => ( 
          <View key={index} style={styles.shopCard}> 
            <Text style={styles.shopName}>{shop.name}</Text> 
            <Text>Rating: {shop.rating || "N/A"}</Text> 
            <Text>Address: {shop.formatted_address || "Address not available"}</Text> 
          </View> 
        ))} 
      </View> 

      {Platform.OS === "web" ? ( 
        <iframe 
          width="100%" 
          height="500px" 
          style={{ border: 0, marginTop: 20 }} 
          src={`https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_API_KEY}&q=mechanic+shop+near+${location.latitude},${location.longitude}&center=${location.latitude},${location.longitude}&zoom=14`}
          allowFullScreen 
        ></iframe> 
      ) : ( 
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
  mapPlaceholder: { 
    width: "100%", 
    height: 500, 
    marginTop: 20, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#ddd", 
  }, 
}); 

export default TechLocation;
