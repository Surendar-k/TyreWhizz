import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DetailsPage = ({ route }) => {
  const navigation = useNavigation();
  const { personalDetails, businessDetails, isDarkMode } = route.params;

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  // Vehicles array without image option
  const vehicles = [
    { id: '1', number: 'ABC 123', type: 'Car' },
    { id: '2', number: 'XYZ 456', type: 'Truck' },
    { id: '3', number: 'SSS 456', type: 'Bike' },
  ];

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setPopupVisible(true);
    setDropdownOpen(false);
  };

  const renderVehicleItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleVehicleSelect(item)} style={styles.vehicleItem}>
      <Text style={styles.vehicleText}>{item.number} ({item.type})</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container(isDarkMode)}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText(isDarkMode)}>Tyre Whizz</Text>
        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.themeToggleButton}>
          <Text style={styles.themeToggleText}>{isDarkMode ? '🌞' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setDropdownOpen(!isDropdownOpen)} style={styles.dropdown}>
        <Text style={styles.dropdownText}>Select Vehicle</Text>
      </TouchableOpacity>

      {isDropdownOpen && (
        <FlatList
          data={vehicles}
          renderItem={renderVehicleItem}
          keyExtractor={(item) => item.id}
          style={styles.dropdownList}
        />
      )}

      {isPopupVisible && (
        <Modal transparent visible={isPopupVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.popup}>
              <Text style={styles.popupTitle}>Vehicle Details</Text>
              <Text style={styles.popupText}>
                {selectedVehicle.type} Number: {selectedVehicle.number}
              </Text>
              <Text style={styles.popupText}>
                {personalDetails ? `Owner: ${personalDetails.name}` : `Owner: ${businessDetails.name}, Org ID: ${businessDetails.organisation}`}
              </Text>
              <TouchableOpacity onPress={() => setPopupVisible(false)} style={styles.closeButton}>
                <Text style={styles.buttonText(isDarkMode)}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: (isDarkMode) => ({
    flex: 1,
    padding: 20,
    backgroundColor: isDarkMode ? '#000' : '#f0f4f8',
  }),
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  headerText: (isDarkMode) => ({
    fontSize: 32,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#fff',
  }),
  themeToggleButton: {
    padding: 10,
  },
  themeToggleText: {
    fontSize: 24,
  },
  dropdown: {
    borderWidth: 2,
    borderColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 18,
    color: '#007BFF',
  },
  dropdownList: {
    maxHeight: 200,
    borderWidth: 2,
    borderColor: '#007BFF',
    borderRadius: 5,
  },
  vehicleItem: {
    padding: 10,
  },
  vehicleText: {
    fontSize: 16,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  popupTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  popupText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: (isDarkMode) => ({
    color: isDarkMode ? '#fff' : '#fff',
    fontSize: 16,
  }),
});

export default DetailsPage;