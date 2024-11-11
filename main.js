import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe6e6df);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Enable shadow mapping
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Load textures
const grassMask = textureLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Grass.png");
const leavesMask = textureLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Leaves.png");
const treeTexture = textureLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Tree.png");
const noiseTexture = textureLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Noise.png");  // Noise texture for grass variation

// GLTF Loader
const gltfLoader = new GLTFLoader();

// Load and add grass model
gltfLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Grass.gltf", (gltf) => {
    const grass = gltf.scene;
    scene.add(grass);

    // Apply noise texture for variation
    const grassMaterial = new THREE.MeshStandardMaterial({
        map: grassMask,
        color: 0x649B66,
        transparent: true,
        depthWrite: false, // Prevent depth writing for transparent objects
        emissive: 0x2f5b2e,  // Light emission to brighten the grass
        roughness: 0.8,
        metalness: 0.2,
        normalMap: noiseTexture, // Adding noise texture to simulate uneven surface
        displacementMap: noiseTexture, // Can add displacement to make grass irregular
        displacementScale: 0.1,
        emissiveIntensity: 0.2
    });

    grass.traverse((child) => {
        if (child.isMesh) {
            child.material = grassMaterial;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
});

// Load and add tree model
gltfLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Tree.gltf", (gltf) => {
    const tree = gltf.scene;
    scene.add(tree);

    // Apply texture to the Tree object
    tree.traverse((child) => {
        if (child.isMesh) {
            child.material.map = treeTexture;
            child.material.depthWrite = true;  // Enable depth writing for opaque objects
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
});

// Load and add leaves model
gltfLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Leaves.gltf", (gltf) => {
    const leaves = gltf.scene;
    scene.add(leaves);

    // Apply texture to the Leaves object
    leaves.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
                map: leavesMask,
                color: 0x649B66,
                transparent: true,
                depthWrite: false // Prevent depth writing for transparent objects
            });
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
});

// Lighting Setup
const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Increased intensity for better brightness
directionalLight.position.set(1, 1, 1).normalize();
directionalLight.castShadow = true; // Enable shadows for directional light
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100); // Point light (like a light bulb)
pointLight.position.set(0, 5, 0);
pointLight.castShadow = true; // Enable shadows for point light
scene.add(pointLight);

const hemisphereLight = new THREE.HemisphereLight(0x6060ff, 0x404040, 1); // Simulating sky and ground lighting
scene.add(hemisphereLight);

// Separate opaque and transparent objects
const opaqueObjects = [];
const transparentObjects = [];

scene.traverse((child) => {
    if (child.isMesh) {
        if (child.material.transparent) {
            transparentObjects.push(child);
        } else {
            opaqueObjects.push(child);
        }
    }
});

// Sort transparent objects by their distance from the camera (back-to-front)
transparentObjects.sort((a, b) => {
    const distanceA = camera.position.distanceTo(a.position);
    const distanceB = camera.position.distanceTo(b.position);
    return distanceB - distanceA;  // Sort in descending order (farthest to nearest)
});

// Animation loop
function animate() {
    // First, render all opaque objects
    opaqueObjects.forEach((obj) => {
        obj.renderOrder = 0;  // Ensure opaque objects render first
    });

    // Then, render all transparent objects
    transparentObjects.forEach((obj) => {
        obj.renderOrder = 1;  // Ensure transparent objects render after opaque
    });

    controls.update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
