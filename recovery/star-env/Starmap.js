import * as React from 'react';
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer, TextureLoader, THREE } from "expo-three";
import StarControlsView from './cameras/StarControlsView';
import { View } from 'react-native';
import StarUtils from './star-pos';
import './DeviceOrientationController';
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

export default function Starmap(props) {
  let [mapCamera, setMapCamera] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [mapRender, setMapRender] = React.useState(null);
  const [mapScene, setMapScene] = React.useState(null);
  const clock = new THREE.Clock();

  
  const starGroup = new THREE.Group();
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
    renderer.sortObjects = false;

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);

    setMapCamera(camera);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(sceneColor, 1, 10000);

    if (utils) testUtils(scene);
    
    const ambientLight = new THREE.AmbientLight(0x101010);
    scene.add(ambientLight);

    let time = StarUtils.getUTC(new Date());
    
    let deltaJ = StarUtils.deltaJ(time);

    let lst, ha, az, alt, x, y, z;  

    lst = StarUtils.LST(deltaJ, global.config.location.longitude);

    let minMag = Number.MAX_VALUE;
    let maxMag = Number.MIN_VALUE;
    for (let star of stars) {
      minMag = star[starIdx.appMag] < minMag ? star[starIdx.appMag] : minMag;
      maxMag = star[starIdx.appMag] > maxMag ? star[starIdx.appMag] : maxMag;
    }
    let pivotMag = maxMag + minMag;

    const positions = [];
    const colors = [];
    const sizes = [];

    for (let s = 0; s < stars.length; s++) {
      const [x, y, z] = starPos(stars[s], lst);
      positions.push( x, y, z );
      

      const color = new THREE.Color(stars[s][starIdx.color]);
      colors.push( color.r, color.g, color.b );

      const size = Math.pow(2.512, -stars[s][starIdx.appMag]);
      if (stars[s][starIdx.proper] == 'Vega') {
        console.log(size, x, y, -z);
      }
      sizes.push( size );
    }
  
    // implement if gl_PointSize < 1 discard
    const vertexCode = `
      attribute float size;
      attribute vec3 customColor;
      uniform float zoom;

      varying vec3 vColor;
      
      void main() {
        vColor = customColor;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vec4 disPosition = modelViewMatrix * vec4(100000.0, 100000.0, 100000.0, 1.0);
        gl_PointSize = size * zoom;
        gl_Position = projectionMatrix * mvPosition;
        if ( gl_PointSize < 1.0 ) gl_Position = projectionMatrix * disPosition;
      }
    `;

    const fragmentCode = `
      uniform sampler2D starTexture;
      uniform sampler2D coronaTexture;

      varying vec3 vColor;

      void main() {
        vec4 starTexels = texture2D( starTexture, gl_PointCoord );
        vec4 coronaTexels = texture2D( coronaTexture, gl_PointCoord );
        vec3 starColor = vColor + starTexels.rgb;
        vec3 coronaColor = vColor * coronaTexels.rgb;
        float alpha = starTexels.a + coronaTexels.a;
        gl_FragColor = vec4(starColor + coronaColor, alpha );
        if ( gl_FragColor.a < ALPHATEST ) discard;
      }
    `;
    
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3) );
    starGeometry.setAttribute( 'customColor', new THREE.Uint8BufferAttribute( colors, 3 ) );
    starGeometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1) );
    
    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        starTexture: { value: textureLoader.load( require( './star.png' ) ) },
        coronaTexture: { value: textureLoader.load( require( './corona.png' ) ) },
        zoom: {value: camera.zoom }
      },
      vertexShader: vertexCode,
      fragmentShader: fragmentCode,
      blending: THREE.AdditiveBlending,
			depthTest: false,
      transparent: true,
      alphaTest: 0.1
    });
    
    const starParticles = new THREE.Points(starGeometry, starMaterial);
    starGroup.add( starParticles );
    scene.add( starGroup );

    
    function update() {
      time = StarUtils.getUTC(new Date());
      
      deltaJ = StarUtils.deltaJ(time);
      
      lst = StarUtils.LST(deltaJ, global.config.location.longitude);

      const geometry = starParticles.geometry;
      const material = starParticles.material;
      const attributes = geometry.attributes;
      const uniforms = material.uniforms;
      uniforms.zoom.value = camera.zoom;
      for (let s = 0; s < stars.length; s++) {
        [x, y, z] = starPos(stars[s], lst);
        attributes.position.array[s * 3] = x;
        attributes.position.array[s * 3 + 1] = y;
        attributes.position.array[s * 3 + 2] = -z;
        if (s == 10) {
          //console.log(x, y, -z);
        }
      }
    }
    
    // Setup an animation loop
    const render = () => {
      timeout = requestAnimationFrame(render);
      //update();
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  }

  function starPos(star, lst) {
    let [az, alt] = StarUtils.azAndAlt(star[starIdx.dec], global.config.location.latitude, StarUtils.HA(lst, star[starIdx.ra]));
    
    return StarUtils.sphereToCart(az, alt, star[starIdx.dist]);
  }

  function getClickedStar(event) {

  }

  function worldToScreen(x, y, z, w) {
    
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
    
  }

	return (
		<View style={{ flex: 1 }} onPress>
      <StarControlsView style={{ flex: 1}} camera={mapCamera}>
        <GLView
          style={{ flex: 1 }}
          onContextCreate={onContextCreate}
        />
      </StarControlsView>
    </View>
	);
}