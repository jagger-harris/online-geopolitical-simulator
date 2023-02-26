/**
 * Landmass object that gets and draws landmasses
 */
class Landmass {
  constructor(data) {
    this.name = data.name;
    this.vertices = data.vertices;
  }

  draw() {
    fill(0);
    beginShape();

    for (let i = 0; i < this.vertices.length; i++) {
      let x = this.vertices[i][0];
      let y = this.vertices[i][1];
      let currentVertex = new Point(x, y);

      vertex(currentVertex.x, currentVertex.y);
    }

    endShape();
  }
}
