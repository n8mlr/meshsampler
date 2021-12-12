import {
    BufferGeometry,
    Color,
    Group,
    Float32BufferAttribute,
    MeshBasicMaterial,
    PerspectiveCamera,
    Points,
    PointsMaterial,
    Scene,
    TextureLoader,
    Vector3,
    WebGLRenderer,
} from 'three';
import texture from "url:./dotTexture.png";
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

camera.position.z = 230;
camera.position.y = 100;
const controls = new OrbitControls(camera, renderer.domElement);

const group = new Group();
scene.add(group);

const vertices = [];

const colors = [];

const sparklesGeoms = new BufferGeometry();

const sparklesMat = new PointsMaterial({
    size: 3,
    alphaTest: 1,
    map: new TextureLoader().load(texture),
    vertexColors: true,
});



const points = new Points(sparklesGeoms, sparklesMat);
group.add(points);


let sampler = null;

let elephant = null;

new OBJLoader().load(
    elephantModel,
    (obj) => {
        elephant = obj.children[0];
        elephant.material = new MeshBasicMaterial({
            wireframe: true,
            color: 0xffffff,
            transparent: true,
            opacity: 0.05,
        });
        group.add(obj);

        sampler = new MeshSurfaceSampler(elephant).build();
        renderer.setAnimationLoop(() => {
            renderLoop(renderer, scene, camera, controls, vertices);
        });

    },
    (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
    (err) => console.error(err)
);

// Build the color palette

const palette = [
    new Color("#FEC6D5"),
    new Color("#218DB9"),
    new Color("#8ACEEA"),
    new Color("#A15495")
];

const tmpPosition = new Vector3();

const addPoint = () => {

    sampler.sample(tmpPosition);
    vertices.push(tmpPosition.x, tmpPosition.y, tmpPosition.z);
    sparklesGeoms.setAttribute("position", new Float32BufferAttribute(vertices, 3));


    const color = palette[Math.floor(Math.random() * palette.length)];
    const colorVal = [color.r, color.g, color.b];
    colors.push(...colorVal);
    sparklesGeoms.setAttribute("color", new Float32BufferAttribute(colors, 3));
}


const renderLoop = (renderer, scene, camera, controls, vertices) => {
    group.rotation.y += 0.02;

    if (vertices.length < 30000) {
        for (let i=0; i < 100; i++) {
            addPoint();
        }
    }

    controls.update();
    renderer.render(scene, camera);
}

function loop() {
    group.rotation.y += 0.02;

    if (vertices.length < 30000) {
        addPoint();
    } else {

    }

    controls.update();
    renderer.render(scene, camera);
}

