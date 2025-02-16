import React from 'react';
import { View, Text, TouchableOpacity, Image, useWindowDimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from "@react-navigation/native";
import logoimg from '../assets/selectroleimg.png';
import { useTranslation } from "./TranslationContext"; // Import translation context

const UserTypeSelectionPage = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { language, setLanguage, translatedText, updateTranslations } = useTranslation();

  // Update translations when language changes
  useFocusEffect(React.useCallback(() => {
    updateTranslations([
      "Welcome to TyreWhizz...",
      "Select Your Role",
      "Driver",
      "Organisation",
      "Technician",
    ]);
  }, [language]));

  const handleSelection = (userType) => {
    navigation.navigate('RoleBasedAuthPage', { userType });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logoimg} style={styles.logo} />
        <Text style={styles.title}>{translatedText["Welcome to TyreWhizz..."] || "Welcome to TyreWhizz..."}</Text>
      </View>

      <Text style={styles.title}>{translatedText["Select Your Role"] || "Select Your Role"}</Text>

      <TouchableOpacity style={[styles.button, width > 768 && styles.webButton]} onPress={() => handleSelection('driver')}>
        <Text style={styles.buttonText}>{translatedText["Driver"] || "Driver"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, width > 768 && styles.webButton]} onPress={() => handleSelection('organisation')}>
        <Text style={styles.buttonText}>{translatedText["Organisation"] || "Organisation"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, width > 768 && styles.webButton]} onPress={() => handleSelection('technician')}>
        <Text style={styles.buttonText}>{translatedText["Technician"] || "Technician"}</Text>
      </TouchableOpacity>

      {/* Global Language Selector */}
      <View style={styles.languageSelector}>
        <TouchableOpacity onPress={() => setLanguage("en")}><Text>🇬🇧 EN</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setLanguage("ta")}><Text>🇮🇳 தமிழ்</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setLanguage("hi")}><Text>🇮🇳 हिंदी</Text></TouchableOpacity>
      </View>
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
  languageSelector: {
    flexDirection: "row",
    marginTop: 20,
    gap: 15,
  },
});

export default UserTypeSelectionPage;
