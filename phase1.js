var shapes = [[]];
var shapeCursor = 0;

function setup() {
  createCanvas(400, 400);
  background(220);
  var c = color('#FF0000')
  c.setAlpha(100);
  fill(c)
}

function draw() {
  background(220);
  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i]
    beginShape();
    shape.forEach(v => {
      vertex(v.x, v.y)
    });
    if (i == shapeCursor) {
      vertex(mouseX, mouseY)
    }
    endShape(CLOSE);
  }
}

function mousePressed() {
  shapes[shapeCursor].push({
    x: mouseX,
    y: mouseY
  });
}

function doubleClicked() {
  shapes.push([]);
  shapeCursor += 1;
}