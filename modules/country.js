/**
 * @class Alliance representing a country in the simulation.
 * 
 * Used to store country variables and country nodes for the simulation.
 */
class Country {
  /**
   * Creates an instance of a country.
   * 
   * @param {JSON} data JSON data of a country.
   */
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.vertices = data.vertices;
    this.selected = false;
    this.nodeAmount = 0;
    this.nodes = [];
    this.capturedNodes = [];
    this.population;
    this.activeMilitary;
    this.reserveMilitary;
    this.fertilityRate;
    this.mortalityMaleAdults;
    this.democracyIndex;
    this.gdp;
    this.nuclearWeapons;
  }

  /**
   * Update country and country node information based on statistics.
   */
  update() {
    let totalPopulation = 0;
    let totalActiveMilitary = 0;
    let totalReserveMilitary = 0;
    let totalFertilityRate = 0;
    let totalMortalityMaleAdults = 0;
    let totalMortalityFemaleAdults = 0;
    let totalLifespan = 0;
    let totalDemocracyIndex = 0;
    let totalGdp = 0;
    let totalNuclearWeapons = 0;

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

      totalPopulation += node.population;
      totalActiveMilitary += node.activeMilitary;
      totalReserveMilitary += node.reserveMilitary;
      totalFertilityRate += node.fertilityRate;
      totalMortalityMaleAdults += node.mortalityMaleAdults;
      totalMortalityFemaleAdults += node.mortalityFemaleAdults;
      totalLifespan += node.lifespan;
      totalDemocracyIndex += node.democracyIndex;
      totalGdp += node.gdp;
      totalNuclearWeapons += node.nuclearWeapons;
    });

    this.population = totalPopulation;
    this.activeMilitary = totalActiveMilitary;
    this.reserveMilitary = totalReserveMilitary;
    this.fertilityRate = totalFertilityRate / this.nodeAmount;
    this.mortalityMaleAdults = totalMortalityMaleAdults / this.nodeAmount;
    this.mortalityFemaleAdults = totalMortalityFemaleAdults / this.nodeAmount;
    this.lifespan = totalLifespan / this.nodeAmount;
    this.democracyIndex = totalDemocracyIndex / this.nodeAmount;
    this.gdp = totalGdp;
    this.nuclearWeapons = totalNuclearWeapons;
  }

  /**
   * Make a country declare war on another country.
   * 
   * @param {Country} country Country to declare war on.
   * @returns A war.
   */
  declareWar(country) {
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

          if (country.gdp > attackersLeader.gdp) {
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

          if (country.gdp > defendersLeader.gdp) {
            defendersLeader = country;
          }
        }
      });
    });

    return new War(attackers, defenders, attackersLeader, defendersLeader);
  }

  /**
   * Get total population of a country based on its nodes.
   * 
   * @returns Total amount of population.
   */
  population() {
    let population = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      population += this.nodes[i].population;
    }

    return population;
  }

  /**
   * Get total active military of a country based on its nodes.
   * 
   * @returns Total amount of active military.
   */
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

  /**
   * Get total reserve military of a country based on its nodes.
   * 
   * @returns Total amount of reserve military.
   */
  reserveMilitary() {
    let reserveMilitary = 0;

    this.nodes.forEach(node => reserveMilitary += node.reserveMilitary);

    return reserveMilitary;
  }

  /**
   * Get average fertility rate of a country.
   * 
   * @returns Average total fertility rate.
   */
  fertilityRate() {
    let fertilityRate = 0;

    this.nodes.forEach(node => fertilityRate += node.fertilityRate);

    let averageFertilityRate = fertilityRate / this.nodes.length;

    return Math.ceil(averageFertilityRate * 100) / 100;
  }

  /**
   * Get average mortality rate for male adults of a country.
   * 
   * @returns Average total mortality rate for male adults.
   */
  mortalityMaleAdults() {
    let mortalityMaleAdults = 0;

    this.nodes.forEach(node => mortalityMaleAdults += node.mortalityMaleAdults);

    let averageMortalityMaleAdults = mortalityMaleAdults / this.nodes.length;

    return Math.ceil(averageMortalityMaleAdults * 100) / 100;
  }

  /**
   * Get average mortality rate for female adults of a country.
   * 
   * @returns Average total mortality rate for female adults.
   */
  mortalityFemaleAdults() {
    let mortalityFemaleAdults = 0;

    this.nodes.forEach(node => mortalityFemaleAdults += node.mortalityFemaleAdults);

    let averageMortalityFemaleAdults = mortalityFemaleAdults / this.nodes.length;

    return Math.ceil(averageMortalityFemaleAdults * 100) / 100;
  }

  /**
   * Get average lifespan of a country.
   * 
   * @returns Average total lifespan.
   */
  lifespan() {
    let lifespan = 0;

    this.nodes.forEach(node => lifespan += node.lifespan);

    let averageLifespan = lifespan / this.nodes.length;

    return Math.ceil(averageLifespan * 100) / 100;
  }

  /**
   * Draw the country on to the screen.
   */
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

  /**
   * Checks if the mouse is above a country.
   * 
   * @returns True if mouse is hovering above a country.
   */
  hover() {
    return this.mouseInsideCountry();
  }
  
  /**
   * Checks if mouse is within country vertices.
   * Credits: https://stackoverflow.com/questions/217578/how-can-i-determine-whether-a-2d-point-is-within-a-polygon
   * 
   * @returns True if mouse is inside country vertices.
   */
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

  /**
   * Generate an array of nodes for a country.
   * 
   * @param {JSON} data JSON data for country.
   * @param {number} amount Amount of nodes to be generated.
   * @returns Array of nodes.
   */
  generateNodes(data, amount) {
    return CountryNode.create(this, data, amount, this.countryTriangles());
  }

  /**
   * Generates the triangulation of a country vertices.
   * 
   * @returns Triangulation of a country in an array.
   */
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

  /**
   * Get the areas of given triangles.
   * 
   * @param {Array.<Point>} trianglePoints Array of triangles to get the areas.
   * @returns An array of areas.
   */
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

  /**
   * Get area ratios from the total areas.
   * 
   * @param {Array.<number>} triangleAreas Array of areas to determine ratios.
   * @returns Area ratios of triangleAreas.
   */
  static getAreaRatios(triangleAreas) {
    const areaRatios = [];

    /* Add up all areas and determine percentages */
    let totalArea = 0;

    triangleAreas.forEach(triangleArea => totalArea += triangleArea);
    triangleAreas.forEach(triangleArea => areaRatios.push(triangleArea / totalArea));

    return areaRatios;
  }
}
