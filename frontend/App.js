import * as React from "react";
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';


import { Text } from "react-native";
import { colors, page, text, spacing } from "./assets/global_styles";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, Link } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import LeftArrowLine from './components/LeftArrowLine';
import { readCookie } from './components/cookieHandler';

import StarPage from './pages/StarPage';
import FavePage from './pages/FavePage';

import RegistrationPage from "./pages/RegistrationPage.js";
import LoginPage from "./pages/LoginPage.js";
import NewPassPage from "./pages/NewPassPage.js"
import ForgotPassPage from "./pages/ForgotPassPage.js"
import VerifyEmailPage from "./pages/VerifyEmailPage.js"


const Stack = createStackNavigator();
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

const prefix = Linking.createURL('/');

const config = {
  screens: {
    StarMap: 'stars',
    Favorites: 'favorites',
    Login: 'login',
    Registration: 'signup',
    EmailVerification: {
      path: 'verify/:verificationToken'
    },
    NewPassword: {
      path: 'new-password/:idToken/:pwToken'
    },
    ForgotPassword: {
      path: 'forgot-password'
    },
  }
};



export default function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  global.stars = starData;
  global.starIdx = require( './star-env/data/columns.json' );
  global.baseURL = 'https://constellario.xyz';
  global.longlat = { longitude: 0, latitude: 0 };
  global.userId = null; // attempt to get userId from cookies on startup. if failure, we know they aren't logged in

  const linking = {
    prefixes: [global.baseURL, prefix],
    config
  };

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

    global.userId = readCookie();
    if (global.userId) {
      setLoggedIn(true);
    }
  }, [global.userId]);

  function CustomDrawerContent(props) {
    const routesToExclude = ['Registration', 'EmailVerification', 'NewPassword', 'ForgotPassword'];
    const { state, ...rest } = props;
    const newState = { ...state };
    newState.routes = newState.routes.filter(
      item => !routesToExclude.includes(item.name)
    );
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItem
        label={() => <LeftArrowLine />}
        onPress={props.navigation.closeDrawer}
        />
        <DrawerItemList state={newState} {...rest} />
        <DrawerItem
        label={'Logout'}
        onPress={() => {global.userId = null; setLoggedIn(false);}}
        />
      </DrawerContentScrollView>
    );
  }

  return (
    <SafeAreaProvider style={{ backgroundColor: "#0b0f0f"}} >
      <NavigationContainer 
        linking={linking} 
        fallback={<Text>Loading...</Text>}>
        <Drawer.Navigator
          initialRouteName="StarMap"
          headerMode="none" 
          drawerContent={(props) => <CustomDrawerContent {...props} />} 
          drawerStyle={{backgroundColor: '#334f59'}}
          drawerContentOptions={{
            activeTintColor: '#ffffff',
            inactiveTintColor: '#ffffff',
            activeBackgroundColor: '#222c33'
          }}>
            <Drawer.Screen name="StarMap" component={StarPage} />
            <Drawer.Screen name="Favorites" component={FavePage} />
            <Drawer.Screen name="Login" component={LoginPage} />
            <Drawer.Screen name="Registration" component={RegistrationPage}/>
            <Drawer.Screen name="EmailVerification" component={VerifyEmailPage}/>
            <Drawer.Screen name="NewPassword" component={NewPassPage}/>
            <Drawer.Screen name="ForgotPassword" component={ForgotPassPage}/>
        </Drawer.Navigator> 
      </NavigationContainer>  
    </SafeAreaProvider>
  );
}