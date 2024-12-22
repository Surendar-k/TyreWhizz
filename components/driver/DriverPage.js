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
  ScrollView,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import * as ImagePicker from 'expo-image-picker';

const DriverPage = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'personalBusiness', title: 'Personal/Business' },
    { key: 'vehicles', title: 'Manage Vehicles' },
  ]);
  const [profileImage, setProfileImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    vehicleNumber: '',
    registrationNumber: '',
  });
  const [businessDetails, setBusinessDetails] = useState({
    organizationName: '',
    organizationId: '',
    ownerName: '',
  });
  const [vehicleList, setVehicleList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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

  const renderPersonalBusinessTab = () => (
    <ScrollView contentContainerStyle={styles.tabContainer}>
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
      <Text style={styles.heading}>Select Account Type</Text>
      <Button
        title="Personal"
        color="black"
        onPress={() => {
          setSelectedOption('Personal');
          setIndex(1);
        }}
      />
      <Button
        title="Business"
        color="black"
        onPress={() => {
          setSelectedOption('Business');
          setIndex(1);
        }}
      />
    </ScrollView>
  );

  const renderVehiclesTab = () => {
    const formFields =
      selectedOption === 'Personal' ? (
        <>
          <Text style={styles.heading}>Personal Details</Text>
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
        items={[
          { label: '2-Wheeler', value: '2-wheeler' },
          { label: '4-Wheeler', value: '4-wheeler' },
        ]}
        style={{
          inputIOS: styles.picker,
          inputAndroid: styles.picker,
        }}
        value={ownerDetails.ride}
        placeholder={{ label: 'Select Ride', value: null }}
      />
      <Button title="Submit Owner Details" onPress={handleSubmitOwner} />
    </ScrollView>
  );

  const renderVehiclesTab = () => (
    <ScrollView contentContainerStyle={styles.tabContainer}>
      <Text style={styles.heading}>Manage Vehicles</Text>
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
        <Text style={styles.addButtonText}>Add Vehicle</Text>
      </TouchableOpacity>
      {vehicleList.map((vehicle, index) => (
        <Text key={index} style={styles.vehicleItem}>
          {vehicle}
        </Text>
      ))}
    </ScrollView>
  );

  const renderScene = SceneMap({
    owner: renderOwnerTab,
    vehicles: renderVehiclesTab,
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
            indicatorStyle={{ backgroundColor: '#007bff' }}
            style={{ backgroundColor: '#f0f0f0' }}
            renderLabel={({ route }) => (
              <Text style={{ color: 'black', fontSize: 16 }}>{route.title}</Text>
            )}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    padding: 16,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePlaceholderText: {
    color: '#aaa',
    fontSize: 14,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  picker: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#333',
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
    width: '100%',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  vehicleItem: {
    fontSize: 16,
    color: '#555',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: '100%',
    textAlign: 'center',
  },
});

export default DriverPage;
