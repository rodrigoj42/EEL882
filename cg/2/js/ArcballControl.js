
THREE.ArcballControls = function (_objectsGroup, _camera, _domElement, _scene) {

  var _plane = new THREE.Plane();
  var _raycaster = new THREE.Raycaster();
  var _mouse = new THREE.Vector2();
  var _arcball = null;
  var _intersection = null;
  var _worldPosition = new THREE.Vector3();

  function activate() {
    _domElement.addEventListener('dblclick', onDoubleClick);
    _domElement.addEventListener('mousedown', onMouseClick);
    _domElement.addEventListener('mousemove', onMouseMove);
    _domElement.addEventListener('mouseleave', onMouseLeave);
    _domElement.addEventListener('mouseup', onMouseLeave);
  }

  function deactivate() {
    _domElement.removeEventListener('dblclick', onDoubleClick);
    _domElement.removeEventListener('mousedown', onMouseClick);
    _domElement.removeEventListener('mousemove', onMouseMove);
    _domElement.removeEventListener('mouseleave', onMouseLeave);
    _domElement.removeEventListener('mouseup', onMouseLeave);
  }

  function onDoubleClick(event) {
    event.preventDefault();

    var rect = _domElement.getBoundingClientRect();
    _mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
    _mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
    _raycaster.setFromCamera( _mouse, _camera );

    let encompassingArcball = _objectsGroup.children.find(
      (object) => object.name === 'Arcball'
    );
    if (encompassingArcball) {
      _objectsGroup.remove(encompassingArcball)
    }

    if (!encompassingArcball) {
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
        let {center, radius} = _objectsGroup.computeBoundingSphere();
        let sphereGeometry = new THREE.SphereGeometry(
          radius * 0.5,
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
        sphere.position.x = center.x;
        sphere.position.y = center.y;
        sphere.position.z = center.z;
        _objectsGroup.add(sphere);
      }
    }
  }

  function onMouseClick(event) {
    event.preventDefault();

    var rect = _domElement.getBoundingClientRect();
    _mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
    _mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
    _raycaster.setFromCamera( _mouse, _camera );

    let encompassingArcballArray = _objectsGroup.children.filter(
      (object) => object.name === 'Arcball'
    );

    let visible_arcballs = _objectsGroup.children
      .flatMap((boxes) => boxes.children)
      .filter((arcball) => arcball.material.visible)
      .concat(encompassingArcballArray)

    var intersects = _raycaster.intersectObjects(visible_arcballs);
    if (intersects.length > 0) {
      _intersection = intersects[0]
    }
  }

  function onMouseMove(event) {
    event.preventDefault();

    if (_intersection) {

      var rect = _domElement.getBoundingClientRect();
      _mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
      _mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
      _raycaster.setFromCamera( _mouse, _camera );

      let _selected = _intersection.object;
      if (_selected) {
        let newIntersection = new THREE.Vector3();
        if (_raycaster.ray.intersectPlane(_plane, newIntersection)) {
          let rotationAxis = new THREE.Vector3().crossVectors(_intersection.point, newIntersection).normalize()
          let angle = _intersection.point.angleTo(newIntersection);

          if (rotationAxis && angle) {
            angle *= -1 * 360 / (2 * Math.PI);
            let quaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angle);
            _intersection.object.parent.applyQuaternion(quaternion);
            _intersection.point = newIntersection;
          }
        }
      }

      let encompassingArcballArray = _objectsGroup.children.filter(
        (object) => object.name === 'Arcball'
      );

      let visible_arcballs = _objectsGroup.children
      .flatMap((boxes) => boxes.children)
      .filter((arcball) => arcball.material.visible)
      .concat(encompassingArcballArray)

      var _intersects = _raycaster.intersectObjects(visible_arcballs);
      if (_intersects.length > 0) {
        let arcballIntersection = _intersects.find(
          (intersect) => intersect.object.name.slice(0,7) === 'Arcball'
        );
        if (arcballIntersection) {
          let object = arcballIntersection.object;
          _plane.setFromNormalAndCoplanarPoint(
            _camera.getWorldDirection(_plane.normal),
            _worldPosition.setFromMatrixPosition(object.matrixWorld) 
          );
        }
      }
    }
  }

  function onMouseLeave(event) {
    event.preventDefault();
    _intersection = null;
  }

  activate();
}

THREE.ArcballControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.ArcballControls.prototype.constructor = THREE.ArcballControls;