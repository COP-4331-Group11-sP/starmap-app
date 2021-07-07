import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer, TextureLoader } from "expo-three";
import * as React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import {
  AmbientLight,
  BoxBufferGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from "three";

import { Platform } from "react-native";

import { colors, page, text, spacing } from "./assets/global_styles";
import Geolocation from './components/Geolocation';
import Rotation from './components/Rotation';

import Navbar from "./components/Navbar";

export default function App() {
  let timeout;

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

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
      <GLView
        style={{ flex: 1 }}
        onContextCreate={async (gl) => {
          const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
          const sceneColor = "#000000";

          // Create a WebGLRenderer without a DOM element
          const renderer = new Renderer({ gl });
          renderer.setSize(width, height);
          renderer.setClearColor(sceneColor);

          const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
          camera.position.set(2, 5, 5);

          const scene = new Scene();
          scene.fog = new Fog(sceneColor, 1, 10000);
          scene.add(new GridHelper(10, 10));

          const ambientLight = new AmbientLight(0x101010);
          scene.add(ambientLight);

          const pointLight = new PointLight(0xffffff, 2, 1000, 1);
          pointLight.position.set(0, 200, 200);
          scene.add(pointLight);

          const spotLight = new SpotLight(0xffffff, 0.5);
          spotLight.position.set(0, 500, 100);
          spotLight.lookAt(scene.position);
          scene.add(spotLight);

          const cube = new IconMesh();
          scene.add(cube);

          camera.lookAt(cube.position);

          function update() {
            cube.rotation.y += 0.05;
            cube.rotation.x += 0.025;
          }

          // Setup an animation loop
          const render = () => {
            timeout = requestAnimationFrame(render);
            update();
            renderer.render(scene, camera);
            gl.endFrameEXP();
          };
          render();
        }}
      />
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

class IconMesh extends Mesh {
  constructor() {
    super(
      new BoxBufferGeometry(1.0, 1.0, 1.0),
      new MeshStandardMaterial({
        map: new TextureLoader().load(require("./assets/icon.png")),
        // color: 0xff0000
      })
    );
  }
}
