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
import { loginFetch } from "./Handlers.js";


export default function LoginPage({navigation}) {

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
          }}> You have successfully registered with Constellario!{'\n'} Check your email for further instructions on{'\n'} how to access your awaiting starmap.</Text>
            
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
