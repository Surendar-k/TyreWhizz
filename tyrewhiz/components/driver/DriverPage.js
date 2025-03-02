import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "../TranslationContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import drivertype from "../../assets/drivertype.png";
const DriverPage = () => {
  const navigation = useNavigation();
  const { translatedText, updateTranslations } = useTranslation();

  React.useEffect(() => {
    updateTranslations([
      "Pick a Driver Type",
      "Personal",
      "Business",
      "Cancel",
    ]);
  }, []);

  const navigateToPage = (page) => {
    navigation.navigate(page);
  };

  return (
    <ImageBackground
      source={drivertype}
      style={styles.backgroundImage}
      imageStyle={{ resizeMode: "repeat" }}
      blurRadius={1}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {translatedText["Pick a Driver Type"] || "Pick a Driver Type"}
          </Text>
          <View style={styles.verticalContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              activeOpacity={0.8}
              onPress={() => navigateToPage("ProfessionalDriverDashboardPage")}
            >
              <Icon name="briefcase" size={30} color="#fff" />
              <Text style={styles.optionButtonText}>
                {translatedText["Business"] || "Business"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              activeOpacity={0.8}
              onPress={() => navigateToPage("IndividualDriverDashboardPage")}
            >
              <Icon name="account" size={30} color="#fff" />
              <Text style={styles.optionButtonText}>
                {translatedText["Personal"] || "Personal"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>
              {translatedText["Cancel"] || "Cancel"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  ImageBackground: {
    opacity: "0.4",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(112, 78, 184, 0.36)",
  },
  container: {
    width: "75%",
    backgroundColor: "rgba(236, 232, 255, 0.96)",
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#222",
    textAlign: "center",
    letterSpacing: 1,
  },
  verticalContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  optionButton: {
    alignItems: "center",
    backgroundColor: "#6F4EB8",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
    shadowColor: "#6F4EB8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    marginBottom: 14,
    width: "90%",
  },
  optionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    textTransform: "uppercase",
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#D9534F",
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    shadowColor: "#D9534F",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
});

export default DriverPage;
