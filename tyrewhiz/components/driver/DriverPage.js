
import React, { useState, useEffect,useContext } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "../TranslationContext"; // ✅ Import the global translation context

const DriverPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { translatedText, updateTranslations } = useTranslation(); // ✅ Use global translations

   useFocusEffect(React.useCallback(() => {
    setModalVisible(true);

    // ✅ Fetch translations dynamically from context
    updateTranslations([
      "Choose Your Driver Type",
      "Individual Driver",
      "Professional Driver",
      "Cancel",
    ]);
  }, []));

  const navigateToIndividualDriverDashboardPage = () => {
    setModalVisible(false);
    navigation.navigate("IndividualDriverDashboardPage");
  };

  const navigateToProfessionalDriverDashboardPage = () => {
    setModalVisible(false);
    navigation.navigate("ProfessionalDriverDashboardPage");
  };

  useEffect(() => {
    setModalVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {translatedText["Choose Your Driver Type"] || "Choose Your Driver Type"}
            </Text>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={navigateToIndividualDriverDashboardPage}
            >
              <Text style={styles.optionButtonText}>
                {translatedText["Individual Driver"] || "Individual Driver"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={navigateToProfessionalDriverDashboardPage}
            >
              <Text style={styles.optionButtonText}>
                {translatedText["Professional Driver"] || "Professional Driver"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.closeButtonText}>
                {translatedText["Cancel"] || "Cancel"}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E5E5",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "80%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  optionButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  optionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#FF5252",
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default DriverPage;
