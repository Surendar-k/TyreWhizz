  import React, { useEffect, useState } from 'react';
  import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
  import { useNavigation } from '@react-navigation/native';
  import { BarChart, PieChart } from 'react-native-chart-kit';
  import { useTranslation } from "../TranslationContext"; // ✅ Import translation context
  import { useFocusEffect } from '@react-navigation/native';
  // const API_URL=process.env.API_URL;
  
  const OrganisationAnalytics = () => {
    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width;
    const { translatedText, updateTranslations } = useTranslation(); // ✅ Add translation support

  
    // State to store real-time data
    const [totalVehicles, setTotalVehicles] = useState(0);
    const [totalDrivers, setTotalDrivers] = useState(0);
    const [activeVehicles, setActiveVehicles] = useState(0);
    const [inactiveVehicles, setInactiveVehicles] = useState(0);
  
    // Fetch data from API
    useEffect(() => {
      const fetchFleetData = async () => {
        try {
          const vehicleResponse = await fetch("http://localhost:5000/api/vehicles");
          const driverResponse = await fetch("http://localhost:5000/api/drivers");
  
          const vehicleData = await vehicleResponse.json();
          const driverData = await driverResponse.json();
  
          // Update state with real-time values
          setTotalVehicles(vehicleData.length);
          setTotalDrivers(driverData.length);
  
          // Example logic to determine active/inactive vehicles
          const active = vehicleData.filter(vehicle => vehicle.status === 'active').length;
          setActiveVehicles(active);
          setInactiveVehicles(vehicleData.length - active);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchFleetData();
    }, []);
  
     useFocusEffect(React.useCallback(() =>{
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
    }, []));
  
    const vehicleData = {
      [translatedText["Total Vehicles"] || "Total Vehicles"]: totalVehicles,
      [translatedText["Active Vehicles"] || "Active Vehicles"]: activeVehicles,
      [translatedText["Inactive Vehicles"] || "Inactive Vehicles"]: inactiveVehicles,
      [translatedText["Total Drivers"] || "Total Drivers"]: totalDrivers,
      [translatedText["Issues Resolved"] || "Issues Resolved"]: 150,
      [translatedText["New Issues"] || "New Issues"]: 20,
      vehicleCategories: {
        [translatedText["Trucks"] || "Trucks"]: 20,
        [translatedText["Cars"] || "Cars"]: 25,
        [translatedText["Vans"] || "Vans"]: 5,
      },
      monthlyComparison: [
        {
          month: translatedText["Jan"] || "Jan",
          resolved: 20,
          new: 10,
        },
        {
          month: translatedText["Feb"] || "Feb",
          resolved: 25,
          new: 15,
        },
        {
          month: translatedText["Mar"] || "Mar",
          resolved: 30,
          new: 20,
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
  
    const pieData = [
      {
        name: translatedText["Trucks"] || "Trucks",
        count: vehicleData.vehicleCategories.trucks,
        color: "#8464a0",
        legendFontColor: "#333",
        legendFontSize: 15,
      },
      {
        name: translatedText["Cars"] || "Cars",
        count: vehicleData.vehicleCategories.cars,
        color: "#0a417a",
        legendFontColor: "#333",
        legendFontSize: 15,
      },
      {
        name: translatedText["Vans"] || "Vans",
        count: vehicleData.vehicleCategories.vans,
        color: "#cea9bc",
        legendFontColor: "#333",
        legendFontSize: 15,
      },
    ];
  
    const barData = {
      labels: vehicleData.monthlyComparison.map((data) => data.month),
      datasets: [
        {
          data: vehicleData.monthlyComparison.map((data) => data.resolved),
        },
        {
          data: vehicleData.monthlyComparison.map((data) => data.new),
        },
      ],
    };
  
    return (
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>TyreWhizz</Text>
        </View>
    
        {/* Role Information */}
        <View style={styles.roleContainer}>
          <Text style={styles.role}>{translatedText["Logged in as: Organization"] || "Logged in as: Organization"}</Text>
        </View>
    
        {/* Analytics Section */}
        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>{translatedText["Organisation Analytics"] || "Organisation Analytics"}</Text>
    
          {/* Metrics */}
          <View style={styles.metricsContainer}>
            {Object.entries(vehicleData).slice(0, 5).map(([key, value], index) => (
              <View key={index} style={styles.metricCard}>
                <Text style={styles.metricText}>
                  {translatedText[key] || key.replace(/([A-Z])/g, " $1")}
                </Text>
                <Text style={styles.metricValue}>{value}</Text>
              </View>
            ))}
          </View>
    
          {/* Charts */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>{translatedText["Vehicle Categories"] || "Vehicle Categories"}</Text>
            <PieChart
              data={pieData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          </View>
    
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>{translatedText["Monthly Issue Comparison"] || "Monthly Issue Comparison"}</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Ensures overall content alignment
    paddingHorizontal: 10,
    paddingVertical: 40,
    backgroundColor: 'rgb(28 10 62)',
    position: 'relative', // Allows absolute positioning of the back button
    
  },
  backButton: {
    position: 'absolute', // Positions the back button independently
    left: 10, // Keeps it at the left edge
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
  },
  backButtonText: {
    color: 'rgb(42 10 62)',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  
  roleContainer: { padding: 10, backgroundColor: 'rgb(245, 245, 245)', alignItems: 'center' },
  role: { fontSize: 18, color: 'rgb(42 10 62)' },
  
  contentContainer: {
    padding: 15,
  },
  subtitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  metricCard: {
    width: '45%',
    backgroundColor: '#eef2f3',
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    alignItems: 'center',
  },
  metricText: {
    fontSize: 18,
    color: '#555',
    fontWeight:'bold',
    marginBottom: 8,
    justifyContent:'center',
    textAlign:'center',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'rgb(110 89 149)',
  },
  chartContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default OrganisationAnalytics;