import * as React from "react";
import { View, Text, Linking, TextInput } from "react-native";
import ColorButton from '../components/ColorButton.js';
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
import ShootingStarsIcon from "../components/ShootingStarsIcon.js";


export default function StarHeader()
{ 
  
  const [loaded] = Font.useFonts({
    'MonospaceBold': require('../components/fonts/MonospaceBold.ttf')
  });

  if(!loaded)
  {
    return null;
  }
  
  return(
  
  <View style = {{alignContent: 'center'}}> 
    
    <ShootingStarsIcon style = {{alignSelf: 'center'}} height = {120} width={200}/>
    
    <Text
    style = {{
      textAlign: 'center',
      fontFamily: 'MonospaceBold',
      fontSize: 35,
      fontWeight: 'bold',
      color: '#d8e3e1',
      paddingBottom: 10,
    }}
    >Constellario</Text>

  </View>
)
  

  
}
