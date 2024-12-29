import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';

const RoleBasedAuthPage = ({ navigation }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [userType, setUserType] = useState('driver'); // Default role

  const handleDirectNavigation = () => {
    if (userType === 'driver') {
      navigation.replace('DriverPage');
    } else if (userType === 'organisation') {
      navigation.replace('OrganisationPage');
    } else if (userType === 'technician') {
      navigation.replace('TechnicianPage');
    } else {
      showModal('Please select a valid role.', true);
    }
  };

  const handleAuthAction = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showModal('Invalid email format. Please enter a valid email.', true);
      return;
    }

    if (password.length < 6) {
      showModal('Password must be at least 6 characters long.', true);
      return;
    }

    const data = { email, password, userType };

    if (isSignup) {
      if (password !== confirmPassword) {
        showModal('Passwords do not match.', true);
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/signup', data);
        showModal(response.data.message, false);
        setIsSignup(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => navigation.replace('LoginPage', { userType }), 3000);
      } catch (error) {
        showModal(error.response?.data?.error || 'Signup failed. Please try again.', true);
      }
      
      return;
    }

    
  try {
    const response = await axios.post('http://localhost:5000/api/login', data);
    showModal(response.data.message, false);
    const { userType } = response.data;  // Ensure this is the correct property from your backend response.

    // Navigate based on userType
    if (userType === 'driver') {
      navigation.replace('DriverPage');
    } else if (userType === 'organisation') {
      navigation.replace('OrganisationPage');
    } else if (userType === 'technician') {
      navigation.replace('TechnicianPage');
    } else {
      showModal('Unknown user type. Please contact support.', true);
    }
  } catch (error) {
    showModal(error.response.data.error, true);
  }
  };
  const showModal = (message, isError) => {
    setPopupMessage(message);
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 3000);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>
        {isSignup ? `Signup as ${userType}` : `Login as ${userType}`}
      </Text>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalText}>{popupMessage}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Text style={styles.subtitle}>Select Role:</Text>
      <Picker
        selectedValue={userType}
        onValueChange={(itemValue) => setUserType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Driver" value="driver" />
        <Picker.Item label="Organisation" value="organisation" />
        <Picker.Item label="Technician" value="technician" />
      </Picker>

      <TouchableOpacity style={styles.directNavButton} onPress={handleDirectNavigation}>
        <Text style={styles.buttonText}>Go to {userType} Page</Text>
      </TouchableOpacity>

      {/* Existing Login/Signup form */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {isSignup && (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleAuthAction}>
        <Text style={styles.buttonText}>{isSignup ? 'Signup' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.toggleText}>
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#6200ee',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleText: {
    color: '#6200ee',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },




  picker: {
    width: '80%',
    height: 50,
    marginBottom: 15,
    backgroundColor: '#fdfdfd', // Slightly off-white background
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#4CAF50', // Match the directNavButton color for consistency
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333', // Dark text color for better readability
  },
  pickerContainer: {
    width: '80%',
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  pickerLabel: {
    width: '100%',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  directNavButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#008CBA', // A modern blue shade for the button
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Rounded corners for a smooth look
    marginBottom: 20, // Space between this and other components
    elevation: 5, // Shadow for a 3D effect on Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Offset for iOS shadow
    shadowOpacity: 0.2, // Opacity for iOS shadow
    shadowRadius: 4, // Radius for iOS shadow
  },
  buttonText: {
    color: '#fff', // White text for contrast
    fontSize: 16, // Readable text size
    fontWeight: 'bold', // Bold for emphasis
    textTransform: 'uppercase', // Uppercase text for a button-like feel
    letterSpacing: 1.2, // Slight spacing for readability
  },
});

export default RoleBasedAuthPage;