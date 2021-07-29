import * as React from 'react';
import { View, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import NavItem from './NavItem';
import { Menu } from '../styles/menu_styles';

export default function MenuDropDown(){

    function DropdownItem(props){
        return(
            // <button className="menu-item"></button>
            <TouchableOpacity style = {Menu.menuItem}>
                {/* <View style={Menu.iconButton}> {props.leftIcon}</View> */}
                {props.leftIcon}
                {props.children}
                {props.rightIcon}
                {/* <View style={Menu.iconRight}> {props.rightIcon}</View> */}
            </TouchableOpacity>
        );
    }
    return(
        
        <View>

            {/* <NavItem icon="⬆️" style = {{backgroundColor: "red"}} /> */}

            {/* <View className="dropdown" style={{ backgroundColor: "aqua", left: 0, top: 100 }}> */}
            <View style={Menu.dropDown}>

                <View style ={Menu.menuItem}>Main Menu</View>
                <DropdownItem leftIcon = "🔙" rightIcon = "➡️"> My Profile </DropdownItem>
                <DropdownItem leftIcon = "🔙"rightIcon = "➡️">  Celestial Bodies  </DropdownItem>
                <DropdownItem leftIcon="🔙" rightIcon="➡️">  App Settings  </DropdownItem>
            </View>
        </View>
    );
}

// leftIcon= "🔙"