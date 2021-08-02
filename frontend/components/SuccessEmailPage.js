import * as React from "react";
import { View, Text, Linking, TextInput } from "react-native";
import ColorButton from './ColorButton.js';
import StarHeader from "./StarHeader.js";
import { Icon } from 'react-native-elements';
import { page, text, spacing } from "../assets/global_styles";
import { 
  useFonts,
  Amiko_700Bold,
  Amiko_400Regular,
  Amiko_600SemiBold,
} from '@expo-google-fonts/amiko';
import * as Font from 'expo-font';
import { loginFetch } from "./Handlers.js";


export default function SuccessEmailPage({navigation}) {

  
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loaded] = Font.useFonts({Amiko_400Regular});

  if(!loaded)
  {
    return null;
  }
  
  return (
  
    <View style={[page.centerer, page.background]}>
      <View>
      <StarHeader/>
  
          <Text style = 
          {{
            fontFamily: 'Amiko_400Regular',
            color: '#d8e3e1',
            textAlign: "center"
          }}> We have found your email in our system!{'\n'} We have have sent further instructions to{'\n'}verify your profile.</Text>
            
            <Text onPress={() => navigation.navigate('Login')}
          style = 
          {{
            fontFamily: 'Amiko_400Regular',
            color: '#d8e3e1',
            marginTop: 15,
            marginBottom: 15,
            textAlign: "center",
            fontSize: 12
      
          }}>Return to login?
          </Text>
      </View>
    </View>
  );
}
