import * as React from 'react';
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer, TextureLoader, THREE } from "expo-three";
import StarControlsView from './cameras/StarControlsView';
import { View } from 'react-native';
import StarUtils from './star-utils';
import '../config';


const starIdx = require('./data/columns.json');

let stars = [];

stars = stars.concat(require('./data/stars_0.json'));
stars = stars.concat(require('./data/stars_1.json'));
stars = stars.concat(require('./data/stars_2.json'));
stars = stars.concat(require('./data/stars_3.json'));
stars = stars.concat(require('./data/stars_4.json'));
stars = stars.concat(require('./data/stars_5.json'));
stars = stars.concat(require('./data/stars_6.json'));
stars = stars.concat(require('./data/stars_7.json'));
stars = stars.concat(require('./data/stars_8.json'));
stars = stars.concat(require('./data/stars_9.json'));
stars = stars.concat(require('./data/stars_10.json'));


global.THREE = global.THREE || THREE;

const vertexCode = `
  attribute float size;
  attribute vec3 customColor;
  attribute float isSelected;
  uniform float zoom;
  uniform mat4 rotationMatrix;

  varying vec3 vColor;
  varying float vIsSelected;
  
  void main() {
    vColor = customColor;
    vIsSelected = isSelected;
    vec4 mvPosition = modelViewMatrix * rotationMatrix * vec4( position, 1.0 );
    gl_PointSize = 50.0 * size * zoom;
    gl_Position = projectionMatrix * mvPosition;

    // Hides invisible stars behind the camera, where they cannot be seen or clicked
    vec4 disPosition = vec4(0.0, 0.0, 100000.0, 1.0); 
    if ( gl_PointSize < 1.0 ) gl_Position = projectionMatrix * disPosition;
  }
`;

const fragmentCode = `
  uniform sampler2D starTexture;
  uniform sampler2D coronaTexture;
  uniform sampler2D selectTexture;

  varying vec3 vColor;
  varying float vIsSelected;

  void main() {
    float renderSelect = vIsSelected;
    vec4 starTexels = texture2D( starTexture, gl_PointCoord );
    vec4 coronaTexels = texture2D( coronaTexture, gl_PointCoord );
    vec4 selectTexels = texture2D( selectTexture, gl_PointCoord );
    vec3 starColor = vColor + starTexels.rgb;
    vec3 coronaColor = vColor * coronaTexels.rgb;
    float alpha = starTexels.a + coronaTexels.a;
    gl_FragColor = vec4(starColor + coronaColor, alpha );
    gl_FragColor = gl_FragColor + vec4(selectTexels.rgb, selectTexels.a * renderSelect);
  }
`;


let selectedStar = null;
export default function Starmap(props) {
  const [mapCamera, setMapCamera] = React.useState(null);
  const [mapRender, setMapRender] = React.useState(null);
  const [mapScene, setMapScene] = React.useState(null);
  const [particles, setParticles] = React.useState(null);
  const clock = new THREE.Clock();

	let timeout;

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    
    return () => clearTimeout(timeout);
  }, []);

  async function onContextCreate(gl) {
    const utils = true;
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const sceneColor = "#000000";
    const textureLoader = new TextureLoader();
    
    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    setMapRender(renderer);
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    setMapCamera(camera);
    camera.position.set(0, 0, 0);


    const scene = new THREE.Scene();
    setMapScene(scene);
    scene.fog = new THREE.Fog(sceneColor, 1, 10000);

    if (utils) testUtils(scene);
    
    const ambientLight = new THREE.AmbientLight(0x101010);
    scene.add(ambientLight);

    let time = StarUtils.getUTC(new Date());
    
    let deltaJ = StarUtils.deltaJ(time);

    let lst, ha, az, alt, x, y, z;  

    const positions = [];
    const colors = [];
    const sizes = [];
    const selected = [];
    const rotationMatrix = new THREE.Matrix4();

    for (let s = 0; s < stars.length; s++) {
      
      const [x, y, z] = StarUtils.sphereToCart(stars[s][starIdx.ra], stars[s][starIdx.dec], 100 + stars[s][starIdx.dist] / 100);

      // Hide uncertain stars
      if (stars[s][starIdx.dist] >= 100000)
        positions.push(0, 0, 100000);
      else 
        positions.push( x, y, z );
      
      
      const color = new THREE.Color(stars[s][starIdx.color]);
      colors.push( color.r, color.g, color.b );

      // god gave us: https://astronomy.stackexchange.com/questions/36406/best-way-to-simulate-star-sizes-to-scale-in-celestial-sphere
      const size = Math.pow(10, (-1.44 - stars[s][starIdx.appMag]) / 5);
      if (stars[s][starIdx.proper] == 'Vega') {
        console.log(size, x, y, z);
      }

      sizes.push( size );
      
      selected.push(0);
    }
    
    
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3) );
    starGeometry.setAttribute( 'customColor', new THREE.Uint8BufferAttribute( colors, 3 ) );
    starGeometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1) );
    starGeometry.setAttribute( 'isSelected', new THREE.Float32BufferAttribute( selected, 1 ));
    
    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        starTexture: { value: textureLoader.load( require( './star.png' ) ) },
        coronaTexture: { value: textureLoader.load( require( './corona.png' ) ) },
        selectTexture: { value: textureLoader.load( require('./star-select.png' ) )},
        zoom: { value: camera.zoom },
        rotationMatrix: { value: rotationMatrix }
      },
      vertexShader: vertexCode,
      fragmentShader: fragmentCode,
      blending: THREE.AdditiveBlending,
			depthTest: false,
      transparent: true,
      alphaTest: 0.1
    });
    
    const starParticles = new THREE.Points(starGeometry, starMaterial);
    setParticles( starParticles );
    scene.add( starParticles );

    
    function update() {
      time = StarUtils.getUTC(new Date());
      
      deltaJ = StarUtils.deltaJ(time);
      
      lst = StarUtils.LST(deltaJ, global.config.location.longitude);
      
      starParticles.material.uniforms.zoom.value = camera.zoom;

      const latRad = StarUtils.degToRad(global.config.location.latitude);

      const rotY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), latRad - Math.PI/2);
      const rotZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, -1), -StarUtils.degToRad(lst));

      const rotFin = new THREE.Quaternion().multiplyQuaternions(rotZ, rotY);

      starParticles.setRotationFromQuaternion(rotFin);
      //const rotMat = new THREE.Matrix4();
      //rotMat.makeRotationFromQuaternion(rotFin);
      //starParticles.material.uniforms.rotationMatrix.value = rotMat;

      clock.start();
    }

    
    
    // Setup an animation loop
    const render = () => {
      timeout = requestAnimationFrame(render);
      update();
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    clock.start();
    render();
  }

  function getSelectedStar() {
    return stars[selectedStar];
  }

  function starInteraction(position) {
    let raycaster = new THREE.Raycaster();
    let renderWindow = new THREE.Vector2();
    mapRender.getSize(renderWindow);

    let coords = new THREE.Vector2();
    coords.x = ( position.x / renderWindow.x ) * 2 - 1;
	  coords.y = - ( position.y / renderWindow.y ) * 2 + 1;
    raycaster.params.Points.threshold = 1 - (mapCamera.zoom * 0.01);
    raycaster.setFromCamera( coords, mapCamera );

		const intersects = raycaster.intersectObject( particles );
    const attributes = particles.geometry.attributes;
    if (intersects.length > 0) {
      let biggest = intersects[ 0 ].index;
      
      for (let i = 1; i < intersects.length; i++) {
        if (stars[biggest][starIdx.appMag] > stars[intersects[ i ].index][starIdx.appMag]) {
          biggest = intersects[ i ].index;
        }
      }
      
      if (selectedStar)
        attributes.isSelected.array[selectedStar] = 0;
      attributes.isSelected.array[biggest] = 1;
      attributes.isSelected.needsUpdate = true;
      selectedStar = biggest;
    }
  }

  function testUtils(scene) {
    // NORTH
    scene.add(new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -1).normalize(),
      new THREE.Vector3(0, 0, 0),
      5,
      0xff0000
    ));
    // EAST
    scene.add(new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0).normalize(),
      new THREE.Vector3(0, 0, 0),
      5,
      0xff5050
    ));
    // SOUTH
    scene.add(new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1).normalize(),
      new THREE.Vector3(0, 0, 0),
      5,
      0xff8080
    ));
    // WEST
    scene.add(new THREE.ArrowHelper(
      new THREE.Vector3(-1, 0, 0).normalize(),
      new THREE.Vector3(0, 0, 0),
      5,
      0xffc0c0
    ));
    // UP
    scene.add(new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0).normalize(),
      new THREE.Vector3(0, 0, 0),
      5,
      0xffeeee
    ));
  }

	return (
		<View style={{ flex: 1 }} onPress>
      <StarControlsView style={{ flex: 1}} camera={mapCamera} starInteraction={starInteraction}>
        <GLView
          style={{ flex: 1 }}
          onContextCreate={onContextCreate}
        />
      </StarControlsView>
    </View>
	);
}