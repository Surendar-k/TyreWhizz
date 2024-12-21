import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const DriverPage = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'owner', title: 'Owner' },
    { key: 'business', title: 'Business' },
  ]);

  const [ownerDetails, setOwnerDetails] = useState({
    name: '',
    vehicleNumber: '',
    registrationNumber: '',
    ride: '',
  });

  const [businessDetails, setBusinessDetails] = useState({
    organizationName: '',
    organizationId: '',
    pincode: '',
    ride: '',
  });

  const handleImageUpload = async () => {
    setIsModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "We need permission to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    Alert.alert("Submitted Successfully");
    navigation.navigate('VehiclesPage');
  };

  const rideOptions = [
    { label: '2-Wheeler', value: '2-wheeler' },
    { label: '3-Wheeler', value: '3-wheeler' },
    { label: '4-Wheeler', value: '4-wheeler' },
    { label: '6-Wheeler', value: '6-wheeler' },
  ];

  const renderOwnerTab = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>Upload Profile Picture</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={ownerDetails.name}
        onChangeText={(text) =>
          setOwnerDetails((prevDetails) => ({ ...prevDetails, name: text }))
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Vehicle Number"
        value={ownerDetails.vehicleNumber}
        onChangeText={(text) =>
          setOwnerDetails((prevDetails) => ({ ...prevDetails, vehicleNumber: text }))
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Registration Number"
        value={ownerDetails.registrationNumber}
        onChangeText={(text) =>
          setOwnerDetails((prevDetails) => ({ ...prevDetails, registrationNumber: text }))
        }
      />
      <Text style={styles.label}>Pick your ride</Text>
      <RNPickerSelect
        onValueChange={(value) =>
          setOwnerDetails((prevDetails) => ({ ...prevDetails, ride: value }))
        }
        items={rideOptions}
        style={{
          inputIOS: styles.picker,
          inputAndroid: styles.picker,
        }}
        value={ownerDetails.ride}
        placeholder={{ label: 'Select Ride', value: null }}
      />
    </View>
  );

  const renderScene = SceneMap({
    owner: renderOwnerTab,
    business: () => <View style={styles.tabContainer}><Text>Business Tab</Text></View>,
  });

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#3f79c8' }}
            style={{ backgroundColor: '#f0f0f0' }}
            renderLabel={({ route }) => (
              <Text style={{ color: 'black', fontSize: 16 }}>{route.title}</Text>
            )}
          />
        )}
      />
      <Button title="SUBMIT" color="#007bff" onPress={handleSubmit} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleImageUpload} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRemoveImage} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Remove Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const VehiclesPage = () => {
  const [vehicleList, setVehicleList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const addVehicle = () => {
    setVehicleList([...vehicleList, selectedVehicle]);
    setSelectedVehicle(null);
  };

  return (
    <View style={styles.vehiclesContainer}>
      <Text style={styles.heading}>Individual</Text>
      <View style={styles.transparentContainer}>
        <Text style={styles.subHeading}>List of Vehicles</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedVehicle(value)}
          items={[
            { label: 'MH12 AB1234 - 2 Wheeler', value: 'MH12 AB1234 - 2 Wheeler' },
            { label: 'MH14 XY5678 - 4 Wheeler', value: 'MH14 XY5678 - 4 Wheeler' },
          ]}
          style={{ inputIOS: styles.picker, inputAndroid: styles.picker }}
          placeholder={{ label: 'Select Vehicle', value: null }}
        />
        <TouchableOpacity onPress={addVehicle} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        {vehicleList.map((vehicle, index) => (
          <Text key={index} style={styles.vehicleItem}>{vehicle}</Text>
        ))}
      </View>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="DriverPage" component={DriverPage} options={{ title: 'Driver Page' }} />
        <Stack.Screen name="VehiclesPage" component={VehiclesPage} options={{ title: 'Vehicles Page' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  profileImageContainer: { width: 150, height: 150, marginBottom: 20, borderRadius: 75 },
  profileImage: { width: '100%', height: '100%', borderRadius: 75 },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: { fontSize: 14, color: '#666', textAlign: 'center' },
  input: { width: '90%', borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  label: { fontSize: 16, marginVertical: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 },
  modalOption: { marginBottom: 15 },
  modalOptionText: { fontSize: 16, color: 'black' },
  modalCancel: { alignItems: 'center' },
  modalCancelText: { fontSize: 16, color: 'black' },
  vehiclesContainer: { flex: 1, padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  transparentContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 20,
    borderRadius: 10,
  },
  subHeading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  addButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
  },
  addButtonText: { color: 'white', fontSize: 16 },
  vehicleItem: { fontSize: 16, marginTop: 5 },
});

export default App;