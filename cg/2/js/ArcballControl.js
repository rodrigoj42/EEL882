
THREE.ArcballControls = function (_objectsGroup, _camera, _domElement, _scene) {

  var _raycaster = new THREE.Raycaster();
  var _mouse = new THREE.Vector2();
  var _arcball = null;

  function activate() {
    _domElement.addEventListener('dblclick', onDoubleClick);
    _domElement.addEventListener('mousedown', onMouseClick);
  }

  function deactivate() {
    _domElement.removeEventListener('dblclick', onDoubleClick);
    _domElement.removeEventListener('mousedown', onMouseClick);
  }

  function onDoubleClick(event) {
    event.preventDefault();

    var rect = _domElement.getBoundingClientRect();
    _mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
    _mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
    _raycaster.setFromCamera( _mouse, _camera );

    let BIG_ARCBALL_IS_ACTIVE = false;
    if (BIG_ARCBALL_IS_ACTIVE) {
      // remove big arcball
    }

    var intersects = _raycaster.intersectObjects(_objectsGroup.children);
    if (intersects.length > 0) {
      _selected = intersects[0].object;
      _arcball = _selected.children.find(
        (child) => child.name.slice(0,7) === 'Arcball'
      );
      if (_arcball) {
        _arcball.material.visible = !_arcball.material.visible;
      } else {
        // do something
      }
    } else {
      let {radius} = _objectsGroup.computeBoundingSphere();
      let sphereGeometry = new THREE.SphereGeometry(
        radius,
        32, 32
      );
      var sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        visible: true
      })
      var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.name = `Arcball`
      _objectsGroup.add(sphere);
    }
  }

  function onMouseClick(event) {
    event.preventDefault();

    var rect = _domElement.getBoundingClientRect();
    _mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
    _mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
    _raycaster.setFromCamera( _mouse, _camera );

    let arcballs = _objectsGroup.children.flatMap(
      (boxes) => boxes.children
    ).filter(
      (arcball) => arcball.material.visible
    );
    var intersects = _raycaster.intersectObjects(arcballs);
    if (intersects.length > 0) {
      console.log(intersects)
    }
  }

  activate();
}

THREE.ArcballControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.ArcballControls.prototype.constructor = THREE.ArcballControls;