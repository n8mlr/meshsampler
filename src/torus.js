import * as THREE from 'three';


import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {MeshSurfaceSampler} from "three/examples/jsm/math/MeshSurfaceSampler";



export const initScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 7, 10);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    return [scene, camera, renderer];
}


// Add a cube to the scene
const [scene, camera, renderer] = initScene();
const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.TorusKnotGeometry(4, 1.3, 100, 16);
const knot = new THREE.Mesh(geometry);

// Build the sampler
const sampler = new MeshSurfaceSampler(knot).build();

// Group for holding elements
const group = new THREE.Group();
scene.add(group);

// Sample coordinates
const vertices = [];
const tempPosition = new THREE.Vector3();
for (let i = 0; i < 15000; i++) {
    sampler.sample(tempPosition);
    vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
}

// Create geometry for coorinate
const pointsGeometry = new THREE.BufferGeometry();
pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

// Create material
const pointsMaterial = new THREE.PointsMaterial({
    color: 0xff61d5,
    size: 0.03,
});
const points = new THREE.Points(pointsGeometry, pointsMaterial);
group.add(points);


// -- RENDER --

function render() {

}

renderer.setAnimationLoop(() => {
    group.rotation.y += 0.01;
    renderer.render(scene, camera);
});