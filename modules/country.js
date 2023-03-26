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
    this.nodes.forEach(node => {
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
    });
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
    let attackersLeader = this;
    let defendersLeader = country;
    let attackerAlliances = [];
    let defenderAlliances = []

    simulation.alliances.forEach(alliance => {
      if (alliance.members.includes(this.id)) {
        attackerAlliances.push(alliance);
      }

      if (alliance.members.includes(country.id)) {
        defenderAlliances.push(alliance);
      }
    })

    attackerAlliances.forEach(alliance => {
      alliance.members.forEach(memberID => {
        let country = simulation.countries.get(memberID);

        if (country) {
          attackers.push(country);

          if (country.gdp() > attackersLeader.gdp()) {
            attackersLeader = country;
          }
        }
      });
    });

    defenderAlliances.forEach(alliance => {
      alliance.members.forEach(memberID => {
        let country = simulation.countries.get(memberID);

        if (country) {
          defenders.push(country);

          if (country.gdp() > defendersLeader.gdp()) {
            defendersLeader = country;
          }
        }
      });
    });

    return new War(attackers, defenders, attackersLeader, defendersLeader);
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

    this.nodes.forEach(node => {
      if (node.capturer == this) {
        activeMilitary += node.activeMilitary;
      }
    })

    this.capturedNodes.forEach(node => activeMilitary += node.activeMilitary);

    return activeMilitary;
  }

  reserveMilitary() {
    let reserveMilitary = 0;

    this.nodes.forEach(node => reserveMilitary += node.reserveMilitary);

    return reserveMilitary;
  }

  fertilityRate() {
    let fertilityRate = 0;

    this.nodes.forEach(node => fertilityRate += node.fertilityRate);

    let averageFertilityRate = fertilityRate / this.nodes.length;

    return Math.ceil(averageFertilityRate * 100) / 100;
  }

  mortalityMaleAdults() {
    let mortalityMaleAdults = 0;

    this.nodes.forEach(node => mortalityMaleAdults += node.mortalityMaleAdults);

    let averageMortalityMaleAdults = mortalityMaleAdults / this.nodes.length;

    return Math.ceil(averageMortalityMaleAdults * 100) / 100;
  }

  mortalityFemaleAdults() {
    let mortalityFemaleAdults = 0;

    this.nodes.forEach(node => mortalityFemaleAdults += node.mortalityFemaleAdults);

    let averageMortalityFemaleAdults = mortalityFemaleAdults / this.nodes.length;

    return Math.ceil(averageMortalityFemaleAdults * 100) / 100;
  }

  lifespan() {
    let lifespan = 0;

    this.nodes.forEach(node => lifespan += node.lifespan);

    let averageLifespan = lifespan / this.nodes.length;

    return Math.ceil(averageLifespan * 100) / 100;
  }

  democracyIndex() {
    let democracyIndex = 0;

    this.nodes.forEach(node => democracyIndex += node.democracyIndex);

    let averageDemocracyIndex = democracyIndex / this.nodes.length;

    return Math.ceil(averageDemocracyIndex * 100) / 100;
  }

  gdp() {
    let gdp = 0;

    this.nodes.forEach(node => gdp += node.gdp);

    return gdp;
  }

  nuclearWeapons() {
    let nuclearWeapons = 0;

    this.nodes.forEach(node => nuclearWeapons += node.nuclearWeapons);

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

    this.vertices.forEach(currentVertex => {
      let i;
      let j;
      let x = (mouseX - offset.x) / zoom;
      let y = (mouseY - offset.y) / zoom;
      let point = new Point(x, y);

      for (i = 0, j = currentVertex.length - 1; i < currentVertex.length; j = i++) {
        if (((currentVertex[i][1] > point.y) != (currentVertex[j][1] > point.y)) && (point.x < (currentVertex[j][0] - currentVertex[i][0]) * (point.y - currentVertex[i][1]) / (currentVertex[j][1] - currentVertex[i][1]) + currentVertex[i][0])) {
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

    triangleAreas.forEach(triangleArea => totalArea += triangleArea);
    triangleAreas.forEach(triangleArea => areaRatios.push(triangleArea / totalArea));

    return areaRatios;
  }
}
