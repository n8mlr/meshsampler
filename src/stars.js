import {
    AdditiveAnimationBlendMode,
    BufferGeometry,
    ShaderMaterial,
    Group,
    Points,
    PerspectiveCamera,
    Scene,
    TextureLoader,
    Vector3,
    WebGLRenderer, AdditiveBlending,
} from "three";
import sparkleTexture from "url:./dotTexture.png";



export const initScene = () => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 50;
    camera.position.y = 50;
    camera.lookAt(0, 0, 0);

    const renderer = new WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    const container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    return [scene, camera, renderer];
}


// Add a cube to the scene
const [scene, camera, renderer] = initScene();
const group = new Group();
scene.add(group);

// Sparkly

class Sparkle extends Vector3 {
  setup(origin) {
    this.add(origin).multiplyScalar(2);
    this.dest = origin;

    this._size = Math.random() * 5 + 0.5;
    this.size = 1;
    this.scaleSpeed = Math.random() * 0.03 + 0.03;
    this.stop = false;
  }
  update() {
    this.x += (this.dest.x - this.x) * 0.08;
    this.y += (this.dest.y - this.y) * 0.08;
    this.z += (this.dest.z - this.z) * 0.08;
    if (this.size < this._size) {
      this.size += this.scaleSpeed;
    } else {
      // if (this.distanceTo(this.dest) < 0.1) {
      //   this.stop = true;
      // }
    }
  }
}


const sparkles = [];
window.sparkles = sparkles;
const sparklesGeometry = new BufferGeometry();
const sparklesMaterial = new ShaderMaterial({
    uniforms: {
        pointTexture: {
            value: new TextureLoader().load(sparkleTexture),
        }
    },
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
});
const points = new Points(sparklesGeometry, sparklesMaterial);
group.add(points);


const render = () => {
  group.rotation.y += 0.002;
  sparkles.forEach((s, i) => {
      if (!s.stop) {
          s.update();

      }
  })
};
