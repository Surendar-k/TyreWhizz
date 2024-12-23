import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomePage from './components/WelcomePage'; // Adjust the path as needed
import UserTypeSelectionPage from './components/UserTypeSelectionPage';
import RoleBasedAuthPage from './components/RoleBasedAuthPage'; // Adjust path as needed
import DriverPage from './components/driver/DriverPage';
import OrganisationPage from './components/organisation/OrganisationPage';
import TechnicianPage from './components/technician/TechnicianPage';
import TireMonitoring from './components/organisation/TireMonitoring';
import OrganisationDriverList from './components/organisation/OrganisationDriverList';
import OrganisationDriverDetail from './components/organisation/OrganisationDriverDetail';
import MonitoringPage from './components/driver/MonitoringPage';
import PersonalDetailsPage from './components/driver/PersonalDetailsPage';
import BusinessDetailsPage from './components/driver/BusinessDetailsPage';
import OrganisationAnalytics from './components/organisation/OrganisationAnalytics';
import OrganisationVehicleList from './components/organisation/OrganisationVehicleList';

const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomePage" component={WelcomePage} />
        <Stack.Screen name="UserTypeSelectionPage" component={UserTypeSelectionPage} />
        <Stack.Screen name="RoleBasedAuthPage" component={RoleBasedAuthPage} />
        <Stack.Screen name="DriverPage" component={DriverPage} />
        <Stack.Screen name="OrganisationPage" component={OrganisationPage} />
        <Stack.Screen name="TechnicianPage" component={TechnicianPage} />
        <Stack.Screen name="OrganisationDriverList" component={OrganisationDriverList} />
        <Stack.Screen name="OrganisationDriverDetail" component={OrganisationDriverDetail} />
        <Stack.Screen name="OrganisationVehicleList" component={OrganisationVehicleList} />
        <Stack.Screen name="OrganisationAnalytics" component={OrganisationAnalytics} />
        <Stack.Screen name="TireMonitoring" component={TireMonitoring}  />
        <Stack.Screen name="MonitoringPage" component={MonitoringPage} />
        <Stack.Screen name="PersonalDetailsPage" component={PersonalDetailsPage} />
        <Stack.Screen name="BusinessDetailsPage" component={BusinessDetailsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

