// DriverPage.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const DriverPage = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [formType, setFormType] = useState(null);
  const [name, setName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [vehicleImage, setVehicleImage] = useState(null);

  const handleImageUpload = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setVehicleImage(response.assets[0]);
      }
    });
  };

  const handleSubmit = () => {
    if (formType === 'personal') {
      console.log('Personal Details Submitted:', { name, vehicleNumber, vehicleType, vehicleImage });
    } else if (formType === 'business') {
      console.log('Business Details Submitted:', { name, organisation, vehicleType, vehicleImage });
    }
    // Reset form
    setName('');
    setVehicleNumber('');
    setVehicleType('');
    setOrganisation('');
    setVehicleImage(null);
    setSidebarVisible(false);
    setFormType(null);
  };

  const renderForm = () => {
    if (formType === 'personal') {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Vehicle Number"
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Type of Vehicle"
            value={vehicleType}
            onChangeText={setVehicleType}
          />
        </>
      );
    } else if (formType === 'business') {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Organisation"
            value={organisation}
            onChangeText={setOrganisation}
          />
          <TextInput
            style={styles.input}
            placeholder="Type of Vehicle"
            value={vehicleType}
            onChangeText={setVehicleType}
          />
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Hamburger Menu Icon */}
      <TouchableOpacity onPress={() => setSidebarVisible(!isSidebarVisible)}>
        <Icon name="bars" size={30} />
      </TouchableOpacity>

      {/* Sidebar */}
      {isSidebarVisible && (
        <View style={styles.sidebar}>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => { setFormType('personal'); setSidebarVisible(false); }}>
            <Text style={styles.sidebarText}>Personal Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => { setFormType('business'); setSidebarVisible(false); }}>
            <Text style={styles.sidebarText}>Business Details</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Form View */}
      <ScrollView style={styles.formContainer}>
        {renderForm()}

        <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
          <Text style={styles.uploadText}>Upload Vehicle Image</Text>
        </TouchableOpacity>

        {vehicleImage && (
          <Image source={{ uri: vehicleImage.uri }} style={styles.imagePreview} />
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit {formType === 'personal' ? 'Personal' : 'Business'} Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: '100%',
    backgroundColor: '#8B4513',
    padding: 20,
    zIndex: 1,
  },
  sidebarItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  sidebarText: {
    color: '#fff',
    fontSize: 18,
  },
  formContainer: {
    marginLeft: isSidebarVisible ? 220 : 0, // Shift content when sidebar is open
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  uploadText: {
    color: '#fff',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 25, // Oval shape
    flex: 0.8,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitText: {
    color: '#fff',
  },
});

export default DriverPage;