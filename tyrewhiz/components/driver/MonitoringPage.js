import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { CircularProgress } from "react-native-circular-progress";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios"; // Ensure you have axios installed
const cartopimg = require("../../assets/car-top-view.png");

const MonitoringPage = ({ navigation }) => {
  const [selectedFeature, setSelectedFeature] = useState("pressure"); // State for selected feature
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef(null);

  const handleNearbyShops = () => {
    navigation.navigate("TechLocation");
  };

  const getProgressColor = (pressure) => {
    if (pressure >= 70) {
      return "#28a745";
    } else if (pressure >= 40) {
      return "#ffc107";
    } else {
      return "#dc3545";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://192.168.137.1:5000/data"); // Correct endpoint for sensor data
        setSensorData(response.data); // Assuming backend sends sensorData in response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading data...</Text>
        </View>
      );
    }

    if (!sensorData) {
      return (
        <View style={styles.centered}>
          <Text>Unable to fetch sensor data. Please try again later.</Text>
        </View>
      );
    }

    switch (selectedFeature) {
      case "pressure":
        return (
          <View style={styles.carImageContainer}>
            <Image source={cartopimg} style={styles.carImage} />
            <View style={[styles.progressCircleContainer, styles.topLeft]}>
              <CircularProgress
                size={70}
                width={10}
                fill={sensorData.pressure1}
                tintColor={getProgressColor(sensorData.pressure1)}
                backgroundColor="#e0e0e0"
              />
              <Text style={styles.percentageText}>
                {sensorData.pressure1} PSI
              </Text>
            </View>
            <View style={[styles.progressCircleContainer, styles.topRight]}>
              <CircularProgress
                size={70}
                width={10}
                fill={sensorData.pressure2}
                tintColor={getProgressColor(sensorData.pressure2)}
                backgroundColor="#e0e0e0"
              />
              <Text style={styles.percentageText}>
                {sensorData.pressure2} PSI
              </Text>
            </View>
          </View>
        );

      case "temperature":
        return (
          <View style={styles.carImageContainer}>
            <Image source={cartopimg} style={styles.carImage} />
            <View style={[styles.progressCircleContainer, styles.topLeft]}>
              <FontAwesome
                name="thermometer-half"
                size={50}
                color={getProgressColor(sensorData.ambientTemp)}
              />
              <Text style={styles.percentageText}>
                {sensorData.ambientTemp} °C
              </Text>
            </View>
            <View style={[styles.progressCircleContainer, styles.topRight]}>
              <FontAwesome
                name="thermometer-half"
                size={50}
                color={getProgressColor(sensorData.objectTemp)}
              />
              <Text style={styles.percentageText}>
                {sensorData.objectTemp} °C
              </Text>
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.carImageContainer}>
            <Text style={styles.headerText}>
              Select a Feature from the Footer
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate("TechLocation")}
        >
          <FontAwesome name="wrench" size={24} color="#ffff" />
        </TouchableOpacity>
      </View>

      {/* Dynamic Content */}
      {renderContent()}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.fixedArrowLeft}
          onPress={() =>
            scrollViewRef.current?.scrollTo({ x: 0, animated: true })
          }
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <ScrollView
          horizontal
          contentContainerStyle={styles.footerContent}
          ref={scrollViewRef}
        >
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setSelectedFeature("temperature")}
          >
            <Ionicons name="thermometer" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setSelectedFeature("pressure")}
          >
            <Ionicons name="cloudy" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setSelectedFeature("tireLife")}
          >
            <Ionicons name="speedometer" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setSelectedFeature("status")}
          >
            <Ionicons name="bar-chart" size={24} color="#fff" />
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={styles.fixedArrowRight}
          onPress={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
  },

  alertContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  yellowAlert: {
    backgroundColor: "#ffc107", // Yellow background for moderate alert
  },
  redAlert: {
    backgroundColor: "#dc3545", // Red background for high alert
  },
  alertText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    top: 20,
  },
  iconContainer: {
    padding: 5,
    top: 22,
  },
  carImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  carImage: {
    width: 350,
    height: 350,
    bottom: 50,
    left: 5,
    resizeMode: "contain",
  },
  progressCircleContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  topLeft: {
    top: 90,
    left: 10,
  },
  topRight: {
    top: 90,
    right: 10,
  },
  bottomLeft: {
    bottom: 250,
    left: 20,
  },
  bottomRight: {
    bottom: 250,
    right: 20,
  },
  percentageText: {
    position: "absolute",
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffff",
    top: 100,
  },
  percentageTextTemperature: {
    marginTop: 10, // Adds space between the icon and the temperature text
    color: "white",
    fontSize: 14, // Adjust font size as needed
    textAlign: "center", // Centers the text below the icon
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: "#333",
    paddingVertical: 10,
    borderRadius: 10,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerButton: {
    padding: 20,
    backgroundColor: "rgb(117 195 0)",
    borderRadius: 20,
    marginHorizontal: 4,
  },
  arrowContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -30,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 100,
  },
  fixedArrowLeft: {
    position: "absolute",
    left: 10,
    bottom: 100,
    zIndex: 20,
    backgroundColor: "rgb(0 164 255)",
    padding: 10,
    borderRadius: 50,
  },
  fixedArrowRight: {
    position: "absolute",
    right: 10,
    bottom: 100,

    zIndex: 20,
    backgroundColor: "rgb(0 164 255)",
    padding: 10,
    borderRadius: 50,
  },
});

export default MonitoringPage;
