import * as THREE from "/three/build/three.module.js";
import { GLTFLoader } from "/three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "/three/examples/jsm/controls/OrbitControls.js";
import { notes } from "/notes_loading.js"; // Load notes' audio files from local directory

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer({ antiaalias: true });
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

// Keep the aspect ratio of objects the same, even when the window size changes
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5; // Limit camera movement to avoid looking at the platform from below

// Spawn the camera looking at the piano
camera.position.set(0, 5, 9.6);
controls.target.set(0, -0.5, 0);

const loader = new GLTFLoader();

// IMPORT Assets
// ---- PIANO
loader.load(
  "assets/models/named_piano.glb",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        // child.receiveShadow = true;
      }
    });
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
    curtains.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        // child.receiveShadow = true;
      }
    });
    curtains.scene.scale.set(5, 5, 5);
    curtains.scene.position.set(-10, -4, 4);
    curtains.scene.children[0].material.color.setHex(0x8b0000);
    curtains.scene.castShadow = true;
    scene.add(curtains.scene);

    var curtainsRight = curtains.scene.clone();
    curtainsRight.translateX(20);
    curtainsRight.castShadow = true;
    scene.add(curtainsRight);

    var curtainsTop = curtains.scene.clone();
    curtainsTop.position.set(0, 0, 0);
    curtainsTop.scale.set(8, 0.8, 2);
    curtainsTop.position.set(0, 12, 3.5);
    curtainsTop.castShadow = true;
    scene.add(curtainsTop);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// HANDLE assets
// Utility elements to calculate clicking in scene
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// Light creation and positioning
var light = new THREE.PointLight(0xffffff, 2, 120);
light.position.set(4, 5, 15);
light.castShadow = true;
scene.add(light);

var platformLight = new THREE.PointLight(0xffffff, 2, 1000);
platformLight.position.set(0, 50, 0);
platformLight.castShadow = true;
scene.add(platformLight);

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-10, 13, 0);
spotLight.castShadow = true;
spotLight.angle = 0.25;
spotLight.distance = 100;
spotLight.decay = 2;
spotLight.penumbra = 0.1;
spotLight.target.position.set(-2, 0, -2);
scene.add(spotLight);
scene.add(spotLight.target);

// ---- WOOD PLATFORM
var platGeo = new THREE.BoxGeometry(1, 1, 1);
// Load wood textures from assets
var woodTexture = new THREE.TextureLoader().load("assets/textures/wood.jpeg");
woodTexture.wrapS = THREE.RepeatWrapping;
woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.set(16, 16);
var platFace = new THREE.MeshPhongMaterial({
  map: woodTexture,
  side: THREE.DoubleSide,
});
var platMatCube = [platFace, platFace, platFace, platFace, platFace, platFace];
var platform = new THREE.Mesh(platGeo, platMatCube);

platform.receiveShadow = true;
platform.scale.set(29, 1, 20);
platform.position.set(0, -4.5, -5);
scene.add(platform);

// ---- WALLS
// Load walls texture
var backgroundTexture = new THREE.TextureLoader().load(
  "assets/textures/background.jpg"
);
var darkTexture = new THREE.TextureLoader().load(
  "assets/textures/dark_texture.jpg"
);

darkTexture.wrapS = THREE.RepeatWrapping;
darkTexture.wrapT = THREE.RepeatWrapping;
darkTexture.repeat.set(1, 1);
var wallFace = new THREE.MeshBasicMaterial({
  map: darkTexture,
  side: THREE.DoubleSide,
});
wallFace.roughness = 1;
var wallMatCube = [wallFace, wallFace, wallFace, wallFace, wallFace, wallFace];

// LEFT
var leftWallGeo = new THREE.BoxGeometry(1, 1, 1);
var leftWallMat = new THREE.MeshBasicMaterial({ color: "black" });
var leftWall = new THREE.Mesh(leftWallGeo, wallMatCube);
leftWall.scale.set(1, 20, 20);
leftWall.position.set(-15, 5, -5);

leftWall.castShadow = true;
leftWall.receiveShadow = true;
scene.add(leftWall);

// RIGHT
var rightWallGeo = new THREE.BoxGeometry(1, 1, 1);
var rightWallMat = new THREE.MeshBasicMaterial({ color: "black" });
var rightWall = new THREE.Mesh(rightWallGeo, wallMatCube);
rightWall.scale.set(1, 20, 20);
rightWall.position.set(15, 5, -5);

rightWall.castShadow = true;
rightWall.receiveShadow = true;
scene.add(rightWall);

// BACK
var backgroundFace = new THREE.MeshBasicMaterial({
  map: backgroundTexture,
  side: THREE.DoubleSide,
});
var backMatCube = [
  wallFace,
  wallFace,
  wallFace,
  wallFace,
  backgroundFace,
  wallFace,
];

var backWallGeo = new THREE.BoxGeometry(1, 1, 1);
var backWallMat = new THREE.MeshBasicMaterial({ color: "black" });
var backWall = new THREE.Mesh(backWallGeo, backMatCube);
backWall.scale.set(30, 20, 1);
backWall.position.set(0, 5, -15);

backWall.castShadow = true;
backWall.receiveShadow = true;
scene.add(backWall);

// ---- ROOF
var roofGeo = new THREE.BoxGeometry(1, 1, 1);
var roofWallMat = new THREE.MeshBasicMaterial({ color: "black" });
var roof = new THREE.Mesh(roofGeo, wallMatCube);
roof.scale.set(30, 1, 20);
roof.position.set(0, 15, -5);
roof.roughness = 0;

roof.castShadow = true;
roof.receiveShadow = true;
scene.add(roof);

// ---- TODO: STAGE LIGHT using external three js library

renderer.render(scene, camera);

// ---- RENDERING FUNCTION
var render = function () {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
};

// ---- EVENT LISTENER
function onMouseClick(event) {
  event.preventDefault();
  console.log(controls);
  // Calculate where the click landed based on window
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Use Raycaster to see all objects that went through click
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children, true);
  console.log(intersects);

  for (var i = 0; i < intersects.length; i++) {
    console.log(intersects[i].object.name);
    if (intersects[i].object.name + ".mp3" in notes) {
      // Play key note sound
      notes[intersects[i].object.name + ".mp3"].isPlaying = false;
      notes[intersects[i].object.name + ".mp3"].play();

      // Based on key type, move it up and down
      this.tl = new TimelineMax();
      // Not Sharp key
      if (!intersects[i].object.name.includes("s")) {
        this.tl.to(intersects[i].object.position, 0.5, {
          y: 2.4,
          ease: Expo.easeOut,
        });
        this.tl.to(intersects[i].object.position, 0.1, {
          y: 2.5,
          ease: Expo.easeOut,
        });
      } else {
        // Sharp key 2.619872570037842
        this.tl.to(intersects[i].object.position, 0.5, {
          y: 2.549872570037842,
          ease: Expo.easeOut,
        });
        this.tl.to(intersects[i].object.position, 0.1, {
          y: 2.619872570037842,
          ease: Expo.easeOut,
        });
      }
      return; // We only want to handle 1 selected mesh when clicked on scene (the closest one)
    }
  }
}

render();

// Event listeners using DOM
document.body.addEventListener("click", onMouseClick);
