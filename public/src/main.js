import * as THREE from "three";
import { LoadGLTFByPath } from "./Helpers/ModelHelper.js";
import { OrbitControls } from "/node_modules/three/examples/jsm/controls/OrbitControls.js";

//Renderer does the job of rendering the graphics
let renderer = new THREE.WebGLRenderer({
  //Defines the canvas component in the DOM that will be used
  canvas: document.querySelector("#background"),
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);

//set up the renderer with the default settings for threejs.org/editor - revision r153
renderer.shadows = true;
renderer.shadowType = 1;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = 0;
renderer.toneMappingExposure = 1;
renderer.useLegacyLights = false;
renderer.toneMapping = THREE.NoToneMapping;
renderer.setClearColor(0xffffff, 0);
//make sure three/build/three.module.js is over r152 or this feature is not available.
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();

// background color black
//scene.background = new THREE.Color(0, 0, 0);

// Add floor
const floorSize = 50;
const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);

const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);

floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
floor.position.y = -0.01; // Slightly below 0 to avoid z-fighting
scene.add(floor);

// Set Lighting
const light = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
light.position.set(1, 2, 1);
scene.add(light);

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Adjust shadow properties for better quality
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 50;

// Add a helper to visualize the light direction (optional, remove in production)
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  5
);
scene.add(directionalLightHelper);

// Enable shadow rendering on the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Enable shadow casting and receiving on the floor
floor.receiveShadow = true;

let camera;
let controls;
let smokeParticles; // Add this line

// Load the GLTF model
LoadGLTFByPath(scene)
  .then(() => {
    setupCamera();
    setupOrbitControls();
    createExhaustSmoke(); // Add this line
    animate();
  })
  .catch((error) => {
    console.error("Error loading JSON scene:", error);
  });

function setupCamera() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 2, -5);
  updateCameraAspect(camera);
}

function setupOrbitControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0); // Set the orbit center to the car's position
  controls.update();

  // Optionally, you can set constraints on the controls
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.minPolarAngle = Math.PI / 6; // 30 degrees
  controls.maxPolarAngle = Math.PI / 2; // 90 degrees
}

// Add this new function
function createExhaustSmoke() {
  const smokeTexture = new THREE.TextureLoader().load(
    "/public/models/textures/smoke/smoke_texture.png"
  );
  const smokeMaterial = new THREE.PointsMaterial({
    size: 0.1,
    map: smokeTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.7,
  });

  const particleCount = 1000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = Math.random() - 0.05; // x
    positions[i * 3 + 1] = Math.random(); // y
    positions[i * 3 + 2] = Math.random() - 0.05; // z
  }

  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  smokeParticles = new THREE.Points(particles, smokeMaterial);

  // Adjust the position to match your car's exhaust location
  smokeParticles.position.set(0, 0.3, -2.3); // Example position, adjust as needed
  scene.add(smokeParticles);
}

// Update the animate function
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Add this block to animate the smoke
  if (smokeParticles) {
    const positions = smokeParticles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += 0.003; // Move particles upward

      // Reset particles that go too high
      if (positions[i + 1] > 1) {
        positions[i + 1] = 0;
      }
    }
    smokeParticles.geometry.attributes.position.needsUpdate = true;
  }

  renderer.render(scene, camera);
}

// Add an event listener for window resizing
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Set the camera aspect ratio to match the browser window dimensions
function updateCameraAspect(camera) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
