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

  draw() {
    if (simulation.selectedCountry == this) {
      fill(100, 100, 255);
    } else {
      if (this.hover()) {
        fill(100);
      } else {
        fill(0);
      }
      
      if (simulation.selectedCountry) {
        for (let i = 0; i < simulation.activeWars.length; i++) {
          if (simulation.activeWars[i].attackers.includes(this) || simulation.activeWars[i].defenders.includes(this)) {
            if (this.hover()) {
              fill(255, 150, 150);
            } else {
              fill(255, 100, 100);
            }
          }
        }
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

    //console.log(simulation.selectedCountry)

    if (simulation.selectedCountry == this) {
      this.nodes.forEach(node => node.draw())
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
    let triangles = [];
    let flattenedData = [];

    /* Flatten array for earcut.js */
    this.vertices.forEach(vertices => {
      let flattenedVertices = [];

      vertices.forEach(vertex => {
        let x = vertex[0];
        let y = vertex[1];

        flattenedVertices.push(x);
        flattenedVertices.push(y);
      })

      flattenedData.push(flattenedVertices);
    })

    flattenedData.forEach(data => {
      let indices = earcut(data);

      for (let i = 0; i < indices.length; i++) {
        if (i % 3 == 0) {
          let x1 = data[indices[i]][0];
          let y1 = data[indices[i]][1];
          let x2 = data[indices[i + 1]][0];
          let y2 = data[indices[i + 1]][1];
          let x3 = data[indices[i + 2]][0];
          let y3 = data[indices[i + 2]][1];
  
          triangles.push(new Triangle(new Point(x1, y1), new Point(x2, y2), new Point(x3, y3)));
        }
      }
    })

    return triangles;
  }
}
