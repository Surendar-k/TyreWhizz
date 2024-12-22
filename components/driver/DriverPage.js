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
  const [selectedRide, setSelectedRide] = useState('');

  // Functions for Profile Picture Modal
  const handleImageUpload = async () => {
    setIsModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your photos!');
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
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => {
          setSelectedOption('Personal');
          setIndex(1);
        }}
      >
        <Text style={styles.buttonText}>PERSONAL</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.buttonStyle, styles.spaceBetweenButtons]}
        onPress={() => {
          setSelectedOption('Business');
          setIndex(1);
        }}
      >
        <Text style={styles.buttonText}>BUSINESS</Text>
      </TouchableOpacity>
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
            placeholderTextColor="gray"
            value={personalDetails.name}
            onChangeText={(text) =>
              setPersonalDetails((prev) => ({ ...prev, name: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Vehicle Number"
            placeholderTextColor="gray"
            value={personalDetails.vehicleNumber}
            onChangeText={(text) =>
              setPersonalDetails((prev) => ({ ...prev, vehicleNumber: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Registration Number"
            placeholderTextColor="gray"
            value={personalDetails.registrationNumber}
            onChangeText={(text) =>
              setPersonalDetails((prev) => ({ ...prev, registrationNumber: text }))
            }
          />
          <Button
            title="Submit Personal Details"
            color="blue"
            onPress={() => Alert.alert('Success', 'Personal details submitted!')}
          />
        </>
      ) : (
        <>
          <Text style={styles.heading}>Business Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Organization Name"
            placeholderTextColor="gray"
            value={businessDetails.organizationName}
            onChangeText={(text) =>
              setBusinessDetails((prev) => ({ ...prev, organizationName: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Organization ID"
            placeholderTextColor="gray"
            value={businessDetails.organizationId}
            onChangeText={(text) =>
              setBusinessDetails((prev) => ({ ...prev, organizationId: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Owner Name"
            placeholderTextColor="gray"
            value={businessDetails.ownerName}
            onChangeText={(text) =>
              setBusinessDetails((prev) => ({ ...prev, ownerName: text }))
            }
          />
          <Button
            title="Submit Business Details"
            color="blue"
            onPress={() => Alert.alert('Success', 'Business details submitted!')}
          />
        </>
      );

    return (
      <ScrollView contentContainerStyle={styles.tabContainer}>
        {formFields}
        <Text style={styles.heading}>Pick Your Ride</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedRide(value)}
          items={[
            { label: '2-Wheeler', value: '2-wheeler' },
            { label: '3-Wheeler', value: '3-wheeler' },
            { label: '4-Wheeler', value: '4-wheeler' },
            { label: '6-Wheeler', value: '6-wheeler' },
          ]}
          style={{
            inputAndroid: { color: 'black' },
            inputIOS: { color: 'black' },
          }}
        />
        <Button
          title="Submit Ride"
          color="blue"
          onPress={() =>
            Alert.alert('Success', `You selected ${selectedRide || 'no ride yet'}.`)
          }
        />
      </ScrollView>
    );
  };

  const renderScene = SceneMap({
    personalBusiness: renderPersonalBusinessTab,
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
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleImageUpload}>
              <Text style={styles.modalOption}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRemoveImage}>
              <Text style={styles.modalOption}>Delete Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.modalOption}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabContainer: { flex: 1, alignItems: 'center', padding: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', marginVertical: 10, color: 'black' },
  profileImageContainer: { marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: { color: '#888' },
  buttonStyle: {
    backgroundColor: 'blue',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  spaceBetweenButtons: { marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 15,
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 20, alignItems: 'center' },
  modalOption: { fontSize: 18, marginVertical: 10, color: '#007bff' },
});

export default DriverPage;
