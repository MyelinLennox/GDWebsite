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

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Texture Loader
const textureLoader = new THREE.TextureLoader();

const grassMask = textureLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Grass.png");
const leavesMask = textureLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Leaves.png");

const treeTexture = textureLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Tree.png");
const TreeoverlayTexture = textureLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/TCom_Overlay_Abstract32_1K_overlay.png");

// GLTF Loader
const gltfLoader = new GLTFLoader();

// Load and add grass model
gltfLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Grass.gltf", (gltf) => {
    const grass = gltf.scene;
    scene.add(grass);

    // Apply texture to the Grass object (assuming it has a mesh with materials)
    grass.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
                map: grassMask,
                color: 0x649B66,
                transparent: true,
                depthWrite: false // Prevent depth writing for transparent objects
            });
            child.material.needsUpdate = true;
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
        }
    });
});

// Add light to the scene
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

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
        obj.renderOrder = 1;  // Ensure transparent objects render after opaque objects
    });

    controls.update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
