import * as React from "react";
import { Text } from "react-native"

import RegistrationPage from "./components/RegistrationPage.js";
import LoginPage from "./components/LoginPage.js";
import SuccessRegisPage from "./components/SuccessRegisPage.js"
import NewPassPage from "./components/NewPassPage.js"
import ForgotPassPage from "./components/ForgotPassPage.js"
import VerifyEmailPage from "./components/VerifyEmailPage.js"
import SuccessEmailPage from "./components/SuccessEmailPage.js"

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
const prefix = Linking.createURL('/');

const Stack = createStackNavigator();

export default function App() {

  const linking = {
    prefixes: ['https://constellario.xyz'],
  };
  
  return (
    <NavigationContainer linking = {linking} fallback = {<Text>Loading... =</Text>}>
    <Stack.Navigator initialRouteName = {'Login'} headerMode = {'none'}>
      <Stack.Screen name="Login" component={LoginPage}/>
      <Stack.Screen name="Registration" component={RegistrationPage}/>
      <Stack.Screen name="Email-Verification" component={VerifyEmailPage}/>
      {/* <Stack.Screen name="Verif-Email-Sent" component={SuccessEmailPage}/> */}
      <Stack.Screen name="New-Password" component={NewPassPage}/>
      <Stack.Screen name="Forgot-Password" component={ForgotPassPage}/>
      {/* <Stack.Screen name="Registration-Successful" component={SuccessRegisPage}/> */}
    </Stack.Navigator>
    </NavigationContainer>
  );
}
