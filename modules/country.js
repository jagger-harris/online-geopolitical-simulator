/**
 * Country object that represents country data in the simulation
 */
class Country {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.vertices = data.vertices;
    this.ai = new AI(this);
    this.selected = false;
    this.nodeAmount = 0;
    this.nodes = [];
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

  draw() {
    if (simulation.selectedCountry == this) {
      fill(100, 100, 255);
    } else {
      if (this.hover()) {
        fill(100);
      } else {
        fill(0);
      }
    }

    this.vertices.forEach(vertices => {
      beginShape();

      vertices.forEach(vertice => {
        let x = vertice[0];
        let y = vertice[1];
        let currentVertex = new Point(x, y);
  
        vertex(currentVertex.x, currentVertex.y);
      })

      endShape();
    })

    if (simulation.selectedCountry == this) {
      this.nodes.forEach(node => node.draw());
    }
  }

  hover() {
    return this.mouseInsideCountry();
  }

  /* https://stackoverflow.com/questions/217578/how-can-i-determine-whether-a-2d-point-is-within-a-polygon */
  mouseInsideCountry() {
    let inside = false;

    this.vertices.forEach(vertice => {
      let i;
      let j;
      let x = (mouseX - offset.x) / zoom;
      let y = (mouseY - offset.y) / zoom;
      let point = new Point(x, y);

      for (i = 0, j = vertice.length - 1; i < vertice.length; j = i++) {
        if (((vertice[i][1] > point.y) != (vertice[j][1] > point.y)) && (point.x < (vertice[j][0] - vertice[i][0]) * (point.y - vertice[i][1]) / (vertice[j][1] - vertice[i][1]) + vertice[i][0])) {
          inside = !inside;
        }
      }
    })

    return inside;
  }

  generateNodes(data, amount) {
    return CountryNode.create(data, amount, this.countryTriangles());
  }

  countryTriangles() {
    let indices;
    let triangles = [];
    let flattenedData = [];

    this.vertices.forEach(vertices => {
      let flattenedVertices = [];

      for (let i = 0; i < vertices.length; i++) {
        let x = vertices[i][0];
        let y = vertices[i][1];

        flattenedVertices.push(x);
        flattenedVertices.push(y);
      }

      flattenedData.push(flattenedVertices);
    })

    for (let i = 0; i < this.vertices.length; i++) {
      indices = earcut(flattenedData[i]);

      for (let j = 0; j < indices.length; j++) {
        if (j % 3 == 0) {
          let currentVertices = this.vertices[i];
          let x1 = currentVertices[indices[j]][0];
          let y1 = currentVertices[indices[j]][1];
          let x2 = currentVertices[indices[j + 1]][0];
          let y2 = currentVertices[indices[j + 1]][1];
          let x3 = currentVertices[indices[j + 2]][0];
          let y3 = currentVertices[indices[j + 2]][1];
  
          triangles.push(new Triangle(new Point(x1, y1), new Point(x2, y2), new Point(x3, y3)));
        }
      }
    }

    return triangles;
  }
}
