var fillColor;
var canvasSize = {
  width: 400,
  height: 400
}

var shapes = [new Shape()];
var shapeCursor = 0;

var rays = []
var rayCursor = 0;

var phaseSelection, showIntersections;
var phaseOptions = ['Insert Shape', 'Insert Ray', 'Edit Mode']
var phase = phaseOptions[0];

var editablePoint;

function setup() {
  let canvas = createCanvas(canvasSize.width, canvasSize.height);
  canvas.parent('canvas');
  // click interactions should only occur inside canvas
  canvas.mousePressed(click);
  canvas.doubleClicked(doubleClick);
  //frameRate(5)
  background(220);

  phaseSelection = createSelect();
  phaseSelection.parent('buttons')
  phaseOptions.forEach(option => {
    phaseSelection.option(option)
  });
  phaseSelection.changed(function() {
    phase = phaseOptions[phaseSelection.elt.selectedIndex]
    console.log(phase)
  })

  showIntersections = createButton('Show Intersections');
  showIntersections.parent('buttons')
  showIntersections.mousePressed(function() {
    if (showIntersections.elt.textContent == 'Show Intersections') {
      showIntersections.elt.textContent = 'Hide Intersections';
    } else {
      showIntersections.elt.textContent = 'Show Intersections'
    }
  })

  fillColor = color('#FF0000')
  fillColor.setAlpha(100);
  fill(fillColor)
}

function draw() {
  background(220);
  let editMode = (phase == phaseOptions[2])
  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i];
    let isLast = (i == shapeCursor && phase == phaseOptions[0]);
    shape.draw(isLast, editMode);
  }
  rays.forEach(r => {
   r.draw() 
  });
}

function click() {
  switch (phase) {
    case phaseOptions[0]:
      shapes[shapeCursor].addVertex(
        new Vertex(mouseX, mouseY)
      );
      break
    case phaseOptions[1]:
      rays.push(new Ray(mouseX, mouseY)) 
      break
    case phaseOptions[2]:
      let found = false;
      for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];
        for (let j = 0; j < shape.vertices.length; j++) {
          const vertex = shape.vertices[j];
          if (dist(mouseX, mouseY, vertex.x, vertex.y) < 5) {
            editablePoint = shapes[i].vertices[j]
            found = true;
            break
          }
        }
        if (found) {
          break
        }
      }
      if (!found) {
        for (let i = 0; i < rays.length; i++) {
          const ray = rays[i];
          if (dist(mouseX, mouseY, ray.start.x, ray.start.y) < 5) {
            editablePoint = rays[i].start;
            found = true;
          }
        }
      }
      if (!found) {
        editablePoint = null;
      }
      break
  }
}

function mouseDragged() {
  if (phase == phaseOptions[2] && editablePoint) {
    editablePoint.x = mouseX;
    editablePoint.y = mouseY;
  }
}

function mouseReleased() {
  if (phase == phaseOptions[1] && rays[rayCursor]) {
    rays[rayCursor].pointTo(mouseX, mouseY)
    rayCursor += 1;
  }
}

function doubleClick() {
  shapes[shapeCursor].vertices.pop()  // double click adds vertex twice 
  shapes.push(new Shape());
  shapeCursor += 1;
}