import * as React from "react";
import { Touchable } from "react-native";
import { View, Text, Image,TouchableOpacity } from 'react-native';
import { Card, ListItem, Button, Icon, } from 'react-native-elements';
import { InfoBox } from "../styles/menu_styles";
import MenuIcon from './MenuIcon';
import StarIcon from './StarIcon'




export default function StarInfoCard(){

    const users = [
        {
            name: 'brynn',
            avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
        },
        // ... // more users here
]

return(
    // put in stylesheet and add mobile specific
    <Card containerStyle = {InfoBox.CardContainerStyle}>
        <Card.Title style={{ color: "white",display:"flex", alignItems: "flex-end"}}>
            Polaris
            <TouchableOpacity style= {{position: "relative",left: 225 }}>
            <StarIcon fill= "transparent" height = "30px"  />
            </TouchableOpacity>
            </Card.Title>
        <Card.Divider />
        {/* <Card.Image > */}
            <Text style={{color:"white", marginBottom: 10, }}>
                The idea with React Native Elements is more about component structure than actual design.
            </Text>
            
        {/* </Card.Image> */}
    </Card>
    
);
}