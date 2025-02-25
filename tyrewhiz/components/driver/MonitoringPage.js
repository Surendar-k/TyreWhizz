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
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "../TranslationContext";
import * as Location from "expo-location";
import axios from "axios";
// const API_URL=process.env.API_URL;
const cartopimg = require("../../assets/car-top-view.png");

const MonitoringPage = ({ navigation }) => {
  const [selectedFeature, setSelectedFeature] = useState("pressure"); // State for selected feature
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef(null);
  const { translatedText, updateTranslations } = useTranslation(); // ✅ Added Translation Support
  const [location, setLocation] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());
  const tires = [
    { name: "Front Left", pressure: 34, temp: 35, wear: "Good" },
    { name: "Front Right", pressure: 32, temp: 38, wear: "Moderate" },
    { name: "Rear Left", pressure: 29, temp: 40, wear: "Replace Soon" },
    { name: "Rear Right", pressure: 30, temp: 37, wear: "Good" },
  ];
  const [batteryVoltage, setBatteryVoltage] = React.useState(12.6);
  const [tireHealth, setTireHealth] = React.useState("Good"); // Default value

  const [alertMessage, setAlertMessage] = React.useState(""); // Default is empty
  const [tireRotationDate, setTireRotationDate] =
    React.useState("Not Available");
  const [recommendedPSI, setRecommendedPSI] = React.useState(32); // Example default PSI
  const [roadCondition, setRoadCondition] = React.useState("Unknown");
  const [nearestService, setNearestService] = React.useState("Fetching...");

  useEffect(() => {
    // Get the user's current location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation("Permission Denied");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(
        `${loc.coords.latitude.toFixed(2)}, ${loc.coords.longitude.toFixed(2)}`
      );
    })();

    // Update time every second
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      updateTranslations([
        "Loading data...",
        "Unable to fetch sensor data. Please try again later.",
        "Rendering temperature section",
        "Rendering pressure section",
        "Back",
        "Select a Feature from the Footer",
      ]);
    }, [])
  );

  const handleNearbyShops = () => {
    navigation.navigate("TechLocation");
  };

  const getProgressColor = (value, type) => {
    if (type === "pressure") {
      if (value >= 70) {
        return "#28a745"; // Green for good pressure
      } else if (value >= 40) {
        return "#ffc107"; // Yellow for warning
      } else {
        return "#dc3545"; // Red for low pressure
      }
    } else if (type === "temperature") {
      if (value <= 20) {
        return "#28a745"; // Green for low temperature
      } else if (value <= 35) {
        return "#ffc107"; // Yellow for moderate temperature
      } else {
        return "#dc3545"; // Red for high temperature
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://147.93.108.7:5000/api/sensor");
        console.log("API Response Data:", response.data);

        // Ensure response contains expected fields
        if (
          !response.data ||
          response.data.pressure === undefined ||
          response.data.incontact_temp === undefined ||
          response.data.ambient_temp === undefined
        ) {
          throw new Error("Missing required sensor data.");
        }

        setSensorData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>{translatedText["Loading data..."] || "Loading data..."}</Text>
        </View>
      );
    }

    if (!sensorData) {
      return (
        <View style={styles.centered}>
          <Text>
            {translatedText[
              "Unable to fetch sensor data. Please try again later."
            ] || "Unable to fetch sensor data. Please try again later."}
          </Text>
        </View>
      );
    }

    // Extract the first data entry
    const { pressure, incontact_temp, ambient_temp, acc_x, acc_y } = sensorData;

    switch (selectedFeature) {
      case "pressure":
        console.log(
          translatedText["Rendering pressure section"] ||
            "Rendering pressure section",
          { pressure }
        );
        return (
          <View style={styles.carImageContainer}>
            <Image source={cartopimg} style={styles.carImage} />
            <View style={[styles.progressCircleContainer, styles.topLeft]}>
              <CircularProgress
                size={70}
                width={10}
                fill={pressure}
                tintColor={getProgressColor(pressure, "pressure")}
                backgroundColor="#e0e0e0"
              />

              <Text style={styles.percentageText}>{pressure} PSI</Text>
            </View>
            <View style={[styles.progressCircleContainer, styles.topRight]}>
              <CircularProgress
                size={70}
                width={10}
                fill={pressure}
                tintColor={getProgressColor(pressure, "pressure")}
                backgroundColor="#e0e0e0"
              />
              <Text style={styles.percentageText}>{pressure} PSI</Text>
            </View>
            <View style={[styles.progressCircleContainer, styles.bottomRight]}>
              <CircularProgress
                size={70}
                width={10}
                fill={pressure}
                tintColor={getProgressColor(pressure, "pressure")}
                backgroundColor="#e0e0e0"
              />

              <Text style={styles.percentageText}>{pressure} PSI</Text>
            </View>
            <View style={[styles.progressCircleContainer, styles.bottomLeft]}>
              <CircularProgress
                size={70}
                width={10}
                fill={pressure}
                tintColor={getProgressColor(pressure, "pressure")}
                backgroundColor="#e0e0e0"
              />

              <Text style={styles.percentageText}>{pressure} PSI</Text>
            </View>
          </View>
        );
      case "objectdetection":
        console.log(
          translatedText["Rendering object detection section"] ||
            "Rendering object detection section"
        );

        return (
          <View style={styles.carImageContainer}>
            <Image source={cartopimg} style={styles.carImage} />

            {/* Left Side - Object Detected */}
            <View style={[styles.progressCircleContainer, styles.topLeft]}>
              <FontAwesome name="crosshairs" size={40} color="red" />
              <Text style={styles.detectionText}>Object Detected</Text>
            </View>

            {/* Right Side - Monitoring */}
            <View style={[styles.progressCircleContainer, styles.topRight]}>
              <FontAwesome name="crosshairs" size={40} color="blue" />
              <Text style={styles.detectionText}>Monitoring</Text>
            </View>
          </View>
        );

      case "temperature":
        console.log(
          translatedText["Rendering temperature section"] ||
            "Rendering temperature section",
          {
            incontact_temp,
            ambient_temp,
          }
        );
        return (
          <View style={styles.carImageContainer}>
            <Image source={cartopimg} style={styles.carImage} />
            <View style={[styles.progressCircleContainer, styles.topLeft]}>
              <FontAwesome
                name="thermometer-half"
                size={50}
                color={getProgressColor(sensorData.incontact_temp)}
              />

              <Text style={styles.percentageText}>
                Incont : {incontact_temp} °C Ambi : {ambient_temp} °C
              </Text>
            </View>
            <View style={[styles.progressCircleContainer, styles.topRight]}>
              <FontAwesome
                name="thermometer-half"
                size={50}
                color={getProgressColor(sensorData.incontact_temp)}
              />
              <Text style={styles.percentageText}>
                Incont : {incontact_temp} °C Ambi : {ambient_temp} °C
              </Text>
            </View>
            <View style={[styles.progressCircleContainer, styles.bottomRight]}>
              <FontAwesome
                name="thermometer-half"
                size={50}
                color={getProgressColor(sensorData.incontact_temp)}
              />
              <Text style={styles.percentageText}>
                Incont : {incontact_temp} °C Ambi : {ambient_temp} °C
              </Text>
            </View>
            <View style={[styles.progressCircleContainer, styles.bottomLeft]}>
              <FontAwesome
                name="thermometer-half"
                size={50}
                color={getProgressColor(sensorData.incontact_temp)}
              />
              <Text style={styles.percentageText}>
                Incont : {incontact_temp} °C Ambi : {ambient_temp} °C
              </Text>
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.container}>
            {/* Feature Selection Prompt */}
            <View style={styles.selectionPrompt}>
              <Text style={styles.headerText}>
                {translatedText["Car Dashboard"] || "Car Dashboard"}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              {/* Pressure Indicator */}
              <View style={styles.box}>
                <FontAwesome name="tachometer" size={40} color="orange" />
                <Text style={styles.infoText}>{pressure} PSI</Text>
              </View>

              {/* Temperature Indicator */}
              <View style={styles.box}>
                <FontAwesome name="thermometer-half" size={40} color="red" />
                <Text style={styles.infoText}>
                  {incontact_temp}°C / {ambient_temp}°C
                </Text>
              </View>

              {/* Location Indicator */}
              <View style={styles.box}>
                <FontAwesome name="map-marker" size={40} color="blue" />
                <Text style={styles.infoText}>
                  {location || "Fetching location..."}
                </Text>
              </View>

              {/* Date & Time */}
              <View style={styles.box}>
                <FontAwesome name="calendar" size={40} color="green" />
                <Text style={styles.infoText}>
                  {dateTime.toLocaleDateString()} -{" "}
                  {dateTime.toLocaleTimeString()}
                </Text>
              </View>

              {/* Battery Level Indicator */}
              <View style={styles.box}>
                <FontAwesome name="battery-half" size={40} color="purple" />
                <Text style={styles.infoText}>{batteryVoltage}V</Text>
              </View>

              {/* Tire Health Status */}
              <View style={styles.box}>
                <FontAwesome name="wrench" size={40} color="gray" />
                <Text style={styles.infoText}>{tireHealth || "Normal"}</Text>
              </View>

              {/* Warning Alerts */}
              <View style={[styles.box, styles.warningBox]}>
                <FontAwesome
                  name="exclamation-triangle"
                  size={40}
                  color="red"
                />
                <Text style={styles.warningText}>
                  {alertMessage || "No issues detected"}
                </Text>
              </View>

              {/* Tire Rotation Reminder */}
              <View style={styles.box}>
                <FontAwesome name="refresh" size={40} color="blue" />
                <Text style={styles.infoText}>
                  Next Rotation: {tireRotationDate || "Not set"}
                </Text>
              </View>

              {/* Recommended PSI Range */}
              <View style={styles.box}>
                <FontAwesome name="info-circle" size={40} color="black" />
                <Text style={styles.infoText}>
                  Recommended PSI: {recommendedPSI} PSI
                </Text>
              </View>

              {/* Weather Condition Alert */}
              <View style={styles.box}>
                <FontAwesome name="cloud" size={40} color="skyblue" />
                <Text style={styles.infoText}>
                  Road Conditions: {roadCondition || "Clear"}
                </Text>
              </View>

              {/* Nearest Service Station */}
              <View style={styles.box}>
                <FontAwesome name="wrench" size={40} color="darkblue" />
                <Text style={styles.infoText}>
                  Nearest Service: {nearestService || "Fetching..."}
                </Text>
              </View>
            </View>
          </View>
        );
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerTextBack}>
            {translatedText["Back"] || "Back"}
          </Text>
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
            onPress={() => setSelectedFeature("objectdetection")}
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
  headerTextBack: {
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
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffff",
    top: 100,
  },
  detectionText: {
    position: "absolute",
    fontSize: 15,
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
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
    top: 10,
  },
  box: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 120,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  selectionPrompt: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    position: "fixed",
    bottom: 0,
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
    gap: 25,
    margin:10
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
