import * as React from 'react';
import { View, TouchableOpacity,FlatList } from 'react-native';
import  {useState} from 'react';
import { Menu } from '../styles/menu_styles';

export default function NavItem(props){

    const[open, setOpen] = useState(true);

    // const[tabNames,setTabNames] = useState([
    //     {name: 'Main Menu', id:'1'},
    //     {name: 'Celestial Bodies', id: '2'},
    //     {name: 'Favorite Stars', id:'3'},
    // ]);
    return(
        <View style = {Menu.navItem}>
            <TouchableOpacity  onPress = {() => setOpen(!open)}>
                {props.icon}
            </TouchableOpacity>

            {open && props.children}
        </View>

    );

}