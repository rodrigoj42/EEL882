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
  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i];
    let isLast = (i == shapeCursor && phase == phaseOptions[0]);
    shape.draw(isLast);
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
      break
  }
}

function mouseReleased() {
  if (phase == phaseOptions[1] && rays[rayCursor]) {
    rays[rayCursor].direction(mouseX, mouseY)
    rayCursor += 1;
  }
}

function doubleClick() {
  shapes.push(new Shape());
  shapeCursor += 1;
}