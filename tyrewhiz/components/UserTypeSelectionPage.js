import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logoimg from '../assets/selectroleimg.png';


const UserTypeSelectionPage = () => {
  const navigation = useNavigation();

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
        style={styles.button}
        onPress={() => handleSelection('driver')}
      >
        <Text style={styles.buttonText}>Driver</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSelection('organisation')}
      >
        <Text style={styles.buttonText}>Organisation</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'contain', // Or you can use 'cover', 'stretch', etc.
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
});

export default UserTypeSelectionPage;
