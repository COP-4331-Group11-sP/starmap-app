import * as React from "react";
import { View, Text, TextInput } from "react-native";
import ColorButton from '../components/ColorButton.js';
import StarHeader from "../components/StarHeader.js";
import { Icon } from 'react-native-elements';
import { page, text, spacing } from "../assets/global_styles";
import { Amiko_400Regular } from '@expo-google-fonts/amiko';
import * as Font from 'expo-font';
import { verifyFetch } from "../components/Handlers.js";
import { Link } from '@react-navigation/native';

export default function VerifyEmailPage({navigation, route}) {

  const [errorOccured, setErrorOccured] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [loaded] = Font.useFonts( {Amiko_400Regular} );
  const [verified, setVerified] = React.useState(false);


  React.useEffect(() => {
    console.log(route.params.verificationToken);
    verifyFetch(route.params.verificationToken)
    .then(message => {
      errorMessage(message);
      setVerified(true);
    });
  }, [route.params.verificationToken]);

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
            }}> 
            {
              verified ? 
              'You\'ve verified! Return to the starmap to enjoy the view!' : 
              'You\'re not verified. Something went wrong!'
            }
          </Text>

            

            {errorOccured ? <Text style = 
                  {{
                    fontFamily: 'Amiko_400Regular',
                    color: 'red',
                    marginTop: 10,
                    marginBottom: 10,
                    textAlign: "center",
                    fontSize: 14
                  }}> {errMessage} </Text> : null}

            <Link to='/login'
          style = 
          {{
            fontFamily: 'Amiko_400Regular',
            color: '#d8e3e1',
            marginTop: 15,
            marginBottom: 15,
            textAlign: "center",
          }}>Return to login?
          </Link>

          <Link to='/stars'
          style = 
          {{
            fontFamily: 'Amiko_400Regular',
            color: '#d8e3e1',
            textAlign: "center",
            fontSize: 10
          }}><Icon  name="back" size={10} type="antdesign" color='#d8e3e1'/> Return to Starmap 
          </Link>
          
      </View>
    </View>
  );
}
