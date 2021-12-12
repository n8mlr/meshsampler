import {
    BufferGeometry,
    Group,
    Float32BufferAttribute,
    Line,
    LineBasicMaterial,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
} from 'three';

import elephantModel from "url:./obj/Elephant_Model.obj";


import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {MeshSurfaceSampler} from "three/examples/jsm/math/MeshSurfaceSampler";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";


const scene = new Scene();
const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 300;
camera.position.y = 100;
const controls = new OrbitControls(camera, renderer.domElement);

const group = new Group();
scene.add(group);

let sampler = null;

let path = null;

const tmpPosition = new Vector3();

class Path {
    constructor() {
        this.vertices = [];
        this.geometry = new BufferGeometry();
        this.material = new LineBasicMaterial({
            color: 0x14b1ff,
            transparent: true,
            opacity: 0.5
        });
        this.line = new Line(this.geometry, this.material);
        sampler.sample(tmpPosition);
        this.previousPoint = tmpPosition.clone();
    }
    update() {
        let pointFound = false;
        while (!pointFound) {
            sampler.sample(tmpPosition);

            if (tmpPosition.distanceTo(this.previousPoint) < 30) {
                this.vertices.push(tmpPosition.x, tmpPosition.y, tmpPosition.z);
                this.previousPoint = tmpPosition.clone();
                pointFound = true;
            }
        }
        this.geometry.setAttribute("position", new Float32BufferAttribute(this.vertices, 3));
    }
}


new OBJLoader().load(
    elephantModel,
    (obj) => {

        sampler = new MeshSurfaceSampler(obj.children[0]).build();

        path = new Path();

        group.add(path.line);

        renderer.setAnimationLoop(renderLoop);

    },
    (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
    (err) => console.error(err)
);






const renderLoop = () => {
    group.rotation.y += 0.002;

    if (path.vertices.length < 30000) {
        path.update();
    }

    controls.update();
    renderer.render(scene, camera);
}
