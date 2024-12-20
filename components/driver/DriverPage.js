import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const DriverPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Driver Dashboard</Text>
      <Text style={styles.content}>
        Here you can view and manage your driving tasks.
      </Text>
      <Button
        title="Register"
        onPress={() => navigation.navigate('RegisterPage')}
      />
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
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
});

export default DriverPage;
