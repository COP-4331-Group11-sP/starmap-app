
import * as React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";


import { Platform } from "react-native";

import { colors, page, text, spacing } from "./assets/global_styles";
import * as Location from 'expo-location';
import Rotation from './components/Rotation';

import Navbar from "./components/Navbar";
import Starmap from "./components/Starmap";

export default function App() {
  const [location, setLocation] = React.useState({longitude: 0, latitude: 0});

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords)
    })();
  }, []);
  
  let rotation = <Rotation />;
  return (
    <>
      <Starmap location={location} />
      {rotation}
    </>
  );
}


