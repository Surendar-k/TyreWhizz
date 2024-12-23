// PersonalDetailsPage.js
import React from 'react';
import { View, Text, StyleSheet, Button, Modal, FlatList, TouchableOpacity, Image } from 'react-native';

const PersonalDetailsPage = ({ route }) => {
  const { name, vehicleNumber, vehicleType, vehicleImage } = route.params;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState(null);

  const vehicles = [
    { id: '1', name: 'Car', number: 'ABC123', image: require('./path/to/image1.jpg') },
    { id: '2', name: 'Bike', number: 'XYZ456', image: require('./path/to/image2.jpg') },
    // Add more vehicles as needed
  ];

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Details</Text>
      <Text>Name: {name}</Text>
      <Text>Vehicle Number: {vehicleNumber}</Text>
      <Text>Vehicle Type: {vehicleType}</Text>
      <Image style={styles.image} source={vehicleImage} />

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.vehicleItem} onPress={() => handleVehicleSelect(item)}>
            <Text style={styles.vehicleText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedVehicle && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image style={styles.modalImage} source={selectedVehicle.image} />
              <Text>Name: {selectedVehicle.name}</Text>
              <Text>Vehicle Number: {selectedVehicle.number}</Text>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  vehicleItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  vehicleText: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});

export default PersonalDetailsPage;