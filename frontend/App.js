import * as React from "react";
import * as Location from 'expo-location';



import { View, Image, Text, TouchableOpacity,Platform,Button,ScrollView } from "react-native";
import { Menu,SearchStyle } from "./styles/menu_styles";
import { colors, page, text, spacing } from "./assets/global_styles";
import { Header, ListItem, Icon,SearchBar,BottomSheet,Card } from "react-native-elements";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DropDownMenu from "./components/DropDownMenu";
import MenuIcon from './components/MenuIcon';
import MagnifyingGlass from './components/MagnifyingGlass';
import EyeSlash from './components/EyeSlash';
import  ShootingStarsIcon  from './components/ShootingStarsIcon';
import { NavigationContainer, DefaultTheme  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LeftArrowLine from './components/LeftArrowLine';
import StarInfoCard from "./components/StarInfoCard";
import StarIcon from './components/StarIcon';
import Meteor from './components/Meteor';

import Starmap from './star-env/Starmap';

import './config';

const Stack = createStackNavigator();


export default function App() {

  const [open, setOpen] = React.useState(true);  // corresponds with dropdownmenu's state
  
  const [value, setValue] = React.useState(""); // corresponds with the searchbar contents

  const [visible,setBarVisible] = React.useState(false);
  
  const [errorMsg, setErrorMsg] = React.useState('');
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      global.config.location = loc.coords;
    })();
  }, []);
  
  // const [isMobile,setmobile] = Mobile();


  // mess with this themeing
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.backgroundColor,
      primary: 'red',
      backgroundColor: 'transparent'
      
    },
  };




  return (
      // style={{ backgroundColor: "#0b0f0f"}}
    <SafeAreaProvider style={{ backgroundColor: "#0b0f0f"}} >
        <Starmap/>
       
         {/* This is styling that will show up for web only version */}
        {Platform.OS === "web" &&
      
          <Header
            backgroundColor = "#334f59"
            containerStyle = {Menu.navbar}
            // rightComponent={{ icon: 'home', color: '#fff' }}
          >
            {/* this is the left component(menu) */}
            <TouchableOpacity  onPress={() => setOpen(!open)}>
              <MenuIcon/>
            </TouchableOpacity>

            {/* This is the middle component (SearchBar) */}
        <SearchBar
          platform="default"
          containerStyle={{ backgroundColor: "transparent", borderLeftWidth: 1, borderRightWidth: 1, borderRadius: 15, position: "absolute", top: -15, borderBottomColor: "transparent", borderTopColor: "transparent", border: "transparent"}}
          inputContainerStyle={{ maxHeight: 40, width: 400, backgroundColor: "#D8E3E1", opacity: "0.2"}}
          inputStyle={{}}
          leftIconContainerStyle={{}}
          rightIconContainerStyle={{}}
          loadingProps={{}}
          onChangeText={newVal => setValue(newVal)}
          onClearText={() => console.log(onClearText())}
          placeholder="Type query here..."
          placeholderTextColor="#888"
          cancelButtonTitle="Cancel"
          cancelButtonProps={{}}
          onCancel={() => console.log(onCancel())}
          value={value}
        />
            {/* <SearchBar 
          containerStyle={{backgroundColor:"transparent", borderLeftWidth: 1, borderRightWidth: 1, borderRadius: 15, position: "absolute", top: -15,borderBottomColor: "transparent",borderTopColor:"transparent",border:"transparent"}}
              // containerStyle = {{backgroundColor:"transparent",borderTopWidth:"none",borderBottomWidth:"none",}}
          inputContainerStyle={{ maxHeight: 40, width: 400, backgroundColor: "#D8E3E1",opacity: "0.2"}}
            placeholder="Type Here..."
          
            /> */}

            {/* This is the right component (Hide UI button) */}
            
            <EyeSlash/>
          

          </Header>

      }

      


      {/* MOBILE VERSION */}
      {(Platform.OS ==="android" || Platform.OS === "ios") && 
      
        <Header
          backgroundColor="transparent"
          containerStyle={Menu.navbar}
          // rightComponent={{ icon: 'search', color: '#fff' }}
        >
          {/* this is the left component(menu) */}
          <TouchableOpacity onPress={() => setOpen(!open)}>
          <MenuIcon />
          </TouchableOpacity>

          {/* This is search bar and will be invisible on mobile */}
          {visible && 
        <SearchBar
          platform="default"
          containerStyle={SearchStyle.MyContainerStyle}
          inputContainerStyle={{ maxHeight: 40, width: 200, backgroundColor: "transparent",border:"transparent"}}
          inputStyle={{}}
          leftIconContainerStyle={{}}
          rightIconContainerStyle={{}}
          loadingProps={{}}
          onChangeText={newVal => setValue(newVal)}
          onClearText={() => console.log(onClearText())}
          placeholder="Type query here..."
          placeholderTextColor="#888"
          cancelButtonTitle="Cancel"
          cancelButtonProps={{}}
          onCancel={() => console.log(onCancel())}
          value={value}
        />

        }

          {/* This is the right component (Hide UI button) */}
          <TouchableOpacity onPress={() => setBarVisible(!visible)}>
            <MagnifyingGlass height = {35} width = {35}/>
          </TouchableOpacity>


        </Header>
      
      }

      <Text style={{ position: "absolute", top: '50%', left: '50%', color: "white",}} onPress={() => alert("ayo")}> HEEEEELLLLLLLOOOOOO</Text>

      {/* <StarInfoCard/> */}
          {/* {open && <DropDownMenu/>} */}
        

          {/* This contains the menu navigation and activates on button press */}
          {open && 

          <NavigationContainer theme ={MyTheme}>

            <Stack.Navigator initialRouteName="Home" headerMode="none" >
              <Stack.Screen name="Home" component={DropDownMenu} />
              <Stack.Screen name="Details" component={FavPage} />
              <Stack.Screen name = "StarList" component ={starsPage}/>
            </Stack.Navigator>
          </NavigationContainer>
          }       
      </SafeAreaProvider>
    );
  }



function FavPage({ navigation }){

    const list = [
        {
            title: "other stuf",
            
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
      <View style={ Menu.dropDownMenu}>

            <ListItem bottomDivider containerStyle={Menu.NavItems} >
                {/* <Icon name={item.icon} /> */}
          {/* <ListItem.Chevron onPress={() => navigation.goBack()}/> */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <LeftArrowLine />
          </TouchableOpacity>
                <ListItem.Content style={{ alignItems: "center" }}>
            <ListItem.Title style={{ color: "white" }} >Your Favorite Stars</ListItem.Title>
                </ListItem.Content>
            </ListItem>

            {/* Add a page such that every favorite star has a notes page */}
            {
                list.map((item, i) => (
                    <ListItem key={i} bottomDivider containerStyle={Menu.NavItems} onPress={() => alert("im stuf")}>
                        <Icon name={item.icon}  />
                    <ListItem.Content style={{ alignItems: "center" }} >
                      <ListItem.Title style={{ color: "white" }} >{item.title}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                ))
                
            }

        </View>
    );
}


async function getWikiArticles(props) {
  var emptyShit = []

  var url = ''
  // for (let place of places) {
    url = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + "Polaris" + "%22" + "Polaris" + "%22&format=json&srlimit=3&origin=*"
    // url = "https://api.wikimedia.org/core/v1/wikipedia/en/page/Vega/description"
    await fetch(url)
      .then(res => {
        // console.log(res)
        // var test = res.json()
        // console.log(test)
        // console.log(test.query.search[0].snippet)
        return res.json()
      })
      .then(res => {

        console.log(res)
        // console.log(res.query.search[0].snippet)
        
        // getTheLinks(res.query.search[0].pageid)
     
      })
      
      .catch(error => {
        console.log(error)
      })
  // }
}

async function getTheLinks(pageid) {
 
    
    var url = "https://en.wikipedia.org/w/api.php?action=query&prop=info&pageids=" + pageid + "&inprop=url&format=json&origin=*";
    let response = await fetch(url);
    let data = await response.json();
    console.log(data)
   
    
}
  
  
function starsPage({ navigation }) {

  const list = [
    {
      title: "other stuf",
      
    },

    {
      title: 'Stuff',
      icon: 'av-timer'
    },

    {
      title: 'Im Stuf',
      icon: 'flight-takeoff'
    },

    {
      title: "other stuf",

    },

    {
      title: 'Stuff',
      icon: 'av-timer'
    },

    {
      title: 'Im Stuf',
      icon: 'flight-takeoff'
    },

    {
      title: "other stuf",

    },

    {
      title: 'Stuff',
      icon: 'av-timer'
    },

    {
      title: 'Im Stuf',
      icon: 'flight-takeoff'
    },

    {
      title: "other stuf",

    },

    {
      title: 'Stuff',
      icon: 'av-timer'
    },

    {
      title: 'Im Stuf',
      icon: 'flight-takeoff'
    },

    {
      title: "other stuf",

    },

    {
      title: 'Stuff',
      icon: 'av-timer'
    },

    {
      title: 'Im Stuf',
      icon: 'flight-takeoff'
    },

    {
      title: "other stuf",

    },

    {
      title: 'Stuff',
      icon: 'av-timer'
    },

    {
      title: 'Im Stuf',
      icon: 'flight-takeoff'
    },

    {
      title: "other stuf",

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
  return (
    <View style={Menu.dropDownMenu}>

      <ListItem bottomDivider containerStyle={Menu.NavItems} >
        {/* <Icon name={item.icon} /> */}
        {/* <ListItem.Chevron onPress={() => navigation.goBack()} /> */}
        <TouchableOpacity onPress={() => navigation.goBack()}> 
        <LeftArrowLine/>
        </TouchableOpacity>
        <ListItem.Content style={{ alignItems: "center" }}>
          <ListItem.Title style={{ color: "white" }} >Celestial Bodies</ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ScrollView>

      
      {
        list.map((item, i) => (
          <ListItem key={i} bottomDivider containerStyle={Menu.NavItems} onPress={() => getWikiArticles()}>
            <Icon name={item.icon} />
            <ListItem.Content style={{ alignItems: "center" }} >
              <ListItem.Title style={{ color: "white" }} >{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))

      }

      </ScrollView>

    </View>
  );
}





  
  
  
  // <Navbar>
  //   {/* <NavItem icon = "🌝"/>
  //   <NavItem icon = "🌌"/> */}
  //   {/* Note: We can render the invisibility button on left side with right/left props as used in video @10:00 */}

  //   {/* Drop Down stuff */}
  //   <NavItem icon= "⬇️">
      
  //     {/* <NavItem icon = "work?" style = {{position: "absolute", left: 100}}/> */}

  //     <MenuDropDown />
  //   </NavItem>

  // </Navbar>


  // This is what was in my return functino before starting fresh
/* <Navbar style={[{ position: "absolute", top: 0, height: 50 }, page.color]}>
        <View style={{position: 'absolute', top: 0, left: 0}}>
          <TouchableOpacity>
            <Image source={require('./assets/List.png')} style={{width: 50, height: 50, tintColor: colors.primary}}/>
          </TouchableOpacity>
        </View>

      <SearchBar
        inputStyle={{justifyContent: 'center', position: 'absolute', width: '300px'}}
        searchIcon={{ paddingLeft: '50px'}}
        inputContainerStyle={{display: 'flex', justifyContent: 'center', width: '400px', left: '50%', marginLeft: '-200px',}}
        placeholder="Type Here..."
        // onChangeText={this.updateSearch}
        // value={search}
        //  left: '50%',width:'200px'
      />
        <View style={{position: 'absolute', top: 0, right: 0}}>
          <TouchableOpacity>
            <Image source={require('./assets/MagnifyingGlass.png')} style={{width: 50, height: 50, tintColor: colors.primary}}/>
          </TouchableOpacity>
        </View>

        <View> Hello</View>
      </Navbar>
      */



// let topBar;
// True for testing for mobile
// if (Platform.OS === "ios" || Platform.OS === "android" || true) {
//   topBar = (
//     <>
//       <View
//         style={{
//           color: "#ffffff",
//           position: "absolute",
//           top: 0,
//           left: 0,
//         }}
//       >
//         <TouchableOpacity>
//           <Image
//             source={require("./assets/List.png")}
//             style={{ width: 50, height: 50, tintColor: "white" }}
//           />
//         </TouchableOpacity>
//       </View>
//       <View
//         style={{
//           color: "#ffffff",
//           position: "absolute",
//           top: 0,
//           right: 0,
//         }}
//       >
//         <TouchableOpacity>
//           <Image
//             source={require("./assets/MagnifyingGlass.png")}
//             style={{ width: 50, height: 50, tintColor: "white" }}
//           />
//         </TouchableOpacity>
//       </View>
//     </>
//   );
// } 
