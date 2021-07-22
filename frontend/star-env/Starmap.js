import * as React from 'react';
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer, TextureLoader } from "expo-three";
import OrbitControlsView from 'expo-three-orbit-controls';
import { View, Button, Text } from 'react-native';
import * as StarPos from './star-pos';
import './DeviceOrientationController';
import '../config';

const space = require('./PANO_MellingerRGB.jpg');

import stars from './stars.json';

import {
  AmbientLight,
  Color,
  Fog,
  GridHelper,
  ArrowHelper,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  ShaderMaterial,
  SpotLight,
  Vector3
} from "three";

export default function Starmap(props) {
  let [camera, setCamera] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState("");

  let spheres = [];
	let timeout;

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts

    return () => clearTimeout(timeout);
  }, []);

  async function onContextCreate(gl) {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const sceneColor = "#000000";
    
    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);

    const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.set(0, 0, 1);

    setCamera(camera);

    const scene = new Scene();
    scene.fog = new Fog(sceneColor, 1, 10000);

    



    scene.add(new GridHelper(10, 10));

    scene.add(new ArrowHelper(
      new Vector3(1, 0, 0).normalize(),
      new Vector3(0, 0, 0),
      5,
      0xff0000
    ));
    scene.add(new ArrowHelper(
      new Vector3(0, 1, 0).normalize(),
      new Vector3(0, 0, 0),
      5,
      0x00ff00
    ));
    scene.add(new ArrowHelper(
      new Vector3(0, 0, 1).normalize(),
      new Vector3(0, 0, 0),
      5,
      0x0000ff
    ));

    const ambientLight = new AmbientLight(0x101010);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 2, 1000, 1);
    pointLight.position.set(0, 200, 200);
    scene.add(pointLight);

    const spotLight = new SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 500, 100);
    spotLight.lookAt(scene.position);
    scene.add(spotLight);

    const geo = new SphereGeometry(0.1, 8, 8);

    let time = new Date();
    let ut = StarPos.dayFraction(time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds());
    
    let j2000 = StarPos.daySinceJ2000(time.getUTCFullYear(), 
                              time.getUTCMonth(), 
                              time.getUTCDate(),
                              time.getUTCHours(),
                              time.getUTCMinutes(),
                              time.getUTCSeconds());

    const bg_geometry = new SphereGeometry( 500, 60, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    bg_geometry.scale( - 1, 1, 1 );
    const bg_texture = new TextureLoader().load(require('./PANO_MellingerRGB.jpg'));
    const bg_material = new MeshBasicMaterial( { map: bg_texture } );
    const bg_mesh = new Mesh( bg_geometry, bg_material );

    let lst = StarPos.LST(j2000, ut, global.config.location.longitude);
    let ha = StarPos.HA(lst, global.config.location.longitude);
    let [el, az] = StarPos.elAndAz(global.config.location.latitude, global.config.location.latitude, ha);
    console.log(`Elevation: ${el}, Azimuth: ${az}`);
    bg_mesh.rotateOnWorldAxis(new Vector3(1, 0, 0), StarPos.degToRad(el+180));
    bg_mesh.rotateOnWorldAxis(new Vector3(0, 1, 0), StarPos.degToRad(az-45));
    
    
    scene.add( bg_mesh );

    for (let s = 0; s < stars.length; s++) {
      const mat = new MeshBasicMaterial( { color: stars[s].color });
      const sphere = new Mesh(geo, mat);
      // For decimal formatted RA and DEC (Should be degrees)
      let raDeg = stars[s].ra;
      let decDeg = stars[s].dec;
      let dist = stars[s].dist ? Math.log2(stars[s].dist) : 10;
      lst = StarPos.LST(j2000, ut, global.config.location.longitude);
      ha = StarPos.HA(lst, raDeg);
      [el, az] = StarPos.elAndAz(decDeg, global.config.location.latitude, ha);
      let [x, y, z] = StarPos.sphereToCart(el, az, dist);

      sphere.position.set(x,y,z);
      scene.add(sphere);
      spheres.push(sphere);
    }

    function update() {
      let time = new Date();
      let ut = StarPos.dayFraction(time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds());
      
      let j2000 = StarPos.daySinceJ2000(time.getUTCFullYear(), 
                                time.getUTCMonth(), 
                                time.getUTCDate(),
                                time.getUTCHours(),
                                time.getUTCMinutes(),
                                time.getUTCSeconds());
      
      let lst = StarPos.LST(j2000, ut, global.config.location.longitude);
      let ha = StarPos.HA(lst, global.config.location.longitude);
      let [el, az] = StarPos.elAndAz(global.config.location.latitude, global.config.location.latitude, ha);
      console.log(`Elevation: ${el}, Azimuth: ${az}`);
      bg_mesh.rotation.set(0, 0, 0);
      bg_mesh.rotateOnWorldAxis(new Vector3(1, 0, 0), StarPos.degToRad(el+180));
      bg_mesh.rotateOnWorldAxis(new Vector3(0, 1, 0), StarPos.degToRad(az-45));

      for (let s = 0; s < stars.length; s++) {
        let raDeg = stars[s].ra;
        let decDeg = stars[s].dec;
        let dist = stars[s].dist ? Math.log2(stars[s].dist) : 10;
        
        lst = StarPos.LST(j2000, ut, global.config.location.longitude);
        ha = StarPos.HA(lst, raDeg);
        [el, az] = StarPos.elAndAz(decDeg, global.config.location.latitude, ha);
        let [x, y, z] = StarPos.sphereToCart(el, az, dist);
        spheres[s].position.set(x, y, z);
      }
    }

    // Setup an animation loop
    const render = () => {
      timeout = requestAnimationFrame(render);
      update();
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  }

	return (
		<>
      {/* Remove Orbit Controls. Implement static position camera, with rotating around and fov zoom. */}
      <OrbitControlsView style={{ flex: 1}} camera={camera}>
			<GLView
        style={{ flex: 1 }}
        onContextCreate={onContextCreate}
      />
      </OrbitControlsView>
		</>
	);
}