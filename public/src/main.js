import * as THREE from "three";
import { LoadGLTFByPath } from "./Helpers/ModelHelper.js";
import { OrbitControls } from "/node_modules/three/examples/jsm/controls/OrbitControls.js";

var revbar = new ldBar("#revBar");

let isRev = false;
// 0.002 ~ 0.007
let rev_counter = 0.002;
let max_rev = 0.007;

export function rev() {
  isRev = true;
  console.log(isRev);
}

export function unrev() {
  isRev = false;
  console.log(isRev);
}

function rrev() {
  // rev control
  if (isRev && rev_counter < max_rev) {
    rev_counter += 0.00007;
  } else if (!isRev && rev_counter > 0.002) {
    rev_counter -= 0.00002;
  }

  revbar.set(((rev_counter - 0.002) / (max_rev - 0.002)) * 100);
}

const canvas = document.querySelector("#background");

//Renderer does the job of rendering the graphics
let renderer = new THREE.WebGLRenderer({
  //Defines the canvas component in the DOM that will be used
  canvas: canvas,
  antialias: true,
});

renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

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
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Variables for smoke particles
let positions_init;
let positions_count;
let positions_moverate;

const scene = new THREE.Scene();

// background color black
scene.background = new THREE.Color(0, 0, 0);

// Box for knowing position
const boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.74, -2.1);
scene.add(box);

// Add floor
const floorSize = 50;
const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);

const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x303030 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);

floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
floor.position.y = -0.01; // Slightly below 0 to avoid z-fighting
scene.add(floor);

// Set Lighting
const light = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
light.position.set(1, 5, 1);
scene.add(light);

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// directionalLight.position.set(5, 10, 7.5);
// directionalLight.castShadow = true;
// scene.add(directionalLight);

// // Adjust shadow properties for better quality
// directionalLight.shadow.mapSize.width = 2048;
// directionalLight.shadow.mapSize.height = 2048;
// directionalLight.shadow.camera.near = 1;
// directionalLight.shadow.camera.far = 50;

// // Add a helper to visualize the light direction (optional, remove in production)
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   5
// );
// scene.add(directionalLightHelper);

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
    addRearLightGlow();
    animate();
  })
  .catch((error) => {
    console.error("Error loading JSON scene:", error);
  });

function setupCamera() {
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(1.4, 1.5, -3.7);

  camera.lookAt(0, 0.5, -2.7);

  updateCameraAspect(camera);
}

function addRearLightGlow() {
  const rearLight = scene.getObjectByName("TwiXeR_992_fascia_glass");

  if (!rearLight) {
    console.error(
      "Rear light mesh (TwiXeR_992_fascia_glass) not found in the model"
    );
    return;
  }

  // Create a glowing material for the rear light
  const glowMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 1,
    transparent: true,
    opacity: 0.5,
  });

  // Apply the glowing material to the rear light mesh
  rearLight.material = glowMaterial;

  // Create a point light to enhance the glow effect
  const rearLightPoint = new THREE.PointLight(0xff0000, 1, 2);
  rearLightPoint.position.set(0, 0.74, -2.1);
  scene.add(rearLightPoint);

  console.log("red light set!");
  console.log("rearLight position", rearLight.position);
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

// Update this function
function createExhaustSmoke() {
  const particleCount = 200;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  positions_init = new Float32Array(particleCount * 2);
  positions_count = new Float32Array(particleCount);
  positions_moverate = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions_init[i * 2] = Math.random() - 0.5;
    positions_init[i * 2 + 1] = Math.random() - 0.5;

    positions_count[i] = i;

    positions_moverate[i] = 0.003;
  }

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = positions_init[i * 2] * 0.01; // x
    positions[i * 3 + 1] = positions_init[i * 2 + 1] * 0.01; // y
    positions[i * 3 + 2] = Math.random() * -0.5; // z
  }

  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // Create a small sphere geometry for smoke particles
  const sphereGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const smokeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.7,
  });

  smokeParticles = new THREE.InstancedMesh(
    sphereGeometry,
    smokeMaterial,
    particleCount
  );
  smokeParticles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  // Set initial positions for instanced spheres
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < particleCount; i++) {
    matrix.setPosition(
      positions[i * 3],
      positions[i * 3 + 1],
      positions[i * 3 + 2]
    );
    smokeParticles.setMatrixAt(i, matrix);
  }

  // Adjust the position to match your car's exhaust location
  smokeParticles.position.set(0, 0.25, -2.3); // Example position, adjust as needed
  scene.add(smokeParticles);
}

// Update the animate function
function animate() {
  requestAnimationFrame(animate);
  // controls.update();

  rrev();
  //console.log(rev_counter);

  // Add this block to animate the smoke
  if (smokeParticles) {
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();

    for (let i = 0; i < smokeParticles.count; i++) {
      positions_count[i] += 1;
      smokeParticles.getMatrixAt(i, matrix);
      const position = new THREE.Vector3().setFromMatrixPosition(matrix);

      position.x += positions_init[i * 2] * 0.002;
      position.y += positions_init[i * 2 + 1] * 0.002 + -1 * position.z * 0.003;
      position.z -= positions_moverate[i];

      // Set particle's opacity
      let opacity =
        (positions_count.length - positions_count[i]) / positions_count.length;
      color.setHex(0xffffff);
      color.multiplyScalar(opacity);
      smokeParticles.setColorAt(i, color);

      // Reset particles that go too far in z direction
      if (positions_count[i] > positions_count.length) {
        positions_count[i] = 0;
        position.x = positions_init[i * 2] * 0.01;
        position.y = positions_init[i * 2 + 1] * 0.01;
        position.z = 0; // Reset to the starting point

        // positions_moverate[i] = !isRev
        //   ? 0.002 + Math.random() * 0.002
        //   : 0.004 + Math.random() * 0.002;

        positions_moverate[i] = rev_counter + Math.random() * 0.002;
      }

      matrix.setPosition(position);
      smokeParticles.setMatrixAt(i, matrix);
    }
    smokeParticles.instanceMatrix.needsUpdate = true;
    smokeParticles.instanceColor.needsUpdate = true;
  }

  renderer.render(scene, camera);
}

// Add an event listener for window resizing
// window.addEventListener("resize", onWindowResize, false);

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

// // Set the camera aspect ratio to match the browser window dimensions
function updateCameraAspect(camera) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
