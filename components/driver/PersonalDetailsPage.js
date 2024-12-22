import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#666',
    width: 120,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  noSelection: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  imageContainer: {
    marginTop: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  vehicleType: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  typeText: {
    color: '#555',
    fontWeight: '500',
  }
});

const VehicleDetails = ({ vehicle }) => {
  if (!vehicle) {
    return (
      <Text style={styles.noSelection}>
        Please select a vehicle to view details
      </Text>
    );
  }

  return (
    <View>
      <Text style={styles.detailsText}>
        <Text style={styles.label}>Name: </Text>
        {vehicle.name}
      </Text>
      <Text style={styles.detailsText}>
        <Text style={styles.label}>Vehicle Number: </Text>
        {vehicle.plateNumber.split('-').slice(0, -1).join('-')}
      </Text>
      <Text style={styles.detailsText}>
        <Text style={styles.label}>Register Number: </Text>
        {vehicle.registerNumber}
      </Text>
      <View style={styles.vehicleType}>
        <Text style={styles.typeText}>Type: {vehicle.type}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: vehicle.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const PersonalDetailsPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const selectedVehicleData = vehicles.find(
    (vehicle) => vehicle.id === selectedVehicle
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Vehicle Details</Text>
      
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedVehicle}
          onValueChange={(itemValue) => setSelectedVehicle(itemValue)}
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

      <View style={styles.detailsContainer}>
        <VehicleDetails vehicle={selectedVehicleData} />
      </View>
    </ScrollView>
  );
};

export default PersonalDetailsPage;