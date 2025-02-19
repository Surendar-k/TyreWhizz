import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useTranslation } from "../TranslationContext"; // ✅ Import translation context
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
const OrganisationAnalytics = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const { translatedText, updateTranslations } = useTranslation();

  // **State Definitions**
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [activeVehicles, setActiveVehicles] = useState(0);
  const [inactiveVehicles, setInactiveVehicles] = useState(0);
  const [vehicleCategories, setVehicleCategories] = useState({
    trucks: 0,
    cars: 0,
    vans: 0,
  });

  useEffect(() => {
    const fetchFleetData = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // Replace with actual token from storage or context
        const decoded = jwtDecode(token);
        console.log("Token Expiration:", decoded.exp);
        const vehicleResponse = await fetch(
          "http://192.168.10.16:5000/api/vehicles",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the request
              "Content-Type": "application/json",
            },
          }
        );

        const driverResponse = await fetch(
          "http://192.168.10.16:5000/api/drivers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!vehicleResponse.ok || !driverResponse.ok) {
          throw new Error(
            `HTTP error! Vehicle: ${vehicleResponse.status}, Driver: ${driverResponse.status}`
          );
        }

        const vehicleData = await vehicleResponse.json();
        const driverData = await driverResponse.json();

        console.log("Fetched Vehicle Data:", vehicleData);
        console.log("Fetched Driver Data:", driverData);

        const validVehicleData = Array.isArray(vehicleData)
          ? vehicleData
          : vehicleData.vehicles
          ? vehicleData.vehicles
          : [];

        setTotalVehicles(validVehicleData.length);
        setTotalDrivers(Array.isArray(driverData) ? driverData.length : 0);

        const active = validVehicleData.filter(
          (vehicle) => vehicle.status === "active"
        ).length;
        setActiveVehicles(active);
        setInactiveVehicles(validVehicleData.length - active);
      } catch (error) {
        console.error("Error fetching fleet data:", error.message);
      }
    };

    fetchFleetData();
  }, []);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await fetch("http://192.168.10.16:5000/api/vehicles");
        const vehicleData = await response.json();

        // **Process Vehicle Category Data**
        const categoryCounts = vehicleData.reduce((acc, vehicle) => {
          const type = vehicle.type?.toLowerCase(); // Ensure lowercase consistency
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        // **Update State**
        setVehicleCategories({
          trucks: categoryCounts["truck"] || 0,
          cars: categoryCounts["car"] || 0,
          vans: categoryCounts["van"] || 0,
        });
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    fetchVehicleData();
  }, []);

  // **Update Translations**
  useFocusEffect(
    React.useCallback(() => {
      updateTranslations([
        "Organisation Analytics",
        "Logged in as: Organization",
        "Vehicle Categories",
        "Monthly Issue Comparison",
        "Total Vehicles",
        "Active Vehicles",
        "Inactive Vehicles",
        "Total Drivers",
        "Issues Resolved",
        "New Issues",
        "Trucks",
        "Cars",
        "Vans",
      ]);
    }, [])
  );

  // **Pie Chart Data**
  const pieData = [
    {
      name: translatedText["Trucks"] || "Trucks",
      count: vehicleCategories.trucks,
      color: "#8464a0",
      legendFontColor: "#333",
      legendFontSize: 15,
    },
    {
      name: translatedText["Cars"] || "Cars",
      count: vehicleCategories.cars,
      color: "#0a417a",
      legendFontColor: "#333",
      legendFontSize: 15,
    },
    {
      name: translatedText["Vans"] || "Vans",
      count: vehicleCategories.vans,
      color: "#cea9bc",
      legendFontColor: "#333",
      legendFontSize: 15,
    },
  ];

  const barData = {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      {
        data: [20, 25, 30], // Issues Resolved
      },
      {
        data: [10, 15, 20], // New Issues
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    barPercentage: 0.7,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>❮</Text>
        </TouchableOpacity>
        <Text style={styles.title}>TyreWhizz</Text>
      </View>

      {/* Role Information */}
      <View style={styles.roleContainer}>
        <Text style={styles.role}>
          {translatedText["Logged in as: Organization"] ||
            "Logged in as: Organization"}
        </Text>
      </View>

      {/* Analytics Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>
          {translatedText["Organisation Analytics"] || "Organisation Analytics"}
        </Text>

        {/* Vehicle Stats */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricText}>
              {translatedText["Total Vehicles"] || "Total Vehicles"}
            </Text>
            <Text style={styles.metricValue}>{totalVehicles}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricText}>
              {translatedText["Active Vehicles"] || "Active Vehicles"}
            </Text>
            <Text style={styles.metricValue}>{activeVehicles}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricText}>
              {translatedText["Inactive Vehicles"] || "Inactive Vehicles"}
            </Text>
            <Text style={styles.metricValue}>{inactiveVehicles}</Text>
          </View>
        </View>

        {/* Pie Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            {translatedText["Vehicle Categories"] || "Vehicle Categories"}
          </Text>
          {vehicleCategories.trucks +
            vehicleCategories.cars +
            vehicleCategories.vans >
          0 ? (
            <PieChart
              data={pieData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          ) : (
            <Text>No data available</Text>
          )}
        </View>

        {/* Bar Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            {translatedText["Monthly Issue Comparison"] ||
              "Monthly Issue Comparison"}
          </Text>
          <BarChart
            data={barData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Ensures overall content alignment
    paddingHorizontal: 10,
    paddingVertical: 40,
    backgroundColor: "rgb(28 10 62)",
    position: "relative", // Allows absolute positioning of the back button
  },
  backButton: {
    position: "absolute", // Positions the back button independently
    left: 10, // Keeps it at the left edge
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 5,
    borderWidth: 1,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

  roleContainer: {
    padding: 10,
    backgroundColor: "rgb(245, 245, 245)",
    alignItems: "center",
  },
  role: { fontSize: 18, color: "rgb(42 10 62)" },

  contentContainer: {
    padding: 15,
  },
  subtitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  metricCard: {
    width: "45%",
    backgroundColor: "#eef2f3",
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    alignItems: "center",
  },
  metricText: {
    fontSize: 18,
    color: "#555",
    fontWeight: "bold",
    marginBottom: 8,
    justifyContent: "center",
    textAlign: "center",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "rgb(110 89 149)",
  },
  chartContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#444",
    marginBottom: 15,
    textAlign: "center",
  },
});

export default OrganisationAnalytics;
