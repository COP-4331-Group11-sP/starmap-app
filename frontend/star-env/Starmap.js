import * as React from 'react';
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer, TextureLoader, THREE } from "expo-three";
import OrbitControlsView from 'expo-three-orbit-controls';
import { View, Button, Text } from 'react-native';
import StarUtils from './star-pos';
import './DeviceOrientationController';
import '../config';


import stars from './stars.json';

global.THREE = global.THREE || THREE;

const bg_img = require('./black_bg.png');

export default function Starmap(props) {
  let [mapCamera, setMapCamera] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [mapRender, setMapRender] = React.useState(null);
  const [mapScene, setMapScene] = React.useState(null);

  let spheres = [];
	let timeout;
  let bg_texture; 

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    
    return () => clearTimeout(timeout);
  }, []);

  function testArea() {
    // for testing functions and examples
    
  }

  testArea();

  async function onContextCreate(gl) {
    const utils = true;
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const sceneColor = "#000000";
    
    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    setMapRender(renderer);
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
    //const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.01, 1000);
    camera.position.set(0, 0, 1);

    setMapCamera(camera);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(sceneColor, 1, 10000);

    if (utils) testUtils(scene);
    

    const ambientLight = new THREE.AmbientLight(0x101010);
    scene.add(ambientLight);

    const geo = new THREE.SphereGeometry(1, 3, 3);

    let time = StarUtils.getUTC(new Date());
    
    let deltaJ = StarUtils.deltaJ(time);

    
    const bg_geometry = new THREE.SphereGeometry( 500, 40, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    bg_geometry.scale( -1, 1, 1 );
    bg_texture = new TextureLoader().load(bg_img);
    const bg_material = new THREE.MeshBasicMaterial( { map: bg_texture } );
    const bg_mesh = new THREE.Mesh( bg_geometry, bg_material );
    
    let lst, ha, az, alt, x, y, z;
    
    scene.add( bg_mesh );

    let minMag = Number.MAX_VALUE;
    for (let star of stars) {
      minMag = star.absMag < minMag ? star.absMag : minMag;
    }

    for (let s = 0; s < stars.length; s++) {
      const mater = new THREE.MeshBasicMaterial({color: stars[s].color});
      
      const sphere = new THREE.Mesh(geo, mater);
      spheres.push(sphere);

      if (stars[s].dist > 10) continue;
      [x, y, z] = starPos(stars[s], lst);

      sphere.position.set(x,y,-z);
      let adjMag = stars[s].absMag - minMag + 1;
      sphere.scale.set(1/adjMag, 1/adjMag, 1/adjMag)
      scene.add(sphere);
    }

    function update() {
      time = StarUtils.getUTC(new Date());
      
      deltaJ = StarUtils.deltaJ(time);
      
      lst = StarUtils.LST(deltaJ, global.config.location.longitude);
      
      ha = StarUtils.HA(lst, global.config.location.longitude);
      [az, alt] = StarUtils.azAndAlt(89.99, global.config.location.latitude, ha);
      let rotX = StarUtils.degToRad((alt)-90);
      let rotY = StarUtils.degToRad(az);
      bg_mesh.setRotationFromEuler(new THREE.Euler(rotX, rotY, 0));
      
      for (let s = 0; s < stars.length; s++) {
        if (stars[s].dist > 10) continue;
        
        [x,y,z] = starPos(stars[s], lst);
        
        spheres[s].position.set(x, y, -z);
      }
      console.log(scene.children.length);
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

  function starPos(star, lst) {
    let [az, alt] = StarUtils.azAndAlt(star.dec, global.config.location.latitude, StarUtils.HA(lst, star.ra));
    return StarUtils.sphereToCart(az, alt, star.dist);
  }

  function getClickedStar(event) {

  }

  function worldToScreen(x, y, z, w) {
    
  }

  function testUtils(scene) {
    scene.add(new THREE.GridHelper(10, 10));

    // EAST
    scene.add(new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0).normalize(),
      new THREE.Vector3(0, 0, 0),
      5,
      0xff0000
    ));
    // UP
    scene.add(new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0).normalize(),
      new THREE.Vector3(0, 0, 0),
      5,
      0x00ff00
    ));
    // NORTH
    scene.add(new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -1).normalize(),
      new THREE.Vector3(0, 0, 0),
      5,
      0x0000ff
    ));
  }

  let toRender = <View style={{ flex: 1 }} onPress>
    <GLView
      style={{ flex: 1 }}
      onContextCreate={onContextCreate}
    />
</View>;

  if (true) {
    toRender = <View style={{ flex: 1 }} onPress>
    <OrbitControlsView style={{ flex: 1}} camera={mapCamera}>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={onContextCreate}
      />
    </OrbitControlsView>
  </View>;
  }

	return (
		<>
      {/* Remove Orbit Controls. Implement static position camera, with rotating around and fov zoom. */}
      {toRender}
		</>
	);
}