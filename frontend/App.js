
import * as React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";


import { Platform } from "react-native";

import { colors, page, text, spacing } from "./assets/global_styles";
import Geolocation from './components/Geolocation';
import Rotation from './components/Rotation';

import Navbar from "./components/Navbar";
import Starmap from "./components/Starmap";

export default function App() {
  let topBar;

  // True for testing for mobile
  if (Platform.OS === "ios" || Platform.OS === "android" || true) {
    topBar = (
      <>
        <View
          style={{
            color: "#ffffff",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <TouchableOpacity>
            <Image
              source={require("./assets/List.png")}
              style={{ width: 50, height: 50, tintColor: "white" }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            color: "#ffffff",
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <TouchableOpacity>
            <Image
              source={require("./assets/MagnifyingGlass.png")}
              style={{ width: 50, height: 50, tintColor: "white" }}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  } else {
    topBar = (
      <View
        style={{
          backgroundColor: "#212121",
          color: "white",
          height: 50,
          left: 0,
          right: 0,
          position: "absolute",
          top: 0,
        }}
      >
        Testing
      </View>
    );
  }
  
  let geolocation = <Geolocation />;
  let rotation = <Rotation />;

  return (
    <>
      <Starmap />
      <Navbar
        style={[{ position: "absolute", top: 0, height: 50 }, page.color]}
      >
        <View style={{position: 'absolute', top: 0, left: 0}}>
          <TouchableOpacity>
            <Image source={require('./assets/List.png')} style={{width: 50, height: 50, tintColor: colors.primary}}/>
          </TouchableOpacity>
        </View>
        <View style={{position: 'absolute', top: 0, right: 0}}>
          <TouchableOpacity>
            <Image source={require('./assets/MagnifyingGlass.png')} style={{width: 50, height: 50, tintColor: colors.primary}}/>
          </TouchableOpacity>
        </View>
      </Navbar>
      {rotation}
      {geolocation}
    </>
  );
}


