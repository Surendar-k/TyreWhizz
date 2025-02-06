import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logoimg from '../assets/selectroleimg.png';

const UserTypeSelectionPage = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Get screen width

  const handleSelection = (userType) => {
    navigation.navigate('RoleBasedAuthPage', { userType });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logoimg} style={styles.logo} />
        <Text style={styles.title}>Welcome to TyreWhizz...</Text>
      </View>

      <Text style={styles.title}>Select Your Role</Text>

      <TouchableOpacity 
        style={[styles.button, width > 768 && styles.webButton]} 
        onPress={() => handleSelection('driver')}
      >
        <Text style={styles.buttonText}>Driver</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, width > 768 && styles.webButton]} 
        onPress={() => handleSelection('organisation')}
      >
        <Text style={styles.buttonText}>Organisation</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, width > 768 && styles.webButton]} 
        onPress={() => handleSelection('technician')}
      >
        <Text style={styles.buttonText}>Technician</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
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
  webButton: {
    width: '60%',  // Increase width for web view
    height: 70,     // Increase height for web view
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserTypeSelectionPage;
