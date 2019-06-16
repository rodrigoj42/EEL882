var container;
var camera, controls, scene, renderer;

init();
animate();

function init() {
  container = document.createElement( 'div' );
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 2000, 10000);
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0,0,1));

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x666666);

  var spot = new THREE.SpotLight(0xffffff, 1.5);
  spot.position.set(0, 0, 0);
  spot.target.position.set(0, 0, 1);
  spot.angle = 2 * Math.PI;
  spot.castShadow = false;

  scene.add(new THREE.AmbientLight(0xffffff));
  scene.add(spot);

  var sphere = createObjects(20);

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = false;

  new THREE.DragControls(sphere.children, camera, renderer.domElement);
  new THREE.ArcballControls(sphere, camera, renderer.domElement, scene);

  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
}

function createObjects(numberOfBoxes) {
  let radius = Math.min(window.innerHeight, window.innerWidth)/2;
  let sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    visible: false
  })
  let sphereGeometry = new THREE.SphereGeometry(
    radius,
    32, 32
  );
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.name = `Arcball`

  sphere.position.x = 0;
  sphere.position.y = 0;
  sphere.position.z = 4000 + radius;

  for (let i = 0; i < numberOfBoxes; i ++) {
    let geometry = new THREE.BoxGeometry(40, 40, 40);

    var mat =  new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      vertexColors: THREE.FaceColors,
      visible: true
    });
    
    for (let i = 0; i < geometry.faces.length/2; i++) {
      let color = Math.random() * 0xffffff;
      geometry.faces[i*2].color.setHex(color);
      geometry.faces[1+i*2].color.setHex(color);
    }

    var object = new THREE.Mesh(geometry, mat);
    object.name = `Box ${i}`

    object.position.x = Math.random() * radius - radius/2;
    object.position.y = Math.random() * radius - radius/2;
    object.position.z = Math.random() * radius - radius/2;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;

    object.geometry.computeBoundingSphere();

    let childSphereGeometry = new THREE.SphereGeometry(
      object.geometry.boundingSphere.radius * 1.2,
      32, 32
    );
    let sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      visible: false
    })

    let childSphere = new THREE.Mesh(childSphereGeometry, sphereMaterial);
    childSphere.name = `Arcball ${i}`
    object.add(childSphere)

    sphere.add(object)
  }

  scene.add(sphere);
  return sphere
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  renderer.render( scene, camera );
}