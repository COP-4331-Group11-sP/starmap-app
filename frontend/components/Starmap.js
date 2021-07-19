import * as React from 'react';
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer, TextureLoader } from "expo-three";
import OrbitControlsView from 'expo-three-orbit-controls';
import { View, Button, Text } from 'react-native';

import stars from '../assets/stars.json';

import {
  AmbientLight,
  BoxBufferGeometry,
  CircleGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  SpotLight,
} from "three";

export default function Starmap() {
	let [resp, setResp] = React.useState('');
  let [camera, setCamera] = React.useState(null);
	let timeout;

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);
	
	async function getData() {
	}

	return (
		<>
      <OrbitControlsView style={{ flex: 1}} camera={camera}>
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
          camera.position.set(0, 0, 30);

          setCamera(camera);

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

          const geo = new SphereGeometry(0.1, 5, 5);

          let time = new Date();
          let ut = dayFraction(time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds());
          
          let j2000 = daySinceJ2000(time.getUTCFullYear(), 
                                    time.getUTCMonth(), 
                                    time.getUTCDate(),
                                    time.getUTCHours(),
                                    time.getUTCMinutes(),
                                    time.getUTCSeconds());

          for (let s = 0; s < stars.length; s++) {
            const mat = new MeshBasicMaterial( { color: Math.random() * 0xffffff });
            const sphere = new Mesh(geo, mat);
            let ra = stars[s].RA.split(' ').map((val)=>{ return parseFloat(val) });
            let dec = stars[s].DEC.split(' ').map((val)=>{ return parseFloat(val) });
            let raDeg = hourToDeg(ra[0], ra[1], ra[2]);
            let decDeg = hourToDeg(dec[0], dec[1], dec[2]);
            let dist = 10;

            let lst = LST(j2000, ut, -82.35);
            let ha = HA(lst, raDeg);
            let [el, az] = elAndAz(decDeg, 29.66, ha);
            let [x, y, z] = sphereToCart(el, az, dist);

            
            sphere.position.set(x,y,z);
            scene.add(sphere);
          }

          function update() {
          }

          function hourToDeg(h, m, s) {
            return h * 15 + m * 0.25 + s * 0.0041666;
          }

          function dayFraction(h, m, s) {
            return (h + (m/60) + (s/3600))/24;
          }

          function degToRad(deg) {
            return deg * Math.PI / 180;
          }

          function radToDeg(rad) {
            return rad * 180 / Math.PI;
          }

          function daySinceJ2000(year,month,day,hour,min,sec) {
            let daysSince2000 = -1.5;
            let leap = 0;
            if (year % 4 != 0) leap = 1;
            for (let y = 1; y < year - 2000; y++) {
              if (year % 4 == 0)
                daysSince2000 += 366;
              else
                daysSince2000 += 365;
            }
            let daysSinceStart;
            switch (month) {
              case (0):
                daysSinceStart = 0;
              case (1):
                daysSinceStart = 31;
              case (2):
                daysSinceStart = 59 + leap;
              case (3):
                daysSinceStart = 90 + leap;
              case (4):
                daysSinceStart = 120 + leap;
              case (5):
                daysSinceStart = 151 + leap;
              case (6):
                daysSinceStart = 181 + leap;
              case (7):
                daysSinceStart = 212 + leap;
              case (8):
                daysSinceStart = 243 + leap;
              case (9):
                daysSinceStart = 273 + leap;
              case (10):
                daysSinceStart = 304 + leap;
              case (11):
                daysSinceStart = 334 + leap;
            }
            return dayFraction(hour, min, sec) + daysSinceStart + day + daysSince2000;
          }

          function LST(j2000, ut, long) {
            let lst = 100.46 + 0.985647 * j2000 + long + 15 * ut;
            if (lst < 0)
              lst += 360;
            return lst % 360;
          }

          function HA(lst, raDeg) {
            let ha = lst - raDeg;
            if (ha < 0) ha += 360;
            return ha;
          }

          function elAndAz(decDeg, lat, ha) {
            let sinLat = Math.sin(degToRad(lat));
            let cosLat = Math.cos(degToRad(lat));
            let sinDec = Math.sin(degToRad(decDeg));
            let cosDec = Math.cos(degToRad(decDeg));
            let cosHa = Math.cos(degToRad(ha));
            let sinHa = Math.cos(degToRad(ha));
            
            let sinEl = sinDec * sinLat + cosDec * cosLat * cosHa;
            let el = radToDeg(Math.asin(sinEl));

            let cosAz = (sinDec - sinEl * sinLat) / (Math.cos(degToRad(el)) * cosLat);
            
            let az = radToDeg(Math.acos(cosAz));
            if (sinHa >= 0) 
              az = 360 - az;
            return [el, az];
          }

          function sphereToCart(el, az, dist) {
            let x = dist * Math.cos(az * Math.PI / 180) * Math.cos(el * Math.PI / 180);
            let y = dist * Math.sin(el * Math.PI / 180);
            let z = dist * Math.sin(az * Math.PI / 180) * Math.cos(el * Math.PI / 180);
            return [x, y, z];
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
      </OrbitControlsView>
		</>
	);
}