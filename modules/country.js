/**
 * Country object that represents country data in the simulation
 */
class Country {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.vertices = data.vertices;
    this.selected = false;
    this.nodeAmount = 0;
    this.nodes = [];
    this.capturedNodes = [];
  }

  updatePopulation() {
    for (let i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i];

      /* Grow population statistically */
      let averageWomenPopulation = Math.floor(node.population * 0.5);
      let percentageChance = (node.fertilityRate / (8766 * node.lifespan)) * averageWomenPopulation;
      let random = Math.random();

      if (random < percentageChance) {
        if (percentageChance < 1) {
          node.population += 1;
        }

        node.population += Math.round(percentageChance);
      }

      /* Decay population statistically */
      let averageMaleDeaths = (node.mortalityMaleAdults / 2000) * (node.population * 0.5) / 8766;
      let averageFemaleDeaths = (node.mortalityFemaleAdults / 2000) * (node.population * 0.5) / 8766;
      random = Math.random();

      if (random < node.mortalityMaleAdults / 2000) {
        node.population -= Math.round(averageMaleDeaths);
      }

      random = Math.random();

      if (random < node.mortalityFemaleAdults / 2000) {
        node.population -= Math.round(averageFemaleDeaths);
      }
    }
  }

  declareWar(country) {
    /**
     * Reasons countries declare war:
     * 1. Not democratic countries (democratic peace principle)
     * 2. Territorial peace theory
     * 3. Bordered countries tend to declare war
     * 4. Not allied to larger and more established countries
     * 5. Resources (to a certain extent, but mainly trade)
     * 6. Power parity (countries that are stronger tend to attack weaker foe)
     * 7. Ideological differences
     * 
     * Reasons countries do not declare war:
     * 1. Nuclear deterrence
     * 2. Capitalism and trade
     */

    let attackers = [this];
    let defenders = [country];

    return new War(attackers, defenders);
  }

  population() {
    let population = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      population += this.nodes[i].population;
    }

    return population;
  }

  activeMilitary() {
    let activeMilitary = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].capturer == this) {
        activeMilitary += this.nodes[i].activeMilitary;
      }
    }

    for (let i = 0; i < this.capturedNodes.length; i++) {
      activeMilitary += this.capturedNodes[i].activeMilitary;
    }

    return activeMilitary;
  }

  reserveMilitary() {
    let reserveMilitary = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      reserveMilitary += this.nodes[i].reserveMilitary;
    }

    return reserveMilitary;
  }

  fertilityRate() {
    let fertilityRate = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      fertilityRate += this.nodes[i].fertilityRate;
    }

    let averageFertilityRate = fertilityRate / this.nodes.length;

    return Math.ceil(averageFertilityRate * 100) / 100;
  }

  mortalityMaleAdults() {
    let mortalityMaleAdults = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      mortalityMaleAdults += this.nodes[i].mortalityMaleAdults;
    }

    let averageMortalityMaleAdults = mortalityMaleAdults / this.nodes.length;

    return Math.ceil(averageMortalityMaleAdults * 100) / 100;
  }

  mortalityFemaleAdults() {
    let mortalityFemaleAdults = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      mortalityFemaleAdults += this.nodes[i].mortalityFemaleAdults;
    }

    let averageMortalityFemaleAdults = mortalityFemaleAdults / this.nodes.length;

    return Math.ceil(averageMortalityFemaleAdults * 100) / 100;
  }

  lifespan() {
    let lifespan = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      lifespan += this.nodes[i].lifespan;
    }

    let averageLifespan = lifespan / this.nodes.length;

    return Math.ceil(averageLifespan * 100) / 100;
  }

  democracyIndex() {
    let democracyIndex = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      democracyIndex += this.nodes[i].democracyIndex;
    }

    let averageDemocracyIndex = democracyIndex / this.nodes.length;

    return Math.ceil(averageDemocracyIndex * 100) / 100;
  }

  gdp() {
    let gdp = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      gdp += this.nodes[i].gdp;
    }

    return gdp;
  }

  nuclearWeapons() {
    let nuclearWeapons = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      nuclearWeapons += this.nodes[i].nuclearWeapons;
    }

    return nuclearWeapons;
  }

  draw() {
    if (simulation.selectedCountry == this) {
      fill(100, 100, 255);
    } else {
      if (this.hover()) {
        fill(100);
      } else {
        if (simulation.activeWars.length < 1) {
          fill(0);
        } else {
          simulation.activeWars.forEach(war => {
            let sameSide = false;
            let inWar = false;
            let selectedCountrySameWar = false;
  
            if (war.attackers.includes(this) || war.defenders.includes(this)) {
              inWar = true;
            }
  
            if (war.attackers.includes(simulation.selectedCountry)) {
              selectedCountrySameWar = true;
  
              if (war.attackers.includes(this)) {
                sameSide = true;
              }
            } else if (war.defenders.includes(simulation.selectedCountry)) {
              selectedCountrySameWar = true;
  
              if (war.defenders.includes(this)) {
                sameSide = true;
              }
            }
  
            if (selectedCountrySameWar && inWar) {
              sameSide ? fill(100, 100, 255) : fill(255, 100, 100);
            } else {
              fill(0);
            }
          })
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
    return CountryNode.create(this, data, amount, this.countryTriangles());
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

  static getAreas(trianglePoints) {
    let triangleAreas = [];

    /* Calculate area for each triangle to determine ratio for node placement */
    for (let i = 0; i < trianglePoints.length; i++) {
      let pointA = trianglePoints[i].a;
      let pointB = trianglePoints[i].b;
      let pointC = trianglePoints[i].c;
      let lengthA = dist(pointA.x, pointA.y, pointB.x, pointB.y);
      let lengthB = dist(pointC.x, pointC.y, pointB.x, pointB.y);
      let lengthC = dist(pointC.x, pointC.y, pointA.x, pointA.y);;

      /* Heron's formula https://en.wikipedia.org//wiki/Heron's_formula */
      let s = (lengthA + lengthB + lengthC) * 0.5;
      let area = Math.sqrt(s * (s - lengthA) * (s - lengthB) * (s - lengthC));

      triangleAreas.push(area);
    }

    return triangleAreas;
  }

  static getAreaRatios(triangleAreas) {
    const areaRatios = [];

    /* Add up all areas and determine percentages */
    let totalArea = 0;
      
    for (let i = 0; i < triangleAreas.length; i++) {
      totalArea += triangleAreas[i];
    }

    for (let i = 0; i < triangleAreas.length; i++) {
      areaRatios.push(triangleAreas[i] / totalArea);
    }

    return areaRatios;
  }
}
