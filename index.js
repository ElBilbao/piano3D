import * as THREE from "/three/build/three.module.js";
import { GLTFLoader } from "/three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "/three/examples/jsm/controls/OrbitControls.js";

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer({ antiaalias: true });
renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
const loader = new GLTFLoader();

loader.load(
  "assets/models/piano3d.glb",
  function (gltf) {
    console.log(gltf);
    scene.add(gltf.scene);
    gltf.scene.position.y = -4;
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var light = new THREE.PointLight(0xffffff, 1, 500);
light.position.set(0, 0, 0);
scene.add(light);
var light = new THREE.PointLight(0xffffff, 2, 1000);
light.position.set(10, 0, 25);
scene.add(light);

// Wood Platform
var platGeo = new THREE.BoxGeometry(1, 1, 1);
var woodTexture = new THREE.TextureLoader().load("assets/textures/wood.jpeg");
woodTexture.wrapS = THREE.RepeatWrapping;
woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.set(16, 16);
var platFace = new THREE.MeshBasicMaterial({
  map: woodTexture,
  side: THREE.DoubleSide,
});
var platMatCube = [platFace, platFace, platFace, platFace, platFace, platFace];
var platform = new THREE.Mesh(platGeo, platMatCube);
scene.add(platform);
platform.position.y = -4.5;
platform.translateZ(-5);
platform.scale.set(30, 1, 20);

renderer.render(scene, camera);

// RENDERING FUNCTION
var render = function () {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
};

function onMouseMove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children, true);
  console.log(intersects);

  for (var i = 0; i < intersects.length; i++) {
    console.log(intersects[i].object.name);
    if (
      !intersects[i].object.name.includes("Piano") &&
      intersects[i].object.name != ""
    ) {
      //intersects[i].object.rotation.x = 0.1;
      this.tl = new TimelineMax();

      this.tl.to(intersects[i].object.position, 0.5, {
        y: 2.4,
        ease: Expo.easeOut,
      });
      this.tl.to(intersects[i].object.position, 0.1, {
        y: 2.5,
        ease: Expo.easeOut,
      });
      return;
    }
  }
}

render();

document.body.addEventListener("click", onMouseMove);
