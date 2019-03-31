var shapes = [new Shape()];
var shapeCursor = 0;

var phaseSelection, showIntersections;
var phaseOptions = ['Insert Shape', 'Insert Ray', 'Edit Mode']
var phase = phaseOptions[0];

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent('canvas');
  canvas.mousePressed(interactions)
  background(220);

  phaseSelection = createSelect();
  phaseSelection.parent('buttons')
  phaseOptions.forEach(option => {
    phaseSelection.option(option)
  });
  phaseSelection.changed(changePhase)

  showIntersections = createButton('Show Intersections');
  showIntersections.parent('buttons')
  showIntersections.mousePressed(toggleIntersections)

  let c = color('#FF0000')
  c.setAlpha(100);
  fill(c)
}

function toggleIntersections() {
  if (showIntersections.elt.textContent == 'Show Intersections') {
    showIntersections.elt.textContent = 'Hide Intersections';
  } else {
    showIntersections.elt.textContent = 'Show Intersections'
  }
}

function changePhase() {
  phase = phaseOptions[phaseSelection.elt.selectedIndex]
  console.log(phase)
}

function draw() {
  background(220);
  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i];
    let isLast = (i == shapeCursor && phase == phaseOptions[0]);
    shape.draw(isLast);
  }
}

function interactions() {
  if (phase == phaseOptions[0]) {
    shapes[shapeCursor].addVertex(
      new Vertex(mouseX, mouseY)
    );
  }
}

function doubleClicked() {
  shapes.push(new Shape());
  shapeCursor += 1;
}