// BusinessDetailsPage.js
import React from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, Image, Button } from 'react-native';

const BusinessDetailsPage = ({ route }) => {
  const { name, vehicleNumber, vehicleType, vehicleImage } = route.params;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState(null);

  // Create an array to hold vehicles (simulating a database or state)
  const vehicles = vehicleImage ? [
    { id: '1', name: 'User Vehicle', number: vehicleNumber, image: vehicleImage },
  ] : [];

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business Details</Text>
      <Text>Name: {name}</Text>
      <Text>Vehicle Number: {vehicleNumber}</Text>
      <Text>Vehicle Type: {vehicleType}</Text>
      {vehicleImage && <Image style={styles.image} source={{ uri: vehicleImage.uri }} />}

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
              <Image style={styles.modalImage} source={{ uri: selectedVehicle.image.uri }} />
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

export default BusinessDetailsPage;