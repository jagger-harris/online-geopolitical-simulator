/**
 * @class Node representing data of a given country.
 * 
 * Used to store country information and basis for the simulation.
 */
class CountryNode {
  /**
   * Creates an instance of a node for a country.
   * 
   * @param {Country} country The country which the node is parented.
   * @param {JSON} data Country JSON data.
   * @param {number} amount Amount of nodes needed to be generated for a country.
   * @param {Point} point Point where the node is located on the screen.
   */
  constructor(country, data, amount, point) {
    this.size = 2;
    this.point = point;
    this.country = country;
    this.population = Math.ceil(data.population / amount);
    this.activeMilitary = Math.ceil(data.activeMilitary / amount);
    this.reserveMilitary = Math.ceil(data.reserveMilitary / amount);
    this.fertilityRate = data.fertilityRate;
    this.mortalityMaleAdults = data.mortalityMaleAdults;
    this.mortalityFemaleAdults = data.mortalityFemaleAdults;
    this.lifespan = data.lifespan;
    this.democracyIndex = data.democracyIndex;
    this.gdp = Number((data.gdp / amount).toFixed(2));
    this.nuclearWeapons = Math.ceil(data.nuclearWeapons / amount);
    this.selected = false;
    this.capturer = this.country;
  }

  /**
   * Draw the node.
   */
  draw() {
    if (this.selected) {
      fill(210, 210, 210);
    } else if (this.hover()) {
      this.capturer != this.country ? fill(255, 150, 150) : fill(150, 150, 255);
    } else {
      this.capturer != this.country ? fill(255, 100, 100) : fill(100, 100, 255);
    }

    ellipse(this.point.x, this.point.y, this.size, this.size);
  }

  /**
   * Checks if the mouse is above a node.
   * 
   * @returns True if mouse is hovering above a node.
   */
  hover() {
    return this.mouseInsideNode();
  }

  /**
   * Checks if mouse is within node circle.
   * Credits: https://math.stackexchange.com/questions/198764/how-to-know-if-a-point-is-inside-a-circle
   * 
   * @returns True if mouse is inside node circle.
   */
  mouseInsideNode() {
    let mX = (mouseX - offset.x) / zoom;
    let mY = (mouseY - offset.y) / zoom;
    let circlePoint = new Point(mX, mY);
    let x = Math.abs(this.point.x - circlePoint.x);
    let y = Math.abs(this.point.y - circlePoint.y);
    let distance = Math.sqrt(x * x + y * y);

    if (distance < this.size * 0.5) {
      return true;
    }

    return false;
  }

  /**
   * Generate an array of country nodes.
   * 
   * @param {Country} country Country which nodes are located in.
   * @param {JSON} data JSON data.
   * @param {number} amount Amount of nodes to be generated.
   * @param {Array.<Point>} trianglePoints Array of triangle points of a country.
   * @returns An array of generated country nodes.
   */
  static create(country, data, amount, trianglePoints) {
    return Array.from(Array(amount), () => {
      let areaRatios = Country.getAreaRatios(Country.getAreas(trianglePoints));

      /* Chose triangle based on area */
      let rTriangle = Math.random();
      let areaCheck = 0;

      while(rTriangle > 0) {
        rTriangle -= areaRatios[areaCheck];
        areaCheck++;
      }

      /* https://stackoverflow.com/questions/4778147/sample-random-point-in-triangle */
      const r1 = Math.random();
      const r2 = Math.random();
      const x = (1 - Math.sqrt(r1)) * trianglePoints[areaCheck - 1].a.x + (Math.sqrt(r1) * (1 - r2)) * trianglePoints[areaCheck - 1].b.x + (Math.sqrt(r1) * r2) * trianglePoints[areaCheck - 1].c.x;
      const y = (1 - Math.sqrt(r1)) * trianglePoints[areaCheck - 1].a.y + (Math.sqrt(r1) * (1 - r2)) * trianglePoints[areaCheck - 1].b.y + (Math.sqrt(r1) * r2) * trianglePoints[areaCheck - 1].c.y;
      const point = new Point(x, y);

      return new this(country, data, amount, point);
    })
  }
}
