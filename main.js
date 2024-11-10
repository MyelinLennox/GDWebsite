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

const grassTexture = textureLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Grass.png");
const leavesTexture = textureLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Leaves.png");
const treeTexture = textureLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Tree.png");
const TreeoverlayTexture = textureLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/TCom_Overlay_Abstract32_1K_overlay.png");

// GLTF Loader
const gltfLoader = new GLTFLoader();

gltfLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Grass.gltf", (gltf) => {
    const grass = gltf.scene;
    scene.add(grass);

    // Apply texture to the Grass object (assuming it has a mesh with materials)
    grass.traverse((child) => {
        if (child.isMesh) {
            child.material.Color = 0x649B66;
            child.material.needsUpdate = true;
        }
    });
});

gltfLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Tree.gltf", (gltf) => {
    const tree = gltf.scene;
    scene.add(tree);

    // Apply texture to the Tree object
    tree.traverse((child) => {
        if (child.isMesh) {
            child.material.map = treeTexture;
            child.material.needsUpdate = true;
        }
    });
});

gltfLoader.load("https://raw.githubusercontent.com/MyelinLennox/GDWebsite/refs/heads/main/Objects/Leaves.gltf", (gltf) => {
    const leaves = gltf.scene;
    scene.add(leaves);

    // Apply texture to the Leaves object
    leaves.traverse((child) => {
        if (child.isMesh) {
            child.material.map = leavesTexture;
            child.material.needsUpdate = true;
        }
    });
});

// Animation Loop
function animate() {
    controls.update();
    renderer.render(scene, camera);
    /*
    console.log(camera.position);
    */
}
renderer.setAnimationLoop(animate);
