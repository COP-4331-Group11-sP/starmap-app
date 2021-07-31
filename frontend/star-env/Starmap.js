import * as React from 'react';
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer, TextureLoader, THREE } from "expo-three";
import StarControlsView from './cameras/StarControlsView';
import StarInfoCard from '../components/StarInfoCard';
import { View } from 'react-native';
import StarUtils from './star-utils';



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

//const bgImage = require('./PANO_MellingerRGB.jpg');
const fontLoader = new THREE.FontLoader();

let font = fontLoader.parse( require( 'three/examples/fonts/optimer_regular.typeface.json' ) );

export default function Starmap(props) {
  const [selectedStar, setSelectedStar] = React.useState(null);
  const [particles, setParticles] = React.useState(null);


  const [mapCamera, setMapCamera] = React.useState(null);
  const [mapRender, setMapRender] = React.useState(null);
  const [mapScene, setMapScene] = React.useState(null);

  let offset = {x: 0, y: 0};

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

    scene.add(generateText('N', new THREE.Vector3(0, 0, -50), camera));
    scene.add(generateText('E', new THREE.Vector3(50, 0, 0), camera));
    scene.add(generateText('S', new THREE.Vector3(0, 0, 50), camera));
    scene.add(generateText('W', new THREE.Vector3(-50, 0, 0), camera));
    
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

    for (let s = 0; s < global.stars.length; s++) {
      
      const [x, y, z] = StarUtils.sphereToCart(global.stars[s][global.starIdx.ra], global.stars[s][global.starIdx.dec], 100 + global.stars[s][global.starIdx.dist] / 1000);

      // Hide uncertain stars
      if (global.stars[s][global.starIdx.dist] >= 100000)
        positions.push(0, 0, 100000);
      else 
        positions.push( x, y, z );
      
      
      const color = new THREE.Color(global.stars[s][global.starIdx.color]);
      colors.push( color.r, color.g, color.b );

      // god gave us: https://astronomy.stackexchange.com/questions/36406/best-way-to-simulate-star-sizes-to-scale-in-celestial-sphere
      const size = Math.pow(10, (-1.44 - global.stars[s][global.starIdx.appMag]) / 5);
      if (global.stars[s][global.starIdx.proper] == 'Vega') {
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
      
      lst = StarUtils.LST(deltaJ, global.longlat.longitude);
      
      starParticles.material.uniforms.zoom.value = camera.zoom;

      const latRad = StarUtils.degToRad(global.longlat.latitude);

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

  function starSelection(position) {
    let raycaster = new THREE.Raycaster();
    let renderWindow = new THREE.Vector2();

    mapRender.getSize(renderWindow);

    let coords = new THREE.Vector2();
    coords.x = ( (position.x - offset.x) / renderWindow.x ) * 2 - 1;
	  coords.y = - ( (position.y - offset.y ) / renderWindow.y ) * 2 + 1;

    raycaster.params.Points.threshold = 5 / (mapCamera.zoom);
    raycaster.setFromCamera( coords, mapCamera );

		const intersects = raycaster.intersectObject( particles );
    const attributes = particles.geometry.attributes;

    if (intersects.length > 0) {
      let biggest = intersects[ 0 ].index;
      
      for (let i = 1; i < intersects.length; i++) {
        let newStarIdx = intersects[ i ].index;

        if (global.stars[biggest][global.starIdx.appMag] > global.stars[newStarIdx][global.starIdx.appMag]) {
          biggest = newStarIdx;
        }
      }

      if (selectedStar)
        attributes.isSelected.array[selectedStar] = 0;
      attributes.isSelected.array[biggest] = 1;
      attributes.isSelected.needsUpdate = true;
      setSelectedStar(biggest);
    }
  }

  function generateText(text, position, camera) {
    const textMat = new THREE.MeshBasicMaterial({opacity: 0.6, transparent: true, color: '#ffffff'});
    const geo = new THREE.TextGeometry(text, {font: font, size: 4, height: 1});
    geo.computeBoundingBox();
    let center = -0.5 * (geo.boundingBox.max.x - geo.boundingBox.min.x);
    const mesh = new THREE.Mesh( geo, textMat );
    mesh.position.set(position.x - center, position.y, position.z);
    mesh.rotation.y = Math.atan2( ( camera.position.x - mesh.position.x ), ( camera.position.z - mesh.position.z ) );
    return mesh;
  }

	return (
		<View style={{ flex: 1 }} onLayout={event => {
      const { x, y } = event.nativeEvent.layout;
      offset = {x, y};
      console.log({x, y}, offset);
    }}>
      <StarControlsView style={{ flex: 1}} camera={mapCamera} starInteraction={starSelection}>
        <GLView
          style={{ flex: 1 }}
          onContextCreate={onContextCreate}
        />
      </StarControlsView>
      {selectedStar != null ? <StarInfoCard setSelectedStar={setSelectedStar} selectedStar={selectedStar}  /> : null}
    </View>
	);
}