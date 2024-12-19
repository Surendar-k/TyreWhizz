import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const RoleBasedAuthPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userType } = route.params; // Get the selected user type (driver, organization, technician)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => password.length >= 8;

  const mockServerResponse = (type) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (type === 'signup' && email === 'test@example.com') {
          reject('This email is already registered.');
        } else if (type === 'login' && (email !== 'test@example.com' || password !== 'password123')) {
          reject('Incorrect email or password.');
        } else {
          resolve(`${type.charAt(0).toUpperCase() + type.slice(1)} successful!`);
        }
      }, 1500);
    });
  };

  const handleSubmit = async () => {
    if (!email || !password || (isSignup && !confirmPassword)) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
  
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Invalid email format.');
      return;
    }
  
    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }
  
    if (isSignup) {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return;
      }
  
      try {
        const response = await mockServerResponse('signup');
        Alert.alert('Success', response, [
          { text: 'OK', onPress: () => setIsSignup(false) },
        ]);
      } catch (error) {
        Alert.alert('Error', error);
      }
    } else {
      try {
        const response = await mockServerResponse('login');
        Alert.alert('Success', response, [
          { text: 'OK', onPress: () => navigation.navigate('HomePage') },
        ]);
      } catch (error) {
        Alert.alert('Error', error);
      }
    }
  };
  
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        {isSignup
          ? `${userType.charAt(0).toUpperCase() + userType.slice(1)} Signup`
          : `${userType.charAt(0).toUpperCase() + userType.slice(1)} Login`}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isSignup ? 'Sign Up' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchButton} onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.switchButtonText}>
          {isSignup
            ? 'Already have an account? Login'
            : 'Don\'t have an account? Sign Up'}
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
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 15,
  },
  switchButtonText: {
    color: '#6200ee',
    fontSize: 14,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: '#6200ee',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RoleBasedAuthPage;
