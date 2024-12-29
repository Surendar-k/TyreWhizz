import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
} from 'react-native';
import driverlogo from '../../assets/driverimg.png';
import { useNavigation } from '@react-navigation/native'; 
const DriverPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logoAnimation] = useState(new Animated.Value(-200));
  const [isModalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState(null);
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(logoAnimation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }, 2000);
    return () => clearTimeout(timer);
  }, [logoAnimation]);

  const handleSubmit = () => {
    console.log('Username:', username);
    console.log('Password:', password);

    // Navigate to MonitoringPage
    navigation.navigate('MonitoringPage', {
      userDetails: { username },
    });
  };


  const handleIconPress = (type) => {
    setFormType(type);
    setModalVisible(false);
    setDetailsModalVisible(true);
  };


  const navigation = useNavigation();  // Call useNavigation here

  const handleDetailsSubmit = () => {
    // Handle details form submission logic here
    console.log(formType);
    setDetailsModalVisible(false);

    // Use the navigation object obtained from useNavigation
    navigation.navigate('MonitoringPage', {
      // Pass any params you want to send to MonitoringPage
      userDetails: {
        formType,
        // Add any other details here
      },
      isDarkMode
    });
  };
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedBox, { transform: [{ translateY: logoAnimation }] }]}>
        <Image source={driverlogo} style={styles.logo} />
        <Text style={styles.heading}>Tyrewhizz...</Text>

        
        
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Profile Photo</Text>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleIconPress('personal')} style={styles.icon}>
            <Text>👤</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleIconPress('notification')} style={styles.icon}>
            <Text>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleIconPress('alert')} style={styles.icon}>
            <Text>⚠️</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Modal for selecting personal or organisation */}
      <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Details</Text>
            <TouchableOpacity onPress={() => handleIconPress('personal')}>
              <Text style={styles.modalButton}>Personal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleIconPress('organisation')}>
              <Text style={styles.modalButton}>Organisation</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✖️</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>

      {/* Modal for details entry */}
      <Modal
        transparent
        visible={isDetailsModalVisible}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailsModalContent}>
            <Text style={styles.detailsModalTitle}>{formType === 'personal' ? 'Personal Details' : 'Organisation Details'}</Text>
            {formType === 'personal' ? (
              <>
                <TextInput style={styles.detailsInput} placeholder="Name" />
                <TextInput style={styles.detailsInput} placeholder="Vehicle Number" />
                <TextInput style={styles.detailsInput} placeholder="Vehicle Type" />
              </>
            ) : (
              <>
                <TextInput style={styles.detailsInput} placeholder="Organisation ID" />
                <TextInput style={styles.detailsInput} placeholder="Vehicle Number" />
                <TextInput style={styles.detailsInput} placeholder="Vehicle Type" />
              </>
            )}
            <TouchableOpacity onPress={handleDetailsSubmit} style={styles.detailsSubmitButton}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDetailsModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✖️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B4948', // Top color
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedBox: {
    width: '90%',
    height: '70%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginTop: 20,
  },
  icon: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 10,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButton: {
    fontSize: 18,
    color: '#007BFF',
    marginVertical: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 24,
  },
  detailsModalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  detailsModalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  detailsInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
  },
  detailsSubmitButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
});

export default DriverPage;