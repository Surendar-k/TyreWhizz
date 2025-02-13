import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TranslationProvider } from "./components/TranslationContext"; // Import global translation provider

import WelcomePage from "./components/WelcomePage";
import UserTypeSelectionPage from "./components/UserTypeSelectionPage";
import RoleBasedAuthPage from "./components/RoleBasedAuthPage";
import DriverPage from "./components/driver/DriverPage";
import OrganisationPage from "./components/organisation/OrganisationPage";
import TechnicianPage from "./components/technician/TechnicianPage";
import TireMonitoring from "./components/organisation/TireMonitoring";
import OrganisationDriverList from "./components/organisation/OrganisationDriverList";
import IndividualDriverPage from "./components/driver/IndividualDriverPage";
import ProfessionalDriverPage from "./components/driver/ProfessionalDriverPage";
import MonitoringPage from "./components/driver/MonitoringPage";
import OrganisationAnalytics from "./components/organisation/OrganisationAnalytics";
import OrganisationVehicleList from "./components/organisation/OrganisationVehicleList";
import TechLocation from "./components/driver/TechLocation";

const Stack = createStackNavigator();

const App = () => {
  return (
    <TranslationProvider>
      {/* Wrap the entire app with TranslationProvider */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="WelcomePage" component={WelcomePage} />
          <Stack.Screen name="UserTypeSelectionPage" component={UserTypeSelectionPage} />
          <Stack.Screen name="RoleBasedAuthPage" component={RoleBasedAuthPage} />
          <Stack.Screen name="DriverPage" component={DriverPage} />
          <Stack.Screen name="IndividualDriverPage" component={IndividualDriverPage} />
          <Stack.Screen name="ProfessionalDriverPage" component={ProfessionalDriverPage} />
          <Stack.Screen name="TechLocation" component={TechLocation} />
          <Stack.Screen name="OrganisationPage" component={OrganisationPage} />
          <Stack.Screen name="TechnicianPage" component={TechnicianPage} />
          <Stack.Screen name="OrganisationDriverList" component={OrganisationDriverList} />
          <Stack.Screen name="OrganisationVehicleList" component={OrganisationVehicleList} />
          <Stack.Screen name="OrganisationAnalytics" component={OrganisationAnalytics} />
          <Stack.Screen name="TireMonitoring" component={TireMonitoring} />
          <Stack.Screen name="MonitoringPage" component={MonitoringPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </TranslationProvider>
  );
};

export default App;
