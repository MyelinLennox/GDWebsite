import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe6e6df);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

const grassTexture = textureLoader.load(
    "https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Grass.png",
    undefined,
    undefined,
    (error) => console.error("Error loading Grass texture:", error)
);

const leavesTexture = textureLoader.load(
    "https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Leaves.png",
    undefined,
    undefined,
    (error) => console.error("Error loading Leaves texture:", error)
);

const overlayTexture = textureLoader.load(
    "https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/TCom_Overlay_Abstract32_1K_overlay.png",
    undefined,
    undefined,
    (error) => console.error("Error loading Overlay texture:", error)
);

const treeTexture = textureLoader.load(
    "https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Tree.png",
    undefined,
    undefined,
    (error) => console.error("Error loading Tree texture:", error)
);

// GLTF Loader
const gltfLoader = new GLTFLoader();

// Load Grass Model
gltfLoader.load(
    "https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Grass.gltf",
    (gltf) => {
        scene.add(gltf.scene);
    },
    undefined,
    (error) => console.error("Error loading Grass model:", error)
);

// Load Tree Model
gltfLoader.load(
    "https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Tree.gltf",
    (gltf) => {
        scene.add(gltf.scene);
    },
    undefined,
    (error) => console.error("Error loading Tree model:", error)
);

// Example mesh with Grass Texture
const grassMaterial = new THREE.MeshBasicMaterial({ map: grassTexture });
const grassGeometry = new THREE.PlaneGeometry(5, 5);
const grassMesh = new THREE.Mesh(grassGeometry, grassMaterial);
grassMesh.position.set(-3, 0, 0);
scene.add(grassMesh);

// Example mesh with Tree Texture
const treeMaterial = new THREE.MeshBasicMaterial({ map: treeTexture });
const treeGeometry = new THREE.PlaneGeometry(5, 5);
const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
treeMesh.position.set(3, 0, 0);
scene.add(treeMesh);

// Animation Loop
function animate() {
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

