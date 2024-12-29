import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomePage from './components/WelcomePage'; // Adjust the path as needed
import UserTypeSelectionPage from './components/UserTypeSelectionPage';
import RoleBasedAuthPage from './components/RoleBasedAuthPage'; // Adjust path as needed

import OrganisationPage from './components/organisation/OrganisationPage';
import TechnicianPage from './components/technician/TechnicianPage';
import MonitoringPage from './components/driver/MonitoringPage';
import DriverPage from './components/driver/DriverPage';




const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomePage" component={WelcomePage} />
        <Stack.Screen name="UserTypeSelectionPage" component={UserTypeSelectionPage} />
        <Stack.Screen name="RoleBasedAuthPage" component={RoleBasedAuthPage} />
        <Stack.Screen name="DriverPage" component={DriverPage}/>
        <Stack.Screen name="OrganisationPage" component={OrganisationPage} />
        <Stack.Screen name="TechnicianPage" component={TechnicianPage} />
       
        <Stack.Screen name="MonitoringPage" component={MonitoringPage}/>
               
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

