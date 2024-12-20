import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Picker,
  TextInput,
  ActivityIndicator,
} from 'react-native';

const OrganisationCheckPage = ({ navigation }) => {
  const [language, setLanguage] = useState('en'); // 'en', 'ta', 'te', 'hi'
  const [isMember, setIsMember] = useState(null); // null, 'yes', 'no'
  const [organization, setOrganization] = useState('');
  const organizations = [
    'New Trend Tours and Travels',
    'Gmmco Limited',
    'Aswanth Earth Movers',
    'Tata Motors Ltd',
    'Mahindra Logistics',
    'VRL Logistics',
    'Blue Dart Express',
    'DTDC Courier',
    'First Flight Couriers',
    'DHL Express',
  ];

  const questions = {
    en: 'Are you a member of an organization?',
    ta: 'நீங்கள் ஒரு நிறுவனத்தின் உறுப்பினரா?',
    te: 'మీరు సంస్థ సభ్యుడా?',
    hi: 'क्या आप किसी संगठन के सदस्य हैं?',
  };

  return (
    <View style={styles.container}>
      <View style={styles.languageToggle}>
        <Button title="English" onPress={() => setLanguage('en')} />
        <Button title="Tamil" onPress={() => setLanguage('ta')} />
        <Button title="Telugu" onPress={() => setLanguage('te')} />
        <Button title="Hindi" onPress={() => setLanguage('hi')} />
      </View>
      <Text style={styles.question}>{questions[language]}</Text>
      {isMember === null ? (
        <View style={styles.buttonGroup}>
          <Button title="Yes" onPress={() => setIsMember('yes')} />
          <Button title="No" onPress={() => navigation.navigate('LoadingPage')} />
        </View>
      ) : isMember === 'yes' ? (
        <View>
          <Text style={styles.label}>Enter the name of the organization:</Text>
          <Picker
            selectedValue={organization}
            onValueChange={(itemValue) => setOrganization(itemValue)}
            style={styles.picker}
          >
            {organizations.map((org, index) => (
              <Picker.Item key={index} label={org} value={org} />
            ))}
          </Picker>
          <Text style={styles.confirmation}>
            Selected Organization: {organization}
          </Text>
        </View>
      ) : null}
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
  languageToggle: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  picker: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  confirmation: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default OrganisationCheckPage;
