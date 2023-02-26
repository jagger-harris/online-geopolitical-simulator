/**
 * Country object that represents country data in the simulation
 */
class Country {
  constructor(data, nodeAmount) {
    this.id = data.id;
    this.name = data.name;
    this.vertices = data.vertices;
    this.ai = new AI(this);
    this.selected = false;
    this.nodeAmount = nodeAmount;
    this.nodes = this.generateNodes(data, nodeAmount);
  }

  population() {
    let population = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      population += this.nodes[i].population;
    }

    return population;
  }

  fertilityRate() {
    let fertilityRate = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      fertilityRate += this.nodes[i].fertilityRate;
    }

    let averageFertilityRate = fertilityRate / this.nodes.length;

    return Math.ceil(averageFertilityRate * 100) / 100;
  }

  lifespan() {
    let lifespan = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      lifespan += this.nodes[i].lifespan;
    }

    let averageLifespan = lifespan / this.nodes.length;

    return Math.ceil(averageLifespan * 100) / 100;
  }

  draw(offset, zoom) {
    if (this.selected) {
      fill(100, 100, 255);
    } else if (this.hover(offset, zoom)) {
      fill(100);
    } else {
      fill(0);
    }

    beginShape();

    for (let i = 0; i < this.vertices.length; i++) {
      let x = this.vertices[i][0];
      let y = this.vertices[i][1];
      let currentVertex = new Point(x, y);

      vertex(currentVertex.x, currentVertex.y);
    }

    endShape();

    if (this.selected) {
      this.nodes.forEach(node => node.draw())
    }
  }

  hover(offset) {
    return this.mouseInsideCountry(offset, zoom);
  }

  /* https://stackoverflow.com/questions/217578/how-can-i-determine-whether-a-2d-point-is-within-a-polygon */
  mouseInsideCountry(offset, zoom) {
    let i;
    let j;
    let x = (mouseX - offset.x) / zoom;
    let y = (mouseY - offset.y) / zoom;
    let point = new Point(x, y);
    let inside = false;
    let vertices = this.vertices;

    for (i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      if (((vertices[i][1] > point.y) != (vertices[j][1] > point.y)) && (point.x < (vertices[j][0] - vertices[i][0]) * (point.y - vertices[i][1]) / (vertices[j][1] - vertices[i][1]) + vertices[i][0])) {
        inside = !inside;
      }
    }

    return inside;
  }

  generateNodes(data, amount) {
    return CountryNode.create(data, amount, this.countryTriangles());
  }

  countryTriangles() {
    let indices;
    let triangles = [];
    let flattenedData = [];

    for (let i = 0; i < this.vertices.length; i++) {
      let x = this.vertices[i][0];
      let y = this.vertices[i][1];

      flattenedData.push(x);
      flattenedData.push(y);
    }

    indices = earcut(flattenedData);

    for (let i = 0; i < indices.length; i++) {
      if (i % 3 == 0) {
        let x1 = this.vertices[indices[i]][0];
        let y1 = this.vertices[indices[i]][1];
        let x2 = this.vertices[indices[i + 1]][0];
        let y2 = this.vertices[indices[i + 1]][1];
        let x3 = this.vertices[indices[i + 2]][0];
        let y3 = this.vertices[indices[i + 2]][1];
  
        triangles.push(new Triangle(new Point(x1, y1), new Point(x2, y2), new Point(x3, y3)));
      }
    }

    return triangles;
  }
}
