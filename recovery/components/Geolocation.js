import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = "lon: " + location.coords.longitude.toFixed(2) + ", lat: " + location.coords.latitude.toFixed(2);
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 350,
    right: 0,
    height: 25,
    width: 150,
    backgroundColor: '#ffffff'
  }
}); 