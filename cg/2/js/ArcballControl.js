
THREE.ArcballControls = function (_objectsGroup, _camera, _domElement) {

  var _raycaster = new THREE.Raycaster();
  var _mouse = new THREE.Vector2();
  var _arcball = null;

  function activate() {
    _domElement.addEventListener('dblclick', onMouseClick);
  }

  function onMouseClick(event) {
    event.preventDefault();

    var rect = _domElement.getBoundingClientRect();
    _mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
    _mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
    _raycaster.setFromCamera( _mouse, _camera );

    var intersects = _raycaster.intersectObjects(_objectsGroup.children);
    if (intersects.length > 0) {
      _selected = intersects[0].object;
      _arcball = _selected.children.find(
        (children) => children.name.slice(0,7) === 'Arcball'
      );
      _arcball.material.visible = !_arcball.material.visible;
    } else {
      
    }
  }

  activate();
}

THREE.ArcballControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.ArcballControls.prototype.constructor = THREE.ArcballControls;