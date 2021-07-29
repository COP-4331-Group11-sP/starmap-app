import * as React from "react";
import { View, TouchableOpacity } from 'react-native';
import { Header, ListItem, Icon } from "react-native-elements";
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Menu } from "../styles/menu_styles";
import SearchBar from "react-native-elements/dist/searchbar/SearchBar-ios";

export default function FavPage(navigation){

    const list = [
        {
            title: "other stuf",
            icon: "rocket"
        },

        {
            title: 'Stuff',
            icon: 'av-timer'
        },

        {
            title: 'Im Stuf',
            icon: 'flight-takeoff'
        },

    ]
    return(
        <View>

            <ListItem bottomDivider containerStyle={Menu.NavItems} >
                {/* <Icon name={item.icon} /> */}
                <ListItem.Chevron onPress={() => alert("ayo")}/>
                <ListItem.Content style={{ alignItems: "center" }}>
                    <ListItem.Title >Go Back</ListItem.Title>
                </ListItem.Content>
            </ListItem>


            {
                list.map((item, i) => (
                    <ListItem key={i} bottomDivider containerStyle={Menu.NavItems} onPress={() => alert("ayo")}>
                        <Icon name={item.icon} />
                        <ListItem.Content >
                            <ListItem.Title >{item.title}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                ))
                
            }

        </View>
    );
}