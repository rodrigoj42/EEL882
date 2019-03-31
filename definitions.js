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