import * as React from "react";
import { View, Text, Linking, TextInput } from "react-native";
import ColorButton from '../components/ColorButton.js';
import StarHeader from "../components/StarHeader.js";
import { Icon } from 'react-native-elements';
import { page, text, spacing } from "../assets/global_styles";
import { 
  useFonts,
  Amiko_700Bold,
  Amiko_400Regular,
  Amiko_600SemiBold,
} from '@expo-google-fonts/amiko';
import * as Font from 'expo-font';
import { registrationFetch } from "./Handlers.js";


export default function LoginPage({navigation}) {

  const [errorOccured, setErrorOccured] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [loaded] = Font.useFonts({Amiko_400Regular});

  if(!loaded)
  {
    return null;
  }
  
  function handleEmail(event)
  {
    setEmail(event.target.value);
  }

  function errorMessage(errorMessage)
  {
    if(errorMessage != 0)
    {
      setErrorOccured(true);
      if( errorMessage == 1)
      {
        setErrMessage("Passwords cannot be less than 8 characters!");
      }
      else if( errorMessage == 2)
      {
        setErrMessage("Passwords do not match!");
      }
      else if ( errorMessage == 3)
      {
        setErrMessage("Invalid combination was entered. Try again.");
      }
      else if ( errorMessage == 4)
      {
        setErrMessage("User does not exist. Please sign up!");
      }
      else if ( errorMessage == 5)
      {
        setErrMessage("Wrong username and password combination.");
      }
      else if ( errorMessage == 6)
      {
        setErrMessage("Internal server error. Try again later.");
      }
    }
  }

  let emailField = 
  <TextInput
      style = 
      {[
        page.inputBoxConfig,
        spacing.p3,
        text.normal,
        text.center,
        spacing.mv2,
      ]}
      placeholder = {'Email'}
      placeholderTextColor = {'#d8e3e1'}
      onChange = {handleEmail}
    />;
  
  return (
  
    <View style={[page.centerer, page.background]}>
      <View>
        <StarHeader/>
            <Text style = 
          {{
            fontFamily: 'Amiko_400Regular',
            color: '#d8e3e1',
            marginBottom: 10,
            textAlign: "center"
          }}>Enter the email you registered with{"\n"} and await a verification email.</Text>
  
            {emailField}

            <ColorButton onPress = { () => errorMessage(verifyEmailFetch(email))}>
              <Text style = {{color: "#d8e3e1", fontWeight: 'bold', alignSelf: 'center'}}>
              <Icon  name="star" size={15} type="antdesign" color='#d8e3e1'/> Send verification email! <Icon  name="star" size={15} type="antdesign" color='#d8e3e1'/>
              </Text>
            </ColorButton> 

            {errorOccured ? <Text style = 
                  {{
                    fontFamily: 'Amiko_400Regular',
                    color: 'red',
                    marginTop: 10,
                    marginBottom: 10,
                    textAlign: "center",
                    fontSize: 14
                  }}> {errMessage} </Text> : null}

            <Text onPress={() => navigation.navigate('Login')}
          style = 
          {{
            fontFamily: 'Amiko_400Regular',
            color: '#d8e3e1',
            marginTop: 15,
            marginBottom: 15,
            textAlign: "center",
          }}>Return to login?
          </Text>
      </View>
    </View>
  );
}
