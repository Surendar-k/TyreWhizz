import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const logoimg = require('../assets/logo.png');

const WelcomePage = ({ navigation }) => {
  useEffect(() => {
    // Navigate to UserTypeSelectionPage after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('UserTypeSelectionPage'); // Replace ensures WelcomePage doesn't stay in the stack
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={logoimg} style={styles.logo} />
      <Text style={styles.title}>Welcome to TyreWhizz...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: '#333',
    fontStyle: 'italic',
  },
});

export default WelcomePage;
