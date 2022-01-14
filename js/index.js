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

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
var mesh = new THREE.Mesh(geometry, material);
mesh.position.z = 2;
mesh.position.y = 1;

var g2 = new THREE.SphereGeometry(1, 200, 200);
var m2 = new THREE.MeshLambertMaterial({ color: 0xf700f7 });
var mesh2 = new THREE.Mesh(g2, m2);
mesh.position.z = -1;
mesh.position.y = -2;

//scene.add(mesh);
//scene.add(mesh2);
var group = new THREE.Group();
group.add(mesh);
group.add(mesh2);
scene.add(group);

var light = new THREE.PointLight(0xffffff, 1, 500);
light.position.set(0, 0, 0);
scene.add(light);
var light = new THREE.PointLight(0xffffff, 2, 1000);
light.position.set(10, 0, 25);
scene.add(light);

renderer.render(scene, camera);

var render = function () {
  requestAnimationFrame(render);

  renderer.render(scene, camera);
};

function onMouseMove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children, true);

  for (var i = 0; i < intersects.length; i++) {
    intersects[i].object.material.color.set(0xff0000);

    this.tl = new TimelineMax();

    this.tl.to(intersects[i].object.scale, 1, {
      x: 2,
      ease: Expo.easeOut,
    });
    this.tl.to(intersects[i].object.scale, 0.5, {
      x: 2,
      ease: Expo.easeOut,
    });
    this.tl.to(intersects[i].object.position, 0.5, {
      x: 2,
      ease: Expo.easeOut,
    });
    this.tl.to(
      intersects[i].object.rotation,
      0.5,
      {
        y: Math.PI * 0.5,
        ease: Expo.easeOut,
      },
      "=-1.5"
    );
  }
}

render();

document.body.addEventListener("click", onMouseMove);
