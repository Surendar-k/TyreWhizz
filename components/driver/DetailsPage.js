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

  // Combine vehicle details from both types
  const vehicles = personalDetails ? [personalDetails.vehicleDetails] : 
                 businessDetails ? [businessDetails.vehicleDetails] : [];

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
          keyExtractor={(item) => item.number}
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
  headerText: (isDarkMode) => ({
    fontSize: 32,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#000',
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
    color: isDarkMode ? '#fff' : '#000',
    fontSize: 16,
  }),
});

export default DetailsPage;