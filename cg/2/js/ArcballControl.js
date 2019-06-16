
THREE.ArcballControls = function (_encompassingArcball, _camera, _domElement, _scene) {

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

    if (_encompassingArcball.material.visible) {
      _encompassingArcball.material.visible = false;
    } else {
      var intersects = _raycaster.intersectObjects(_encompassingArcball.children);
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
        _encompassingArcball.material.visible = true;
      }
    }
  }

  function onMouseClick(event) {
    event.preventDefault();

    var rect = _domElement.getBoundingClientRect();
    _mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
    _mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
    _raycaster.setFromCamera( _mouse, _camera );

    let visibleArcballs = _encompassingArcball.children
      .flatMap((boxes) => boxes.children)
      .filter((arcball) => arcball.material.visible)

    if (_encompassingArcball.material.visible) {
      _intersection = _raycaster.intersectObject(_encompassingArcball)[0];
    } else {
      let arcballIntersections = _raycaster.intersectObjects(visibleArcballs);
      let boxIntersections = _raycaster.intersectObjects(_encompassingArcball.children);
      if (arcballIntersections.length > 0 && boxIntersections.length == 0) {
        _intersection = arcballIntersections[0]
      }
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
        if (_selected.name === 'Arcball') {
          let intersects = _raycaster.intersectObject(_selected)
          if (intersects.length > 0) {
            newIntersection = intersects[0].point;
          }
        } else {
          _raycaster.ray.intersectPlane(_plane, newIntersection);
        }
        if (newIntersection.z) {
          let rotationAxis = new THREE.Vector3().crossVectors(_intersection.point, newIntersection).normalize()
          let angle = _intersection.point.angleTo(newIntersection);

          if (rotationAxis && angle) {
            angle *= 360 / (2 * Math.PI);
            rotationAxis.x *= -1;
            rotationAxis.y *= -1;
            let quaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angle);
            if (_selected.name === 'Arcball') {
              _selected.applyQuaternion(quaternion);
            } else {
              _intersection.object.parent.applyQuaternion(quaternion);
            }
            _intersection.point = newIntersection;
          }
        }
      }

      let visibleArcballs = _encompassingArcball.children
        .flatMap((boxes) => boxes.children)
        .filter((arcball) => arcball.material.visible);

      var _intersects = _raycaster.intersectObjects(visibleArcballs);
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