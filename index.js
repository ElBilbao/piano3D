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
camera.position.z = 10;

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
const loader = new GLTFLoader();

// ---- PIANO
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

// ---- CURTAINS
loader.load(
  "assets/models/curtains.glb",
  function (curtains) {
    console.log(curtains);
    scene.add(curtains.scene);
    curtains.scene.scale.set(5, 5, 1);
    curtains.scene.position.set(-10, -4, 4);
    curtains.scene.children[0].material.color.setHex(0x8b0000);

    var curtainsRight = curtains.scene.clone();
    scene.add(curtainsRight);
    curtainsRight.translateX(20);

    var curtainsTop = curtains.scene.clone();
    scene.add(curtainsTop);
    curtainsTop.position.set(0, 0, 0);
    curtainsTop.scale.set(8, 0.8, 2);
    curtainsTop.position.set(0, 12, 3.5);
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

// ---- WOOD PLATFORM
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

platform.scale.set(30, 1, 20);
platform.position.set(0, -4.5, -5);

// ---- WALLS
// LEFT
var leftWallGeo = new THREE.BoxGeometry(1, 1, 1);
var leftWallMat = new THREE.MeshBasicMaterial({ color: "black" });
var leftWall = new THREE.Mesh(leftWallGeo, leftWallMat);
scene.add(leftWall);
leftWall.scale.set(1, 20, 20);
leftWall.position.set(-15, 5, -5);
// RIGHT
var rightWallGeo = new THREE.BoxGeometry(1, 1, 1);
var rightWallMat = new THREE.MeshBasicMaterial({ color: "black" });
var rightWall = new THREE.Mesh(rightWallGeo, rightWallMat);
scene.add(rightWall);
rightWall.scale.set(1, 20, 20);
rightWall.position.set(15, 5, -5);
// BACK
var backWallGeo = new THREE.BoxGeometry(1, 1, 1);
var backWallMat = new THREE.MeshBasicMaterial({ color: "black" });
var backWall = new THREE.Mesh(backWallGeo, backWallMat);
scene.add(backWall);
backWall.scale.set(30, 20, 1);
backWall.position.set(0, 5, -15);

// ---- ROOF
var roofGeo = new THREE.BoxGeometry(1, 1, 1);
var roofWallMat = new THREE.MeshBasicMaterial({ color: "black" });
var roof = new THREE.Mesh(roofGeo, roofWallMat);
scene.add(roof);
roof.scale.set(30, 1, 20);
roof.position.set(0, 15, -5);

// ---- STAGE LIGHT using external three js library

renderer.render(scene, camera);

// ---- RENDERING FUNCTION
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
