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
import { useTranslation } from "../TranslationContext"; // Import global translation context
import axios from "axios"; // Ensure you have axios installed
// const API_URL=process.env.API_URL;
const cartopimg = require("../../assets/car-top-view.png");

const MonitoringPage = ({ navigation }) => {
  const [selectedFeature, setSelectedFeature] = useState("pressure"); // State for selected feature
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef(null);
  const { translatedText, updateTranslations } = useTranslation(); // ✅ Added Translation Support

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
            <CircularProgress
              size={70}
              width={10}
              fill={pressure}
              tintColor={getProgressColor(pressure, "pressure")}
              backgroundColor="#e0e0e0"
            />
            <Text style={styles.percentageText}>{pressure} PSI</Text>
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
              <Text style={styles.percentageText}>{incontact_temp} °C</Text>
            </View>
            <View style={[styles.progressCircleContainer, styles.topRight]}>
              <FontAwesome
                name="thermometer-half"
                size={50}
                color={getProgressColor(sensorData.ambient_temp)}
              />
              <Text style={styles.percentageText}>{ambient_temp} °C</Text>
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.carImageContainer}>
            <Text style={styles.headerText}>
              {translatedText["Select a Feature from the Footer"] ||
                "Select a Feature from the Footer"}
            </Text>
          </View>
        );
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerText}>
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
