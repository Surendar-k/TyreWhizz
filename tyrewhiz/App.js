import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TranslationProvider } from "./components/TranslationContext"; 

import WelcomePage from "./components/WelcomePage";
import UserTypeSelectionPage from "./components/UserTypeSelectionPage";
import RoleBasedAuthPage from "./components/RoleBasedAuthPage";
import DriverPage from "./components/driver/DriverPage";
import OrganisationPage from "./components/organisation/OrganisationPage";
import TechnicianPage from "./components/technician/TechnicianPage";
import TireMonitoring from "./components/organisation/TireMonitoring";
import OrganisationDriverList from "./components/organisation/OrganisationDriverList";
import MonitoringPage from "./components/driver/MonitoringPage";
import OrganisationAnalytics from "./components/organisation/OrganisationAnalytics";
import OrganisationVehicleList from "./components/organisation/OrganisationVehicleList";
import TechLocation from "./components/driver/TechLocation";
import IndividualDriverNotifications from "./components/driver/IndividualDriverNotifications";
import IndividualDriverMessages from "./components/driver/IndividualDriverMessages";
import IndividualDriverDashboardPage from "./components/driver/IndividualDriverDashboardPage";
import ProfessionalDriverDashboardPage from "./components/driver/ProfessionalDriverDashboardPage";
import ProfessionalDriverNotifications from "./components/driver/ProfessionalDriverNotifications";
import ProfessionalDriverMessages from "./components/driver/ProfessionalDriverMessages";

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
          <Stack.Screen
          name="IndividualDriverDashboardPage"
          component={IndividualDriverDashboardPage}
        />
        <Stack.Screen
          name="IndividualDriverNotifications"
          component={IndividualDriverNotifications}
        />
        <Stack.Screen
          name="IndividualDriverMessages"
          component={IndividualDriverMessages}
        />

        <Stack.Screen
          name="ProfessionalDriverDashboardPage"
          component={ProfessionalDriverDashboardPage}
        />
        <Stack.Screen
          name="ProfessionalDriverMessages"
          component={ProfessionalDriverMessages}
        />
        <Stack.Screen
          name="ProfessionalDriverNotifications"
          component={ProfessionalDriverNotifications}
        />

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
