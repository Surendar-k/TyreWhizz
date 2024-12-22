import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

const vehicles = [
  {
    id: 1,
    plateNumber: 'KL-01-AB-1234 - 2 wheeler',
    name: 'Royal Enfield Classic 350',
    registerNumber: 'REG123456789',
    image: 'https://via.placeholder.com/200x150?text=Royal+Enfield',
    type: '2 wheeler'
  },
  {
    id: 2,
    plateNumber: 'KL-02-CD-5678 - 3 wheeler',
    name: 'Piaggio Ape',
    registerNumber: 'REG987654321',
    image: 'https://via.placeholder.com/200x150?text=Piaggio+Ape',
    type: '3 wheeler'
  },
  {
    id: 3,
    plateNumber: 'KL-03-EF-9012 - 4 wheeler',
    name: 'Toyota Innova',
    registerNumber: 'REG456789123',
    image: 'https://via.placeholder.com/200x150?text=Toyota+Innova',
    type: '4 wheeler'
  },
  {
    id: 4,
    plateNumber: 'KL-04-GH-3456 - 6 wheeler',
    name: 'Tata Truck',
    registerNumber: 'REG789123456',
    image: 'https://via.placeholder.com/200x150?text=Tata+Truck',
    type: '6 wheeler'
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1a237e',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    marginVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    elevation: 2,
  },
  picker: {
    height: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: '#f44336',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 15,
  },
  typeTag: {
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  typeText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  noSelectionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontStyle: 'italic',
  }
});

const VehicleDetailsModal = ({ vehicle, visible, onClose }) => {
  if (!vehicle) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <ScrollView>
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{vehicle.name}</Text>
            </View>

            <View style={styles.detailsRow}>
              <Text style={styles.label}>Vehicle Number:</Text>
              <Text style={styles.value}>
                {vehicle.plateNumber.split('-').slice(0, -1).join('-')}
              </Text>
            </View>

            <View style={styles.detailsRow}>
              <Text style={styles.label}>Register Number:</Text>
              <Text style={styles.value}>{vehicle.registerNumber}</Text>
            </View>

            <View style={styles.typeTag}>
              <Text style={styles.typeText}>{vehicle.type}</Text>
            </View>

            <Image
              source={{ uri: vehicle.image }}
              style={styles.image}
              resizeMode="cover"
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const BusinessDetailsPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const selectedVehicleData = vehicles.find(
    (vehicle) => vehicle.id === selectedVehicle
  );

  const handleVehicleSelect = (itemValue) => {
    setSelectedVehicle(itemValue);
    if (itemValue) {
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>List of Vehicles</Text>
      
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={selectedVehicle}
          onValueChange={handleVehicleSelect}
        >
          <Picker.Item label="Select a vehicle" value={null} />
          {vehicles.map((vehicle) => (
            <Picker.Item 
              key={vehicle.id}
              label={vehicle.plateNumber}
              value={vehicle.id}
            />
          ))}
        </Picker>
      </View>

      {!selectedVehicle && (
        <Text style={styles.noSelectionText}>
          Please select a vehicle to view details
        </Text>
      )}

      <VehicleDetailsModal
        vehicle={selectedVehicleData}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default BusinessDetailsPage;