import React, { useState, useRef,useEffect  } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
const cartopimg = require('../../assets/car-top-view.png');


const MonitoringPage = ({ navigation }) => {
  const [selectedFeature, setSelectedFeature] = useState('pressure');
  const [tirePressure, setTirePressure] = useState({
    frontLeft: 0,
    frontRight: 0,
    backLeft: 0,
    backRight: 0,
  });
  const [tireTemperature, setTireTemperature] = useState({
    frontLeft: 0,
    frontRight: 0,
    backLeft: 0,
    backRight: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

 // Color function based on pressure/temperature values
 const getProgressColor = (value) => {
  if (value >= 70) {
    return '#28a745';
  } else if (value >= 40) {
    return '#ffc107';
  } else {
    return value === 0 ? '#808080' : '#dc3545'; // Gray color for 0 values
  }
};
  // Function to check sensor connection
  const checkSensorConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sensor/status');
      const data = await response.json();
      setIsConnected(data.isConnected);
      return data.isConnected;
    } catch (error) {
      console.error('Error checking sensor connection:', error);
      setIsConnected(false);
      return false;
    }
  };
  const ConnectionStatus = () => (
    <View style={styles.connectionStatus}>
      <View style={[styles.statusDot, { backgroundColor: isConnected ? '#28a745' : '#dc3545' }]} />
      <Text style={styles.statusText}>
        {isConnected ? 'Sensors Connected' : 'Sensors Disconnected'}
      </Text>
    </View>
  );

    // Effect to handle initial connection and polling
    useEffect(() => {
      // Initial fetch
      fetchSensorData();
  
      // Set up polling interval (every 5 seconds)
      const interval = setInterval(fetchSensorData, 5000);
  
      // Cleanup on component unmount
      return () => clearInterval(interval);
    }, []);
// Function to fetch sensor data
const fetchSensorData = async () => {
  try {
    // First check if sensors are connected
    const sensorConnected = await checkSensorConnection();
    
    if (!sensorConnected) {
      // Reset values to 0 if sensors are not connected
      setTirePressure({
        frontLeft: 0,
        frontRight: 0,
        backLeft: 0,
        backRight: 0,
      });
      setTireTemperature({
        frontLeft: 0,
        frontRight: 0,
        backLeft: 0,
        backRight: 0,
      });
      setIsLoading(false);
      return;
    }

    // If sensors are connected, fetch the data
    const response = await fetch('http://localhost:5000/api/sensor/data');
      const data = await response.json();
      setTirePressure(data.pressure);
      setTireTemperature(data.temperature);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setTirePressure({ frontLeft: 0, frontRight: 0, backLeft: 0, backRight: 0 });
      setTireTemperature({ frontLeft: 0, frontRight: 0, backLeft: 0, backRight: 0 });
      setIsLoading(false);
    }
  };
  const renderContent = () => {
    switch (selectedFeature) {
      case 'pressure':
        return (
          <View style={styles.carImageContainer}>
            <Image source={cartopimg} style={styles.carImage} />
            <View style={[styles.progressCircleContainer, styles.topLeft]}>
              <CircularProgress
                size={70}
                width={10}
                fill={tirePressure.frontLeft}
                tintColor={getProgressColor(tirePressure.frontLeft)}
                backgroundColor="#e0e0e0"
                rotation={0}
              />
              <Text style={styles.percentageText}>{tirePressure.frontLeft} PSI</Text>
            </View>
            <View style={[styles.progressCircleContainer, styles.topRight]}>
              <CircularProgress
                size={70}
                width={10}
                fill={tirePressure.frontRight}
                tintColor={getProgressColor(tirePressure.frontRight)}
                backgroundColor="#e0e0e0"
              />
              <Text style={styles.percentageText}>{tirePressure.frontRight} PSI</Text>
            </View>
            <View style={[styles.progressCircleContainer, styles.bottomLeft]}>
              <CircularProgress
                size={70}
                width={10}
                fill={tirePressure.backLeft}
                tintColor={getProgressColor(tirePressure.backLeft)}
                backgroundColor="#e0e0e0"
              />
              <Text style={styles.percentageText}>{tirePressure.backLeft} PSI</Text>
            </View>
            <View style={[styles.progressCircleContainer, styles.bottomRight]}>
              <CircularProgress
                size={70}
                width={10}
                fill={tirePressure.backRight}
                tintColor={getProgressColor(tirePressure.backRight)}
                backgroundColor="#e0e0e0"
              />
              <Text style={styles.percentageText}>{tirePressure.backRight} PSI</Text>
            </View>
          </View>
        );
        //temperature
      case 'temperature':
        return (
          <View style={styles.carImageContainer}>
  <Image source={cartopimg} style={styles.carImage} />
  
  {/* Front Left Tire */}
  <View style={[styles.progressCircleContainer, styles.topLeft]}>
    {/* Conditionally render icon based on temperature */}
    {tireTemperature.frontLeft > 30 ? (
      <FontAwesome name="thermometer-three-quarters" size={70} color={getProgressColor(tireTemperature.frontLeft)} />
    ) : tireTemperature.frontLeft > 20 ? (
      <FontAwesome name="thermometer-half" size={70} color={getProgressColor(tireTemperature.frontLeft)} />
    ) : (
      <FontAwesome name="thermometer-quarter" size={70} color={getProgressColor(tireTemperature.frontLeft)} />
    )}
    <Text style={styles.percentageTextTemperature}>{tireTemperature.frontLeft} °C</Text>
  </View>

  {/* Front Right Tire */}
  <View style={[styles.progressCircleContainer, styles.topRight]}>
    {/* Conditionally render icon based on temperature */}
    {tireTemperature.frontRight > 30 ? (
      <FontAwesome name="thermometer-three-quarters" size={70} color={getProgressColor(tireTemperature.frontRight)} />
    ) : tireTemperature.frontRight > 20 ? (
      <FontAwesome name="thermometer-half" size={70} color={getProgressColor(tireTemperature.frontRight)} />
    ) : (
      <FontAwesome name="thermometer-quarter" size={70} color={getProgressColor(tireTemperature.frontRight)} />
    )}
    <Text style={styles.percentageTextTemperature}>{tireTemperature.frontRight} °C</Text>
  </View>

  {/* Back Left Tire */}
  <View style={[styles.progressCircleContainer, styles.bottomLeft]}>
    {/* Conditionally render icon based on temperature */}
    {tireTemperature.backLeft > 30 ? (
      <Ionicons name="thermometer-sharp" size={70} color={getProgressColor(tireTemperature.backLeft)} />
    ) : tireTemperature.backLeft > 20 ? (
      <Ionicons name="thermometer-outline" size={70} color={getProgressColor(tireTemperature.backLeft)} />
    ) : (
      <Ionicons name="thermometer" size={70} color={getProgressColor(tireTemperature.backLeft)} />
    )}
    <Text style={styles.percentageTextTemperature}>{tireTemperature.backLeft} °C</Text>
  </View>

  {/* Back Right Tire */}
  <View style={[styles.progressCircleContainer, styles.bottomRight]}>
    {/* Conditionally render icon based on temperature */}
    {tireTemperature.backRight > 30 ? (
      <Ionicons name="thermometer-sharp" size={70} color={getProgressColor(tireTemperature.backRight)} />
    ) : tireTemperature.backRight > 20 ? (
      <Ionicons name="thermometer-outline" size={70} color={getProgressColor(tireTemperature.backRight)} />
    ) : (
      <Ionicons name="thermometer" size={70} color={getProgressColor(tireTemperature.backRight)} />
    )}
    <Text style={styles.percentageTextTemperature}>{tireTemperature.backRight} °C</Text>
  </View>
</View>

        );
      case 'tireLife':
        return (
          <View style={styles.carImageContainer}>
            <Text style={styles.headerText}>Tire Life Details Will Appear Here</Text>
          </View>
        );
      case 'status':
        return (
          <View style={styles.carImageContainer}>
            <Text style={styles.headerText}>Status Information Will Appear Here</Text>
          </View>
        );
      default:
        return (
          <View style={styles.carImageContainer}>
            <Text style={styles.headerText}>Select a Feature from the Footer</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Content */}
      {renderContent()}

      <View style={styles.footer}>
  <TouchableOpacity
    style={styles.fixedArrowLeft}
    onPress={() => scrollViewRef.current?.scrollTo({ x: 0, animated: true })}
  >
    <Ionicons name="arrow-back" size={24} color="#fff" />
  </TouchableOpacity>

  <ScrollView
    horizontal
    contentContainerStyle={styles.footerContent}
    ref={scrollViewRef}
  >
    <TouchableOpacity style={styles.footerButton} onPress={() => setSelectedFeature('temperature')}>
      <Ionicons name="thermometer" size={24} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.footerButton} onPress={() => setSelectedFeature('pressure')}>
      <Ionicons name="cloudy" size={24} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.footerButton} onPress={() => setCurrentContent('home')}>
      <Ionicons name="home" size={24} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.footerButton} onPress={() => setSelectedFeature('tireLife')}>
      <Ionicons name="speedometer" size={24} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.footerButton} onPress={() => setSelectedFeature('status')}>
      <Ionicons name="bar-chart" size={24} color="#fff" />
    </TouchableOpacity>
  </ScrollView>

  <TouchableOpacity
    style={styles.fixedArrowRight}
    onPress={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
  >
    <Ionicons name="arrow-forward" size={24} color="#fff" />
  </TouchableOpacity>
</View>

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    top: 20,
  },
  carImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  carImage: {
    width: 350,
    height: 370,
    bottom: 100,
    left:5,
    resizeMode: 'contain',
  },
  progressCircleContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLeft: {
    top: 90,
    left: 10,
  },
  topRight: {
    top: 90,
    right: 10,
  },
  bottomLeft: {
    bottom: 250,
    left: 20,
  },
  bottomRight: {
    bottom: 250,
    right: 20,
  },
  percentageText: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffff',
  },
  percentageTextTemperature: {
    marginTop: 10, // Adds space between the icon and the temperature text
    color: 'white',
    fontSize: 14, // Adjust font size as needed
    textAlign: 'center', // Centers the text below the icon
  }
  ,
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    paddingVertical: 10,
    borderRadius: 10,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerButton: {
    padding: 20,
    backgroundColor: 'rgb(117 195 0)',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  arrowContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  fixedArrowLeft: {
    position: 'absolute',
    left: 10,
    bottom: 100,
    zIndex: 20,
    backgroundColor: 'rgb(0 164 255)',
    padding: 10,
    borderRadius: 50,
  },
  fixedArrowRight: {
    position: 'absolute',
    right: 10,
    bottom: 100,

    zIndex: 20,
    backgroundColor: 'rgb(0 164 255)',
    padding: 10,
    borderRadius: 50,
  },


  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  }
  
});

export default MonitoringPage;