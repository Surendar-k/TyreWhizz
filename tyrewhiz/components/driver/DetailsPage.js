import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

const DetailsPage = ({ route, navigation }) => {
  const { personalDetails, businessDetails, isDarkMode } = route.params;

  const handleViewPairSensor = () => {
    Alert.alert("Pair Sensor", "Pairing with sensor...");
  };

  return (
    <ScrollView style={styles.container(isDarkMode)}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Details</Text>
      </View>
      {personalDetails && (
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Name: {personalDetails.name}</Text>
          {personalDetails.vehicleDetailsList.map((vehicle, index) => (
            <View key={index}>
              <Text style={styles.detailLabel}>
                Vehicle Number: {vehicle.number}, Type: {vehicle.type}
              </Text>
              <TouchableOpacity onPress={handleViewPairSensor}>
                <Text style={styles.viewButton}>View Pair Sensor</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      {businessDetails && (
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Business Name: {businessDetails.name}</Text>
          <Text style={styles.detailLabel}>Organisation ID: {businessDetails.organisation}</Text>
          {businessDetails.vehicleDetailsList.map((vehicle, index) => (
            <View key={index}>
              <Text style={styles.detailLabel}>
                Vehicle Number: {vehicle.number}, Type: {vehicle.type}
              </Text>
              <TouchableOpacity onPress={handleViewPairSensor}>
                <Text style={styles.viewButton}>View Pair Sensor</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Driver Page</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: (isDarkMode) => ({
    flex: 1,
    padding: 20,
    backgroundColor: isDarkMode ? '#000' : '#f0f4f8',
  }),
  header: {
    backgroundColor: '#007BFF',
    padding: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailBox: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  detailLabel: {
    fontSize: 18,
    marginVertical: 5,
  },
  viewButton: {
    color: '#007BFF',
    fontSize: 16,
    marginTop: 5,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default DetailsPage;