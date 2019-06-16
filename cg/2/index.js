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

  var boxGroup = createBoxes(20);

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = false;

  new THREE.DragControls(boxGroup.children, camera, renderer.domElement);
  new THREE.ArcballControls(boxGroup, camera, renderer.domElement, scene);

  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
}

function createBoxes(numberOfBoxes) {
  var boxGroup = new THREE.Group()

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
    object.position.z = Math.random() * 6000// + 3000;

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
    sphere.name = `Arcball ${i}`
    object.add(sphere)

    boxGroup.add(object)
  }

  boxGroup.computeBoundingSphere = function() {

    childrenX = this.children.map((children) => children.position.x)
    childrenY = this.children.map((children) => children.position.y)
  
    minX = Math.min(...childrenX);
    maxX = Math.max(...childrenX);
    minY = Math.min(...childrenY);
    maxY = Math.max(...childrenY);
  
    boxGroupLimits = [
      {x: minX, y: minY},
      {x: minX, y: maxY},
      {x: maxX, y: minY},
      {x: maxX, y: maxY}
    ]

    this.boundingSphere = {
      center: new THREE.Vector2(
        childrenX.reduce((acc, cur) => acc + cur)/childrenX.length,
        childrenY.reduce((acc, cur) => acc + cur)/childrenY.length,
      )
    }
    this.boundingSphere.radius = Math.max(
      ...boxGroupLimits.map((point) => this.boundingSphere.center.distanceTo(point))
    )

    return this.boundingSphere
  }

  boxGroup.position.z = 3000;

  scene.add(boxGroup);
  return boxGroup
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