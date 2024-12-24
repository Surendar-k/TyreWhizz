import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const DriverPage = () => {
  const navigation = useNavigation();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [formType, setFormType] = useState(null);
  const [name, setName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [organisation, setOrganisation] = useState('');
  const [savedDetails, setSavedDetails] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const handleSubmit = () => {
    if (formType) {
      const vehicleDetails = { number: vehicleNumber, type: vehicleType };
      setSavedDetails([...savedDetails, { name, vehicleDetails, organisation }]);
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setVehicleNumber('');
    setVehicleType('Car');
    setOrganisation('');
    setPopupVisible(false);
    setFormType(null);
  };

  const renderForm = () => (
    <View style={styles.formContainer(isDarkMode)}>
      <TextInput
        style={styles.input(isDarkMode)}
        placeholder={formType === 'personal' ? "Name" : "Business Name"}
        value={name}
        onChangeText={setName}
      />
      {formType === 'business' && (
        <TextInput
          style={styles.input(isDarkMode)}
          placeholder="Organisation ID"
          value={organisation}
          onChangeText={setOrganisation}
        />
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
        <Text style={styles.buttonText(isDarkMode)}>Save Details</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setPopupVisible(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>➕ Add New Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container(isDarkMode)}>
      <View style={styles.header}>
        <Text style={styles.headerText(isDarkMode)}>Tyre Whizz</Text>
        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.themeToggleButton}>
          <Text style={styles.themeToggleText}>{isDarkMode ? '🌞' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => setPopupVisible(true)}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>👤</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🔔</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>⚠️</Text>
          </View>
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
        <Text style={styles.nameText}>{name || 'Your Name'}</Text>
        {name ? (
          <TouchableOpacity onPress={() => setName('')} style={styles.editNameButton}>
            <Text style={styles.editIcon}>+</Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            style={styles.nameInput(isDarkMode)}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
        )}
      </View>

      {isPopupVisible && (
        <Modal transparent visible={isPopupVisible}>
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
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  nameInput: (isDarkMode) => ({
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '80%',
    textAlign: 'center',
    backgroundColor: isDarkMode ? '#555' : '#fff',
    color: isDarkMode ? '#fff' : '#000',
  }),
  editNameButton: {
    marginTop: 10,
  },
  editIcon: {
    fontSize: 24,
    color: '#007BFF',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 2,
    borderColor: '#007BFF',
    borderRadius: 10,
    paddingBottom: 10,
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    color: '#007BFF',
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
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  }),
  submitButton: (isDarkMode) => ({
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  }),
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default DriverPage;