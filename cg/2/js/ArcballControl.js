
THREE.ArcballControls = function (_objects, _camera, _domElement) {

  var _raycaster = new THREE.Raycaster();
  var _mouse = new THREE.Vector2();

  function activate() {
    _domElement.addEventListener('mousedown', onMouseClick);
  }

  function onMouseClick(event) {
    event.preventDefault();

    var rect = _domElement.getBoundingClientRect();
    _mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
    _mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
    _raycaster.setFromCamera( _mouse, _camera );

    var intersects = _raycaster.intersectObjects(_objects);
    if (intersects.length > 0) {
      _selected = intersects[0].object;
      _selected.children.forEach(children => {
        children.material.visible = !children.material.visible;
      });
    }
  }

  activate();
}

THREE.ArcballControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.ArcballControls.prototype.constructor = THREE.ArcballControls;