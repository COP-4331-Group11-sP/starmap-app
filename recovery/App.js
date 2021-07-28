
import * as React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';


import { Platform } from 'react-native';

import { colors, page, text, spacing } from './assets/global_styles';
import * as Location from 'expo-location';
import Rotation from './components/Rotation';

import Navbar from './components/Navbar';
import Starmap from './star-env/Starmap';

import './config';

export default function App() {
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
  
  let rotation = <Rotation />;
  return (
    <>
      <Starmap/>
      {rotation}
      <View style={{backgroundColor: '#fff', color: '#000', top: 50, right: 0, position: 'absolute'}}>
        <Text>Lat: {global.config.location.latitude.toFixed(3)}, Long: {global.config.location.longitude.toFixed(3)}</Text>
      </View>
    </>
  );
}


