import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { CircularProgress } from "react-native-circular-progress";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "../TranslationContext";
import * as Location from "expo-location";

const cartopimg = require("../../assets/car-top-view.png");
const biketopimg = require("../../assets/biketopimg.png"); // You'll need to add this asset
const trucktopimg = require("../../assets/trucktopimg.png"); // You'll need to add this asset
const { width, height } = Dimensions.get("window");

const MonitoringPage = ({ navigation, route }) => {
  // Get vehicle type from navigation params, default to 4-wheeler if not specified
  const vehicleType = route.params?.vehicleType || 4;

  const [selectedFeature, setSelectedFeature] = useState("dashboard"); // Default to dashboard view
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(false); // Set to false since we're using random data
  const scrollViewRef = useRef(null);
  const { translatedText, updateTranslations } = useTranslation();
  const [location, setLocation] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());

  // Generate random sensor data
  const generateRandomSensorData = () => {
    return {
      pressure: (Math.random() * 15 + 25).toFixed(2), // 25-40 PSI
      incontact_temp: (Math.random() * 30 + 25).toFixed(2), // 25-55°C
      ambient_temp: (Math.random() * 20 + 15).toFixed(2), // 15-35°C
      acc_x: (Math.random() * 2 - 1).toFixed(2), // -1 to 1
      acc_y: (Math.random() * 2 - 1).toFixed(2), // -1 to 1
      acc_z: (Math.random() * 2 - 1).toFixed(2), // -1 to 1
    };
  };

  // Generate tire data based on vehicle type with random values
  const generateTireData = () => {
    const generateRandomTireData = () => ({
      pressure: Math.floor(Math.random() * 15 + 25), // 25-40 PSI
      temp: Math.floor(Math.random() * 25 + 30), // 30-55°C
      wear: ["Good", "Moderate", "Replace Soon"][Math.floor(Math.random() * 3)],
    });

    switch (vehicleType) {
      case 2:
        return [{ name: "Front", ...generateRandomTireData() }];
      case 6:
        return [{ name: "Front Left", ...generateRandomTireData() }];
      case 4:
      default:
        return [{ name: "Rear Left", ...generateRandomTireData() }];
    }
  };

  // Use the function to generate tire data
  const [tires, setTires] = useState(generateTireData());

  const [batteryVoltage, setBatteryVoltage] = useState(12.6);
  const [tireHealth, setTireHealth] = useState("Good");
  const [alertMessage, setAlertMessage] = useState("");
  const [tireRotationDate, setTireRotationDate] = useState("Not Available");
  const [recommendedPSI, setRecommendedPSI] = useState(32);
  const [tyreAge, setTyreAge] = useState("New");
  const [nearestService, setNearestService] = useState("Fetching...");

  // Get the appropriate vehicle image based on type
  const getVehicleImage = () => {
    switch (vehicleType) {
      case 2:
        return biketopimg;
      case 6:
        return trucktopimg;
      case 4:
      default:
        return cartopimg;
    }
  };

  useEffect(() => {
    // Initialize with random sensor data
    setSensorData(generateRandomSensorData());

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

      // Mock data - set nearest service based on location
      setNearestService("AutoTech (2.3 mi)");
    })();

    // Update time every second
    const timeInterval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    // Update sensor data and tire data every second
    const dataInterval = setInterval(() => {
      setSensorData(generateRandomSensorData());
      setTires(generateTireData());

      // Update battery voltage randomly
      setBatteryVoltage((Math.random() * 2 + 11.5).toFixed(1)); // 11.5-13.5V
    }, 1000);

    // Set mock tire rotation date
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 2);
    setTireRotationDate(nextDate.toLocaleDateString());

    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, [vehicleType]);

  // Update alerts based on current tire condition
  useEffect(() => {
    if (
      tires.some((tire) => tire.wear === "Replace Soon" || tire.pressure < 30)
    ) {
      const lowPressureTire = tires.find((tire) => tire.pressure < 30);
      if (lowPressureTire) {
        setAlertMessage(
          `Low tire pressure detected on ${lowPressureTire.name}`
        );
      } else {
        const wornTire = tires.find((tire) => tire.wear === "Replace Soon");
        if (wornTire) {
          setAlertMessage(`Tire wear critical on ${wornTire.name}`);
        }
      }
      setTireHealth("Requires Attention");
    } else {
      setAlertMessage("");
      setTireHealth("Good");
    }
  }, [tires]);

  useFocusEffect(
    React.useCallback(() => {
      updateTranslations([
        "Loading data...",
        "Unable to fetch sensor data. Please try again later.",
        "Tire Pressure",
        "Temperature",
        "Back",
        "Dashboard",
        "Object Detection",
        "Status",
        "Tire Health",
        "Car Monitoring",
        "Bike Monitoring",
        "Truck Monitoring",
      ]);
    }, [])
  );

  const handleNearbyShops = () => {
    navigation.navigate("TechLocation");
  };

  const getTirePressureStatus = (value) => {
    if (value >= 32 && value <= 36) {
      return { color: "#28a745", status: "Optimal" }; // Green for good pressure
    } else if (value >= 28 && value < 32) {
      return { color: "#ffc107", status: "Low" }; // Yellow for warning
    } else {
      return { color: "#dc3545", status: "Critical" }; // Red for danger
    }
  };

  const getTemperatureStatus = (value) => {
    if (value <= 40) {
      return { color: "#28a745", status: "Normal" }; // Green for normal temp
    } else if (value <= 60) {
      return { color: "#ffc107", status: "Warning" }; // Yellow for warning
    } else {
      return { color: "#dc3545", status: "Overheating" }; // Red for high temp
    }
  };

  // Helper function to place tires based on vehicle type
  const getTirePositionStyles = (index) => {
    if (vehicleType === 2) {
      // For 2-wheeler (bike), place tires in a vertical line
      return index === 0
        ? { top: 100, alignSelf: "center" }
        : { bottom: 60, alignSelf: "center" };
    } else if (vehicleType === 6) {
      // For 6-wheeler (truck)
      switch (index) {
        case 0:
          return styles.topLeft;
        case 1:
          return styles.topRight;
        case 2:
          return { top: "45%", left: "8%" };
        case 3:
          return { top: "45%", right: "8%" };
        case 4:
          return styles.bottomLeft;
        case 5:
          return styles.bottomRight;
        default:
          return {};
      }
    } else {
      // For 4-wheeler (default car)
      switch (index) {
        case 0:
          return styles.topLeft;
        case 1:
          return styles.topRight;
        case 2:
          return styles.bottomLeft;
        case 3:
          return styles.bottomRight;
        default:
          return {};
      }
    }
  };

  // Get short tire position name
  const getTireShortName = (index) => {
    if (vehicleType === 2) {
      return index === 0 ? "F" : "R"; // Front, Rear
    } else if (vehicleType === 6) {
      // Front Left, Front Right, Middle Left, Middle Right, Rear Left, Rear Right
      const positions = ["FL", "FR", "ML", "MR", "RL", "RR"];
      return positions[index] || "";
    } else {
      // Front Left, Front Right, Rear Left, Rear Right
      const positions = ["FL", "FR", "RL", "RR"];
      return positions[index] || "";
    }
  };

  // Get header title based on vehicle type
  const getMonitoringTitle = () => {
    switch (vehicleType) {
      case 2:
        return translatedText["Bike Monitoring"] || "Bike Monitoring";
      case 6:
        return translatedText["Truck Monitoring"] || "Truck Monitoring";
      case 4:
      default:
        return translatedText["Car Monitoring"] || "Car Monitoring";
    }
  };

  const renderContent = () => {
    if (!sensorData) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {translatedText[
              "Unable to fetch sensor data. Please try again later."
            ] || "Unable to fetch sensor data. Please try again later."}
          </Text>
        </View>
      );
    }

    // Extract data
    const { pressure, incontact_temp, ambient_temp, acc_x, acc_y, acc_z } =
      sensorData;

    switch (selectedFeature) {
      case "pressure":
        return (
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.carImageContainer}>
              <Text style={styles.sectionTitle}>
                {translatedText["Tire Pressure"] || "Tire Pressure"}
              </Text>
              <Image source={getVehicleImage()} style={styles.carImage} />

              {/* Render tire pressure gauges dynamically based on vehicle type */}
              {tires.map((tire, index) => (
                <View
                  key={`pressure-${index}`}
                  style={[styles.tireContainer, getTirePositionStyles(index)]}
                >
                  <CircularProgress
                    size={80}
                    width={8}
                    fill={tire.pressure * 2}
                    tintColor={getTirePressureStatus(tire.pressure).color}
                    backgroundColor="#2a2a2a"
                    rotation={0}
                    backgroundWidth={5}
                  >
                    {() => (
                      <View style={styles.tireDataContainer}>
                        <Text style={styles.tirePressureText}>
                          {tire.pressure}
                        </Text>
                        <Text style={styles.tireUnitText}>PSI</Text>
                      </View>
                    )}
                  </CircularProgress>
                  <Text style={styles.tirePositionText}>
                    {getTireShortName(index)}
                  </Text>
                  <Text
                    style={[
                      styles.tireStatusText,
                      { color: getTirePressureStatus(tire.pressure).color },
                    ]}
                  >
                    {getTirePressureStatus(tire.pressure).status}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Pressure Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Recommended PSI:</Text>
                <Text style={styles.infoValue}>{recommendedPSI} PSI</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Average Pressure:</Text>
                <Text style={styles.infoValue}>
                  {(
                    tires.reduce((sum, tire) => sum + tire.pressure, 0) /
                    tires.length
                  ).toFixed(1)}{" "}
                  PSI
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Next Rotation:</Text>
                <Text style={styles.infoValue}>{tireRotationDate}</Text>
              </View>
            </View>

            {alertMessage && (
              <View style={styles.alertBox}>
                <FontAwesome
                  name="exclamation-triangle"
                  size={24}
                  color="#ffc107"
                />
                <Text style={styles.alertText}>{alertMessage}</Text>
              </View>
            )}
          </ScrollView>
        );

      case "temperature":
        return (
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.carImageContainer}>
              <Text style={styles.sectionTitle}>
                {translatedText["Temperature"] || "Temperature"}
              </Text>
              <Image source={getVehicleImage()} style={styles.carImage} />

              {/* Render tire temperature gauges dynamically based on vehicle type */}
              {tires.map((tire, index) => (
                <View
                  key={`temp-${index}`}
                  style={[styles.tireContainer, getTirePositionStyles(index)]}
                >
                  <CircularProgress
                    size={80}
                    width={8}
                    fill={(tire.temp / 80) * 100}
                    tintColor={getTemperatureStatus(tire.temp).color}
                    backgroundColor="#2a2a2a"
                    rotation={0}
                    backgroundWidth={5}
                  >
                    {() => (
                      <View style={styles.tireDataContainer}>
                        <Text style={styles.tirePressureText}>{tire.temp}</Text>
                        <Text style={styles.tireUnitText}>°C</Text>
                      </View>
                    )}
                  </CircularProgress>
                  <Text style={styles.tirePositionText}>
                    {getTireShortName(index)}
                  </Text>
                  <Text
                    style={[
                      styles.tireStatusText,
                      { color: getTemperatureStatus(tire.temp).color },
                    ]}
                  >
                    {getTemperatureStatus(tire.temp).status}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Temperature Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ambient Temperature:</Text>
                <Text style={styles.infoValue}>{ambient_temp}°C</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contact Temperature:</Text>
                <Text style={styles.infoValue}>{incontact_temp}°C</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Average Tire Temp:</Text>
                <Text style={styles.infoValue}>
                  {(
                    tires.reduce((sum, tire) => sum + tire.temp, 0) /
                    tires.length
                  ).toFixed(1)}
                  °C
                </Text>
              </View>
            </View>

            {Math.max(...tires.map((t) => t.temp)) > 38 && (
              <View style={styles.alertBox}>
                <FontAwesome
                  name="exclamation-triangle"
                  size={24}
                  color="#ffc107"
                />
                <Text style={styles.alertText}>
                  High temperature detected. Consider checking tire condition.
                </Text>
              </View>
            )}
          </ScrollView>
        );

      case "objectdetection":
        return (
          <View style={styles.carImageContainer}>
            <Text style={styles.sectionTitle}>
              {translatedText["Object Detection"] || "Object Detection"}
            </Text>
            <Image source={getVehicleImage()} style={styles.carImage} />

            {/* Left Side - Object Detected */}
            <View style={[styles.objectDetectionContainer, styles.leftSide]}>
              <View style={styles.objectDetectionBubble}>
                <FontAwesome name="crosshairs" size={40} color="#ff4757" />
              </View>
              <Text style={styles.objectDetectionText}>Object Detected</Text>
              <Text style={styles.objectDetailText}>
                Distance: {(Math.random() * 3 + 0.5).toFixed(1)}m
              </Text>
            </View>

            {/* Right Side - Monitoring */}
            <View style={[styles.objectDetectionContainer, styles.rightSide]}>
              <View style={styles.objectMonitoringBubble}>
                <FontAwesome name="shield" size={40} color="#2ed573" />
              </View>
              <Text style={styles.objectMonitoringText}>Safe Zone</Text>
              <Text style={styles.objectDetailText}>No obstacles</Text>
            </View>

            {/* Bottom information */}
            <View style={styles.objectInfoContainer}>
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Detection Status</Text>
                <View style={styles.sensorStatusContainer}>
                  <View style={styles.sensorStatus}>
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor:
                            Math.random() > 0.3 ? "#2ed573" : "#ff4757",
                        },
                      ]}
                    />
                    <Text style={styles.sensorName}>Front Sensors</Text>
                  </View>
                  <View style={styles.sensorStatus}>
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor:
                            Math.random() > 0.3 ? "#2ed573" : "#ff4757",
                        },
                      ]}
                    />
                    <Text style={styles.sensorName}>Rear Sensors</Text>
                  </View>
                  <View style={styles.sensorStatus}>
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor:
                            Math.random() > 0.3 ? "#2ed573" : "#ff4757",
                        },
                      ]}
                    />
                    <Text style={styles.sensorName}>Side Sensors</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );

      case "dashboard":
      default:
        return (
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.dashboardContainer}>
              <Text style={styles.sectionTitle}>
                {translatedText["Dashboard"] || "Dashboard"}
              </Text>

              {/* Status Cards Row */}
              <View style={styles.statusCardRow}>
                <View
                  style={[
                    styles.statusCard,
                    tireHealth !== "Good" ? styles.warningCard : {},
                  ]}
                >
                  <FontAwesome
                    name={vehicleType === 2 ? "motorcycle" : "car"}
                    size={28}
                    color={tireHealth === "Good" ? "#2ed573" : "#ffa502"}
                  />
                  <Text style={styles.statusLabel}>
                    {translatedText["Tire Health"] || "Tire Health"}
                  </Text>
                  <Text style={styles.statusValue}>{tireHealth}</Text>
                </View>
                <View style={styles.statusCard}>
                  <FontAwesome
                    name="battery-three-quarters"
                    size={28}
                    color="#2ed573"
                  />
                  <Text style={styles.statusLabel}>Battery</Text>
                  <Text style={styles.statusValue}>{batteryVoltage}V</Text>
                </View>
                <View style={styles.statusCard}>
                  <FontAwesome name="tachometer" size={28} color="#2ed573" />
                  <Text style={styles.statusLabel}>Avg. PSI</Text>
                  <Text style={styles.statusValue}>
                    {(
                      tires.reduce((sum, tire) => sum + tire.pressure, 0) /
                      tires.length
                    ).toFixed(1)}
                  </Text>
                </View>
              </View>

              {/* Alert Box */}
              {alertMessage && (
                <View style={styles.dashboardAlertBox}>
                  <FontAwesome
                    name="exclamation-triangle"
                    size={24}
                    color="#ffc107"
                  />
                  <Text style={styles.dashboardAlertText}>{alertMessage}</Text>
                </View>
              )}

              {/* Info Cards */}
              <View style={styles.infoCardGrid}>
                {/* Location Card */}
                <View style={styles.dashboardInfoCard}>
                  <View style={styles.cardHeader}>
                    <FontAwesome name="map-marker" size={20} color="#75c300" />
                    <Text style={styles.cardTitle}>Location</Text>
                  </View>
                  <Text style={styles.cardValue}>
                    {location || "Fetching location..."}
                  </Text>
                </View>

                {/* Date & Time Card */}
                <View style={styles.dashboardInfoCard}>
                  <View style={styles.cardHeader}>
                    <FontAwesome name="calendar" size={20} color="#75c300" />
                    <Text style={styles.cardTitle}>Date & Time</Text>
                  </View>
                  <Text style={styles.cardValue}>
                    {dateTime.toLocaleDateString()}
                  </Text>
                  <Text style={styles.cardSubValue}>
                    {dateTime.toLocaleTimeString()}
                  </Text>
                </View>

                {/* Tyre Age Card */}
                <View style={styles.dashboardInfoCard}>
                  <View style={styles.cardHeader}>
                    <FontAwesome name="heart" size={20} color="#75c300" />
                    <Text style={styles.cardTitle}>Tyre Age</Text>
                  </View>
                  <Text style={styles.cardValue}>{tyreAge}</Text>
                </View>

                {/* Service Station Card */}
                <TouchableOpacity
                  style={styles.dashboardInfoCard}
                  onPress={handleNearbyShops}
                >
                  <View style={styles.cardHeader}>
                    <FontAwesome name="wrench" size={20} color="#75c300" />
                    <Text style={styles.cardTitle}>Nearest Service</Text>
                  </View>
                  <Text style={styles.cardValue}>{nearestService}</Text>
                  <Text style={styles.cardAction}>Tap to view more</Text>
                </TouchableOpacity>

                {/* Tire Rotation Card */}
                <View style={styles.dashboardInfoCard}>
                  <View style={styles.cardHeader}>
                    <FontAwesome name="refresh" size={20} color="#75c300" />
                    <Text style={styles.cardTitle}>Next Rotation</Text>
                  </View>
                  <Text style={styles.cardValue}>{tireRotationDate}</Text>
                </View>

                {/* Temperature Card */}
                <View style={styles.dashboardInfoCard}>
                  <View style={styles.cardHeader}>
                    <FontAwesome
                      name="thermometer-half"
                      size={20}
                      color="#75c300"
                    />
                    <Text style={styles.cardTitle}>Temperature</Text>
                  </View>
                  <View style={styles.tempRow}>
                    <Text style={styles.tempLabel}>Ambient:</Text>
                    <Text style={styles.tempValue}>{ambient_temp}°C</Text>
                  </View>
                  <View style={styles.tempRow}>
                    <Text style={styles.tempLabel}>Contact:</Text>
                    <Text style={styles.tempValue}>{incontact_temp}°C</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
            <Text style={styles.headerTextBack}>
              {translatedText["Back"] || "Back"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getMonitoringTitle()}</Text>
          <TouchableOpacity
            style={styles.serviceButton}
            onPress={() => navigation.navigate("TechLocation")}
          >
            <FontAwesome name="wrench" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.contentWrapper}>
          <ScrollView contentContainerStyle={styles.content}>
            {renderContent()}
          </ScrollView>
        </View>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.footerContent}
            ref={scrollViewRef}
          >
            <TouchableOpacity
              style={[
                styles.footerButton,
                selectedFeature === "dashboard" && styles.footerButtonActive,
              ]}
              onPress={() => setSelectedFeature("dashboard")}
            >
              <Ionicons name="speedometer" size={24} color="#fff" />
              <Text style={styles.footerButtonText}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.footerButton,
                selectedFeature === "pressure" && styles.footerButtonActive,
              ]}
              onPress={() => setSelectedFeature("pressure")}
            >
              <Ionicons name="speedometer-outline" size={24} color="#fff" />
              <Text style={styles.footerButtonText}>Pressure</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.footerButton,
                selectedFeature === "temperature" && styles.footerButtonActive,
              ]}
              onPress={() => setSelectedFeature("temperature")}
            >
              <Ionicons name="thermometer" size={24} color="#fff" />
              <Text style={styles.footerButtonText}>Temperature</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.footerButton,
                selectedFeature === "objectdetection" &&
                  styles.footerButtonActive,
              ]}
              onPress={() => setSelectedFeature("objectdetection")}
            >
              <Ionicons name="eye" size={24} color="#fff" />
              <Text style={styles.footerButtonText}>Detection</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Base container styles
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    backgrounfdColor: "#121212",
  },
  contentWrapper: {
    flex: 1, // Ensures the content takes up available space
  },
  content: {
    flexGrow: 1, // Allows content to be scrollable while keeping footer at bottom
    paddingBottom: 60, // Prevents overlap with footer
  },

  scrollContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#ff4757",
    textAlign: "center",
    fontSize: 16,
  },

  // Header styles
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
    zIndex: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  headerTextBack: {
    fontSize: 16,
    color: "#ffffff",
    marginLeft: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  serviceButton: {
    padding: 8,
  },

  // Car image and tire positioning styles
  carImageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    paddingVertical: 100,
  },
  carImage: {
    height: 200,
    resizeMode: "contain",
  },
  tireContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(117, 195, 0, 0.1)", // Subtle accent background
    borderRadius: 15,
    padding: 10,
  },
  topLeft: {
    top: "20%", // Move front tires slightly higher
    left: "8%",
  },
  topRight: {
    top: "20%", // Move front tires slightly higher
    right: "8%",
  },
  bottomLeft: {
    bottom: "20%", // Move back tires slightly lower
    left: "8%",
  },
  bottomRight: {
    bottom: "20%", // Move back tires slightly lower
    right: "8%",
  },

  tireDataContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  tirePressureText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tireUnitText: {
    color: "#ffffff",
    fontSize: 12,
  },
  tirePositionText: {
    color: "#ffffff",
    fontSize: 14,
    marginTop: 5,
  },
  tireStatusText: {
    fontSize: 12,
    marginTop: 2,
  },

  // Section styling
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginVertical: 15,
  },

  // Information card styles
  infoCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  infoLabel: {
    color: "#aaaaaa",
    fontSize: 14,
  },
  infoValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },

  // Alert styles
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
  },
  alertText: {
    color: "#ffffff",
    marginLeft: 10,
    fontSize: 14,
  },

  // Footer navigation styles
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#111",
    paddingVertical: 10,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  footerButton: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  footerButtonActive: {
    backgroundColor: "#333",
    borderRadius: 10,
  },
  footerButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  // Dashboard styles
  dashboardContainer: {
    padding: 15,
  },
  statusCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statusCard: {
    backgroundColor: "#2A2A2A", // Slightly lighter background
    borderRadius: 15, // More rounded corners
    padding: 15,
    alignItems: "center",
    width: "31%",
    elevation: 3, // Subtle elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderLeftWidth: 3,
    borderLeftColor: "transparent", // Prepare for conditional coloring
  },
  warningCard: {
    borderLeftWidth: 3,
    borderLeftColor: "#ffa502",
  },
  statusLabel: {
    color: "#aaaaaa",
    fontSize: 12,
    marginTop: 5,
  },
  statusValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2,
  },
  dashboardAlertBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333", // Dark background
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107", // Warning color
    padding: 12,
    marginVertical: 15,
    borderRadius: 10,
    elevation: 3,
  },
  dashboardAlertText: {
    color: "#ffffff",
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
  },

  // Dashboard info cards grid
  infoCardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dashboardInfoCard: {
    backgroundColor: "#2A2A2A", // Consistent dark background
    borderRadius: 15, // More rounded corners
    padding: 15,
    width: "48%",
    marginBottom: 15,
    elevation: 3, // Subtle elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(117, 195, 0, 0.2)", // Subtle accent border
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  cardValue: {
    color: "#ffffff",
    fontSize: 16,
  },
  cardSubValue: {
    color: "#aaaaaa",
    fontSize: 14,
    marginTop: 2,
  },
  cardAction: {
    color: "#75c300",
    fontSize: 12,
    marginTop: 8,
  },
  tempRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  tempLabel: {
    color: "#aaaaaa",
    fontSize: 14,
  },
  tempValue: {
    color: "#ffffff",
    fontSize: 14,
  },

  // Object detection styles
  objectDetectionContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)", // Semi-transparent background
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(117, 195, 0, 0.3)", // Subtle accent border
  },
  leftSide: {
    left: "10%",
    top: "40%",
  },
  rightSide: {
    right: "10%",
    top: "40%",
  },
  objectDetectionBubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 71, 87, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ff4757",
  },
  objectMonitoringBubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(46, 213, 115, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2ed573",
  },
  objectDetectionText: {
    color: "#ff4757",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  objectMonitoringText: {
    color: "#2ed573",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  objectDetailText: {
    color: "#ffffff",
    fontSize: 12,
    marginTop: 2,
  },
  objectInfoContainer: {
    position: "absolute",
    bottom: 0, // Ensures it's at the bottom
    left: 0,
    right: 0,
    alignItems: "center", // Centers the content
    paddingVertical: 10, // Adds some spacing for better visibility
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: Semi-transparent background for better contrast
  },

  sensorStatusContainer: {
    marginTop: 8,
  },
  sensorStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  sensorName: {
    color: "#ffffff",
    fontSize: 14,
  },
});

export default MonitoringPage;
