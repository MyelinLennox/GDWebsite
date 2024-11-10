import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Load Texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/Grass.png');
const material = new THREE.MeshBasicMaterial({ map: texture });

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load GLTF Model
const gltfLoader = new GLTFLoader();
gltfLoader.load(
    '/Grass.gltf',
    function (gltf) {
        scene.add(gltf.scene);
    },
    undefined,
    function (error) {
        console.error("Error loading GLTF model:", error);
    }
);

scene.background = new THREE.Color(0xe6e6df);

function animate() {
    // Add animation or update logic if needed
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Fetch server-side visit count and display in a button element
async function fetchCount() {
    try {
        const response = await fetch("https://gd-website-lyart.vercel.app/visitCounter");
        const data = await response.json();
        const count = data.visitCount;
        document.getElementById("visitCountButton").textContent = count;
        console.log(`Initial count from server: ${count}`);
    } catch (error) {
        console.error("Failed to fetch count:", error);
    }
}

fetchCount();
