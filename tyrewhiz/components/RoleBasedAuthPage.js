import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import axios from "axios";
import logoimg from "../assets/rolebasedauthimage.png";
import { API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "./TranslationContext"; // Import global translation context

const RoleBasedAuthPage = ({ route, navigation }) => {
  const { userType } = route.params;
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const { translatedText, updateTranslations } = useTranslation();

  // Update translations when language changes
  useFocusEffect(React.useCallback(() => {
    updateTranslations([
      "Back",
      "Signup",
      "Login",
      "Email",
      "Password",
      "Confirm Password",
      "Already have an account? Login",
      "Don't have an account? Signup",
      "Email and password are required.",
      "Invalid email format. Please enter a valid email.",
      "Password must be at least 6 characters long.",
      "Passwords do not match.",
      "Unknown user type. Please contact support.",
      "Network error or server unreachable. Please try again later.",
      "An unexpected error occurred. Please try again later.",
    ]);
  }, []));

  const handleAuthAction = async () => {
    if (!email || !password) {
      Alert.alert("Error", translatedText["Email and password are required."] || "Email and password are required.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showModal(translatedText["Invalid email format. Please enter a valid email."] || "Invalid email format.", true);
      return;
    }

    if (password.length < 6) {
      showModal(translatedText["Password must be at least 6 characters long."] || "Password must be at least 6 characters long.", true);
      return;
    }

    const data = { email, password, userType };

    if (isSignup) {
      if (password !== confirmPassword) {
        showModal(translatedText["Passwords do not match."] || "Passwords do not match.", true);
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/api/signup", data);
        showModal(response.data.message, false);
        setIsSignup(false);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
       setIsSignup(false);
      } catch (error) {
        showModal(error.response?.data?.error || "Signup failed. Please try again.", true);
      }
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/login", data);
      showModal(response.data.message, false);

      const { userType } = response.data;

      if (userType === "driver") {
        navigation.replace("DriverPage");
      } else if (userType === "organisation") {
        navigation.replace("OrganisationPage");
      } else if (userType === "technician") {
        navigation.replace("TechnicianPage");
      } else {
        showModal(translatedText["Unknown user type. Please contact support."] || "Unknown user type. Please contact support.", true);
      }
    } catch (error) {
      if (error.response) {
        showModal(error.response.data.error, true);
      } else if (error.request) {
        showModal(translatedText["Network error or server unreachable. Please try again later."] || "Network error. Try again later.", true);
      } else {
        showModal(translatedText["An unexpected error occurred. Please try again later."] || "Unexpected error. Try again later.", true);
      }
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
        <Text style={styles.buttonText}>{translatedText["Back"] || "Back"}</Text>
      </TouchableOpacity>
      
      <View style={styles.logoContainer}>
        <Image source={logoimg} style={styles.logo} />
      </View>

      <Text style={styles.title}>
        {isSignup ? `${translatedText["Signup"] || "Signup"} as ${userType}` : `${translatedText["Login"] || "Login"} as ${userType}`}
      </Text>

      <Modal visible={isModalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
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

      <TextInput style={styles.input} placeholder={translatedText["Email"] || "Email"} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder={translatedText["Password"] || "Password"} value={password} onChangeText={setPassword} secureTextEntry />

      {isSignup && (
        <TextInput style={styles.input} placeholder={translatedText["Confirm Password"] || "Confirm Password"} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      )}

      <TouchableOpacity style={styles.button} onPress={handleAuthAction}>
        <Text style={styles.buttonText}>{isSignup ? translatedText["Signup"] || "Signup" : translatedText["Login"] || "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.toggleText}>
          {isSignup
            ? translatedText["Already have an account? Login"] || "Already have an account? Login"
            : translatedText["Don't have an account? Signup"] || "Don't have an account? Signup"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#6200ee",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleText: {
    color: "#6200ee",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },

  // Media queries for web responsiveness
  "@media (min-width: 768px)": {
    container: {
      width: "60%", // Adjust container width for larger screens
      padding: 40,
    },
    input: {
      width: "70%", // Make inputs larger for web
      height: 60, // Increase input height for web
    },
    button: {
      width: "70%", // Make buttons larger for web
      height: 60, // Increase button height for web
    },
    title: {
      fontSize: 32, // Increase title font size for web
    },
    modalContainer: {
      width: "50%", // Adjust modal width for larger screens
    },
    logo: {
      width: 250, // Adjust logo size for web
      height: 250,
    },
  },
});

export default RoleBasedAuthPage;