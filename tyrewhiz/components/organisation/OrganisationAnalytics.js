import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const OrganisationAnalytics = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;

  const vehicleData = {
    TotalVehicles: 50,
    ActiveVehicles: 42,
    InactiveVehicles: 8,
    IssuesResolved: 150,
    NewIssues: 20,
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
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    barPercentage: 0.7,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const pieData = [
    {
      name: 'Trucks',
      count: vehicleData.vehicleCategories.trucks,
      color: '#8464a0',
      legendFontColor: '#333',
      legendFontSize: 15,
    },
    {
      name: 'Cars',
      count: vehicleData.vehicleCategories.cars,
      color: '#0a417a',
      legendFontColor: '#333',
      legendFontSize: 15,
    },
    {
      name: 'Vans',
      count: vehicleData.vehicleCategories.vans,
      color: '#cea9bc',
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

      {/* Analytics Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>Organisation Analytics</Text>

        {/* Metrics */}
        <View style={styles.metricsContainer}>
          {Object.entries(vehicleData).slice(0, 5).map(([key, value], index) => (
            <View key={index} style={styles.metricCard}>
              <Text style={styles.metricText}>{key.replace(/([A-Z])/g, ' $1')}</Text>
              <Text style={styles.metricValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Charts */}
        <View style={styles.chartContainer}>
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
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Monthly Issue Comparison</Text>
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
