import * as React from "react";
import { View, Text, TextInput } from "react-native";
import ColorButton from '../components/ColorButton.js';
import StarHeader from "../components/StarHeader.js";
import { Icon } from 'react-native-elements';
import { page, text, spacing } from "../assets/global_styles";
import { Amiko_400Regular } from '@expo-google-fonts/amiko';
import * as Font from 'expo-font';
import { loginFetch } from "../components/Handlers.js";
import { Link, useLinkTo } from '@react-navigation/native';


export default function LoginPage({navigation}) {

  const [errorOccured, setErrorOccured] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loaded] = Font.useFonts({Amiko_400Regular});
  const linkTo = useLinkTo();

  if(!loaded)
  {
    return null;
  }
  
  function handleUsername(event)
  {
    setUsername(event.target.value);
  }
 
  function handlePassword(event)
  {
    setPassword(event.target.value);
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
        setErrMessage("Wrong password!");
      }
      else if ( errorMessage == 3)
      {
        setErrMessage("User does not exist. Please sign up!");
        
      }
      else if ( errorMessage == 4)
      {
        setErrMessage("Wrong username and password combination. Try again.");
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
  color = {'#d8e3e1'}
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
          }}> The stars above you are just a click away.{"\n"} Login below!</Text>
  
            {usernameField}
            
            {passField}

            <Link to='/forgot-password'
            style = 
            {{
              fontFamily: 'Amiko_400Regular',
              color: '#d8e3e1',
              textAlign: "right",
              fontSize: 14,
            }}>Forgot Password?</Link>

            <ColorButton onPress = { () => {
                  loginFetch(username, password)
                  .then(message => {
                    errorMessage(message);
                    if (message == 0) {
                      linkTo('/stars');
                    }
                  })
                }
              }>
              <Text style = {{color: "#d8e3e1", fontWeight: 'bold', alignSelf: 'center'}}>
              <Icon  name="star" size={15} type="antdesign" color='#d8e3e1'/> Login! <Icon  name="star" size={15} type="antdesign" color='#d8e3e1'/>
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

          <Link to='/signup'
          style = 
          {{
            fontFamily: 'Amiko_400Regular',
            color: '#d8e3e1',
            marginTop: 15,
            marginBottom: 15,
            textAlign: "center",
          }}>New User? Click here!
          </Link>

          <Link to='/stars'
          style = 
          {{
            fontFamily: 'Amiko_400Regular',
            color: '#d8e3e1',
            textAlign: "center",
            fontSize: 10
          }}>
            <Icon  name="back" size={10} type="antdesign" color='#d8e3e1'/> Return to Starmap 
          </Link>
          
      </View>
    </View>
  );
}
