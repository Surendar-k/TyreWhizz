import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const DriverPage = () => {
  const navigation = useNavigation();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [formType, setFormType] = useState(null);
  const [name, setName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [organisation, setOrganisation] = useState('');
  const [vehicleImage, setVehicleImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [vehicleDetailsList, setVehicleDetailsList] = useState([]);
  const [savedVehicles, setSavedVehicles] = useState([]);

  const handleImageUpload = () => {
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: true },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri;
          setVehicleImage(imageUri);
        }
      }
    );
  };

  const handleProfileImageUpload = () => {
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: true },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri;
          setProfileImage(imageUri);
        }
      }
    );
  };

  const handleCameraAccess = () => {
    launchCamera(
      { mediaType: 'photo', includeBase64: true },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri;
          setProfileImage(imageUri);
        }
      }
    );
  };

  const handleSubmit = () => {
    const vehicleDetails = { number: vehicleNumber, type: vehicleType };
    setVehicleDetailsList([...vehicleDetailsList, vehicleDetails]);
    setSavedVehicles([...savedVehicles, vehicleNumber]);

    if (formType === 'personal') {
      navigation.navigate('DetailsPage', { 
        personalDetails: { name, vehicleDetailsList: [...vehicleDetailsList, vehicleDetails] }, 
        isDarkMode 
      });
    } else if (formType === 'business') {
      navigation.navigate('DetailsPage', { 
        businessDetails: { name, organisation, vehicleDetailsList: [...vehicleDetailsList, vehicleDetails] }, 
        isDarkMode 
      });
    }
    resetForm();
  };

  const handleSelectVehicle = (vehicle) => {
    const selectedVehicle = vehicleDetailsList.find(v => v.number === vehicle);
    if (selectedVehicle) {
      Alert.alert("Vehicle Details", 
        `Vehicle Number: ${selectedVehicle.number}\nType: ${selectedVehicle.type}\nName: ${name}`, 
        [{ text: "View Pair Sensor", onPress: () => Alert.alert("Pair Sensor", "Pairing with sensor...") }]
      );
    }
  };

  const resetForm = () => {
    setName('');
    setVehicleNumber('');
    setVehicleType('Car');
    setOrganisation('');
    setVehicleImage(null);
    setProfileImage(null);
    setPopupVisible(false);
    setFormType(null);
  };

  const renderForm = () => (
    <View style={styles.formContainer(isDarkMode)}>
      {formType === 'personal' ? (
        <>
          <TextInput
            style={styles.input(isDarkMode)}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input(isDarkMode)}
            placeholder="Organisation ID"
            value={organisation}
            onChangeText={setOrganisation}
          />
        </>
      )}
      <TextInput
        style={styles.input(isDarkMode)}
        placeholder="Vehicle Number"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
      />
      <TextInput
        style={styles.input(isDarkMode)}
        placeholder="Vehicle Type (Car/Bike/Truck)"
        value={vehicleType}
        onChangeText={setVehicleType}
      />
      <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton(isDarkMode)}>
        <Text style={styles.buttonText(isDarkMode)}>Upload Vehicle Image</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton(isDarkMode)}>
        <Text style={styles.buttonText(isDarkMode)}>Submit</Text>
      </TouchableOpacity>

      {savedVehicles.length > 0 && (
        <FlatList
          data={savedVehicles}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectVehicle(item)}>
              <Text style={styles.vehicleItem}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container(isDarkMode)} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.headerText(isDarkMode)}>Tyre Whizz</Text>
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => setPopupVisible(true)} style={styles.iconCircle}>
          <Text style={styles.icon}>👤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconCircle}>
          <Text style={styles.icon}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconCircle}>
          <Text style={styles.icon}>⚠️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity onPress={handleProfileImageUpload} style={styles.profileButton}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Text style={styles.uploadProfileText(isDarkMode)}>Upload Profile Image</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCameraAccess} style={styles.cameraButton}>
          <Text style={styles.cameraButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {isPopupVisible && (
        <Modal
          transparent
          visible={isPopupVisible}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.popup}>
              <Text style={styles.popupTitle}>Choose Details</Text>
              <TouchableOpacity onPress={() => { setFormType('personal'); setPopupVisible(false); }}>
                <Text style={styles.popupButton(isDarkMode)}>Personal Details</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setFormType('business'); setPopupVisible(false); }}>
                <Text style={styles.popupButton(isDarkMode)}>Business Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {formType && renderForm()}
    </KeyboardAvoidingView>
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
  headerText: (isDarkMode) => ({
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  }),
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconCircle: {
    backgroundColor: '#007BFF',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    color: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007BFF',
    overflow: 'hidden',
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  uploadProfileText: (isDarkMode) => ({
    textAlign: 'center',
    color: isDarkMode ? '#fff' : '#007BFF',
  }),
  cameraButton: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  cameraButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popup: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  popupTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  popupButton: (isDarkMode) => ({
    fontSize: 18,
    color: '#007BFF',
    marginVertical: 10,
  }),
  formContainer: (isDarkMode) => ({
    padding: 20,
    backgroundColor: isDarkMode ? '#333' : '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  }),
  input: (isDarkMode) => ({
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: isDarkMode ? '#555' : '#fff',
    color: isDarkMode ? '#fff' : '#000',
  }),
  uploadButton: (isDarkMode) => ({
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  }),
  submitButton: (isDarkMode) => ({
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  }),
  buttonText: (isDarkMode) => ({
    color: '#fff',
    fontSize: 16,
  }),
  vehicleItem: {
    fontSize: 18,
    marginVertical: 5,
    color: '#007BFF',
  },
});

export default DriverPage;