import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {MeshSurfaceSampler} from "three/examples/jsm/math/MeshSurfaceSampler";
import {
    Vector3,
    Object3D,
} from "three";


export const initScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
    camera.position.set(1, 1, 2);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    return [scene, camera, renderer];
}


// Add a cube to the scene
const [scene, camera, renderer] = initScene();
const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
    color: 0x66ccff,
    wireframe: true
});

// Group for holding elements
const group = new THREE.Group();
scene.add(group);

const cube = new THREE.Mesh(geometry, material);
group.add(cube);




// Render some particles
const NUM_PARTICLES = 300;


// Build the surface sampler
const sampler = new MeshSurfaceSampler(cube).build();

const sphereGeom = new THREE.SphereGeometry(0.05, 6, 6);
const sphereMat = new THREE.MeshBasicMaterial({
    color: 0xffa0e6
});
const spheres = new THREE.InstancedMesh(sphereGeom, sphereMat, NUM_PARTICLES);
group.add(spheres);


// Build the vector for holding coords
const tempPosition = new Vector3();
// matrix for each sphere
const tempObject = new Object3D();

for (let i = 0; i < NUM_PARTICLES; i++) {
    sampler.sample(tempPosition);
    // store the point coords
    tempObject.position.set(
        tempPosition.x,
        tempPosition.y,
        tempPosition.z
    );

    // Randomize scale
    tempObject.scale.setScalar(Math.random() * 0.5 + 0.5);
    tempObject.updateMatrix();
    spheres.setMatrixAt(i, tempObject.matrix);
}


// -- RENDER --

function render() {
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(render);