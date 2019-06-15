var container;
var camera, controls, scene, renderer;
var objects = [];

init();
animate();

function init() {
  container = document.createElement( 'div' );
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0,0,1));

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe0e0e0);

  var spot = new THREE.SpotLight(0xffffff, 1.5);
  spot.position.set(0, 0, 0);
  spot.target.position.set(0, 0, 1);
  spot.angle = 2 * Math.PI;
  spot.castShadow = false;

  scene.add(new THREE.AmbientLight(0xffffff));
  scene.add(spot);

  objects = createBoxes(20);

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = false;

  new THREE.DragControls(objects, camera, renderer.domElement);
  new THREE.ArcballControls(objects, camera, renderer.domElement);

  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
}

function createBoxes(numberOfBoxes) {
  for (let i = 0; i < numberOfBoxes; i ++) {
    let geometry = new THREE.BoxGeometry(40, 40, 40);

    var mat =  new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      vertexColors: THREE.FaceColors
    });
    
    for (let i = 0; i < geometry.faces.length/2; i++) {
      let color = Math.random() * 0xffffff;
      geometry.faces[i*2].color.setHex(color);
      geometry.faces[1+i*2].color.setHex(color);
    }

    var object = new THREE.Mesh(geometry, mat);
    object.name = `Box ${i}`

    object.position.x = Math.random() * window.innerWidth/2 - window.innerWidth/4;
    object.position.y = Math.random() * window.innerHeight/2 - window.innerHeight/4;
    object.position.z = Math.random() * 400 + 200;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;

    object.geometry.computeBoundingSphere();

    var sphereGeometry = new THREE.SphereGeometry(
      object.geometry.boundingSphere.radius * 1.2,
      32, 32
    );
    var sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      visible: false
    })
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    object.add(sphere)

    scene.add(object);
    objects.push(object);
  }

  return objects
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