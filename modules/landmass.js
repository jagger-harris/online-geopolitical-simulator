/**
 * @class Landmass representing a non-changing border.
 * 
 * Used to determine border changes during peace deals.
 */
class Landmass {
  /**
   * Creates an instance of a landmass.
   * 
   * @param {JSON} data Landmass JSON data.
   */
  constructor(data) {
    this.name = data.name;
    this.vertices = data.vertices;
  }

  /**
   * Draw the landmass.
   */
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
