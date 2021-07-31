import * as React from "react";
import * as Location from 'expo-location';



import { View, Image, Text, TouchableOpacity,Platform,Button,ScrollView, FlatList } from "react-native";
import { Menu,SearchStyle } from "./styles/menu_styles";
import { colors, page, text, spacing } from "./assets/global_styles";
import { Header, ListItem, Icon,SearchBar,BottomSheet,Card } from "react-native-elements";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DropDownMenu from "./components/DropDownMenu";
import MenuIcon from './components/MenuIcon';
import MagnifyingGlass from './components/MagnifyingGlass';
import EyeSlash from './components/EyeSlash';
import  ShootingStarsIcon  from './components/ShootingStarsIcon';
import { NavigationContainer, DefaultTheme, DrawerActions  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import LeftArrowLine from './components/LeftArrowLine';
import StarInfoCard from "./components/StarInfoCard";
import StarIcon from './components/StarIcon';
import Meteor from './components/Meteor';

import Starmap from './star-env/Starmap';
import StarUtils from './star-env/star-utils';


const Drawer = createDrawerNavigator();

let starData = [];

starData = starData.concat(require('./star-env/data/stars_0.json'));
starData = starData.concat(require('./star-env/data/stars_1.json'));
starData = starData.concat(require('./star-env/data/stars_2.json'));
starData = starData.concat(require('./star-env/data/stars_3.json'));
starData = starData.concat(require('./star-env/data/stars_4.json'));
starData = starData.concat(require('./star-env/data/stars_5.json'));
starData = starData.concat(require('./star-env/data/stars_6.json'));
starData = starData.concat(require('./star-env/data/stars_7.json'));
starData = starData.concat(require('./star-env/data/stars_8.json'));
starData = starData.concat(require('./star-env/data/stars_9.json'));
starData = starData.concat(require('./star-env/data/stars_10.json'));

export default function App() {
  global.stars = starData;
  global.starIdx = require( './star-env/data/columns.json');
  global.baseURL = 'https://constellario.xyz';
  
  global.longlat = {longitude: 0, latitude: 0};

  function getSelectedStar() {
    return global.selectedStar;
  }
  function setSelectedStar(star) {
    global.selectedStar = star;
    setMenuStar(star);
  }

  function getLocation() {
    return global.longlat;
  }
  function setLocation(longlat) {
    global.longlat = longlat;
    console.log(`Latitude: ${global.longlat.latitude}, Longitude: ${global.longlat.longitude}`);
  }

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItem
        label={() => <LeftArrowLine />}
        onPress={props.navigation.closeDrawer}
        
        />
        <DrawerItemList {...props} />
        <DrawerItem
        label="Help"
        onPress={() => Linking.openURL('https://mywebsite.com/help')}
        activeTintColor={props.activeTintColor}
        inactiveTintColor={props.inactiveTintColor}
        />
      </DrawerContentScrollView>
    );
  }


  const starScreen = function({navigation}) {
    const [search, setSearch] = React.useState('');
    return (
      <>
        <Header backgroundColor = "#334f59" containerStyle = {Menu.navbar}>
          {/* this is the left component(menu) */}
          <TouchableOpacity  onPress={navigation.toggleDrawer}>
            <MenuIcon/>
          </TouchableOpacity>
          {/* This is the middle component (SearchBar) */}
          <SearchBar
            platform="default"
            containerStyle={{ backgroundColor: "transparent", borderLeftWidth: 1, borderRightWidth: 1, borderRadius: 15, position: "absolute", top: -15, borderBottomColor: "transparent", borderTopColor: "transparent", border: "transparent"}}
            inputContainerStyle={{ maxHeight: 40, width: Platform.OS == 'web' ? 400 : 250, backgroundColor: "#D8E3E120"}}
            inputStyle={{}}
            loadingProps={{}}
            onChangeText={val => setSearch(val)}
            placeholder="Type query here..."
            placeholderTextColor="#888"
            cancelButtonTitle="Cancel"
            cancelButtonProps={{}}
            value={search}
          />
        </Header>
        <Starmap setSelectedStar={setSelectedStar} getSelectedStar={getSelectedStar} getLocation={getLocation}/>
      </>
    );
  }

  let searchResults = [
    {starId: '1'},
    {starId: '2'},
    {starId: '3'},
    {starId: '4'},
    {starId: '5'},
    {starId: '0'},
    {starId: '118330'}
  ];

  const favScreen = function({navigation}) {
    const [results, setResults] = React.useState([]);

    async function searchFavorites() {
      let payload = {starId: '.*', userId: '60e7bb316b98f0921db705b7'};

      let response = await fetch(global.baseURL + '/api/search-favorites', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(payload)
      });
      let data = await response.json();

      if (response.status == 200) {
          return data;
      } 
    }

    navigation.addListener('focus', () => {
      /*searchFavorites()
      .then(searchResults => {
        setResults(searchResults);
      });*/
      setResults(searchResults);
    })

    return (
      <>
        <Header backgroundColor = "#334f59" containerStyle = {Menu.navbar}>
          {/* this is the left component(menu) */}
          <TouchableOpacity  onPress={navigation.toggleDrawer}>
            <MenuIcon/>
          </TouchableOpacity>
        </Header>

          <FlatList
            style={{flex: 1, backgroundColor: '#222c33'}}
            contentContainerStyle={{alignItems: 'center', padding: 10 }}
            numColumns={Platform.OS == 'web' ? 3 : 1}
            data={results}
            renderItem={({item}) => {return <StarInfoCard selectedStar={item.starId} faveWindow={true} />}}
            keyExtractor={item => item.starId}
          />
      </>
    )
  }



  return (
    <SafeAreaProvider style={{ backgroundColor: "#0b0f0f"}} >
          <NavigationContainer>
            <Drawer.Navigator 
              initialRouteName="Star Map" 
              headerMode="none" 
              drawerContent={(props) => <CustomDrawerContent {...props} />} 
              drawerStyle={{backgroundColor: '#334f59'}}
              drawerContentOptions={{
                activeTintColor: '#ffffff',
                inactiveTintColor: '#ffffff',
                activeBackgroundColor: '#222c33'
              }}>
              <Drawer.Screen name="Star Map" component={starScreen} />
              <Drawer.Screen name="Favorites" component={favScreen} />
            </Drawer.Navigator>
          </NavigationContainer>  
      </SafeAreaProvider>
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
