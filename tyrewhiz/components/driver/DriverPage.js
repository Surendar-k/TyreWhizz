import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Dimensions, TextInput, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';
import steerlogo from '../../assets/Steering.png';

const { height } = Dimensions.get('window');

const DriverPage = () => {
  const [showContainer, setShowContainer] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [showHamburgerModal, setShowHamburgerModal] = useState(false);
  const [showSensorIdModal, setShowSensorIdModal] = useState(false);
  const [showPairingOptionsModal, setShowPairingOptionsModal] = useState(false);
  const [sensorId, setSensorId] = useState('');
  const [vehicleNumbers, setVehicleNumbers] = useState([]);
  const [personalName, setPersonalName] = useState('');
  const [personalVehicleType, setPersonalVehicleType] = useState('');
  const [personalVehicleNumber, setPersonalVehicleNumber] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [businessVehicleNumber, setBusinessVehicleNumber] = useState('');
  const [businessVehicleType, setBusinessVehicleType] = useState('');

  const slideAnim = useRef(new Animated.Value(height)).current;

  const vehicleTypes = ['2 wheeler', '3 wheeler', '4 wheeler', '5 wheeler', '6 wheeler'];

  const handleImagePicker = () => {
    const options = { mediaType: 'photo', includeBase64: false, maxHeight: 2000, maxWidth: 2000 };
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setProfileImage(source);
      }
    });
  };

  const handlePersonalSubmit = () => {
    console.log('Personal Details Submitted:', { name: personalName, vehicleType: personalVehicleType, vehicleNumber: personalVehicleNumber, organizationId });
    setShowPersonModal(false);
  };

  const handleBusinessSubmit = () => {
    console.log('Business Details Submitted:', { organizationId, vehicleNumber: businessVehicleNumber, vehicleType: businessVehicleType });
  };

  const toggleContainer = () => {
    const toValue = showContainer ? height : 0;
    Animated.spring(slideAnim, { toValue, useNativeDriver: true, tension: 20, friction: 7 }).start();
    setShowContainer(!showContainer);
    setSelectedIcon(null);
  };

  const openHamburgerMenu = () => {
    setShowHamburgerModal(true);
    setVehicleNumbers(['ABC123', 'XYZ456']);
  };

  const handleSelectVehicleNumber = (vehicleNumber) => {
    console.log('Selected Vehicle Number:', vehicleNumber);
    setShowHamburgerModal(false);
    setShowSensorIdModal(true);
  };

  const handleSensorIdSubmit = () => {
    console.log('Sensor ID Submitted:', sensorId);
    setShowSensorIdModal(false);
    setShowPairingOptionsModal(true);
  };

  const handlePairingOptionSelect = (option) => {
    console.log(`${option} selected`);
    setShowPairingOptionsModal(false);
  };

  const renderContent = () => {
    switch (selectedIcon) {
      case 'person':
        return (
          <ScrollView style={styles.formScrollView}>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>PERSONAL DETAILS</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={personalName}
                onChangeText={setPersonalName}
                placeholderTextColor="#666"
              />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={personalVehicleType}
                  onValueChange={setPersonalVehicleType}
                  style={styles.picker}>
                  <Picker.Item label="Select Vehicle Type" value="" />
                  {vehicleTypes.map(type => (
                    <Picker.Item key={type} label={type} value={type} />
                  ))}
                </Picker>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Vehicle Number"
                value={personalVehicleNumber}
                onChangeText={setPersonalVehicleNumber}
                placeholderTextColor="#666"
              />
              <TextInput
                style={styles.input}
                placeholder="Organization ID"
                value={organizationId}
                onChangeText={setOrganizationId}
                placeholderTextColor="#666"
              />
              <TouchableOpacity style={styles.submitButton} onPress={handlePersonalSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
      case 'notifications':
        return (
          <View style={styles.notificationContainer}>
            <TouchableOpacity style={styles.notificationButton} onPress={() => setSelectedIcon('tyrePressure')}>
              <Text style={styles.notificationText}>Check Tyre Pressure</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationButton} onPress={() => setSelectedIcon('tyreTemperature')}>
              <Text style={styles.notificationText}>Check Tyre Temperature</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationButton} onPress={() => setSelectedIcon('systemUpdate')}>
              <Text style={styles.notificationText}>System Update</Text>
            </TouchableOpacity>
          </View>
        );
      case 'tyrePressure':
        return (
          <View style={styles.messageContainer}>
            <Text style={styles.message}>Tyre Pressure: 32 PSI</Text>
          </View>
        );
      case 'tyreTemperature':
        return (
          <View style={styles.messageContainer}>
            <Text style={styles.message}>Tyre Temperature: 75°C</Text>
          </View>
        );
      case 'systemUpdate':
        return (
          <View style={styles.messageContainer}>
            <Text style={styles.message}>System Update: Do check the settings in app for updation. </Text>
          </View>
        );
      case 'alerts':
        return (
          <View style={styles.messageContainer}>
            <Text style={styles.message}>No alerts!!</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowPersonModal(true)}>
          <Icon name="person" size={24} color="#fff" style={styles.personIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Welcome Driver Tyrewhizz</Text>
        <TouchableOpacity style={styles.hamburgerButton} onPress={openHamburgerMenu}>
          <Icon name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image source={profileImage || steerlogo} style={styles.profileImage} />
          <TouchableOpacity style={styles.cameraButton} onPress={handleImagePicker}>
            <Icon name="camera-alt" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.arrowContainer}>
        <TouchableOpacity style={styles.arrowButton} onPress={toggleContainer}>
          <Icon name={showContainer ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={30} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.slidingContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setSelectedIcon('notifications')}>
            <Icon name="notifications" size={24} color="#f5a442" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setSelectedIcon('alerts')}>
            <Icon name="warning" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        {renderContent()}
      </Animated.View>

      {/* Person Modal */}
      <Modal visible={showPersonModal} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowPersonModal(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <ScrollView>
              <Text style={styles.modalTitle}>Personal Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={personalName}
                onChangeText={setPersonalName}
                placeholderTextColor="#666"
              />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={personalVehicleType}
                  onValueChange={setPersonalVehicleType}
                  style={styles.picker}>
                  <Picker.Item label="Select Vehicle Type" value="" />
                  {vehicleTypes.map(type => (
                    <Picker.Item key={type} label={type} value={type} />
                  ))}
                </Picker>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Vehicle Number"
                value={personalVehicleNumber}
                onChangeText={setPersonalVehicleNumber}
                placeholderTextColor="#666"
              />
              <TextInput
                style={styles.input}
                placeholder="Organization ID"
                value={organizationId}
                onChangeText={setOrganizationId}
                placeholderTextColor="#666"
              />
              <TouchableOpacity style={styles.submitButton} onPress={handlePersonalSubmit}>
                <Text style={styles.submitButtonText}>Register</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Hamburger Menu Modal */}
      <Modal visible={showHamburgerModal} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowHamburgerModal(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Vehicle Number</Text>
            {vehicleNumbers.map((number) => (
              <TouchableOpacity key={number} onPress={() => handleSelectVehicleNumber(number)}>
                <Text style={styles.vehicleOption}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Sensor ID Modal */}
      <Modal visible={showSensorIdModal} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowSensorIdModal(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Enter Pair Sensor ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Sensor ID"
              value={sensorId}
              onChangeText={setSensorId}
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSensorIdSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Pairing Options Modal */}
      <Modal visible={showPairingOptionsModal} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowPairingOptionsModal(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Pairing Option</Text>
            <TouchableOpacity onPress={() => handlePairingOptionSelect('Manual Pair')}>
              <Text style={styles.optionText}>Custom Pair</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePairingOptionSelect('Auto Pair')}>
              <Text style={styles.optionText}>Automatic Pair</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePairingOptionSelect('Scan QR Code')}>
              <Text style={styles.optionText}>QR Capture</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { backgroundColor: '#4CAF50', padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  personIcon: { position: 'absolute', left: 20 },
  hamburgerButton: { padding: 5 },
  mainContent: { flex: 1, backgroundColor: '#e0f2e9', alignItems: 'center' },
  profileSection: { alignItems: 'center', marginBottom: 20 },
  profileImageContainer: { position: 'relative' },
  profileImage: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f0f0f0' },
  cameraButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4CAF50', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  arrowContainer: { position: 'absolute', left: 0, right: 0, bottom: '30%', alignItems: 'center', zIndex: 2 },
  arrowButton: { width: 40, height: 40, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  slidingContainer: { position: 'absolute', left: 10, right: 10, bottom: 0, backgroundColor: '#e6e6e6', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, height: '65%', marginHorizontal: 10 },
  iconContainer: { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', paddingHorizontal: 20, marginBottom: 30, marginTop: 20 },
  iconButton: { padding: 10, backgroundColor: 'white', borderRadius: 25, width: 44, height: 44, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  formScrollView: { flex: 1 },
  detailsContainer: { backgroundColor: '#90EE90', borderRadius: 10, padding: 15 },
  detailsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: 'white', borderRadius: 5, padding: 12, fontSize: 16 },
  pickerContainer: { backgroundColor: 'white', borderRadius: 5, marginVertical: 5, overflow: 'hidden' },
  picker: { height: 50 },
  submitButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  messageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: { fontSize: 16, color: '#666' },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  closeButton: { position: 'absolute', top: 10, right: 10 },
  vehicleOption: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  notificationContainer: { padding: 20, backgroundColor: '#e6e6e6', borderRadius: 10 },
  notificationButton: { padding: 10, backgroundColor: '#4CAF50', borderRadius: 5, marginVertical: 5 },
  notificationText: { color: '#fff', fontSize: 16 },
  optionText: { padding: 15, fontSize: 16, textAlign: 'center' },
});

export default DriverPage;