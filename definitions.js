class Shape {
  constructor() {
    this.vertices = []
  }
  addVertex(vertex) {
    this.vertices.push(vertex)
  }
  draw(isLast, editMode) {
    beginShape()
    this.vertices.forEach( v => {
      vertex(v.x, v.y)
    });
    if (isLast) {
      vertex(mouseX, mouseY)
    }
    endShape(CLOSE)
    if (editMode) {
      fill('black')
      this.vertices.forEach(v => {
        circle(v.x, v.y, 5)
      })
      fill(fillColor)
    }
  }
}

class Vertex {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Ray {
  // todo: deal with single clicks
  constructor(x, y) {
    this.start = createVector(x, y);
    this.radius = 30;
    this.end = null;
    this.direction = null;
  }
  pointTo(x, y) {
    this.direction = p5.Vector.sub(
      createVector(x, y), this.start
      ).normalize().mult(40);
    this.end = p5.Vector.add(this.start, this.direction)
  }
  newPosition(x, y) {
    this.start = createVector(x, y);
    this.end = p5.Vector.add(this.start, this.direction)
  }
  draw() {
    fill('black')
    circle(this.start.x, this.start.y, 5)
    if (this.direction) {
      drawArrow(this.start, this.direction)
      extendLine(this.start, this.direction)
    } else {
      this.pointTo(mouseX, mouseY)
      drawArrow(this.start, this.direction)
      extendLine(this.start, this.direction)
      this.clearPointer()
    }
    fill(fillColor)
  }
  clearPointer() {
    this.end = null;
    this.direction = null;
  }
}

// taken from p5 docs: https://p5js.org/reference/#/p5.Vector/normalize
function drawArrow(base, vec) {
  push();
  translate(base.x, base.y);
  strokeWeight(3);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

// needs to be reworked to extend line indefinitely 
function extendLine(base, vec) {
  push();
  translate(base.x, base.y);
  line(0, 0, vec.x * 15, vec.y * 15);
  pop();
}