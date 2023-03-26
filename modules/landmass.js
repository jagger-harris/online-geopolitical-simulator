/**
 * Landmass object that gets and draws landmasses
 */
class Landmass {
  constructor(data) {
    this.name = data.name;
    this.vertices = data.vertices;
  }

  draw() {
    fill(0, 0, 0, 0);
    beginShape();

    this.vertices.forEach(currentVertex => {
      let x = currentVertex[0];
      let y = currentVertex[1];
      let newVertex = new Point(x, y);

      vertex(newVertex.x, newVertex.y);
    });

    endShape();
  }
}
