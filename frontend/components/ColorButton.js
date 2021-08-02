import React from 'react';
import { TouchableOpacity } from 'react-native';
import { page, text, spacing } from "../assets/global_styles";

export default function ColorButton (props) {
  return (
    
        <TouchableOpacity onPress = {props.onPress} style = {[page.inputBoxConfig, page.btnLogin]}> 

        {props.children}
        
        </TouchableOpacity>
  );
}
