class Shape {
  constructor() {
    this.vertices = []
  }
  addVertex(vertex) {
    this.vertices.push(vertex)
  }
  draw(isLast) {
    beginShape()
    this.vertices.forEach( v => {
      vertex(v.x, v.y)
    });
    if (isLast) {
      vertex(mouseX, mouseY)
    }
    endShape(CLOSE)
  }
}

class Vertex {
  constructor(x, y) {
    this.x = x;
    this.y = y
  }
}

class Ray {
  // todo: deal with single clicks
  constructor(x, y) {
    this.start = createVector(x, y);
    this.radius = 30;
    this.end = null;
  }
  direction(x, y) {
    this.end = p5.Vector.sub(
      createVector(x, y), this.start
      ).normalize().mult(50);
  }
  draw() {
    fill('black')
    circle(this.start.x, this.start.y, 5)
    if (this.end) {
      drawArrow(this.start, this.end, 'blue')
    } else {
      this.direction(mouseX, mouseY)
      drawArrow(this.start, this.end, 'blue')
      this.end = null;
    }
    fill(fillColor)
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