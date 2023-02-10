import {Point} from "./geometry.js"

export class Node {
  constructor(point, population, happiness) {
    this.point = point;
    this.population = population;
    this.happiness = happiness;
    this.borderVertices = [];
  }

  stability() {
    return this.happiness;
  }

  addBorderVertex(vertex) {
    this.borderVertices.push(vertex);
  }

  draw(sketch) {
    sketch.fill(100);
    sketch.noStroke();
    sketch.circle(this.point.x, this.point.y, 5);
  }

  static create(sketch, count, dataTrianglePoints) {
    return Array.from(Array(count), () => {
      const triangleAreas = [];
      const areaRatios = [];

      /* Calculate area for each triangle to determine ratio for node placement */
      for (let i = 0; i < dataTrianglePoints.length; i++) {
        let pointA = dataTrianglePoints[i].a;
        let pointB = dataTrianglePoints[i].b;
        let pointC = dataTrianglePoints[i].c;
        let lengthA = sketch.dist(pointA.x, pointA.y, pointB.x, pointB.y);
        let lengthB = sketch.dist(pointC.x, pointC.y, pointB.x, pointB.y);
        let lengthC = sketch.dist(pointC.x, pointC.y, pointA.x, pointA.y);;

        /* Heron's formula https://en.wikipedia.org//wiki/Heron's_formula */
        let s = (lengthA + lengthB + lengthC) * 0.5;
        let area = Math.sqrt(s * (s - lengthA) * (s - lengthB) * (s - lengthC));

        triangleAreas.push(area);
      }

      /* Add up all areas and determine percentages */
      let totalArea = 0;
      for (let i = 0; i < triangleAreas.length; i++) {
        totalArea += triangleAreas[i];
      }

      for (let i = 0; i < dataTrianglePoints.length; i++) {
        areaRatios.push(triangleAreas[i] / totalArea);
      }

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
      const x = (1 - Math.sqrt(r1)) * dataTrianglePoints[areaCheck - 1].a.x + (Math.sqrt(r1) * (1 - r2)) * dataTrianglePoints[areaCheck - 1].b.x + (Math.sqrt(r1) * r2) * dataTrianglePoints[areaCheck - 1].c.x;
      const y = (1 - Math.sqrt(r1)) * dataTrianglePoints[areaCheck - 1].a.y + (Math.sqrt(r1) * (1 - r2)) * dataTrianglePoints[areaCheck - 1].b.y + (Math.sqrt(r1) * r2) * dataTrianglePoints[areaCheck - 1].c.y;
      const point = new Point(x, y);

      return new this(point);
    })
  }
}
