import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import hook for navigation
import { BarChart, PieChart } from 'react-native-chart-kit';

const OrganisationAnalytics = () => {
  const navigation = useNavigation(); // Access navigation object

  const screenWidth = Dimensions.get('window').width;

  const vehicleData = {
    totalVehicles: 50,
    activeVehicles: 42,
    inactiveVehicles: 8,
    issuesResolved: 150,
    newIssues: 20,
    vehicleCategories: {
      trucks: 20,
      cars: 25,
      vans: 5,
    },
    monthlyComparison: [
      { month: 'Jan', resolved: 20, new: 10 },
      { month: 'Feb', resolved: 25, new: 15 },
      { month: 'Mar', resolved: 30, new: 20 },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    barPercentage: 0.7,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const pieData = [
    {
      name: 'Trucks',
      count: vehicleData.vehicleCategories.trucks,
      color: '#4CAF50',
      legendFontColor: '#333',
      legendFontSize: 15,
    },
    {
      name: 'Cars',
      count: vehicleData.vehicleCategories.cars,
      color: '#FF9800',
      legendFontColor: '#333',
      legendFontSize: 15,
    },
    {
      name: 'Vans',
      count: vehicleData.vehicleCategories.vans,
      color: '#03A9F4',
      legendFontColor: '#333',
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
        <Text style={styles.role}>Logged in as: Organization</Text>
      </View>

      {/* Title */}
      <Text style={styles.subtitle}>Organisation Analytics</Text>

      {/* Metrics */}
      <View style={styles.metricsContainer}>
        <Text style={styles.metric}>Total Vehicles: {vehicleData.totalVehicles}</Text>
        <Text style={styles.metric}>Active Vehicles: {vehicleData.activeVehicles}</Text>
        <Text style={styles.metric}>Inactive Vehicles: {vehicleData.inactiveVehicles}</Text>
        <Text style={styles.metric}>Issues Resolved: {vehicleData.issuesResolved}</Text>
        <Text style={styles.metric}>New Issues: {vehicleData.newIssues}</Text>
      </View>

      {/* Pie Chart */}
      <Text style={styles.chartTitle}>Vehicle Categories</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="15"
      />

      {/* Bar Chart */}
      <Text style={styles.chartTitle}>Monthly Issue Comparison</Text>
      <BarChart
        data={barData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  roleContainer: { padding: 10, backgroundColor: '#e8f5e9', alignItems: 'center' },
  role: { fontSize: 16, color: '#333' },
  subtitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  metricsContainer: { marginBottom: 20 },
  metric: { fontSize: 16, marginBottom: 10 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
});

export default OrganisationAnalytics;
