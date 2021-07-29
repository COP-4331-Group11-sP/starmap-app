import * as React from "react";
import { View, TouchableOpacity } from 'react-native';
import { Header, ListItem, Icon } from "react-native-elements";
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Menu } from "../styles/menu_styles";
import SubPages from "./FavPage";
import SearchBar from "react-native-elements/dist/searchbar/SearchBar-ios";
import FavPage from "./FavPage";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ShootingStarsIcon from './ShootingStarsIcon';
import StarIcon from './StarIcon';
import Meteor from './Meteor';

const Stack = createStackNavigator();
export default function DropDownMenu({navigation}){

    const [open, setFavOpen] = useState(false);


    function favoritesPage(){
        
    }

    return(
        

        <View style={Menu.dropDownMenu}>
            

            <ListItem bottomDivider containerStyle={{ backgroundColor: "#839997"}} >
                {/* <Icon name={item.icon} /> */}
                <ShootingStarsIcon/>
                <ListItem.Content style= {{alignItems: "center"}}>
                    <ListItem.Title >Main Menu</ListItem.Title>
                    {/* <ShootingStarsIcon/> */}
                </ListItem.Content>
            </ListItem>
            
            {/* <ListItem bottomDivider containerStyle={Menu.NavItems}  onPress={() => setFavOpen(!open)}> */}
            <ListItem bottomDivider containerStyle={Menu.NavItems} onPress={() => navigation.navigate('Details')}>
                {/* <Icon name= "av-timer" /> */}
                <StarIcon/>
                <ListItem.Content style={{ alignItems: "center", }} >
                    <ListItem.Title style = {{color: "white"}} > Favorites</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>

           

            <ListItem bottomDivider  containerStyle={Menu.NavItems} onPress={() => navigation.navigate('StarList')}>
                {/* <Icon name = "flight-takeoff" /> */}
                <Meteor/>
                <ListItem.Content style={{ alignItems: "center" }} >
                    <ListItem.Title style = {{color: "white"}} > Celestial Bodies </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>

            {open && <FavPage/>}

            
        </View>

       

    );
}

