class Shape {
  constructor() {
    this.vertices = []
    this.lines = []
  }
  addVertex(vertex) {
    this.vertices.push(vertex)
    if (this.vertices.length > 1) {
      this.lines.push({
        start: this.vertices[this.vertices.length - 2],
        end: vertex
      });
    }
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
  draw(showIntersections) {
    fill('black')
    circle(this.start.x, this.start.y, 5)
    if (!this.direction) {
      this.pointTo(mouseX, mouseY)
      var clearPointer = true;
    }
    drawArrow(this.start, this.direction)
    var rayEnd = this.extendToBorder()
    if (rayEnd) {
      line(...rayEnd)
    }
    if (showIntersections) {
      shapes.forEach(s => {
        s.lines.forEach(l => {
          let intersection = findIntersection(this, l);
          if (intersection) {
            if (this.checkDirection(intersection)) {
              circle(intersection.x, intersection.y, 10)
            }
          }
        })
      })
    }
    fill(fillColor)
    if (clearPointer) {
      this.clearPointer()
    }
  }
  clearPointer() {
    this.end = null;
    this.direction = null;
  }
  extendToBorder() {
    for (let borderLine of borderLines) {
      var intersection = findIntersection(this, borderLine)
      if (intersection) {
        return this.checkDirection(intersection)
      }
    } return false
  }
  checkDirection(intersection) {
    var intersectionVector = p5.Vector.sub(
      createVector(intersection.x, intersection.y),
      this.start);
    if (SAME_SIGNS(intersectionVector.x, this.direction.x) &&
        SAME_SIGNS(intersectionVector.y, this.direction.y)) {
      return [this.end.x, this.end.y, intersection.x, intersection.y]
    } return false
  }
}