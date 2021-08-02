import * as React from "react";
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';


import { Text } from "react-native";
import { colors, page, text, spacing } from "./assets/global_styles";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import LeftArrowLine from './components/LeftArrowLine';

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
    Home: {
      initialRouteName: 'StarMap',
      screens: {
        StarMap: {
          path: ''
        },
        Favorites: {
          path: 'favorites'
        }
      }
    },
    UserEntry: {
      initialRouteName: 'Login',
      screens: {
        Login: {
          path: 'login'
        },
        Registration: {
          path: 'signup'
        },
        EmailVerification: {
          path: 'verify'
        },
        NewPassword: {
          path: 'new-password'
        },
        ForgotPassword: {
          path: 'forgot-password'
        }
      }
    },
    StarMap: '*',
  }
}

const linking = {
  prefixes: [global.baseURL, prefix],
  config
};

export default function App() {
  global.stars = starData;
  global.starIdx = require( './star-env/data/columns.json');
  global.baseURL = 'https://constellario.xyz';
  global.longlat = { longitude: 0, latitude: 0 };

  

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

  return (
    <SafeAreaProvider style={{ backgroundColor: "#0b0f0f"}} >
      <NavigationContainer 
        linking={linking} 
        fallback={<Text>Loading...</Text>}>
        <Stack.Navigator initialRouteName="Home" 
        headerMode='none'>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="UserEntry" component={UserEntry} />
        </Stack.Navigator>
      </NavigationContainer>  
    </SafeAreaProvider>
  );
}

function Home() {
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

  return (
    // <NavigationContainer>
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
        </Drawer.Navigator>
      // </NavigationContainer>  
  );
}


function UserEntry() {
  return (
    // <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' headerMode='none'>
        <Stack.Screen name="Login" component={LoginPage}/>
        <Stack.Screen name="Registration" component={RegistrationPage}/>
        <Stack.Screen name="EmailVerification" component={VerifyEmailPage}/>
        <Stack.Screen name="NewPassword" component={NewPassPage}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassPage}/>
      </Stack.Navigator>
    // </NavigationContainer>
  );
}