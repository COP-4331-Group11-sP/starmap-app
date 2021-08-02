import * as React from "react";
import { View, Text, TextInput } from "react-native";
import ColorButton from '../components/ColorButton.js';
import StarHeader from "../components/StarHeader.js";
import { Icon } from 'react-native-elements';
import { page, text, spacing } from "../assets/global_styles";
import { Amiko_400Regular } from '@expo-google-fonts/amiko';
import * as Font from 'expo-font';
import { registrationFetch } from '../components/Handlers.js'


export default function RegistrationPage({navigation}) {

  const [errorOccured, setErrorOccured] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [conf, setConf] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [loaded] = Font.useFonts( {Amiko_400Regular} );

  if(!loaded)
  {
    return null;
  }
  
  function handleUsername(event)
  {
    setUsername(event.target.value);
    console.log(username);
  }
 
  function handlePassword(event)
  {
    setPassword(event.target.value);
  }

  function handleConf(event)
  {
    setConf(event.target.value);
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
        setErrMessage("Email must include an @ AND a period.");
      }
      else if ( errorMessage == 4)
      {
        setErrMessage("Username or e-mail has been used.");
      }
      else if ( errorMessage == 5)
      {
        setErrMessage("Internal server error. Try again later.");
      }
    }
  }

  let usernameField = 
  <TextInput
      style = 
      {[
        page.inputBoxConfig,
        spacing.p3,
        text.normal,
        text.center,
        spacing.mv2,
        page.color
      ]}
      placeholder = {'Username'}
      placeholderTextColor = {'#d8e3e1'}
      onChange = {handleUsername}
    />;

  let passField = 
  <TextInput
  style = 
  {[
    page.inputBoxConfig,
    text.normal,
    text.center,
    spacing.mv2,
    page.color
  ]}
  placeholder = {'Password'}
  placeholderTextColor = {'#d8e3e1'}
  secureTextEntry = {true}
  onChange = {handlePassword}
  />;

  let confField = 
  <TextInput
  style = 
  {[
    page.inputBoxConfig,
    text.normal,
    text.center,
    spacing.mv2,
    page.color
  ]}
  placeholder = {'Confirm Password'}
  placeholderTextColor = {'#d8e3e1'}
  secureTextEntry = {true}
  onChange = {handleConf}
  />;

  let emailField = 
  <TextInput
      style = 
      {[
        page.inputBoxConfig,
        spacing.p3,
        text.normal,
        text.center,
        spacing.mv2,
        page.color
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
          }}> Welcome! You're just a moment away{"\n"} from favoriting the stars. Sign up below!</Text>
  
            {usernameField}
            
            {passField}

            {confField}

            {emailField}

            <ColorButton onPress = { () => errorMessage(registrationFetch(username, password, conf, email))}>
              <Text style = {{color: "#d8e3e1", fontWeight: 'bold', alignSelf: 'center'}}>
              <Icon  name="star" size={15} type="antdesign" color='#d8e3e1'/> Register! <Icon  name="star" size={15} type="antdesign" color='#d8e3e1'/>
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
          }}>Not a new user? Click here to sign in!
          </Text>

          <Text onPress={() => navigation.navigate('Login')}
          style = 
          {{
            fontFamily: 'Amiko_400Regular',
            color: '#d8e3e1',
            textAlign: "center",
            fontSize: 10
          }}><Icon  name="back" size={10} type="antdesign" color='#d8e3e1'/> Return to Starmap 
          </Text>

      </View>
    </View>
  );
}
