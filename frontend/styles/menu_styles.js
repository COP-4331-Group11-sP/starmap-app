import { StyleSheet,Platform } from "react-native";
import { Header, ListItem, Icon } from "react-native-elements";
import { color } from "react-native-elements/dist/helpers";
import { SafeAreaProvider } from 'react-native-safe-area-context';





// const styles = StyleSheet.create({ height: Platform.OS === 'ios' ? 200 : 100 });


const Menu = StyleSheet.create({
    
    

    
    //width handled by parent "dropDownMenu"
    NavItems: {
        backgroundColor: "#334f59",
        
        // maxWidth: 400,
    },

    navbar:{
        
        height: Platform.OS === "web" ? 60: null,
        borderStyle: Platform.OS === "web" ? "none" :null,
        borderBottomWidth: 0,
        // opacity:  Platform.OS  === "web" ? 1: 0.1,
        
        
        
    },
    

    dropDownMenu: {
        // maxWidth: "20%",
        backgroundColor: 'aqua',
        borderRightWidth: 1,
        maxWidth: Platform.OS === "web" ? "15%" : "50%",
        maxHeight: "100%",
        
        
    }
    
   

});

const SearchStyle =StyleSheet.create({

    MyContainerStyle:{
        backgroundColor: "transparent", 
        borderLeftWidth: 0, 
        borderRightWidth: 0, 
        borderRadius: 15, 
        position: "absolute", 
        top: -15, 
        borderBottomColor: "transparent", 
        borderTopColor: "transparent", 
    }

});


const InfoBox = StyleSheet.create({
    CardContainerStyle:{
        position: "absolute",
        top: Platform.OS === "web" ? 10 : null,
        bottom: Platform.OS === "web" ? null : 20,
        left: 10,
        zIndex: 1,
        width: 350,
        height: 250,
        backgroundColor: "#334f5950",
        borderRadius: 20,
        borderWidth: 0,
        padding: 10,
        margin: 0,
    },

    cardText:{
        color:"white",
    }
});

const FavBox = StyleSheet.create({
    CardContainerStyle:{
        position: "relative",
        width: 350,
        height: 250,
        backgroundColor: "#334f59",
        borderRadius: 20,
        padding: 10,
        margin: 10
    },

    cardText:{
        color:"white",
    }
})

export {Menu,SearchStyle,InfoBox, FavBox};




// body: {
//     margin: 0,
//     backgroundColor: "#0b0f0f",
//     fontFamily: "roboto",
//     // webkitFontSmoothing: "antialiased",
//     // mozOsxFontSmoothing: "grayscale",
// },

// navbar: {   
//     height: 60,
//     backgroundColor: "#334f59",
//     padding: 12,
//     borderBottomColor: "#474a4d",
//     borderBottomWidth: 1,
//     borderStyle: "solid",

// },

// navbarNav: {
//     maxWidth: "100%",
//     height: "100%",
//     display: "flex",
//     justifyContent: "flex-start",
//     margin:0,
//     padding:0,

    

// },

// navbarNavRight: {
//     maxWidth: "100%",
//     height: "100%",
//     right: 0,
//     display: "flex",
//     justifyContent: "flex-end",
// },

// navItem: {
//     width: "calc(60 * 0.8)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     position: "absolute",
//     // position: "fixed",
//     left: 10,
// },

// // not in use****
// // iconButton: {
// //     width: "calc(60 * 0.5)",
// //     height: "calc(60 * 0.5)",
// //     backgroundColor: "#484a4d",
// //     borderRadius: "50%",
// //     padding: 5,
// //     margin: 2,
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     // transition: filter 300ms
// // },

// iconButtonHover: {
//   // filter: brightness(1.2);
// },

// dropDown:{
//     // position: "absolute",
//     position: "absolute",
//     top: 60,
//     left: 0,
//     width: 300,
//     backgroundColor: "#334f59",
//     borderWidth: 1,
//     borderStyle: "solid",
//     borderColor: "#474a4d",
//     // borderRadius: 8,
//     padding: 12,
//     overflow: "hidden",
//     //transition: height 500ms ease
// },

// menu: {
//     width: "100%",
// },

// menuItem: {
//     height: 50,
//     display: "flex",
//     alignItems: "center",
//     borderWidth: 1,
//     borderStyle: "solid",
//     borderColor: "aqua",
//     borderRadius: 8,
//     backgroundColor: "#00ffff",
//     //transition: background(this is a color = #0b0f0f ) var(--speed);
//     padding: 6,

// },

// menuItemHover: {
//     backgroundColor: "#525357",

// },

// // Not in use ****
// iconRight: {
//     marginLeft: 100,
// }